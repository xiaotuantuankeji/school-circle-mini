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

            <view class="topSearchView">
                <view class="topSearchInputView">
                    <image class="topSearchInputImg" src="/static/img/other/search.png"></image>
                    <input class="topSearchInput" type="text" v-model="searchValue" placeholder="请输入昵称..."
                        placeholder-class="topSearchInputPlaceholder" confirm-type="search" inputmode="search"
                        @confirm="searchClick" />
                </view>
            </view>

            <view class="middleSelectView" v-if="loginNikeNameId == lookNikeNameId">
                <view class="middleSelectInsideView">
                    <uni-segmented-control :current="changeValue" :values="localData" style-type="text"
                        active-color="#007aff" @clickItem="onClickItem" />
                </view>
            </view>

            <view class="bottomContentView">
                <view class="bottomNotContentView" v-if="followList.length==0">
                    <view class="bottomNotContentTextView">暂无关注信息</view>
                </view>
                <view class="bottomContentFollowItemsView" v-for="(item, idx) in followList" :key="idx" v-else>
                    <view class="itemsLeftView">
                        <image class="itemsLeftAvatarImg" src="/static/img/logo/default-avatar.png"
                            v-if="item.avatar==''" @click="toUserDetailClick(item.stId, item.studentId)"></image>
                        <image class="itemsLeftAvatarImg" :src="item.avatar" v-else
                            @click="toUserDetailClick(item.stId, item.studentId)"></image>
                        <view class="itemsLeftNickView">{{item.nikeName}}</view>
                    </view>
                    <view class="itemsRightView" v-if="loginNikeNameId == lookNikeNameId">
                        <button class="itemsRightBtn"
                            @click="saveStudentFollow('2', item.studentId, item.nikeName, idx)"
                            v-if="item.status=='1'">取消关注</button>
                        <button class="itemsRightBtn"
                            @click="saveStudentFollow('1', item.studentId, item.nikeName, idx)"
                            v-if="item.status=='2'">关注</button>
                    </view>
                    <view class="itemsRightView"
                        v-if="item.studentId == loginNikeNameId && loginNikeNameId != lookNikeNameId">
                        <view>我</view>
                    </view>
                </view>
            </view>

        </view>

    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    import verifySchool from '../../libs/verify_school'

    export default {
        comments: {
            topBackground
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginStudentId: '',
                loginNikeNameId: '',

                lookNikeNameId: '',

                searchValue: '',
                changeValue: '0',

                followList: [],

                localData: ['我关注的', '关注我的', '互相关注'],
            }
        },
        onLoad(opt) {
            let lookNikeNameId = opt.lookNikeNameId
            if (lookNikeNameId == undefined) {
                lookNikeNameId = ''
            }
            this.lookNikeNameId = lookNikeNameId

            this.getSystemInfo()
        },
        onShow() {
            this.getLoginInfo()
            this.getMyFollowData()
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
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
                this.loginNikeNameId = userInfo.nikeNameId
            },
            searchClick() {
                // console.log('========关注搜索=========:' + this.searchValue)
                this.searchSort()
            },
            onClickItem(e) {
                this.changeValue = e.currentIndex
                this.searchSort()
            },
            searchSort() {
                if (this.changeValue == '0') {
                    this.getMyFollowData()
                } else if (this.changeValue == '1') {
                    this.getFollowMyData()
                } else if (this.changeValue == '2') {
                    this.getMutualFollowData()
                }
            },
            getMyFollowData() {
                let searchNikeNameId = ''
                if (this.loginNikeNameId == this.lookNikeNameId) {
                    searchNikeNameId = this.loginNikeNameId
                } else {
                    searchNikeNameId = this.lookNikeNameId
                }
                const param = 'followerId=' + searchNikeNameId + '&loginStudentId=' + this.loginNikeNameId +
                    '&searchValue=' + this.searchValue
                this.$api.getFollowingList(param).then(res => {
                    // console.log('getFollowingList succes res:' + JSON.stringify(res))

                    this.followList = res.data

                    uni.hideLoading()
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
            getFollowMyData() {
                const param = 'followingId=' + this.loginNikeNameId + '&searchValue=' + this.searchValue
                this.$api.getFollowersList(param).then(res => {
                    // console.log('getFollowersList succes res:' + JSON.stringify(res))

                    this.followList = res.data

                    uni.hideLoading()
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
            getMutualFollowData() {
                const param = 'followerId=' + this.loginNikeNameId + '&searchValue=' + this.searchValue
                this.$api.getMutualFollowList(param).then(res => {
                    // console.log('getMutualFollowList succes res:' + JSON.stringify(res))

                    this.followList = res.data

                    uni.hideLoading()
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
            async saveStudentFollow(sign, studentId, nikeName, idx) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '设置中...',
                    mask: true
                })

                const param = {
                    schoolId: this.loginSchoolId,
                    followerId: this.loginNikeNameId,
                    followerNickName: this.loginNikeName,
                    followingId: studentId,
                    followingNickName: nikeName,
                    actionType: sign
                }
                this.$api.followUser(param).then(res => {
                    // console.log('followUser succes res:' + JSON.stringify(res))

                    this.followList[idx].status = sign

                    uni.hideLoading()
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
            toUserDetailClick(studentId, nikeNameId) {
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + studentId + '&lookNikeNameId=' +
                        nikeNameId
                })
            },
        }
    }
</script>

<style>
    .content {
        background: linear-gradient(179deg, #94D4D2 0%, #FFFFFF 8%, #FFFFFF 100%);
        position: relative;
    }

    .contentInsideView {
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .topSearchView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .topSearchInputView {
        width: 100%;
        padding: 10rpx 25rpx;
        background: #FFFFFF;
        border-radius: 40rpx;
        border: 2rpx solid #000000;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .topSearchInputImg {
        width: 36rpx;
        height: 36rpx;
    }

    .topSearchInput {
        width: 88%;
        margin-left: 22rpx;
    }

    .topSearchInputPlaceholder {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .middleSelectView {
        margin-top: 40rpx;
    }

    .middleSelectInsideView {
        width: 100%;
    }

    .bottomContentView {
        margin-top: 40rpx;
    }

    .bottomContentFollowItemsView {
        margin-bottom: 30rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 10rpx;
        border-bottom: 2rpx solid #F3F3F3;
    }

    .itemsLeftView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .itemsLeftAvatarImg {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
    }

    .itemsLeftNickView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 32rpx;
        color: #858585;
        line-height: 65rpx;
        font-style: normal;
        margin-left: 10rpx;
    }

    .itemsRightView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .itemsRightBtn {
        width: 180rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .bottomNotContentView {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bottomNotContentTextView {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #858585;
        line-height: 40rpx;
    }
</style>