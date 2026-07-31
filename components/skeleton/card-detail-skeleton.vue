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
    <view class="card-detail-skeleton">
        <!-- 帖子内容骨架 -->
        <view class="card-detail-view">
            <view class="card-user-info-skeleton">
                <view class="skeleton-avatar"></view>
                <view class="skeleton-user-info">
                    <view class="skeleton-title" style="width: 40%;"></view>
                    <view class="skeleton-text-short"></view>
                </view>
            </view>
            <view class="skeleton-content">
                <view class="skeleton-text"></view>
                <view class="skeleton-text" style="width: 85%;"></view>
                <view class="skeleton-text" style="width: 60%;"></view>
            </view>
            <view class="skeleton-img" style="height: 400rpx; margin-top: 20rpx;"></view>
            <view class="skeleton-menu">
                <view class="skeleton-menu-item" v-for="i in 3" :key="i">
                    <view class="skeleton-icon"></view>
                    <view class="skeleton-text-short"></view>
                </view>
            </view>
        </view>

        <!-- 评论输入框骨架 -->
        <view class="comment-input-skeleton">
            <view class="skeleton-avatar-sm"></view>
            <view class="skeleton-input"></view>
        </view>

        <!-- 评论列表骨架 -->
        <view class="comment-list-skeleton">
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
.card-detail-skeleton {
    width: 100%;
}

.card-detail-view {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 27rpx;
    margin-bottom: 20rpx;
}

.card-user-info-skeleton {
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

.skeleton-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 20rpx;
}

.skeleton-menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.skeleton-icon {
    width: 40rpx;
    height: 40rpx;
    background: #E6E6E6;
    border-radius: 50%;
    margin-bottom: 8rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.comment-input-skeleton {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 20rpx 27rpx;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.skeleton-input {
    flex: 1;
    height: 60rpx;
    background: #E6E6E6;
    border-radius: 30rpx;
    margin-left: 20rpx;
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

.comment-list-skeleton {
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
