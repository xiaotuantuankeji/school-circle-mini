import configData from './config'
import storage from './storage'
import type { RequestOptions, Interceptor } from '../types/index'

/**
 * 统一请求封装
 * 功能：请求/响应拦截器、Token自动注入、接口缓存、防重复提交、统一错误处理
 */

// ==================== 请求缓存 ====================
const cache = new Map<string, { data: any; time: number }>()

function getCacheKey(url: string, method: string, data: any): string {
	const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data || '')
	return `${method.toUpperCase()}:${url}:${dataStr}`
}

function getCache(key: string, ttl: number): any {
	if (!ttl || ttl <= 0) return null
	const item = cache.get(key)
	if (!item) return null
	if (Date.now() - item.time > ttl) {
		cache.delete(key)
		return null
	}
	return item.data
}

function setCache(key: string, data: any): void {
	cache.set(key, { data, time: Date.now() })
}

/**
 * 清除指定缓存
 */
function clearCache(pattern?: string): void {
	if (!pattern) {
		cache.clear()
		return
	}
	for (const key of cache.keys()) {
		if (key.includes(pattern)) {
			cache.delete(key)
		}
	}
}

// ==================== 防重复提交 ====================
const pendingRequests = new Map<string, boolean>()

function getRequestKey(url: string, method: string, data: any): string {
	const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data || '')
	return `${method.toUpperCase()}:${url}:${dataStr}`
}

// ==================== Content-Type 映射 ====================
const CONTENT_TYPE_MAP: Record<string, string> = {
	json: 'application/json',
	form: 'application/x-www-form-urlencoded',
	file: 'multipart/form-data'
}

// ==================== 拦截器链 ====================
const requestInterceptors: Interceptor[] = []
const responseInterceptors: Interceptor[] = []

function addRequestInterceptor(fulfilled: (config: any) => any, rejected?: (error: any) => any): void {
	requestInterceptors.push({ fulfilled, rejected })
}

function addResponseInterceptor(fulfilled: (config: any) => any, rejected?: (error: any) => any): void {
	responseInterceptors.push({ fulfilled, rejected })
}

// 默认请求拦截器：自动注入Token
addRequestInterceptor(function (config) {
	const token = storage.token.get()
	if (token) {
		config.header = config.header || {}
		config.header['Authorization'] = 'Bearer ' + token
	}
	return config
})

// 默认响应拦截器
addResponseInterceptor(function (response) {
	return response
})

// ==================== 错误码映射 ====================
const ERROR_MESSAGES: Record<number, string> = {
	400: '请求参数错误',
	401: '登录已过期，请重新登录',
	403: '没有权限访问',
	404: '请求资源不存在',
	500: '服务器内部错误',
	502: '网关错误',
	503: '服务暂不可用'
}

function handleHttpError(statusCode: number, data: any): void {
	const message = (data && data.msg) || ERROR_MESSAGES[statusCode] || '请求失败(' + statusCode + ')'
	if (statusCode === 401) {
		storage.clear()
		uni.showToast({ title: message, icon: 'none' })
		setTimeout(() => {
			uni.reLaunch({ url: '/pages/index/index' })
		}, 1500)
		return
	}
	uni.showToast({ title: message, icon: 'none' })
}

function handleNetworkError(error: any): void {
	if (!error || !error.errMsg) {
		uni.showToast({ title: '未知网络错误', icon: 'none' })
		return
	}
	const errMsg = error.errMsg
	if (errMsg.includes('timeout')) {
		uni.showToast({ title: '请求超时，请稍后重试', icon: 'none' })
	} else if (errMsg.includes('fail to connect')) {
		uni.showToast({ title: '网络连接失败', icon: 'none' })
	} else if (errMsg.includes('request:fail')) {
		uni.showToast({ title: '网络异常，请检查网络', icon: 'none' })
	} else {
		uni.showToast({ title: '网络错误', icon: 'none' })
	}
}

// ==================== 核心请求方法 ====================

interface RequestConfig {
	url: string
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	data?: Record<string, any> | string
	dataType: string
	header: Record<string, string>
}

