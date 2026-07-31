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

interface ConfigData {
	server_url_config : string
	file_url_server : string
	pageSize : number
	websocket_url : string
}

let server_url_config : string = ''
let file_url_server : string = ''
const pageSize : number = 10

let websocket_url : string = ''

if (process.env.NODE_ENV === 'development') {
	// 开发环境，请替换为实际的开发服务器地址和端口
	server_url_config = 'http://XXX.XXX.XXX.XXX:XXXXX/app-api'
	websocket_url = 'ws://XXX.XXX.XXX.XXX:XXXXX/ws'

	// 公众号访问路径
	file_url_server = server_url_config + '/infra/file/upload'
} else {
	// 生产环境，请替换为实际的生产服务器域名和端口
	server_url_config = 'https://XXX.XXX.XXX.XXX:XXXXX/app-api'
	websocket_url = 'wss://XXX.XXX.XXX.XXX:XXXXX/ws'

	file_url_server = server_url_config + '/infra/file/upload'
}

const configData : ConfigData = {
	server_url_config,
	file_url_server,
	pageSize,
	websocket_url
}

export default configData
