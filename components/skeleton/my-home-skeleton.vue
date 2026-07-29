<template>
    <view class="my-home-skeleton">
        <!-- 顶部用户信息骨架 -->
        <view class="top-user-skeleton">
            <view class="skeleton-avatar-lg"></view>
            <view class="skeleton-user-info">
                <view class="skeleton-title" style="width: 40%;"></view>
                <view class="skeleton-text" style="width: 60%;"></view>
                <view class="skeleton-text-short"></view>
            </view>
        </view>

        <!-- 底部帖子列表骨架 -->
        <view class="bottom-card-skeleton">
            <view class="skeleton-card-title"></view>
            <view class="skeleton-card" v-for="i in count" :key="i">
                <view style="display: flex; flex-direction: row;">
                    <view class="skeleton-avatar"></view>
                    <view style="flex: 1; margin-left: 20rpx;">
                        <view class="skeleton-title"></view>
                        <view class="skeleton-text"></view>
                        <view class="skeleton-text" style="width: 70%;"></view>
                        <view class="skeleton-img" style="height: 180rpx; margin-top: 16rpx;"></view>
                        <view style="display: flex; justify-content: space-between; margin-top: 16rpx;">
                            <view class="skeleton-text-short"></view>
                            <view class="skeleton-text-short"></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        count: { type: Number, default: 3 }
    }
}
</script>

<style scoped>
.my-home-skeleton {
    width: 100%;
}

.skeleton-avatar-lg {
    width: 146rpx;
    height: 146rpx;
    border-radius: 50%;
    background: #E6E6E6;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-avatar {
    width: 92rpx;
    height: 92rpx;
    border-radius: 50%;
    background: #E6E6E6;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-user-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.skeleton-title {
    height: 32rpx;
    width: 60%;
    background: #E6E6E6;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-text {
    height: 26rpx;
    width: 100%;
    background: #E6E6E6;
    border-radius: 8rpx;
    margin-bottom: 12rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-text-short {
    height: 26rpx;
    width: 40%;
    background: #E6E6E6;
    border-radius: 8rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-img {
    width: 100%;
    height: 200rpx;
    background: #E6E6E6;
    border-radius: 12rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-card-title {
    height: 32rpx;
    width: 30%;
    background: #E6E6E6;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-card {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 27rpx;
    margin-bottom: 20rpx;
}

@keyframes skeleton-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}
</style>
