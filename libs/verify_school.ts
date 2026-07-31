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
import type { UserInfo } from '../types/index'

interface SchoolStatusData {
	studentSort: string
	schoolStatus: string
	banLevel: string
	isOpenSchool?: boolean
	schoolName?: string
}

/**
 * 验证校园是否关闭
 */
function verifySchoolIsClose(): Promise<boolean> {
	const userInfo: UserInfo | null = storage.user.get()
	const studentId = userInfo ? userInfo.studentId : ''

	return new Promise((resolve) => {
		const serverUrl = configData.server_url_config
		uni.request({
			url: serverUrl + '/school/mini/getSchoolAndStudentStatus?studentId=' + studentId,
			method: 'GET',
			success: function (res) {
				const data: SchoolStatusData = res.data.data

				const studentSort = data.studentSort
				const schoolStatus = data.schoolStatus
				const banLevel = data.banLevel

				if (studentSort === '3') {
					if (!data.isOpenSchool) {
						uni.showModal({
							title: '关闭',
							content: '你暂未开通代理或代理的校园已被冻结或关闭，请联系管理员',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									uni.exitMiniProgram()
								}
							}
						})
						resolve(true)
						return
					}
				} else if (studentSort === '4') {
					if (!data.isOpenSchool) {
						uni.showModal({
							title: '关闭',
							content: '你暂未开通账号或校园已被冻结或关闭，请联系管理员',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									uni.exitMiniProgram()
								}
							}
						})
						resolve(true)
						return
					}
				} else {
					if (schoolStatus !== '') {
						if (schoolStatus === '4') {
							const schoolName = data.schoolName || ''
							uni.showModal({
								title: '关闭',
								content: '[' + schoolName + ']已被关闭，请稍后再试',
								showCancel: false,
								success: function (res) {
									if (res.confirm) {
										uni.exitMiniProgram()
									}
								}
							})
							resolve(true)
							return
						}
					}
				}

				if (banLevel === '5' && userInfo) {
					const banDay = userInfo.banDay
					const banEndDay = userInfo.banEndDay
					const banReason = userInfo.banReason
					let content = '你的账户因[' + banReason + ']，已被禁止登录小程序'
					if (banDay === '0') {
						content += '。'
					} else if (banDay === '1') {
						content += '1天。截止：' + banEndDay
					} else if (banDay === '2') {
						content += '7天。截止：' + banEndDay
					} else if (banDay === '3') {
						content += '30天。截止：' + banEndDay
					} else if (banDay === '4') {
						content += '360天。截止：' + banEndDay
					}
					uni.showModal({
						title: '封禁',
						content,
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								uni.exitMiniProgram()
							}
						}
					})
					resolve(true)
					return
				}

				resolve(false)
			}
		})
	})
}

/**
 * 验证校园是否冻结
 */
function verifySchoolIsFreeze(): Promise<boolean> {
	const userInfo: UserInfo | null = storage.user.get()
	const studentId = userInfo ? userInfo.studentId : ''

	return new Promise((resolve) => {
		const serverUrl = configData.server_url_config
		uni.request({
			url: serverUrl + '/school/mini/getSchoolAndStudentStatus?studentId=' + studentId,
			method: 'GET',
			success: function (res) {
				const data: SchoolStatusData = res.data.data

				const studentSort = data.studentSort
				const schoolStatus = data.schoolStatus
				const banLevel = data.banLevel

				if (studentSort === '3') {
					if (!data.isOpenSchool) {
						uni.showModal({
							title: '关闭',
							content: '你暂未开通代理或代理的校园已被冻结或关闭，请联系管理员',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									uni.exitMiniProgram()
								}
							}
						})
						resolve(true)
						return
					}
				} else if (studentSort === '4') {
					if (!data.isOpenSchool) {
						uni.showModal({
							title: '关闭',
							content: '你暂未开通账号或校园已被冻结或关闭，请联系管理员',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									uni.exitMiniProgram()
								}
							}
						})
						resolve(true)
						return
					}
				} else {
					if (schoolStatus !== '') {
						if (schoolStatus === '3') {
							const schoolName = data.schoolName || ''
							uni.showModal({
								title: '冻结',
								content: '[' + schoolName + ']已被冻结，只能查看不能操作',
								showCancel: false
							})
							resolve(true)
							return
						}
						if (schoolStatus === '4') {
							const schoolName = data.schoolName || ''
							uni.showModal({
								title: '关闭',
								content: '[' + schoolName + ']已被关闭，请稍后再试',
								showCancel: false,
								success: function (res) {
									if (res.confirm) {
										uni.exitMiniProgram()
									}
								}
							})
							resolve(true)
							return
						}
					}
				}

				if (banLevel === '5' && userInfo) {
					const banDay = userInfo.banDay
					const banEndDay = userInfo.banEndDay
					const banReason = userInfo.banReason
					let content = '你的账户因[' + banReason + ']，已被禁止登录小程序'
					if (banDay === '0') {
						content += '。'
					} else if (banDay === '1') {
						content += '1天。截止：' + banEndDay
					} else if (banDay === '2') {
						content += '7天。截止：' + banEndDay
					} else if (banDay === '3') {
						content += '30天。截止：' + banEndDay
					} else if (banDay === '4') {
						content += '360天。截止：' + banEndDay
					}
					uni.showModal({
						title: '封禁',
						content,
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								uni.exitMiniProgram()
							}
						}
					})
					resolve(true)
					return
				}

				resolve(false)
			}
		})
	})
}

export default {
	verifySchoolIsClose,
	verifySchoolIsFreeze
}
