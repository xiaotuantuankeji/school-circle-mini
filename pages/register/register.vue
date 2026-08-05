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
	<view class="register-page">
		<!-- 自定义返回按钮 -->
		<view class="custom-back" @click="goLogin">
			<text class="back-icon">‹</text>
		</view>

		<!-- 顶部装饰 -->
		<view class="decor-top">
			<view class="decor-circle decor-circle-1"></view>
			<view class="decor-circle decor-circle-2"></view>
		</view>

		<!-- Logo 区域 -->
		<view class="brand-area">
			<view class="logo-wrapper">
				<image class="logo-image" src="/static/img/tabbar/circleactive.png" mode="aspectFit"></image>
			</view>
			<text class="app-title">团团校园圈</text>
		</view>

		<!-- 表单卡片 -->
		<view class="form-card">
			<!-- <view class="input-group">
				<view class="input-item">
					<input
						v-model="username"
						placeholder="请输入用户名（4-20位字母或数字）"
						:maxlength="20"
						@blur="onUsernameBlur"
					/>
					<text class="input-status" v-if="username.length >= 4 && usernameError === ''">✓</text>
					<text class="input-status error" v-if="usernameError">✕</text>
				</view>

				<view class="input-item">
					<input
						:type="showPassword ? 'text' : 'password'"
						v-model="password"
						placeholder="请输入密码（6-20位）"
						:maxlength="20"
					/>
					<text class="toggle-pwd" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</text>
				</view>

				<view class="input-item">
					<input
						:type="showConfirm ? 'text' : 'password'"
						v-model="confirmPassword"
						placeholder="请再次输入密码"
						:maxlength="20"
					/>
					<text class="toggle-pwd" @click="showConfirm = !showConfirm">{{ showConfirm ? '🙈' : '👁️' }}</text>
				</view>
			</view> -->
			
			<view class="input-item">
				<uni-easyinput type="text" placeholder="请输入用户名（4-20位字母或数字）" v-model="username" maxlength="20" @blur="onUsernameBlur"></uni-easyinput>
			</view>
			
			<view class="input-item">
				<uni-easyinput type="password" placeholder="请输入密码（6-20位）" v-model="password" maxlength="20"></uni-easyinput>
			</view>
			
			<view>
				<uni-easyinput type="password" placeholder="请再次输入密码" v-model="confirmPassword" maxlength="20"></uni-easyinput>
			</view>

			<view
				class="submit-btn"
				:class="{ loading: loading }"
				:hover-class="loading ? '' : 'submit-btn-hover'"
				@click="handleRegister"
			>
				<text>{{ loading ? '注册中...' : '注 册' }}</text>
			</view>

			<view class="bottom-hint">
				<text class="hint-text">已有账号？</text>
				<text class="hint-link" @click="goLogin">去登录</text>
			</view>
		</view>

		<!-- 底部版权 -->
		<view class="footer-text">
			<text>南京校团团科技有限公司</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: '',
				showPassword: false,
				showConfirm: false,
				usernameError: '',
				loading: false
			}
		},
		methods: {
			validateUsername(username) {
				if (!username || username.trim() === '') {
					return '请输入用户名'
				}
				if (username.length < 4) {
					return '用户名长度不能少于4位'
				}
				if (username.length > 20) {
					return '用户名长度不能超过20位'
				}
				if (!/^[a-zA-Z0-9]+$/.test(username)) {
					return '用户名只能包含英文字母和数字'
				}
				return ''
			},

			validatePassword(password) {
				if (!password || password.trim() === '') {
					return '请输入密码'
				}
				if (password.length < 6) {
					return '密码长度不能少于6位'
				}
				if (password.length > 20) {
					return '密码长度不能超过20位'
				}
				return ''
			},

			onUsernameBlur() {
				if (this.username.length > 0) {
					this.usernameError = this.validateUsername(this.username)
				} else {
					this.usernameError = ''
				}
			},

			handleRegister() {
				const usernameError = this.validateUsername(this.username)
				if (usernameError) {
					uni.showToast({ title: usernameError, icon: 'none' })
					return
				}

				const passwordError = this.validatePassword(this.password)
				if (passwordError) {
					uni.showToast({ title: passwordError, icon: 'none' })
					return
				}

				if (this.password !== this.confirmPassword) {
					uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
					return
				}

				this.loading = true

				const param = {
					username: this.username.trim(),
					password: this.password
				}
				const that = this

				this.$api.registerByPassword(param).then(res => {
					that.loading = false
					if (res.code == 0) {
						const userInfo = res.data
						that.$storage.user.set(userInfo)
						if (userInfo.accessToken) {
							that.$storage.token.set(userInfo.accessToken)
						}
						uni.showToast({
							title: '注册成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/chooseschool/chooseschool'
							})
						}, 800)
					} else {
						uni.showToast({
							title: res.msg || '注册失败',
							icon: 'none'
						})
					}
				}).catch(err => {
					that.loading = false
					uni.showToast({
						title: '网络异常，请稍后再试',
						icon: 'none'
					})
				})
			},

			goLogin() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	page {
		background: #f0f4f8;
		height: 100%;
	}

	.register-page {
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(160deg, #ebf4f3 0%, #f0f4f8 40%, #f8fafc 100%);
		padding: 0 48rpx 40rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	/* 自定义返回按钮 */
	.custom-back {
		position: absolute;
		top: 30rpx;
		left: 24rpx;
		width: 72rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.back-icon {
		font-size: 56rpx;
		color: #1a1a2e;
		font-weight: 300;
		line-height: 1;
	}

	/* ===== 装饰元素 ===== */
	.decor-top {
		position: absolute;
		top: -120rpx;
		left: -80rpx;
		width: 100%;
		height: 500rpx;
		pointer-events: none;
	}

	.decor-circle {
		position: absolute;
		border-radius: 50%;
		opacity: 0.08;
		background: #47b5af;
	}

	.decor-circle-1 {
		width: 400rpx;
		height: 400rpx;
		top: -80rpx;
		right: -120rpx;
	}

	.decor-circle-2 {
		width: 260rpx;
		height: 260rpx;
		top: 200rpx;
		left: -60rpx;
	}

	/* ===== 标题区域 ===== */
	.brand-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 60rpx;
		margin-bottom: 32rpx;
	}

	.logo-wrapper {
		width: 100rpx;
		height: 100rpx;
		border-radius: 24rpx;
		background: linear-gradient(135deg, #47b5af 0%, #5cc9c2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 24rpx rgba(71, 181, 175, 0.25);
		margin-bottom: 20rpx;
	}

	.logo-image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 10rpx;
	}

	.app-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a2e;
		letter-spacing: 2rpx;
	}

	/* ===== 表单卡片 ===== */
	.form-card {
		width: 100%;
		max-width: 640rpx;
		background: #ffffff;
		border-radius: 28rpx;
		padding: 52rpx 44rpx 44rpx;
		box-sizing: border-box;
		box-shadow: 0 2rpx 24rpx rgba(0, 0, 0, 0.04), 0 8rpx 40rpx rgba(71, 181, 175, 0.06);
		display: flex;
		flex-direction: column;
	}

	.input-item {
		margin-bottom: 24rpx;
	}

	.toggle-pwd {
		margin-left: 16rpx;
	}

	.input-status {
		margin-left: 16rpx;
		color: #47b5af;
		font-weight: 600;
	}

	.input-status.error {
		color: #ef4444;
	}

	/* 提交按钮：用 view 替代 button，避免原生默认样式干扰 */
	.submit-btn {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		background: #47b5af;
		border-radius: 16rpx;
		color: #ffffff;
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: 4rpx;
		text-align: center;
		margin-top: 36rpx;
		box-sizing: border-box;
	}

	.submit-btn-hover {
		background: #3aa09a;
		opacity: 0.95;
	}

	.submit-btn.loading {
		opacity: 0.7;
	}

	/* 底部提示 */
	.bottom-hint {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 36rpx;
		gap: 8rpx;
	}

	.hint-text {
		font-size: 26rpx;
		color: #8896a7;
	}

	.hint-link {
		font-size: 26rpx;
		color: #47b5af;
		font-weight: 600;
	}

	/* 底部版权 */
	.footer-text {
		margin-top: 48rpx;
		font-size: 22rpx;
		color: #bfc6d0;
		letter-spacing: 1rpx;
	}
</style>
