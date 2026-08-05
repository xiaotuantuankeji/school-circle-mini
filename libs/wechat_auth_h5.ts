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

/**
 * H5 平台认证适配器
 * 对外暴露与 wechat_auth.ts 完全相同的接口（validateUser / getCode / getUserDetail），
 * 使所有调用 this.$wechatAuth 的页面无需任何修改即可兼容 H5。
 *
 * 小程序通过 wx.login → code → token 认证；H5 通过密码登录获取 token，
 * 本文件使用 storage 中已存储的 token 和 userInfo 来校验与刷新状态。
 */

import configData from '../common/config'
import storage from '../common/storage'

function validateUser(resolve: (result: string) => void): void {
	const userData = storage.user.get()
	if (userData !== null && userData.studentId) {
		// 已登录，刷新用户信息
		getUserDetail(userData.studentId, resolve)
	} else {
		// 未登录，跳转 H5 登录页
		uni.reLaunch({ url: '/pages/login/login' })
		resolve('no_user')
	}
}

/**
 * H5 不存在微信 code 概念，未登录时直接跳转登录页
 */
function getCode(resolve: (result: string) => void): void {
	uni.reLaunch({ url: '/pages/login/login' })
	resolve('no_user')
}

function getUserDetail(studentId: string, resolve?: (result: string) => void): void {
	const wxUrl = configData.server_url_config
	const token = storage.token.get() || ''
	uni.request({
		url: wxUrl + '/school/mini/getStudentInfo?id=' + studentId,
		method: 'GET',
		header: {
			'Authorization': token ? 'Bearer ' + token : ''
		},
		success: function (res: any) {
			const userDetailData = res.data?.data
			if (!userDetailData) {
				storage.clear()
				uni.reLaunch({ url: '/pages/login/login' })
				return
			}
			storage.user.set(userDetailData)
			// 存储 OAuth2 token（如果接口返回）
			if (userDetailData.accessToken) {
				storage.token.set(userDetailData.accessToken)
			}
			if (resolve !== undefined) {
				resolve('ok')
			}
		},
		fail: function () {
			if (resolve !== undefined) {
				resolve('error')
			}
		}
	})
}

export default {
	validateUser,
	getCode,
	getUserDetail
}
