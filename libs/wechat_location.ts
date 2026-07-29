import api from '../api/index'

interface LocationResult {
	latitude: number
	longitude: number
	speed: number
	accuracy: number
}

function getConfig(): void {
	const url = location.href.split('#')[0]
	const param = 'reqUrl=' + url
	api.getJsApiTicket(param).then((res: any) => {
		const shareConfig = res

		wx.config({
			debug: false,
			appId: shareConfig.appId,
			timestamp: shareConfig.timestamp,
			nonceStr: shareConfig.noncestr,
			signature: shareConfig.signature,
			surl: res.surl,
			jsApiList: ['getLocation']
		})
	}).catch((err: any) => {
		console.log(err)
	})
}

function getLocation(resolve: (res: LocationResult | string) => void): void {
	WechatJSSDK.ready(() => {
		WechatJSSDK.getLocation({
			type: 'wgs84',
			success: function (res: LocationResult) {
				if (resolve !== undefined) {
					resolve(res)
				}
			},
			cancel: function (msg: string) {
				resolve(msg)
			}
		})
	})
}

export default {
	getConfig,
	getLocation
}
