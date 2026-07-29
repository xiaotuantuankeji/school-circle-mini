import configData from './config'
import uuidData from './uuid_data'
import storage from './storage'

function uploadHead(path: string, resolve?: (result: string) => void): void {
	const userInfoData = storage.user.get()
	const userId = userInfoData ? userInfoData.userId : ''

	const fileUrl = (configData as any).file_url_config
	uni.uploadFile({
		url: fileUrl + '/Web/v1/files/minip/uploadUserResourceImage',
		filePath: path,
		name: 'localFile',
		formData: {
			fileId: uuidData.uuidToString(),
			userId: userId,
			category: '1'
		},
		success: (uploadFileRes) => {
			const data = JSON.parse(uploadFileRes.data)
			const url: string = data.data

			const userData = storage.user.get()
			if (userData) {
				userData.headUrl = url
				storage.user.set(userData)
			}

			if (resolve !== undefined) {
				resolve('ok')
			}
		}
	})
}

export default {
	uploadHead
}
