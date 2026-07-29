<template>
    <view class="playmate-detail-skeleton">
        <!-- 搭子详情骨架 -->
        <view class="playmate-detail-view">
            <view class="playmate-user-info-skeleton">
                <view class="skeleton-avatar"></view>
                <view class="skeleton-user-info">
                    <view class="skeleton-title" style="width: 40%;"></view>
                    <view class="skeleton-text-short"></view>
                </view>
            </view>
            <view class="skeleton-content">
                <view class="skeleton-title" style="width: 50%; margin-bottom: 15rpx;"></view>
                <view class="skeleton-text"></view>
                <view class="skeleton-text" style="width: 85%;"></view>
                <view class="skeleton-text" style="width: 60%;"></view>
            </view>
            <view class="skeleton-parameter">
                <view class="skeleton-param-item" v-for="i in 3" :key="i">
                    <view class="skeleton-param-icon"></view>
                    <view class="skeleton-text-short"></view>
                </view>
            </view>
            <view class="skeleton-img" style="height: 400rpx; margin-top: 20rpx;"></view>
        </view>

        <!-- 成员列表骨架 -->
        <view class="member-view-skeleton">
            <view class="skeleton-tag"></view>
            <view class="member-avatar-skeleton">
                <view class="skeleton-avatar-sm" v-for="i in 5" :key="i"></view>
                <view class="skeleton-avatar-sm" style="background: #E6E6E6; display: flex; align-items: center; justify-content: center;">
                    <view style="width: 2rpx; height: 20rpx; background: #999;"></view>
                    <view style="width: 2rpx; height: 20rpx; background: #999; margin-left: 4rpx;"></view>
                    <view style="width: 2rpx; height: 20rpx; background: #999; margin-left: 4rpx;"></view>
                </view>
            </view>
        </view>

        <!-- 评论区骨架 -->
        <view class="comment-area-skeleton">
            <view class="skeleton-title" style="width: 30%; margin-bottom: 20rpx;"></view>
            <view class="comment-item-skeleton" v-for="i in 2" :key="i">
                <view class="skeleton-avatar-sm"></view>
                <view class="comment-content-skeleton">
                    <view class="skeleton-title" style="width: 25%;"></view>
                    <view class="skeleton-text" style="width: 90%;"></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        count: { type: Number, default: 2 }
    }
}
</script>

<style scoped>
.playmate-detail-skeleton {
    width: 100%;
}

.playmate-detail-view {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 27rpx;
    margin-bottom: 20rpx;
}

.playmate-user-info-skeleton {
    display: flex;
    flex-direction: row;
    margin-bottom: 20rpx;
}

.skeleton-avatar {
    width: 92rpx;
    height: 92rpx;
    border-radius: 50%;
    background: #E6E6E6;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-avatar-sm {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #E6E6E6;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-user-info {
    flex: 1;
    margin-left: 20rpx;
}

.skeleton-title {
    height: 32rpx;
    width: 60%;
    background: #E6E6E6;
    border-radius: 8rpx;
    margin-bottom: 12rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-text {
    height: 26rpx;
    width: 100%;
    background: #E6E6E6;
    border-radius: 8rpx;
    margin-bottom: 10rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-text-short {
    height: 26rpx;
    width: 40%;
    background: #E6E6E6;
    border-radius: 8rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-content {
    padding: 0 10rpx;
    margin-bottom: 20rpx;
}

.skeleton-img {
    width: 100%;
    background: #E6E6E6;
    border-radius: 12rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.skeleton-parameter {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 20rpx;
}

.skeleton-param-item {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.skeleton-param-icon {
    width: 26rpx;
    height: 26rpx;
    background: #E6E6E6;
    border-radius: 50%;
    margin-right: 10rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.member-view-skeleton {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 27rpx;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.skeleton-tag {
    height: 40rpx;
    width: 100rpx;
    background: #E6E6E6;
    border-radius: 8rpx;
    margin-right: 20rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.member-avatar-skeleton {
    flex: 1;
    display: flex;
    flex-direction: row;
}

.comment-area-skeleton {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 27rpx;
}

.comment-item-skeleton {
    display: flex;
    flex-direction: row;
    margin-bottom: 20rpx;
}

.comment-content-skeleton {
    flex: 1;
    margin-left: 15rpx;
}

@keyframes skeleton-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}
</style>
