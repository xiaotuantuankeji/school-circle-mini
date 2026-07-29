/**
 * 业务类型定义
 */

/** 用户信息 */
export interface UserInfo {
	studentId: string
	userId: string
	schoolId: string
	schoolName: string
	userName: string
	nikeName: string
	headUrl: string
	mobilePhone: string
	sex: string
	birthday: string
	signature: string
	likeHobby: string
	bodyHeight: string
	bodyWeight: string
	hometown: string
	mbti: string
	background: string
	isShowInfo: string
	isShowNumId: string
	banLevel: string
	banDay: string
	banEndDay: string
	banReason: string
	studentSort: string
	isNewUser: boolean
}

/** 消息未读数 */
export interface UnreadCount {
	commentCount: number
	likeCount: number
	collectCount: number
	systemCount: number
	playmateCommentCount: number
	playmateMemberCount: number
	list: any[]
}

/** 帖子数据 */
export interface CardItem {
	id: string
	studentId: string
	content: string
	images: string[]
	sectionId: string
	sectionName: string
	commentCount: number
	likeCount: number
	collectCount: number
	isLike: boolean
	isCollect: boolean
	isTop: boolean
	createTime: string
	userInfo: {
		studentId: string
		nikeName: string
		headUrl: string
	}
}

/** 帖子评论 */
export interface CardComment {
	id: string
	cardId: string
	studentId: string
	content: string
	createTime: string
	userInfo: {
		studentId: string
		nikeName: string
		headUrl: string
	}
	replyList?: CardComment[]
}

/** 搭子数据 */
export interface PlaymateItem {
	id: string
	studentId: string
	title: string
	content: string
	images: string[]
	sortId: string
	sortName: string
	status: string
	maxNum: number
	currentNum: number
	createTime: string
	userInfo: {
		studentId: string
		nikeName: string
		headUrl: string
	}
}

/** API 响应结构 */
export interface ApiResponse<T = any> {
	code: number
	msg: string
	data: T
}

/** 分页参数 */
export interface PageParams {
	pageNo: number
	pageSize: number
}

/** 学校数据 */
export interface SchoolInfo {
	id: string
	schoolName: string
	schoolLogo: string
	schoolStatus: string
}

/** 存储配置 */
export interface StorageOptions {
	expire?: number
}

/** 存储数据结构 */
export interface StorageData<T = any> {
	value: T
	expire: number
	timestamp: number
}

/** 请求配置 */
export interface RequestOptions {
	url: string
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	data?: Record<string, any> | string
	contentType?: 'json' | 'form' | 'file'
	cacheTTL?: number
	repeatable?: boolean
	showError?: boolean
	silent?: boolean
}

/** 拦截器 */
export interface Interceptor {
	fulfilled: (config: any) => any
	rejected?: (error: any) => any
}
