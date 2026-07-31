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
