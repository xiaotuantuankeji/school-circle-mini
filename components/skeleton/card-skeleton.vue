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
	<view class="card-skeleton">
		<view class="card-skeleton__item" v-for="i in count" :key="i">
			<!-- 用户信息区：头像 + 昵称/时间 -->
			<view class="card-skeleton__header">
				<view class="card-skeleton__avatar">
					<view class="sk-circle sk-bg"></view>
				</view>
				<view class="card-skeleton__user-info">
					<view class="sk-line sk-bg" style="width: 45%; height: 30rpx;"></view>
					<view class="sk-line sk-bg" style="width: 65%; height: 22rpx; margin-top: 10rpx;"></view>
				</view>
			</view>
			<!-- 文字内容区 -->
			<view class="card-skeleton__body">
				<view class="sk-line sk-bg" style="width: 100%; height: 28rpx;"></view>
				<view class="sk-line sk-bg" style="width: 85%; height: 28rpx; margin-top: 12rpx;"></view>
				<view class="sk-line sk-bg" style="width: 60%; height: 28rpx; margin-top: 12rpx;"></view>
			</view>
			<!-- 图片区 -->
			<view class="card-skeleton__images">
				<view class="sk-rect sk-bg"></view>
				<view class="sk-rect sk-bg"></view>
				<view class="sk-rect sk-bg"></view>
			</view>
			<!-- 底部交互栏 -->
			<view class="card-skeleton__footer">
				<view class="sk-line sk-bg" style="width: 80rpx; height: 24rpx;"></view>
				<view class="sk-line sk-bg" style="width: 80rpx; height: 24rpx;"></view>
				<view class="sk-line sk-bg" style="width: 80rpx; height: 24rpx;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'card-skeleton',
		props: {
			count: {
				type: Number,
				default: 3
			}
		}
	}
</script>

<style scoped>
	.card-skeleton {
		width: 100%;
	}

	.card-skeleton__item {
		background: #FFFFFF;
		border-radius: 0 0 20rpx 20rpx;
		padding: 27rpx 27rpx 0 27rpx;
		margin-bottom: 16rpx;
	}

	.card-skeleton__header {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.card-skeleton__avatar {
		width: 92rpx;
		height: 92rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.card-skeleton__user-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.card-skeleton__body {
		margin-top: 20rpx;
	}

	.card-skeleton__images {
		display: flex;
		flex-direction: row;
		gap: 10rpx;
		margin-top: 20rpx;
	}

	.card-skeleton__footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 20rpx;
		padding: 16rpx 0;
		border-top: 2rpx solid #F3F3F1;
	}

	.sk-bg {
		background: #F3F3F1;
		border-radius: 8rpx;
		animation: skeleton-fade 1.2s ease-in-out infinite;
	}

	.sk-circle {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.sk-line {
		border-radius: 8rpx;
	}

	.sk-rect {
		flex: 1;
		height: 200rpx;
		border-radius: 12rpx;
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
