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

            <view class="topMenuView">
                <view class="topMenuTextView">
                    <view class="topMenuText" @click="messageMenuClick('1')">评论</view>
                    <view class="topMenuTextBottomLineView" v-if="sort=='1'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="topMenuText" @click="messageMenuClick('2')">收藏</view>
                    <view class="topMenuTextBottomLineView" v-if="sort=='2'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="topMenuText" @click="messageMenuClick('3')">点赞</view>
                    <view class="topMenuTextBottomLineView" v-if="sort=='3'"></view>
                </view>
                <view class="topMenuTextView" style="width: 20%;">
                    <view class="topMenuText"></view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='4'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="topMenuText"></view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='5'"></view>
                </view>
            </view>

            <view class="messageBottomCommentAndPlaymateView" v-if="sort=='1'">
                <view class="messageBottomCPItemView" v-for="(item, idx) in dataList" :key="idx"
                    @click="toPage(item.cardId)">
                    <view class="CPItemImageView">
                        <image class="CPItemImage" src="/static/img/logo/default-avatar.png" v-if="loginAvatar==''">
                        </image>
                        <image class="CPItemImage" :src="loginAvatar" v-else></image>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="CPItemInfoNickNameView">{{loginNikeName}}</view>
                        <view class="CPItemTimesView">
                            <view class="CPItemText">评论了{{item.nikeName}}帖子</view>
                            <view class="CPItemTimes">{{item.dateTime}}</view>
                        </view>
                        <view class="CPItemContentText">{{item.content}}</view>
                        <view class="CPItemBtnView">
                            <view class="itemCommentLoveBtnView" @click.native.stop="deleteData(item.cardCommentId)">
                                <view class="loveBtnText">删除</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="messageBottomLikeAndCollectView" v-if="sort=='2' || sort=='3'">
                <view class="messageBottomCPItemView" v-for="(item, idx) in dataList" :key="idx"
                    @click="toPage(item.cardId)">
                    <view class="CPItemImageView">
                        <image class="CPItemImage" src="/static/img/logo/default-avatar.png" v-if="loginAvatar==''">
                        </image>
                        <image class="CPItemImage" :src="loginAvatar" v-else></image>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="CPItemInfoNickNameView">{{loginNikeName}}</view>
                        <view class="CPItemTimesView">
                            <view class="CPItemText" v-if="sort=='2'">收藏了{{item.nikeName}}帖子</view>
                            <view class="CPItemText" v-if="sort=='3'">点赞了{{item.nikeName}}帖子</view>
                            <view class="CPItemTimes">{{item.dateTime}}</view>
                        </view>
                        <view class="LCItemContentView">
                            <view class="LCItemContentLine"></view>
                            <view class="LCItemContentText">{{item.content}}</view>
                        </view>
                        <view class="CPItemBtnView">
                            <view class="itemCommentLoveBtnView" @click.native.stop="cancelData(item.cardId)">
                                <view class="loveBtnText">取消</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

        </view>

    </view>
</template>

<script>
    import verifySchool from '../../libs/verify_school'
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginStudentId: '',
                loginNikeName: '',
                loginAvatar: '',

                sort: '1',

                dataList: [],
            }
        },
        onLoad(opt) {
            let sort = opt.sort
            if (sort == undefined) {
                sort = '1'
            }
            this.sort = sort

            this.getSystemInfo()
            this.getLoginInfo()
            this.getMyMessageList()
        },
        onShow() {
            this.getLoginInfo()
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
            // 获取当前登录用户信息
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
                this.loginNikeName = userInfo.nikeName
                this.loginAvatar = userInfo.avatar
            },
            messageMenuClick(sort) {
                this.sort = sort
                this.dataList = []
                this.getMyMessageList()
            },
            getMyMessageList() {
                uni.showLoading({
                    title: '获取中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&sort=' + this.sort;
                this.$api.getMyMessageList(param).then(res => {
                    // console.log('getMyMessageList succes res:' + JSON.stringify(res))
                    this.dataList = res.data

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            toPage(cardId) {
                uni.navigateTo({
                    url: '/pages/carddetail/carddetail?cardId=' + cardId
                })
            },
            async deleteData(cardCommentId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                uni.showModal({
                    title: '提示',
                    content: '确认删除评论？',
                    success: function(res) {
                        if (res.confirm) {
                            _this.deleteCardComment(cardCommentId)
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                })
            },
            deleteCardComment(cardCommentId) {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = {
                    commentId: cardCommentId
                };
                this.$api.deleteCardComment(param).then(res => {
                    // console.log('deleteCardComment succes res:' + JSON.stringify(res))
                    this.getMyMessageList()

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            async cancelData(cardId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                if (this.sort == '2') {
                    this.collectClick(cardId)
                } else if (this.sort == '3') {
                    this.likeClick(cardId)
                }
            },
            collectClick(cardId) {
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const collectSign = '0'

                const param = {
                    cardId: cardId,
                    sign: collectSign,
                    studentId: this.loginStudentId
                };
                this.$api.updateCollectSign(param).then(res => {
                    this.getMyMessageList()

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
            likeClick(cardId) {
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const likeSign = '0'

                const param = {
                    cardId: cardId,
                    sign: likeSign,
                    studentId: this.loginStudentId
                };
                this.$api.updateLikeSign(param).then(res => {
                    this.getMyMessageList()

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
        }
    }
</script>

<style>
    .content {
        width: 100%;
        background: linear-gradient(180deg, #94D4D2 0%, #FFFFFF 8%, #FFFFFF 100%);
        position: relative;
    }

    .contentInsideView {
        width: 89%;
        position: absolute;
        z-index: 2;
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .topMenuView {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 15rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .topMenuTextView {
        position: relative;
    }

    .topMenuText {
        z-index: 2;
    }

    .topMenuTextBottomLineView {
        height: 10rpx;
        background: #CCFA10;
        border-radius: 4rpx;
        margin-top: -13rpx;
        z-index: 1;
    }

    .messageBottomCommentAndPlaymateView {
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
    }

    .messageBottomCPItemView {
        display: flex;
        flex-direction: row;
        margin-top: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #F3F3F1;
    }

    .CPItemImageView {
        width: 120rpx;
    }

    .CPItemImage {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
    }

    .CPItemInfoView {
        width: 80%;
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
    }

    .CPItemInfoNickNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
    }

    .CPItemTimesView {
        display: flex;
        flex-direction: row;
        margin-top: 5rpx;
    }

    .CPItemText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #2CABA6;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .CPItemTimes {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .CPItemContentText {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        /* 限制为2行 */
        overflow: hidden;
        /* 隐藏溢出的文本 */

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;

        margin-top: 5rpx;
    }

    .CPItemBtnView {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 5rpx;
    }

    .itemCommentLoveBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #F3F3F1;
        border-radius: 30rpx;
        padding: 10rpx 20rpx;
    }

    .loveBtnImg {
        width: 22rpx;
        height: 18rpx;
    }

    .loveBtnText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #858585;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-left: 6rpx;
    }

    .itemCommentReplyBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #F3F3F1;
        margin-left: 20rpx;
        border-radius: 30rpx;
        padding: 10rpx 20rpx;
    }

    .replyBtnImg {
        width: 20rpx;
        height: 20rpx;
    }

    .replyBtnText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #858585;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-left: 6rpx;
    }

    .messageBottomLikeAndCollectView {
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
    }

    .LCItemContentView {
        display: flex;
        flex-direction: row;
    }

    .LCItemContentLine {
        border: 8rpx solid #E6E6E6;
    }

    .LCItemContentText {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-left: 10rpx;
    }
</style>