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

import configData from '../common/config'
import storage from '../common/storage'

function validateUser(resolve: (result: string) => void): void {
	const userData = storage.user.get()
	if (userData !== null) {
		const studentId = userData.studentId
		if (studentId === undefined) {
			getCode(resolve)
		} else {
			getUserDetail(studentId, resolve)
		}
	} else {
		getCode(resolve)
	}
}

function getCode(resolve: (result: string) => void): void {
	uni.getProvider({
		service: 'oauth',
		success: function (res) {
			if (res.provider.indexOf('weixin') >= 0) {
				uni.login({
					success: function (loginRes) {
						const code = loginRes.code
						getOpenId(code, resolve)
					}
				})
			}
		}
	})
}

function getOpenId(code: string, resolve: (result: string) => void): void {
	const wxUrl = configData.server_url_config
	uni.request({
		url: wxUrl + '/school/mini/verifyStudent?code=' + code,
		method: 'GET',
		success: function (res) {
			const userInfo = res.data.data
			storage.user.set(userInfo)
			// 存储 OAuth2 token
			if (userInfo.accessToken) {
				storage.token.set(userInfo.accessToken)
			}
			resolve('ok')
		}
	})
}

function bindingMobilephone(studentId: string, mobilePhone: string, resolve: (result: string) => void): void {
	const wxUrl = configData.server_url_config
	uni.request({
		url: wxUrl + '/v1/minip/bindingMobilephone',
		method: 'POST',
		data: {
			userid: studentId,
			mobilephone: mobilePhone
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: function (res) {
			const user = res.data.data
			const sid = user.studentId
			getUserDetail(sid, resolve)
		}
	})
}

function getUserDetail(studentId: string, resolve?: (result: string) => void): void {
	const wxUrl = configData.server_url_config
	uni.request({
		url: wxUrl + '/school/mini/getStudentInfo?id=' + studentId,
		method: 'GET',
		success: function (res) {
			const userDetailData = res.data.data

			if (userDetailData === undefined) {
				storage.clear()
				validateUser(resolve!)
			} else {
				storage.user.set(userDetailData)
				// 存储 OAuth2 token
				if (userDetailData.accessToken) {
					storage.token.set(userDetailData.accessToken)
				}
				if (resolve !== undefined) {
					resolve('ok')
				}
			}
		}
	})
}

export default {
	validateUser,
	getCode,
	getUserDetail
}
