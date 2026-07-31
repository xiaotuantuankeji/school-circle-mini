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
