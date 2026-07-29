import api from '../api/index'

function getShare(): void {
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
			jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'hideMenuItems', 'showMenuItems']
		})
	}).catch((err: any) => {
		console.log(err)
	})
}

function hideMenu(): void {
	WechatJSSDK.ready(() => {
		WechatJSSDK.hideMenuItems({
			menuList: [
				'menuItem:share:appMessage',
				'menuItem:share:timeline',
				'menuItem:share:qq',
				'menuItem:share:weiboApp',
				'menuItem:share:facebook',
				'menuItem:share:QZone'
			]
		})
	})
}

function showMenu(): void {
	WechatJSSDK.ready(() => {
		WechatJSSDK.showMenuItems({
			menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
		})
	})
}

function loadShare(title: string, link: string, imgUrlOrigin: string): void {
	WechatJSSDK.ready(() => {
		WechatJSSDK.updateAppMessageShareData({
			title,
			desc: '',
			link,
			imgUrl: imgUrlOrigin + '/specWechat/static/img/spec_share.jpg',
			success(_res) {},
			cancel(_res) {}
		})

		WechatJSSDK.updateTimelineShareData({
			title,
			desc: '',
			link,
			imgUrl: imgUrlOrigin + '/specWechat/static/img/spec_share.jpg',
			success(_res) {},
			cancel(_res) {}
		})
	})
}

export default {
	getShare,
	hideMenu,
	showMenu,
	loadShare
}
