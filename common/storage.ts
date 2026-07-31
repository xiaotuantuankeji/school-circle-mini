/*
 * Copyright 2026 南京校团团科技有限公司
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import configData from './config'
import type { StorageOptions, StorageData, UserInfo, UnreadCount } from '../types/index'

/**
 * 统一Storage存储管理器
 * 支持数据加密、序列化、过期时间管理
 */

interface StorageNamespace<T> {
	set(value: T): boolean
	get(): T | null
	remove(): boolean
}

interface StorageConfigNamespace {
	set(key: string, value: any): boolean
	get(key: string, defaultValue?: any): any
}

// 配置
const CONFIG = {
	enableEncryption: false,
	encryptionKey: (configData as any).encryption_key || 'school-circle-mini-2024',
	defaultExpireTime: 0
}

/**
 * 简单的加密/解密函数
 */
function encrypt(data: string): string {
	if (!CONFIG.enableEncryption) return data

	try {
		const key = CONFIG.encryptionKey
		let encrypted = ''
		for (let i = 0; i < data.length; i++) {
			const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
			encrypted += String.fromCharCode(charCode)
		}
		return btoa(encrypted)
	} catch (e) {
		console.error('加密失败:', e)
		return data
	}
}

function decrypt(encryptedData: string): string {
	if (!CONFIG.enableEncryption) return encryptedData

	try {
		const key = CONFIG.encryptionKey
		const decoded = atob(encryptedData)
		let decrypted = ''
		for (let i = 0; i < decoded.length; i++) {
			const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
			decrypted += String.fromCharCode(charCode)
		}
		return decrypted
	} catch (e) {
		console.error('解密失败:', e)
		return encryptedData
	}
}

/**
 * 设置存储
 */
function set<T = any>(key: string, value: T, options: StorageOptions = {}): boolean {
	try {
		const { expire = CONFIG.defaultExpireTime } = options

		const dataToStore: StorageData<T> = {
			value: value,
			expire: expire > 0 ? Date.now() + expire : 0,
			timestamp: Date.now()
		}

		const serialized = JSON.stringify(dataToStore)
		const encrypted = encrypt(serialized)

		uni.setStorageSync(key, encrypted)
		return true
	} catch (e) {
		console.error('Storage set error:', e)
		return false
	}
}

/**
 * 获取存储
 */
function get<T = any>(key: string, defaultValue: T | null = null): T | null {
	try {
		const encrypted: any = uni.getStorageSync(key)

		if (!encrypted) {
			return defaultValue
		}

		const decrypted: string | object = decrypt(encrypted)

		let data: StorageData<T>
		if (typeof decrypted === 'object') {
			data = decrypted as StorageData<T>
		} else if (typeof decrypted === 'string') {
			data = JSON.parse(decrypted) as StorageData<T>
		} else {
			return defaultValue
		}

		if (data && data.expire > 0 && Date.now() > data.expire) {
			uni.removeStorageSync(key)
			return defaultValue
		}

		return data && data.value !== undefined ? data.value : (data as any)
	} catch (e) {
		console.error('Storage get error:', e)
		return defaultValue
	}
}

/**
 * 移除存储
 */
function remove(key: string): boolean {
	try {
		uni.removeStorageSync(key)
		return true
	} catch (e) {
		console.error('Storage remove error:', e)
		return false
	}
}

/**
 * 清空所有存储
 */
function clear(): boolean {
	try {
		uni.clearStorageSync()
		return true
	} catch (e) {
		console.error('Storage clear error:', e)
		return false
	}
}

/**
 * 获取存储信息
 */
function getStorageInfo(): { keys: string[]; currentSize: number; limitSize: number } | null {
	try {
		return uni.getStorageInfoSync()
	} catch (e) {
		console.error('Storage getStorageInfo error:', e)
		return null
	}
}

/**
 * 检查是否存在
 */
function has(key: string): boolean {
	const value = get(key, null)
	return value !== null
}

// ==================== 快捷方法 ====================

const storage = {
	set,
	get,
	remove,
	clear,
	getStorageInfo,
	has,

	/** 用户相关存储 */
	user: {
		set(userInfo: UserInfo): boolean {
			return set<UserInfo>('userInfo', userInfo, { expire: 7 * 24 * 60 * 60 * 1000 })
		},
		get(): UserInfo | null {
			return get<UserInfo>('userInfo', null)
		},
		remove(): boolean {
			return remove('userInfo')
		}
	} as StorageNamespace<UserInfo>,

	/** Token相关存储 */
	token: {
		set(token: string): boolean {
			return set<string>('token', token, { expire: 24 * 60 * 60 * 1000 })
		},
		get(): string | null {
			return get<string>('token', null)
		},
		remove(): boolean {
			return remove('token')
		}
	} as StorageNamespace<string>,

	/** 消息未读数存储 */
	unread: {
		set(data: UnreadCount): boolean {
			return set<UnreadCount>('msgUnread', data)
		},
		get(): UnreadCount {
			return get<UnreadCount>('msgUnread', {
				commentCount: 0,
				likeCount: 0,
				collectCount: 0,
				systemCount: 0,
				playmateCommentCount: 0,
				playmateMemberCount: 0,
				list: []
			}) as UnreadCount
		},
		remove(): boolean {
			return remove('msgUnread')
		}
	} as StorageNamespace<UnreadCount>,

	/** 配置相关存储 */
	config: {
		set(key: string, value: any): boolean {
			return set(`config_${key}`, value)
		},
		get(key: string, defaultValue: any = null): any {
			return get(`config_${key}`, defaultValue)
		}
	} as StorageConfigNamespace
}

export default storage
