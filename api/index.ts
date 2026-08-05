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

import request from '@/common/request'

const api: Record<string, (params: any) => Promise<any>> = {
	getJsApiTicket: (params: any) => request.globalRequest('/school/mini/getJsApiTicket', 'GET', params, 'form', ''),
	getStudentInfo: (params: any) => request.globalRequest('/school/mini/getStudentInfo', 'GET', params, 'form', ''),
	getSectionList: (params: any) => request.globalRequest('/school/mini/getSectionData', 'GET', params, 'form', ''),
	getAllSchoolByStatus: (params: any) => request.globalRequest('/school/mini/getAllSchoolByStatus', 'GET', params, 'form', ''),
	saveStudentSchool: (params: any) => request.globalRequest('/school/mini/saveStudentSchool', 'POST', params, 'json', ''),

	// 发帖
	saveCardData: (params: any) => request.globalRequest('/school/mini/saveSendCard', 'POST', params, 'form', ''),
	getSendCardList: (params: any) => request.globalRequest('/school/mini/getSendCard', 'GET', params, 'form', ''),
	updateLikeSign: (params: any) => request.globalRequest('/school/mini/updateLikeSign', 'POST', params, 'form', ''),
	updateCollectSign: (params: any) => request.globalRequest('/school/mini/updateCollectSign', 'POST', params, 'form', ''),
	updateAttentionSign: (params: any) => request.globalRequest('/school/mini/updateAttentionSign', 'POST', params, 'form', ''),
	getOtherSchool: (params: any) => request.globalRequest('/school/mini/getOtherSchool', 'GET', params, 'form', ''),
	getSendCardDetail: (params: any) => request.globalRequest('/school/mini/getSendCardDetail', 'GET', params, 'form', ''),
	saveCardComment: (params: any) => request.globalRequest('/school/mini/saveCardComment', 'POST', params, 'form', ''),
	getCardCommentList: (params: any) => request.globalRequest('/school/mini/getCardCommentList', 'GET', params, 'form', ''),
	updateCommentLikeSign: (params: any) => request.globalRequest('/school/mini/updateCommentLikeSign', 'POST', params, 'form', ''),
	getCarouselImageInfo: (params: any) => request.globalRequest('/school/mini/getCarouselImageInfo', 'GET', params, 'form', ''),
	updateIsTopSign: (params: any) => request.globalRequest('/school/mini/updateIsTopSign', 'POST', params, 'form', ''),
	deleteCardInfo: (params: any) => request.globalRequest('/school/mini/deleteCardInfo', 'POST', params, 'form', ''),
	saveAccusationInfo: (params: any) => request.globalRequest('/school/mini/saveAccusationInfo', 'POST', params, 'json', ''),
	getHotCardList: (params: any) => request.globalRequest('/school/mini/getHotCardList', 'GET', params, 'form', ''),

	// 搭子
	getPlaymateSort: (params: any) => request.globalRequest('/school/mini/getPlaymateSort', 'GET', params, 'form', ''),
	savePlaymateData: (params: any) => request.globalRequest('/school/mini/savePlaymate', 'POST', params, 'form', ''),
	getPlaymateList: (params: any) => request.globalRequest('/school/mini/getPlaymateList', 'GET', params, 'form', ''),
	getPlaymateDetail: (params: any) => request.globalRequest('/school/mini/getPlaymateDetail', 'GET', params, 'form', ''),
	savePlaymateComment: (params: any) => request.globalRequest('/school/mini/savePlaymateComment', 'POST', params, 'form', ''),
	getPlaymateCommentList: (params: any) => request.globalRequest('/school/mini/getPlaymateCommentList', 'GET', params, 'form', ''),
	playmateUpdateLikeSign: (params: any) => request.globalRequest('/school/mini/playmateUpdateLikeSign', 'POST', params, 'form', ''),

	// 微信
	getAccessToken: (params: any) => request.globalRequest('/school/mini/getAccessToken', 'GET', params, 'form', ''),
	msgSecCheck: (params: any) => request.globalRequest('/school/mini/msgSecCheck', 'POST', params, 'form', ''),
	mediaSecCheck: (params: any) => request.globalRequest('/school/mini/mediaSecCheck', 'POST', params, 'form', ''),
	getPhoneNumber: (params: any) => request.globalRequest('/school/mini/getPhoneNumber', 'POST', params, 'form', ''),

	joinPlaymate: (params: any) => request.globalRequest('/school/mini/joinPlaymate', 'POST', params, 'form', ''),
	quitPlaymate: (params: any) => request.globalRequest('/school/mini/quitPlaymate', 'POST', params, 'form', ''),
	finishPlaymate: (params: any) => request.globalRequest('/school/mini/finishPlaymate', 'POST', params, 'form', ''),
	disbandPlaymate: (params: any) => request.globalRequest('/school/mini/disbandPlaymate', 'POST', params, 'form', ''),

	// 消息
	getMessageCommentList: (params: any) => request.globalRequest('/school/mini/getMessageCommentList', 'GET', params, 'form', ''),
	getMessageLikeList: (params: any) => request.globalRequest('/school/mini/getMessageLikeList', 'GET', params, 'form', ''),
	getMessageCollectList: (params: any) => request.globalRequest('/school/mini/getMessageCollectList', 'GET', params, 'form', ''),
	getMessagePlaymateCommentList: (params: any) => request.globalRequest('/school/mini/getMessagePlaymateCommentList', 'GET', params, 'form', ''),
	getMessageSystemList: (params: any) => request.globalRequest('/school/mini/getMessageSystemList', 'GET', params, 'form', ''),
	getSystemMsgContent: (params: any) => request.globalRequest('/school/mini/getSystemMsgContent', 'GET', params, 'form', ''),

	// 个人设置
	saveCardLookPurview: (params: any) => request.globalRequest('/school/mini/saveCardLookPurview', 'POST', params, 'form', ''),
	saveMySignature: (params: any) => request.globalRequest('/school/mini/saveMySignature', 'POST', params, 'form', ''),
	saveMyLikeHobby: (params: any) => request.globalRequest('/school/mini/saveMyLikeHobby', 'POST', params, 'form', ''),
	saveMyBirthday: (params: any) => request.globalRequest('/school/mini/saveMyBirthday', 'POST', params, 'form', ''),
	saveMySex: (params: any) => request.globalRequest('/school/mini/saveMySex', 'POST', params, 'form', ''),
	saveMyBodyHeight: (params: any) => request.globalRequest('/school/mini/saveMyBodyHeight', 'POST', params, 'form', ''),
	saveMyBodyWeight: (params: any) => request.globalRequest('/school/mini/saveMyBodyWeight', 'POST', params, 'form', ''),
	saveMyHometown: (params: any) => request.globalRequest('/school/mini/saveMyHometown', 'POST', params, 'form', ''),
	saveMyMBTI: (params: any) => request.globalRequest('/school/mini/saveMyMBTI', 'POST', params, 'form', ''),
	saveMyAvatar: (params: any) => request.globalRequest('/school/mini/saveMyAvatar', 'POST', params, 'form', ''),
	saveMyNikeName: (params: any) => request.globalRequest('/school/mini/saveMyNikeName', 'POST', params, 'form', ''),
	saveMyBackground: (params: any) => request.globalRequest('/school/mini/saveMyBackground', 'POST', params, 'form', ''),
	saveMyMobilePhone: (params: any) => request.globalRequest('/school/mini/saveMyMobilePhone', 'POST', params, 'form', ''),
	saveMyIsShowInfo: (params: any) => request.globalRequest('/school/mini/saveMyIsShowInfo', 'POST', params, 'form', ''),
	saveMyIsShowNumId: (params: any) => request.globalRequest('/school/mini/saveMyIsShowNumId', 'POST', params, 'form', ''),

	getMyMessageList: (params: any) => request.globalRequest('/school/mini/getMyMessageList', 'GET', params, 'form', ''),
	getMyMessageCount: (params: any) => request.globalRequest('/school/mini/getMyMessageCount', 'GET', params, 'form', ''),
	deleteCardComment: (params: any) => request.globalRequest('/school/mini/deleteCardComment', 'POST', params, 'form', ''),
	getGlobalSettings: (params: any) => request.globalRequest('/school/mini/getGlobalSettings', 'GET', params, 'form', ''),

	// 账号
	getAccountsInfo: (params: any) => request.globalRequest('/school/mini/getAccountsInfo', 'GET', params, 'form', ''),
	updateDefaultNikeName: (params: any) => request.globalRequest('/school/mini/updateDefaultNikeName', 'POST', params, 'form', ''),

	// 认证
	saveSchoolVerify: (params: any) => request.globalRequest('/school/mini/saveSchoolVerify', 'POST', params, 'form', ''),
	getVerifyRecord: (params: any) => request.globalRequest('/school/mini/getLastSchoolVerifyRecord', 'GET', params, 'form', ''),
	getChildIdentityList: (params: any) => request.globalRequest('/school/mini/getChildIdentityList', 'GET', params, 'form', ''),
	saveIdentityVerify: (params: any) => request.globalRequest('/school/mini/saveIdentityVerify', 'POST', params, 'form', ''),
	getIdentityVerifyRecord: (params: any) => request.globalRequest('/school/mini/getLastIdentityVerifyRecord', 'GET', params, 'form', ''),
	getStudentBadge: (params: any) => request.globalRequest('/school/mini/getStudentBadge', 'GET', params, 'form', ''),

	// 好友/关注
	getGroupList: (params: any) => request.globalRequest('/school/mini/getGroupList', 'GET', params, 'form', ''),
	getStudentFollow: (params: any) => request.globalRequest('/school/mini/getStudentFollow', 'GET', params, 'form', ''),
	saveStudentFollow: (params: any) => request.globalRequest('/school/mini/saveStudentFollow', 'POST', params, 'form', ''),
	saveGroupList: (params: any) => request.globalRequest('/school/mini/saveGroupList', 'POST', params, 'form', ''),
	getGroupContent: (params: any) => request.globalRequest('/school/mini/getGroupContent', 'GET', params, 'form', ''),
	sendGroupContent: (params: any) => request.globalRequest('/school/mini/sendGroupContent', 'POST', params, 'form', ''),
	deleteGroupContent: (params: any) => request.globalRequest('/school/mini/deleteGroupContent', 'POST', params, 'form', ''),
	deleteGroupList: (params: any) => request.globalRequest('/school/mini/deleteGroupList', 'POST', params, 'form', ''),
	getGroupSendPurview: (params: any) => request.globalRequest('/school/mini/getGroupSendPurview', 'GET', params, 'form', ''),
	updateBatchRead: (params: any) => request.globalRequest('/school/mini/updateBatchRead', 'POST', params, 'form', ''),
	updateGroupContentRead: (params: any) => request.globalRequest('/school/mini/updateGroupContentRead', 'POST', params, 'form', ''),

	// 其他
	getPageImageData: (params: any) => request.globalRequest('/school/mini/getPageImageData', 'GET', params, 'form', ''),
	updateShareImageUrl: (params: any) => request.globalRequest('/school/mini/updateShareImageUrl', 'POST', params, 'form', ''),
	followUser: (params: any) => request.globalRequest('/school/mini/followUser', 'POST', params, 'json', ''),
	isFollowingUser: (params: any) => request.globalRequest('/school/mini/isFollowingUser', 'GET', params, 'form', ''),
	getFollowUserNumber: (params: any) => request.globalRequest('/school/mini/getFollowUserNumber', 'GET', params, 'form', ''),
	getFollowingList: (params: any) => request.globalRequest('/school/mini/getFollowingList', 'GET', params, 'form', ''),
	getFollowersList: (params: any) => request.globalRequest('/school/mini/getFollowersList', 'GET', params, 'form', ''),
	getMutualFollowList: (params: any) => request.globalRequest('/school/mini/getMutualFollowList', 'GET', params, 'form', ''),
	getAdContent: (params: any) => request.globalRequest('/school/mini/getAdContent', 'GET', params, 'form', ''),
	saveClickNum: (params: any) => request.globalRequest('/school/mini/saveClickNum', 'POST', params, 'form', ''),
	saveLoginLog: (params: any) => request.globalRequest('/school/mini/saveLoginLog', 'POST', params, 'json', ''),
	saveExamineAppeal: (params: any) => request.globalRequest('/school/mini/saveExamineAppeal', 'POST', params, 'form', ''),

	// 机构
	saveAgencyInfo: (params: any) => request.globalRequest('/school/mini/saveAgencyInfo', 'POST', params, 'form', ''),
	loginAgencyAccount: (params: any) => request.globalRequest('/school/mini/loginAgencyAccount', 'POST', params, 'form', ''),
	getAgencySchoolData: (params: any) => request.globalRequest('/school/mini/getAgencySchoolData', 'GET', params, 'form', ''),
	updateLoginPass: (params: any) => request.globalRequest('/school/mini/updateLoginPass', 'POST', params, 'form', ''),
	deleteAccount: (params: any) => request.globalRequest('/school/mini/deleteAccount', 'POST', params, 'form', ''),
	getAreaTree: (params: any) => request.globalRequest('/system/area/city_tree', 'GET', params, 'form', ''),

	// 未读数
	getUnreadCount: (params: any) => request.globalRequest('/school/mini/getUnreadCount', 'GET', params, 'form', ''),
	updateUnreadCount: (params: any) => request.globalRequest('/school/mini/updateUnreadCount', 'POST', params, 'form', ''),

	// 课程表
	getCourseCurrentSemester: (params: any) => request.get('/school/mini/course/semester/current', params, { cacheTTL: 60 * 1000, silent: true }),
	getCourseSemesterList: (params: any) => request.get('/school/mini/course/semester/list', params, { cacheTTL: 60 * 1000, silent: true }),
	getCourseClassroomList: (params: any) => request.get('/school/mini/course/classroom/list', params, { cacheTTL: 60 * 1000, silent: true }),
	getCourseTemplateList: (params: any) => request.get('/school/mini/course/template/list', params, { cacheTTL: 60 * 1000, silent: true }),
	getCourseScheduleList: (params: any) => request.get('/school/mini/course/schedule/list', params, { cacheTTL: 10 * 1000, silent: true }),
	getCourseScheduleByWeek: (params: any) => request.get('/school/mini/course/schedule/listByWeek', params, { cacheTTL: 30 * 1000, silent: true }),
	createCourseSchedule: (params: any) => request.post(`/school/mini/course/schedule/create?studentId=${params.studentId}`, params, { silent: true }),
	updateCourseSchedule: (params: any) => request.put(`/school/mini/course/schedule/update?studentId=${params.studentId}`, params, { silent: true }),
	deleteCourseSchedule: (params: any) => request.del(`/school/mini/course/schedule/delete?id=${params.id}&studentId=${params.studentId}`, {}, { silent: true }),
	importCourseFromTemplates: (params: any) => request.globalRequest('/school/mini/course/schedule/importFromTemplates', 'POST', `semesterId=${params.semesterId}&studentId=${params.studentId}&templateIds=${params.templateIds.join(',')}&dayOfWeek=${params.dayOfWeek}&startSection=${params.startSection}&endSection=${params.endSection}&weekStart=${params.weekStart}&weekEnd=${params.weekEnd}`, 'form', ''),
	generateCourseShareCode: (params: any) => request.get('/school/mini/course/schedule/generateShareCode', params, { silent: true }),
	importCourseByShareCode: (params: any) => request.globalRequest('/school/mini/course/schedule/importByShareCode', 'POST', `shareCode=${encodeURIComponent(params.shareCode)}&semesterId=${params.semesterId}&studentId=${params.studentId}`, 'form', ''),

	// H5 用户名密码登录
	loginByPassword: (params: any) => request.globalRequest('/school/mini/loginByPassword', 'POST', params, 'json', ''),
	// H5 用户名密码注册
	registerByPassword: (params: any) => request.globalRequest('/school/mini/registerByPassword', 'POST', params, 'json', '')
}

export default api
