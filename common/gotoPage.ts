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

interface PageData {
	pageName: string
	pageOptions?: {
		id: string
		pageSource: string
	}
}

function toPage(): void {
	let url = ''
	const pageData: PageData = uni.getStorageSync('pageData')
	const pageName = pageData.pageName

	if (pageName === 'personal') {
		url = '/pages/personal/personal'
		uni.redirectTo({ url })
	}
	if (pageName === 'detailPoll') {
		const pageOptions = pageData.pageOptions!
		url = '/pages/detail/detail_poll?id=' + pageOptions.id + '&pageSource=' + pageOptions.pageSource
		uni.redirectTo({ url })
	}
	if (pageName === 'detailInvite') {
		const pageOptions = pageData.pageOptions!
		url = '/pages/detail/detail_invite?id=' + pageOptions.id + '&pageSource=' + pageOptions.pageSource
		uni.redirectTo({ url })
	}
	if (pageName === 'index') {
		url = '/pages/index/index?current=0'
		uni.reLaunch({ url })
	}
}

export default {
	toPage
}
