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
	<view class="playmate-skeleton">
		<view class="playmate-skeleton__item" v-for="i in count" :key="i">
			<view class="playmate-skeleton__top">
				<view class="playmate-skeleton__img">
					<view class="sk-rect sk-bg"></view>
				</view>
				<view class="playmate-skeleton__right">
					<view class="playmate-skeleton__title">
						<view class="sk-tag sk-bg"></view>
						<view class="sk-line sk-bg" style="width: 65%; height: 30rpx;"></view>
					</view>
					<view class="playmate-skeleton__content">
						<view class="sk-line sk-bg" style="width: 100%; height: 26rpx;"></view>
						<view class="sk-line sk-bg" style="width: 80%; height: 26rpx; margin-top: 10rpx;"></view>
						<view class="sk-line sk-bg" style="width: 50%; height: 26rpx; margin-top: 10rpx;"></view>
					</view>
				</view>
			</view>
			<view class="playmate-skeleton__bottom">
				<view class="playmate-skeleton__bottom-avatar">
					<view class="sk-circle-sm sk-bg"></view>
				</view>
				<view class="sk-line sk-bg" style="width: 25%; height: 26rpx; margin-left: 16rpx;"></view>
				<view class="sk-line sk-bg" style="width: 20%; height: 22rpx; margin-left: 16rpx;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'playmate-skeleton',
		props: {
			count: {
				type: Number,
				default: 3
			}
		}
	}
</script>

<style scoped>
	.playmate-skeleton {
		width: 100%;
	}

	.playmate-skeleton__item {
		margin-bottom: 25rpx;
		background: linear-gradient(360deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
		border-radius: 0 0 20rpx 20rpx;
		padding: 20rpx 27rpx 0 27rpx;
	}

	.playmate-skeleton__top {
		display: flex;
		flex-direction: row;
	}

	.playmate-skeleton__img {
		width: 50%;
		height: 231rpx;
		flex-shrink: 0;
	}

	.playmate-skeleton__right {
		width: 50%;
		margin-left: 27rpx;
		display: flex;
		flex-direction: column;
	}

	.playmate-skeleton__title {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.playmate-skeleton__content {
		margin-top: 16rpx;
		display: flex;
		flex-direction: column;
	}

	.playmate-skeleton__bottom {
		height: 70rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 10rpx;
		border-top: 2rpx solid #F3F3F1;
	}

	.playmate-skeleton__bottom-avatar {
		width: 40rpx;
		height: 40rpx;
		flex-shrink: 0;
	}

	.sk-bg {
		background: #F3F3F1;
		border-radius: 8rpx;
		animation: skeleton-fade 1.2s ease-in-out infinite;
	}

	.sk-rect {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.sk-tag {
		width: 79rpx;
		height: 37rpx;
		border-radius: 10rpx;
		flex-shrink: 0;
	}

	.sk-line {
		border-radius: 8rpx;
	}

	.sk-circle-sm {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
	}

	@keyframes skeleton-fade {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
</style>
