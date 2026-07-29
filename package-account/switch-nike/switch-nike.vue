<template>
	<view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
		<top-background></top-background>

		<view class="contentInsideView">

			<view class="nikeItemView" v-for="(item, idx) in nikeList" :key="idx" @click="switchNikeClick(item)">
				<!-- <view class="nikeItemAvatarView">
                    <image class="topUserAvatarImg" src="/static/img/logo/default-avatar.png" v-if="item.avatar==''">
                    </image>
                    <image class="topUserAvatarImg" :src="item.avatar" v-else></image>
                </view> -->
				<view class="nikeItemBasicView">
					<view class="nikeItemBasicNikeView">
						<!-- <view class="nikeItemBasicTagView" v-if="item.sort=='1'">主号</view>
                        <view class="nikeItemBasicTagView" v-if="item.sort=='2'">小号</view> -->
						<view class="nikeItemBasicNikeText">{{item.nikeName}}</view>
					</view>
					<!-- <view class="nikeItemBasicSchoolView">{{item.schoolName}}</view> -->
				</view>
				<view class="nikeItemIconView">
					<uni-icons type="checkbox-filled" color="#18bc37" size="30" v-if="item.isCheck"></uni-icons>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				winWidth: 0,
				winHeight: 0,

				loginStudentId: '',
				loginStudentSort: '0', //学生分类（0:未设置，1:内部管理，2:内部小号）
				loginSchoolId: '',
				loginSchoolName: '',
				loginNikeName: '',
				loginAvatar: '',
				loginNumId: '',
				// loginMoreNikeList: [],

				showNikeName: '',

				nikeList: [],
			}
		},
		onLoad(opt) {
			this.getSystemInfo()
		},
		onShow() {
			this.getLoginInfo()
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
			// 获取当前登录用户信息
			getLoginInfo() {
				const userInfo = this.$storage.user.get();
				this.loginStudentId = userInfo.studentId
				this.loginStudentSort = userInfo.sort
				this.loginSchoolId = userInfo.schoolId
				this.loginSchoolName = userInfo.schoolName
				this.loginNikeName = userInfo.nikeName
				this.loginAvatar = userInfo.avatar
				this.loginNumId = userInfo.numId
				const moreNikeList = userInfo.moreNikeList
				// this.loginMoreNikeList = moreNikeList

				this.showNikeName = userInfo.showNikeName

				const nikeList = []
				// let mainIsCheck = false
				// if (userInfo.nikeName == userInfo.showNikeName) {
				//     mainIsCheck = true
				// }
				// nikeList.push({
				//     id: this.loginStudentId,
				//     studentId: this.loginStudentId,
				//     nikeName: this.loginNikeName,
				//     isCheck: mainIsCheck,
				//     isMain: true
				// })
				for (let i = 0; i < moreNikeList.length; i++) {
					const item = moreNikeList[i]
					nikeList.push({
						id: item.id,
						studentId: item.studentId,
						nikeName: item.nikeName,
						isCheck: (item.isDefault == '1') ? true : false,
						isMain: false
					})
				}

				this.nikeList = nikeList
			},
			switchNikeClick(item) {
				const _this = this
				if (item.nikeName != this.showNikeName) {
					uni.showModal({
						title: '提示',
						content: '是否确认切换此昵称？',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								_this.switchNike(item.id, item.studentId, item.nikeName, item.isMain)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},
			switchNike(id, studentId, nikeName, isMain) {
				const _this = this
				uni.showLoading({
					title: '切换中...',
					mask: true
				})

				const param = 'id=' + id + '&studentId=' + studentId + '&isMain=' + isMain
				this.$api.updateDefaultNikeName(param).then(res => {
					// console.log('saveMyAvatar succes res:' + JSON.stringify(res))

					this.showNikeName = nikeName

					const data = res.data

					new Promise(function(resolve, reject) {
						_this.$wechatAuth.getUserDetail(_this.loginStudentId,
							resolve)
					}).then(function(msg) {
						if (msg == 'ok') {
							// this.loginMoreNikeList = data

							const userInfo = _this.$storage.user.get()
							// userInfo.showNikeName = nikeName
							userInfo.moreNikeList = data
							uni.setStorageSync("userInfo", userInfo)

							uni.navigateBack()
						}

						uni.hideLoading()
					})
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
		background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #FFFFFF 100%);
		position: relative;
	}

	.contentInsideView {
		width: 89%;
		height: 93%;
		position: absolute;
		z-index: 2;
		padding: 50rpx 46rpx;
	}

	.nikeItemView {
		height: 60rpx;
		padding: 20rpx 40rpx;
		border-radius: 40rpx;
		border: 2rpx solid #9a9a98;
		display: flex;
		flex-direction: row;
		margin-bottom: 40rpx;
	}

	.nikeItemAvatarView {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.topUserAvatarImg {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.nikeItemBasicView {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.nikeItemBasicNikeView {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.nikeItemBasicTagView {
		padding: 5rpx 15rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		background-color: #2979ff;
		color: #FFFFFF;
	}

	.nikeItemBasicNikeText {
		font-size: 32rpx;
		margin-left: 20rpx;
	}

	.nikeItemBasicSchoolView {
		font-size: 32rpx;
	}

	.nikeItemIconView {
		width: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto 10rpx auto auto;
	}
</style>
