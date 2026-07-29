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
	// 公司环境
	server_url_config = 'http://192.168.188.13:48080/app-api'
	websocket_url = 'ws://192.168.188.13:48080/ws'
	// 家环境
	// server_url_config = 'http://192.168.2.9:48080/app-api'
	// websocket_url = 'ws://192.168.2.9:48080/ws'
	// 开发环境
	// server_url_config = 'http://192.168.2.7:8280/spec-server'
	// websocket_url = 'ws://192.168.2.7:8280/ws'
	// 生产环境
	// server_url_config = 'https://school.xiaotuantuan.com.cn:8782/app-api'
	// websocket_url = 'wss://school.xiaotuantuan.com.cn:8782/ws'

	// 公众号访问路径
	file_url_server = server_url_config + '/infra/file/upload'
} else {
	// 生产环境
	server_url_config = 'https://school.xiaotuantuan.com.cn:8782/app-api'
	websocket_url = 'wss://school.xiaotuantuan.com.cn:8782/ws'

	file_url_server = server_url_config + '/infra/file/upload'
}

const configData : ConfigData = {
	server_url_config,
	file_url_server,
	pageSize,
	websocket_url
}

export default configData
