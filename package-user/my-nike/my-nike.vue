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
		<top-background></top-background>

		<view class="contentInsideView">
			<view class="moreNikeAddView">
				<view class="moreNikeAddText">注：初始昵称（团团_开头）仅可修改一次，新增的昵称保存后不可修改或删除</view>
				<uni-icons type="plus-filled" size="40" color="#4CAF50" @click="addNikeNameBtn"></uni-icons>
			</view>
			<view class="moreNikeInputView" v-for="(item, idx) in loginMoreNikeList" :key="idx">
				<input class="moreNikeInput" type="text" v-model="item.nikeName" placeholder="请输入昵称" :disabled="item.isDisabled"
					maxlength="20" />
			</view>

			<button class="bottomBtn" @click="nikeNameClick" v-if="isShowSaveBtn">保&nbsp;&nbsp;&nbsp;&nbsp;存</button>
		</view>
	</view>
</template>

<script>
	import verifySchool from '../../libs/verify_school'
	export default {
		data() {
			return {
				winWidth: 0,
				winHeight: 0,

				access_token: '',
				nikeCount: 0,
				nikeMaxCount: 3,
				isMainNikeDisabled: true,
				isShowSaveBtn: false,

				loginStudentId: '',
				mainNikeName: '',
				loginMoreNikeList: [],
			}
		},
		onLoad(opt) {
			this.getSystemInfo()
			this.getLoginInfo()
			this.getAccessToken()
		},
		methods: {
			// 获取设备信息
			getSystemInfo() {
				const that = this
				uni.getSystemInfo({
					success: function(res) {
						that.winWidth = res.windowWidth
						that.winHeight = res.windowHeight
					}
				});
			},
			// 获取当前登录用户信息
			getLoginInfo() {
				const userInfo = this.$storage.user.get();
				this.loginStudentId = userInfo.studentId
				this.loginMoreNikeList = userInfo.moreNikeList
				this.nikeCount = this.loginMoreNikeList.length
				for (let i = 0; i < this.loginMoreNikeList.length; i++) {
					this.loginMoreNikeList[i].isDisabled = true
					if (this.loginMoreNikeList[i].nikeName.indexOf("团团_") > -1) {
						this.loginMoreNikeList[i].isDisabled = false
						this.isShowSaveBtn = true
					}
				}
			},
			getAccessToken() {
				const param = ''
				this.$api.getAccessToken(param).then(res => {
					// console.log('getAccessToken succes res:' + JSON.stringify(res))
					this.access_token = res.data

				}).catch(res => {
					// 失败进行的操作
					uni.showToast({
						icon: 'error',
						title: '出错了...',
						mask: true
					})
				})
			},
			async addNikeNameBtn() {
				const isFreeze = await verifySchool.verifySchoolIsFreeze();
				if (isFreeze) {
					return;
				}

				if (this.nikeCount == this.nikeMaxCount) {
					uni.showToast({
						title: '最多存在3个昵称',
						icon: 'none',
						mask: true
					})
				} else {
					this.loginMoreNikeList.push({
						id: null,
						schoolId: '',
						studentId: '',
						nikeName: '',
						isDefault: '0',
						isDisabled: false,
					})
					this.nikeCount = this.nikeCount + 1
					this.isShowSaveBtn = true
				}
			},
			checkContent(content) {
				const _this = this
				return new Promise((resolve, reject) => {
					const param = {
						access_token: _this.access_token,
						content: content
					}
					this.$api.msgSecCheck(param).then(res => {
						// console.log('msgSecCheck succes res:' + JSON.stringify(res))
						resolve(res.data)
					}).catch(res => {
						// 失败进行的操作
						uni.showToast({
							icon: 'error',
							title: res,
							mask: true
						})
					})
				})
			},
			async nikeNameClick() {
				const _this = this
				const isFreeze = await verifySchool.verifySchoolIsFreeze();
				if (isFreeze) {
					return;
				}

				uni.showLoading({
					title: '处理中...',
					mask: true
				})

				let nikeContent = ''
				if (this.loginMoreNikeList.length > 0) {
					const nikeArray = []

					const loginMoreNikeList = this.loginMoreNikeList
					for (let i = 0; i < loginMoreNikeList.length; i++) {
						const item = loginMoreNikeList[i]
						if (item.nikeName == '') {
							uni.showToast({
								title: '昵称不能为空！',
								icon: 'none',
								mask: true
							})
							return
						}
						nikeArray.push(item.nikeName)
						nikeContent = item.nikeName + ','
					}

					const newSet = new Set(nikeArray)
					if (nikeArray.length !== newSet.size) {
						uni.showToast({
							title: '昵称不能重复！',
							icon: 'none',
							mask: true
						})
						return
					}
				}

				if (nikeContent.indexOf('团团_') > -1) {
					uni.showToast({
						title: '昵称不能包含：团团_',
						icon: 'none',
						mask: true
					})
					return
				}

				const res_content = await this.checkContent(nikeContent)
				// console.log("return checkContent res_content:" + JSON.stringify(res_content))
				if (res_content) {
					uni.hideLoading()

					uni.showToast({
						title: '昵称包含危险信息，请修改',
						icon: 'none',
						mask: true
					})
					return
				}

				const param = 'loginStudentId=' + this.loginStudentId + '&moreNike=' + JSON.stringify(this
					.loginMoreNikeList)
				this.$api.saveMyNikeName(param).then(res => {
					// console.log('saveMyAvatar succes res:' + JSON.stringify(res))
					if (res.code == 0) {
						const newNike = res.data

						uni.hideLoading()

						new Promise(function(resolve, reject) {
							_this.$wechatAuth.getUserDetail(_this.loginStudentId,
								resolve)
						}).then(function(msg) {
							if (msg == 'ok') {
								const userInfo = this.$storage.user.get()
								userInfo.moreNikeList = newNike
								uni.setStorageSync("userInfo", userInfo)

								uni.navigateBack()
							}
						})
					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true,
							duration: 3000
						})
					}
				}).catch(res => {
					// 失败进行的操作
					uni.showToast({
						icon: 'error',
						title: '出错了...',
						mask: true
					})
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		background: linear-gradient(180deg, #94D4D2 0%, #FFFFFF 8%, #FFFFFF 100%);
		position: relative;
	}

	.contentInsideView {
		width: 89%;
		position: absolute;
		z-index: 2;
		padding: 10rpx 46rpx 50rpx 46rpx;
	}

	.topNikeNameView {
		margin-top: 20rpx;
	}

	.topNikeNameInput {
		background: #FFFFFF;
		box-shadow: 0 0 4rpx 2rpx rgba(0, 0, 0, 0.16);
		border-radius: 20rpx;
		padding: 20rpx;
		color: #000000;
		font-size: 29rpx;
	}

	.moreNikeAddView {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.moreNikeAddText {
		font-size: 28rpx;
		color: #FF0000;
	}

	.moreNikeInputView {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.moreNikeInput {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0 0 4rpx 2rpx rgba(0, 0, 0, 0.16);
		border-radius: 20rpx;
		padding: 20rpx;
		color: #000000;
		font-size: 29rpx;
	}

	.bottomBtn {
		margin-top: 60rpx;
		background: #000000;
		border-radius: 40rpx;

		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 31rpx;
		color: #8CE8ED;
		font-style: normal;
		text-transform: none;
	}
</style>
