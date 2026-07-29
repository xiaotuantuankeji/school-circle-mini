const codeMsg: Record<string, string> = {
	'code_9999': '系统出现错误',
	'code_40201000': '缺少参数',
	'code_40201022': '无操作权限',
	'code_40201029': '状态已变更',
	'code_40201033': '含违法违规内容'
}

function getErrCodeMsg(code: string): string {
	let title = codeMsg['code_' + code]
	if (title === undefined) {
		title = '出错，稍后重试'
	}
	return title
}

export default {
	getErrCodeMsg
}
