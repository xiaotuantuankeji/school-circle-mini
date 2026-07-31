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
 * 通用工具函数
 */

/**
 * 格式化时间（秒 → HH:MM:SS）
 */
function formatTime(time: number | string): number | string {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	const hour = parseInt(String(time / 3600))
	time = time % 3600
	const minute = parseInt(String(time / 60))
	time = time % 60
	const second = time

	return ([hour, minute, second]).map(function (n) {
		const s = n.toString()
		return s[1] ? s : '0' + s
	}).join(':')
}

/**
 * 格式化位置
 */
function formatLocation(
	longitude: string | number,
	latitude: string | number
): { longitude: string[]; latitude: string[] } {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	const lonStr = Number(longitude).toFixed(2)
	const latStr = Number(latitude).toFixed(2)

	return {
		longitude: lonStr.toString().split('.'),
		latitude: latStr.toString().split('.')
	}
}

const UNITS: Record<string, number> = {
	'年': 31557600000,
	'月': 2629800000,
	'天': 86400000,
	'小时': 3600000,
	'分钟': 60000,
	'秒': 1000
}

const dateUtils = {
	UNITS,

	humanize(milliseconds: number): string {
		let humanize = ''
		for (const key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前'
				break
			}
		}
		return humanize || '刚刚'
	},

	format(dateStr: string): string {
		const date = this.parse(dateStr)
		const diff = Date.now() - date.getTime()
		if (diff < this.UNITS['天']) {
			return this.humanize(diff)
		}
		const _format = function (number: number): string | number {
			return number < 10 ? '0' + number : number
		}
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes())
	},

	parse(str: string): Date {
		const a = str.split(/[^0-9]/).map(Number)
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
	}
}

function getNowTime(): string {
	const date = new Date()
	const hh = date.getHours()
	const mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	return hh + ':' + mf + ':' + ss
}

function getNowDate(): string {
	const date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	return year + '-' + month + '-' + day
}

function checkEmail(email: string): boolean {
	return RegExp(/^([a-zA-Z0-9]+[_|.]*[a-zA-Z0-9]+)@([a-zA-Z0-9]+[_|.]*[a-zA-Z0-9]+)\.[a-zA-Z]{2,4}$/).test(email)
}

/**
 * 时间格式化为"刚刚"、"X分钟前"等
 */
function getDateBeforeNow(stringTime: string): string {
	const timeObj = new Date(stringTime)

	const minute = 1000 * 60
	const hour = minute * 60
	const day = hour * 24
	const week = day * 7
	const month = day * 30
	const year = month * 12

	const time1 = Date.now()
	const time2 = timeObj.getTime()
	const time = time1 - time2

	let result: string | Date | null = null
	if (time < 0) {
		result = stringTime
	} else if (time / year >= 1) {
		result = getStrDate(stringTime)
	} else if (time / month >= 1) {
		result = getStrDate(stringTime)
	} else if (time / week >= 1) {
		result = getStrDate(stringTime)
	} else if (time / day >= 1) {
		const days = parseInt(String(time / day))
		if (days > 3) {
			result = getStrDate(stringTime)
		} else {
			result = days + '天前'
		}
	} else if (time / hour >= 1) {
		result = parseInt(String(time / hour)) + '小时前'
	} else if (time / minute >= 1) {
		result = parseInt(String(time / minute)) + '分钟前'
	} else {
		result = '刚刚'
	}
	return result
}

function getStrDate(strDate: string): string {
	const date = new Date(strDate)
	const year = date.getFullYear()
	const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	return year + '-' + month + '-' + day
}

/**
 * 防抖函数 - 在连续调用后只执行最后一次
 */
function debounce(fn: Function, delay: number = 500): Function {
	let timer: ReturnType<typeof setTimeout> | null = null
	return function (this: any, ...args: any[]) {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
			timer = null
		}, delay)
	}
}

/**
 * 节流函数 - 在指定时间间隔内只执行一次
 */
function throttle(fn: Function, delay: number = 300): Function {
	let lastTime = 0
	return function (this: any, ...args: any[]) {
		const now = Date.now()
		if (now - lastTime >= delay) {
			fn.apply(this, args)
			lastTime = now
		}
	}
}

export default {
	formatTime,
	formatLocation,
	dateUtils,
	getNowTime,
	getNowDate,
	checkEmail,
	getDateBeforeNow,
	debounce,
	throttle
}
