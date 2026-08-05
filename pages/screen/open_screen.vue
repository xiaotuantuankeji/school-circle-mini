<!--
  Copyright 2026 南京校团团科技有限公司

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<template>
	<view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
		<image class="content-image" :src="showImage" v-if="showImage!=''"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				winWidth: 0,
				winHeight: 0,

				imageData: [],
				showImage: '',

				countDown: 1
			}
		},
		onLoad() {
			this.getSystemInfo()
		},
		onShow() {
			// #ifdef H5
			// H5: 先检查登录状态，未登录则跳转，不执行后续逻辑
			const token = this.$storage.token.get()
			const userInfo = this.$storage.user.get()
			if (!token || !userInfo || !userInfo.studentId) {
				uni.redirectTo({ url: '/pages/login/login' })
				return
			}
			this.saveLoginLog()
			this.getPageImageData()
			// #endif
			// #ifndef H5
			this.getUserInfo()
			this.getPageImageData()
			// #endif
		},
		methods: {
			// 获取设备信息
			getSystemInfo() {
				const that = this
				const winInfo = uni.getWindowInfo()
				// console.log('winInfo:' + JSON.stringify(winInfo))
				that.winWidth = winInfo.windowWidth
				that.winHeight = winInfo.windowHeight
			},
			getUserInfo() {
				const that = this
				// #ifdef H5
				const token = that.$storage.token.get()
				const userInfo = that.$storage.user.get()
				if (token && userInfo && userInfo.studentId) {
					that.saveLoginLog()
				} else {
					// 未登录，跳转到登录页
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
				// #endif
				// #ifndef H5
				new Promise(function(resolve, reject) {
					that.$wechatAuth.validateUser(resolve)
				}).then(function(msg) {
					console.log('msg:' + msg)
					if (msg == 'ok') {
						that.saveLoginLog()
					}
				})
				// #endif
			},
			showAd() {
				this.countDown = 1; // 设置倒计时时间
				this.startCountDown(); // 开始倒计时
			},
			startCountDown() {
				const that = this
				const timer = setInterval(() => {
					if (that.countDown > 0) {
						that.countDown--;
					} else {
						clearInterval(timer)
						that.skip();
					}
				}, 1000);
			},
			skip() {
				const userInfo = this.$storage.user.get();
				const schoolId = userInfo ? userInfo.schoolId : ''
				if (schoolId == '') {
					uni.redirectTo({
						url: '/pages/chooseschool/chooseschool'
					})
				} else {
					uni.switchTab({
						url: "/pages/index/index"
					})
				}
			},
			getPageImageData() {
				const param = 'type=1'
				this.$api.getPageImageData(param).then(res => {
					// console.log('getPageImageData succes res:' + JSON.stringify(res))

					const data = res.data
					this.imageData = data

					for (let i = 0; i < data.length; i++) {
						const item = data[i]
						this.showImage = item.imageUrl
					}

					if (this.showImage == '') {
						this.skip();
					} else {
						this.showAd()
					}
				}).catch(res => {
					// 失败进行的操作
					// uni.showToast({
					//     icon: 'error',
					//     title: '出错了...',
					//     mask: true
					// })
					this.skip();
				})
			},
			saveLoginLog() {
				const userInfo = this.$storage.user.get();
				const deviceData = uni.getDeviceInfo();
				// console.log('userInfo:' + JSON.stringify(userInfo))
				// console.log('deviceData:' + JSON.stringify(deviceData))

				const param = {
					schoolId: userInfo.schoolId,
					schoolName: userInfo.schoolName,
					studentId: userInfo.studentId,
					openid: userInfo.openid,
					numId: userInfo.numId,
					nikeName: userInfo.showNikeName,
					osSystem: deviceData.system,
					platform: deviceData.platform,
					deviceId: deviceData.deviceId,
					deviceType: deviceData.deviceType,
					deviceBrand: deviceData.deviceBrand,
					deviceModel: deviceData.deviceModel
				}
				this.$api.saveLoginLog(param).then(res => {
					// console.log('saveLoginLog succes res:' + JSON.stringify(res))
					uni.$emit('loginSuccess')
				}).catch(res => {
					uni.$emit('loginSuccess')
				})
			},
		}
	}
</script>

<style>
	.content {}

	.content-image {
		width: 100%;
		height: 100%;
	}
</style>
