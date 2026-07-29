<template>
	<view class="msg-skeleton">
		<view class="msg-skeleton__item" v-for="i in count" :key="i">
			<view class="msg-skeleton__avatar">
				<view class="sk-circle sk-bg"></view>
			</view>
			<view class="msg-skeleton__info">
				<view class="msg-skeleton__top">
					<view class="sk-line sk-bg" style="width: 40%; height: 30rpx;"></view>
					<view class="sk-line sk-bg" style="width: 25%; height: 22rpx;"></view>
				</view>
				<view class="msg-skeleton__desc" v-if="type === 'comment' || type === 'playmate'">
					<view class="sk-line sk-bg" style="width: 55%; height: 24rpx; margin-top: 8rpx;"></view>
					<view class="sk-line sk-bg" style="width: 90%; height: 26rpx; margin-top: 10rpx;"></view>
					<view class="sk-line sk-bg" style="width: 75%; height: 26rpx; margin-top: 8rpx;"></view>
				</view>
				<view class="msg-skeleton__desc" v-else-if="type === 'like' || type === 'collect'">
					<view class="sk-line sk-bg" style="width: 55%; height: 24rpx; margin-top: 8rpx;"></view>
					<view class="sk-line sk-bg" style="width: 90%; height: 26rpx; margin-top: 10rpx;"></view>
				</view>
				<view class="msg-skeleton__desc" v-else>
					<view class="sk-line sk-bg" style="width: 90%; height: 26rpx; margin-top: 10rpx;"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'message-skeleton',
		props: {
			count: {
				type: Number,
				default: 4
			},
			type: {
				type: String,
				default: 'comment'
			}
		}
	}
</script>

<style scoped>
	.msg-skeleton {
		width: 100%;
	}

	.msg-skeleton__item {
		display: flex;
		flex-direction: row;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #F3F3F1;
	}

	.msg-skeleton__avatar {
		width: 100rpx;
		height: 100rpx;
		flex-shrink: 0;
	}

	.msg-skeleton__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.msg-skeleton__top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.msg-skeleton__desc {
		display: flex;
		flex-direction: column;
	}

	.sk-bg {
		background: #F3F3F1;
		border-radius: 8rpx;
		animation: skeleton-fade 1.2s ease-in-out infinite;
	}

	.sk-circle {
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
	}

	.sk-line {
		border-radius: 8rpx;
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