function request<T = any>(options: RequestOptions): Promise<T> {
	const {
		url = '',
		method = 'GET',
		data = {},
		contentType = 'json',
		cacheTTL = 0,
		repeatable = false,
		showError = true,
		silent = false
	} = options

	const reqMethod = method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE'

	let config: RequestConfig = {
		url: configData.server_url_config + url,
		method: reqMethod,
		data: data,
		dataType: 'json',
		header: {
			'Content-Type': CONTENT_TYPE_MAP[contentType] || CONTENT_TYPE_MAP.json
		}
	}

	// GET请求：字符串参数拼接到URL
	if (reqMethod === 'GET') {
		if (typeof data === 'string' && data) {
			config.url = config.url + '?' + data
			config.data = {}
		}
	}

	// GET缓存检查
	if (reqMethod === 'GET' && cacheTTL > 0) {
		const cacheKey = getCacheKey(url, method, data)
		const cached = getCache(cacheKey, cacheTTL)
		if (cached) {
			return Promise.resolve(cached)
		}
	}

	// 防重复提交检查
	const requestKey = getRequestKey(url, method, data)
	if (!repeatable && reqMethod !== 'GET' && pendingRequests.has(requestKey)) {
		return Promise.reject(new Error('请求正在处理中，请勿重复操作'))
	}

	// 执行请求拦截器链
	for (const interceptor of requestInterceptors) {
		config = interceptor.fulfilled(config)
	}

	if (!silent) {
		uni.showLoading && uni.showLoading({ title: '加载中...', mask: true })
	}

	if (!repeatable && reqMethod !== 'GET') {
		pendingRequests.set(requestKey, true)
	}

	return new Promise<T>((resolve, reject) => {
		uni.request({
			url: config.url,
			method: config.method,
			data: config.data,
			dataType: config.dataType,
			header: config.header,
			success(res) {
				pendingRequests.delete(requestKey)
				if (!silent) uni.hideLoading && uni.hideLoading()

				const response = res.data as T

				let processedResponse: T = response
				for (const interceptor of responseInterceptors) {
					processedResponse = interceptor.fulfilled(processedResponse)
				}

				if (res.statusCode >= 200 && res.statusCode < 300) {
					if (reqMethod === 'GET' && cacheTTL > 0) {
						const cacheKey = getCacheKey(url, method, data)
						setCache(cacheKey, processedResponse)
					}
					resolve(processedResponse)
				} else {
					if (showError) {
						handleHttpError(res.statusCode, response)
					}
					reject(response)
				}
			},
			fail(error) {
				pendingRequests.delete(requestKey)
				if (!silent) uni.hideLoading && uni.hideLoading()

				if (showError) {
					handleNetworkError(error)
				}
				reject(error)
			}
		})
	})
}

function get<T = any>(url: string, data?: any, options: Partial<RequestOptions> = {}): Promise<T> {
	return request<T>({ url, method: 'GET', data, ...options })
}

function post<T = any>(url: string, data?: any, options: Partial<RequestOptions> = {}): Promise<T> {
	return request<T>({ url, method: 'POST', data, ...options })
}

function put<T = any>(url: string, data?: any, options: Partial<RequestOptions> = {}): Promise<T> {
	return request<T>({ url, method: 'PUT', data, ...options })
}

function del<T = any>(url: string, data?: any, options: Partial<RequestOptions> = {}): Promise<T> {
	return request<T>({ url, method: 'DELETE', data, ...options })
}

interface UploadOptions {
	url?: string
	showError?: boolean
}

function upload(filePath: string, formData: Record<string, string> = {}, options: UploadOptions = {}): Promise<any> {
	const { url = '/infra/file/upload', showError = true } = options

	const token = storage.token.get()
	const header: Record<string, string> = {
		'Authorization': token ? 'Bearer ' + token : ''
	}

	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: configData.server_url_config + url,
			filePath,
			name: 'file',
			formData,
			header,
			success(res) {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					try {
						const data = JSON.parse(res.data)
						resolve(data)
					} catch (e) {
						resolve(res.data)
					}
				} else {
					if (showError) {
						uni.showToast({ title: '上传失败', icon: 'none' })
					}
					reject(res)
				}
			},
			fail(error) {
				if (showError) {
					uni.showToast({ title: '上传失败，请检查网络', icon: 'none' })
				}
				reject(error)
			}
		})
	})
}

/**
 * @deprecated 建议使用 get/post 等快捷方法
 */
function globalRequest<T = any>(
	url: string,
	method: string,
	data: any,
	contentType: string,
	_serverSort?: string
): Promise<T> {
	return request<T>({
		url,
		method: method as RequestOptions['method'],
		data,
		contentType: (contentType || 'json') as RequestOptions['contentType'],
		silent: true,
		showError: true
	})
}

export default {
	request,
	get,
	post,
	put,
	del,
	upload,
	globalRequest,
	addRequestInterceptor,
	addResponseInterceptor,
	clearCache
}
