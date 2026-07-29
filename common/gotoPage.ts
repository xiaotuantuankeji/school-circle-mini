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
