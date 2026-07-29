<template>
	<view class="personal-skeleton">
		<!-- 头像信息区 -->
		<view class="personal-skeleton__info">
			<view class="personal-skeleton__avatar">
				<view class="sk-circle-lg sk-bg"></view>
			</view>
			<view class="personal-skeleton__detail">
				<view class="sk-line sk-bg" style="width: 45%; height: 34rpx;"></view>
				<view class="sk-line sk-bg" style="width: 60%; height: 24rpx; margin-top: 12rpx;"></view>
				<view class="sk-line sk-bg" style="width: 40%; height: 24rpx; margin-top: 8rpx;"></view>
			</view>
		</view>
		<!-- 统计数据区 -->
		<view class="personal-skeleton__count">
			<view class="personal-skeleton__count-item" v-for="i in 4" :key="i">
				<view class="sk-line sk-bg" style="width: 50rpx; height: 30rpx; margin: 0 auto;"></view>
				<view class="sk-line sk-bg" style="width: 40rpx; height: 20rpx; margin: 8rpx auto 0;"></view>
			</view>
		</view>
		<!-- 菜单列表区 -->
		<view class="personal-skeleton__menu">
			<view class="personal-skeleton__menu-item" v-for="i in 4" :key="i">
				<view class="sk-line sk-bg" style="width: 35%; height: 28rpx;"></view>
				<view class="sk-line sk-bg" style="width: 24rpx; height: 24rpx;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'personal-skeleton'
	}
</script>

<style scoped>
	.personal-skeleton {
		width: 100%;
	}

	.personal-skeleton__info {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20rpx;
	}

	.personal-skeleton__avatar {
		width: 146rpx;
		height: 146rpx;
		flex-shrink: 0;
	}

	.personal-skeleton__detail {
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
		flex: 1;
	}

	.personal-skeleton__count {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 0 30rpx;
		margin-top: 10rpx;
	}

	.personal-skeleton__count-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.personal-skeleton__menu {
		margin-top: 40rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		overflow: hidden;
	}

	.personal-skeleton__menu-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 2rpx solid #F3F3F1;
	}

	.personal-skeleton__menu-item:last-child {
		border-bottom: none;
	}

	.sk-bg {
		background: #F3F3F1;
		border-radius: 8rpx;
		animation: skeleton-fade 1.2s ease-in-out infinite;
	}

	.sk-circle-lg {
		width: 146rpx;
		height: 146rpx;
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
