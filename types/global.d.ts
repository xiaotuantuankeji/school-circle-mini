/**
 * uni-app 全局类型扩展
 */

declare namespace UniApp {
	interface LoginRes {
		code: string
	}
}

declare const uni: {
	getStorageSync(key: string): any
	setStorageSync(key: string, data: any): void
	removeStorageSync(key: string): void
	clearStorageSync(): void
	getStorageInfoSync(): { keys: string[]; currentSize: number; limitSize: number }

	request<T = any>(options: {
		url: string
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
		data?: any
		header?: Record<string, string>
		dataType?: string
		success?: (res: { statusCode: number; data: T; header: Record<string, string> }) => void
		fail?: (err: { errMsg: string }) => void
	}): void

	uploadFile(options: {
		url: string
		filePath: string
		name: string
		formData?: Record<string, string>
		header?: Record<string, string>
		success?: (res: { statusCode: number; data: string }) => void
		fail?: (err: { errMsg: string }) => void
	}): void

	showLoading(options: { title: string; mask?: boolean }): void
	hideLoading(): void
	showToast(options: { title: string; icon?: 'success' | 'none' | 'loading' }): void
	showModal(options: {
		title?: string
		content: string
		showCancel?: boolean
		success?: (res: { confirm: boolean; cancel: boolean }) => void
	}): void

	redirectTo(options: { url: string }): void
	reLaunch(options: { url: string }): void
	navigateTo(options: { url: string }): void
	navigateBack(options?: { delta?: number }): void
	exitMiniProgram(options?: {
		success?: () => void
		fail?: (err: any) => void
	}): void

	getProvider(options: { service: string; success?: (res: { provider: string[] }) => void }): void
	login(options: { success?: (res: { code: string }) => void }): void

	getSystemInfoSync(): {
		platform: string
		windowWidth: number
		windowHeight: number
		statusBarHeight: number
		pixelRatio: number
	}

	connectSocket(options: {
		url: string
		complete?: () => void
	}): any

	onSocketOpen(callback: () => void): void
	onSocketMessage(callback: (res: { data: string }) => void): void
	onSocketError(callback: (error: any) => void): void
	onSocketClose(callback: (res: { code: number; reason: string }) => void): void

	sendSocketMessage(options: {
		data: string
		fail?: () => void
	}): void

	closeSocket(): void
}

declare const wx: {
	config(options: {
		debug?: boolean
		appId: string
		timestamp: number
		nonceStr: string
		signature: string
		surl?: string
		jsApiList: string[]
		[key: string]: any
	}): void
}

declare const WechatJSSDK: {
	ready(callback: () => void): void
	getLocation(options: {
		type: string
		success?: (res: { latitude: number; longitude: number; speed: number; accuracy: number }) => void
		cancel?: (msg: any) => void
	}): void
	updateAppMessageShareData(options: {
		title: string
		desc: string
		link: string
		imgUrl: string
		success?: (res: any) => void
		cancel?: (res: any) => void
	}): void
	updateTimelineShareData(options: {
		title: string
		desc: string
		link: string
		imgUrl: string
		success?: (res: any) => void
		cancel?: (res: any) => void
	}): void
	hideMenuItems(options: { menuList: string[] }): void
	showMenuItems(options: { menuList: string[] }): void
}

declare function getApp(): any
declare function getCurrentPages(): any[]

declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}
