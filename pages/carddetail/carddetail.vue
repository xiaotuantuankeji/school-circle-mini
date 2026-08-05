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

            <card-detail-skeleton v-if="isFirstLoading" />

            <template v-else>
            <view class="cardDetailView">
                <view class="cardUserInfoView">
                    <view class="cardUserAvatarView" @click="toUserDetailClick">
                        <image class="cardUserAvatarImg" :src="cardItem.avatar" v-if="cardItem.avatar != ''"></image>
                        <image class="cardUserAvatarImg" src="/static/img/logo/default-avatar.png" v-else></image>
                        <image class="avatarImgIcon" :src="`/static/img/my/${cardItem.identityIconName}.png`"
                            v-if="cardItem.identityIconName!=''"></image>
                    </view>
                    <view class="cardUserOtherView">
                        <view class="cardUserNameAndMoreView">
                            <view class="cardUserNameView">
                                <view @click="toUserDetailClick">{{cardItem.nikeName}}</view>
                                <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="cardItem.sex=='1'">
                                </image>
                                <image class="userInfoSexImg" src="/static/img/other/woman.png"
                                    v-if="cardItem.sex=='2'"></image>
                                <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                    v-if="cardItem.studentStatus=='2'&&cardItem.studentSort!='3'&&cardItem.studentSort!='4'">
                                </image>
                            </view>
                            <view class="cardUserMoreView" @click="openOperateMenu">
                                <image class="cardUserMoreImg" src="/static/img/other/more-black.png"></image>
                            </view>
                        </view>
                        <view class="cardUserTimesView">{{formatTime(cardItem.updateTime)}}</view>
                    </view>
                </view>
                <view class="cardContentInfoView">
                    <view class="cardContentInfoText">
                        <text>{{cardItem.content}}</text>
                    </view>
                </view>
                <view class="cardImageInfoView" v-if="cardItem.pictureList != null && cardItem.pictureList.length > 0">
                    <image class="cardOneImage" :src="cardItem.pictureList[0].pictureUrl"
                        v-if="cardItem.pictureList.length == 1" mode="widthFix"
                        @click="previewImage(cardItem.pictureList, 0)"></image>
                    <uni-grid :column="3" :show-border="false" :square="true" v-else>
                        <uni-grid-item v-for="(item, idx) in cardItem.pictureList" :index="idx" :key="idx">
                            <image class="gridItemImg" :src="item.pictureUrl" mode="aspectFill"
                                @click="previewImage(cardItem.pictureList, idx)" />
                        </uni-grid-item>
                    </uni-grid>
                </view>
                <view class="cardVideoInfoView" v-if="cardItem.videoUrl!=undefined&&cardItem.videoUrl!=''">
                    <video id="videoId" style="width: 600rpx;height: 300rpx;"
                        :style="(cardItem.videoUrl==undefined||cardItem.videoUrl=='')?'display: none;':''"
                        :src="cardItem.videoUrl" play-btn-position="center" show-fullscreen-btn="false"
                        object-fit="cover" muted="true" show-mute-btn="true" binderror="onVideoError"></video>
                </view>
                <view class="cardAddressView" v-if="cardItem.localName!=''">
                    <view class="cardLocationView">
                        <image class="cardLocationImg" src="/static/img/other/location-blue.png"></image>
                        <view class="cardLocationText" @click="openLocation">{{cardItem.localName}}</view>
                    </view>
                </view>
                <view class="cardSectionNameView">
                    <view class="cardSectionNameText">#{{cardItem.sectionName}}</view>
                </view>
                <view class="bottomSendCardMenu">
                    <view class="bottomSendCardMenuItemView">
                        <button class="menuShareButton" open-type="share">
                            <image class="menuItemImg" src="/static/img/other/share-black.png"></image>
                            <view class="menuItemText">分享</view>
                        </button>
                    </view>
                    <view class="bottomSendCardMenuItemView"
                        @click="likeClick(cardItem.cardId, cardItem.isLike, index)">
                        <image class="menuItemImg" src="/static/img/other/love.png" v-if="cardItem.isLike=='0'"></image>
                        <image class="menuItemImg" src="/static/img/other/love-active.png" v-else>
                        </image>
                        <view class="menuItemText" v-if="cardItem.likeNumber>0">
                            {{(cardItem.likeNumber>99)?'99+':cardItem.likeNumber}}
                        </view>
                        <view class="menuItemText" v-else>点赞</view>
                    </view>
                    <view class="bottomSendCardMenuItemView"
                        @click="collectClick(cardItem.cardId, cardItem.isCollect, index)">
                        <image class="menuItemImg" src="/static/img/other/star.png" v-if="cardItem.isCollect=='0'">
                        </image>
                        <image class="menuItemImg" src="/static/img/other/star-active.png" v-else></image>
                        <view class="menuItemText" v-if="cardItem.collectNumber>0">
                            {{(cardItem.collectNumber>99)?'99+':cardItem.collectNumber}}
                        </view>
                        <view class="menuItemText" v-else>收藏</view>
                    </view>
                    <!-- <view class="bottomSendCardMenuItemView"
                        @click="attentionClick(cardItem.cardId, cardItem.isAttention, index)">
                        <image class="menuItemImg" src="/static/img/other/eye.png" v-if="cardItem.isAttention=='0'">
                        </image>
                        <image class="menuItemImg" src="/static/img/other/eye-active.png" v-else></image>
                        <view class="menuItemText" v-if="cardItem.attentionNumber>0">
                            {{(cardItem.attentionNumber>99)?'99+':cardItem.attentionNumber}}
                        </view>
                        <view class="menuItemText" v-else>关注</view>
                    </view> -->
                </view>
            </view>

            <view class="cardDetailCommentView" v-if="isShowComment">
                <view class="myInfoAvatarView">
                    <image class="commentLoginAvatar" src="/static/img/logo/default-avatar.png" v-if="loginAvatar==''">
                    </image>
                    <image class="commentLoginAvatar" :src="loginAvatar" v-else></image>
                    <image class="avatarImgIcon" :src="`/static/img/my/${loginIdentityIconUrl}.png`"
                        v-if="loginIdentityIconUrl!=''"></image>
                </view>
                <view class="cardDetailCommentBtnView">
                    <view class="cardDetailCommentBtnText" @click="openCommentPage">评论</view>
                    <image class="cardDetailCommentBtnImg" src="/static/img/other/picture.png"
                        @click="openChooseImagePage" v-if="is_open_upload == '1'"></image>
                </view>
            </view>

            <view class="cardDetailCommentContentView">
                <view class="commentContentNumberView">
                    共{{(cardItem.commentNumber==undefined)?0:cardItem.commentNumber}}条评论</view>
                <view class="notCommentContentView" v-if="commentList.length==0">暂无评论</view>
                <!-- 评论 -->
                <view class="commentContentItemView" v-for="(item, index) in commentList" :key="index" v-else>
                    <view class="itemLoginAvatarView" @click="commentToUserDetailClick(item.studentId)">
                        <view class="cardUserAvatarView">
                            <image class="cardUserAvatarImg" :src="item.avatar" v-if="item.avatar != ''"></image>
                            <image class="cardUserAvatarImg" src="/static/img/logo/default-avatar.png" v-else></image>
                            <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                v-if="item.identityIconName!=''"></image>
                        </view>
                    </view>
                    <view class="itemCommentContentView">
                        <view class="itemCommentName">
                            <view @click="commentToUserDetailClick(item.studentId)">{{item.nikeName}}</view>
                            <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="item.sex=='1'">
                            </image>
                            <image class="userInfoSexImg" src="/static/img/other/woman.png" v-if="item.sex=='2'">
                            </image>
                            <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                v-if="item.studentStatus=='2'&&loginStudentSort!='3'&&loginStudentSort!='4'"></image>
                        </view>
                        <view class="itemCommentContentText">
                            <text>{{item.content}}</text>
                        </view>
                        <view class="itemCommentImgView" v-if="item.pictureUrl!=''" @click="lookImage(item.pictureUrl)">
                            <image class="itemCommentImg" :src="item.pictureUrl" mode="widthFix">
                            </image>
                        </view>
                        <view class="itemCommentTimeAndBtnView">
                            <view class="itemCommentTimeText">{{formatTime(item.updateTime)}}</view>
                            <view class="itemCommentBtnView">
                                <view class="itemCommentLoveBtnView"
                                    @click="commentLikeClick(item.id, item.isLike, index)">
                                    <image class="loveBtnImg" src="/static/img/other/love.png" v-if="item.isLike=='0'">
                                    </image>
                                    <image class="loveBtnImg" src="/static/img/other/love-active.png" v-else></image>
                                    <view class="loveBtnText">点赞</view>
                                </view>
                                <view class="itemCommentReplyBtnView"
                                    @click="replyCommentClick(item.id, item.studentId)" v-if="isShowComment">
                                    <image class="replyBtnImg" src="/static/img/other/reply.png"></image>
                                    <view class="replyBtnText">回复</view>
                                </view>
                            </view>
                        </view>

                        <!-- 回复 -->
                        <view class="itemCommentReplyView" v-for="(replyItem, idx) in item.replyList" :key="idx"
                            v-if="item.replyList.length>0">
                            <view class="itemLoginAvatarView" @click="commentToUserDetailClick(replyItem.studentId)">
                                <view class="cardUserAvatarView">
                                    <image class="cardUserAvatarImg" :src="replyItem.avatar"
                                        v-if="replyItem.avatar != ''"></image>
                                    <image class="cardUserAvatarImg" src="/static/img/logo/default-avatar.png" v-else>
                                    </image>
                                    <image class="avatarImgIcon"
                                        :src="`/static/img/my/${replyItem.identityIconName}.png`"
                                        v-if="replyItem.identityIconName!=''"></image>
                                </view>
                            </view>

                            <view class="itemCommentContentView">
                                <view class="itemCommentName">
                                    <view @click="commentToUserDetailClick(replyItem.studentId)">{{replyItem.nikeName}}
                                    </view>
                                    <image class="userInfoSexImg" src="/static/img/other/male.png"
                                        v-if="replyItem.sex=='1'">
                                    </image>
                                    <image class="userInfoSexImg" src="/static/img/other/woman.png"
                                        v-if="replyItem.sex=='2'"></image>
                                    <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                        v-if="replyItem.studentStatus=='2'&&replyItem.studentSort!='3'&&replyItem.studentSort!='4'">
                                    </image>
                                </view>
                                <view class="itemCommentContentText">
                                    <text>{{replyItem.content}}</text>
                                </view>
                                <view class="itemCommentReplyImgView" @click="lookImage(replyItem.pictureUrl)"
                                    v-if="replyItem.pictureUrl!=''">
                                    <image class="itemCommentReplyImg" src="/static/img/other/picture.png">
                                    </image>
                                    <view class="itemCommentReplyImgText">查看图片</view>
                                </view>
                                <view class="itemCommentTimeAndBtnView">
                                    <view class="itemCommentTimeText">{{formatTime(replyItem.updateTime)}}</view>
                                    <view class="itemCommentBtnView">
                                        <view class="itemCommentLoveBtnView"
                                            @click="replyLikeClick(replyItem.id, replyItem.isLike, index, idx)">
                                            <image class="loveBtnImg" src="/static/img/other/love.png"
                                                v-if="replyItem.isLike=='0'">
                                            </image>
                                            <image class="loveBtnImg" src="/static/img/other/love-active.png" v-else>
                                            </image>
                                            <view class="loveBtnText">点赞</view>
                                        </view>
                                        <view class="itemCommentReplyBtnView"
                                            @click="replyCommentClick(item.id, replyItem.studentId)"
                                            v-if="isShowComment">
                                            <image class="replyBtnImg" src="/static/img/other/reply.png"></image>
                                            <view class="replyBtnText">回复</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>

                    </view>

                </view>

            </view>
            </template>

        </view>

        <uni-popup ref="commentPopup" background-color="#ffffff" :safeArea="false">
            <view class="sendCommentPopup">
                <textarea class="sendCommentPopupTextarea" v-model="content" cursor-spacing="200"></textarea>
                <view class="sendCommentPopupBtnView">
                    <view class="sendCommentPopupBtnIconView">
                        <image class="sendCommentPopupBtnIconImg" src="/static/img/other/picture.png"
                            @click="chooseImage" v-if="is_open_upload == '1'"></image>
                    </view>
                    <view class="sendCommentPopupBtnSendView">
                        <button class="sendBtn" size="mini" @click="sendCommentClick">发送</button>
                    </view>
                </view>
                <view class="showUploadImgView" v-if="uploadImageUrl!=''">
                    <image class="uploadImageDeleteImg" src="/static/img/other/image-delete.png" @click="deleteImage">
                    </image>
                    <image class="uploadImageImg" :src="uploadImageUrl" @click="commentPreviewImage"></image>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="operatePopupRef" background-color="none" :is-mask-click="false" :safeArea="true">
            <view class="operateMenuView">
                <top-background></top-background>

                <view class="operateMenuInsideView">
                    <view class="operateMenuIconView">
                        <image class="operateMenuIconImg" src="/static/img/logo/logo-top.png"></image>
                    </view>

                    <view class="titleView" v-if="sendStudentId==loginStudentId">
                        <view>
                            <view class="titleTextView">操作帖子</view>
                            <view class="titleLineView"></view>
                        </view>
                    </view>

                    <view class="operateMenuItemView" v-if="sendStudentId==loginStudentId">
                        <!-- <view class="operateMenuOneView" @click="editCardClick">
                            <image class="operateMenuOneImg" src="/static/img/other/edit-black.png"></image>
                            <view class="operateMenuOneText">编辑帖子</view>
                        </view> -->
                        <view class="operateMenuOneView" v-if="cardItem.isTop=='1'" @click="isTopClick('2')">
                            <image class="operateMenuOneImg" src="/static/img/other/pin.png"></image>
                            <view class="operateMenuOneText">个人主页置顶</view>
                        </view>
                        <view class="operateMenuOneView" v-if="cardItem.isTop=='2'" @click="isTopClick('1')">
                            <image class="operateMenuOneImg" src="/static/img/other/pin-black.png"></image>
                            <view class="operateMenuOneText">取消置顶</view>
                        </view>
                        <view class="operateMenuOneView" @click="deleteCardClick">
                            <image class="operateMenuOneImg" src="/static/img/other/trash-black.png"></image>
                            <view class="operateMenuOneText">删除帖子</view>
                        </view>
                    </view>

                    <view class="titleView">
                        <view>
                            <view class="titleTextView">分享与收藏</view>
                            <view class="titleLineView"></view>
                        </view>
                    </view>

                    <view class="operateMenuItemView">
                        <view class="operateMenuOneView" @click="shareCircle">
                            <image class="operateMenuOneImg" src="/static/img/other/compass-black.png"></image>
                            <view class="operateMenuOneText">分享到朋友圈</view>
                        </view>
                        <view class="operateMenuOneView" @click="sharePosterClick">
                            <image class="operateMenuOneImg" src="/static/img/other/download-black.png"></image>
                            <view class="operateMenuOneText">保存海报分享</view>
                        </view>
                        <view class="operateMenuOneView">
                            <button class="shareButton" open-type="share">
                                <image class="operateMenuOneImg" src="/static/img/other/share-black.png"></image>
                                <view class="operateMenuOneText">分享给朋友</view>
                            </button>
                        </view>
                    </view>
                    <view class="operateMenuItemView" v-if="sendStudentId!=loginStudentId">
                        <!-- <view class="operateMenuOneView">
                            <image class="operateMenuOneImg" src="/static/img/other/star-black.png"></image>
                            <view class="operateMenuOneText">添加到收藏夹</view>
                        </view> -->
                        <view class="operateMenuOneView" @click="tipOffClick">
                            <image class="operateMenuOneImg" src="/static/img/other/shield-black.png"></image>
                            <view class="operateMenuOneText">举报</view>
                        </view>
                    </view>

                    <view>
                        <button class="operateMenuBtn" @click="closeOperateMenu">取&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </view>

                </view>
            </view>
        </uni-popup>

        <view v-if="shareTipShow">
            <view class="shareTipBackgroup"></view>
            <view class="shareTipDescribeView">
                <view class="shareTipDescribeImgView">
                    <image class="shareTipDescribeImg" src="/static/img/other/share_tip.png"></image>
                </view>
                <view class="shareTipDescribeTextView">
                    <view class="shareTipDescribeText" @click="closeShareTip">我知道了</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    import cardDetailSkeleton from '../../components/skeleton/card-detail-skeleton.vue'
    import util from '../../common/util';
    import verifySchool from '../../libs/verify_school'
    export default {
        components: {
            topBackground,
            cardDetailSkeleton
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                keyboardHeight: 0,

                is_open_upload: '0', // 0：关闭，1：打开

                pageNo: 1,
                pageSize: this.$configData.pageSize,

                shareTipShow: false,

                isShowComment: false,

                cardItem: {},
                commentList: [],

                cardId: 0,
                content: '',
                toStudentId: '',
                commentId: '',
                shareImgUrl: '',

                uploadImageUrl: '',
                pictureUrl: '',

                schoolId: '',
                schoolName: '',
                sendStudentId: '',
                sendNikeNameId: '',
                loginStudentId: '',
                loginSchoolId: '',
                loginAvatar: '',
                loginShowNikeName: '',
                loginIdentityIconUrl: '',
                loginStudentSort: '',

                isFirstLoading: true,
            }
        },
        onLoad(opt) {
            let cardId = opt.cardId
            if (cardId == undefined) {
                cardId = 6
            }
            this.cardId = cardId

            let shareTip = opt.shareTip
            if (shareTip == undefined) {
                shareTip = false
            }
            this.shareTipShow = shareTip

            this.getSystemInfo()
            this.getLoginInfo()
            this.getSendCardDetail()
            this.getCardCommentList()
        },
        onShow() {
            this.getGlobalSettings()
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
                if (!userInfo) return;
                this.loginStudentId = userInfo.studentId
                this.loginSchoolId = userInfo.schoolId
                this.loginAvatar = userInfo.avatar
                this.loginShowNikeName = userInfo.showNikeName
                this.loginStudentSort = userInfo.sort
                const identityInfoRespVOList = userInfo.identityInfoRespVOList
                if (identityInfoRespVOList && identityInfoRespVOList.length > 0) {
                    if (identityInfoRespVOList[0].examineStatus == '2') {
                        this.loginIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                    }
                }
            },
            getGlobalSettings() {
                const param = 'serialName=is_open_upload_image_and_video'
                this.$api.getGlobalSettings(param).then(res => {
                    // console.log('getGlobalSettings succes res:' + JSON.stringify(res))
                    this.is_open_upload = res.data.is_open_upload_image_and_video

                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            formatTime(time) {
                return util.getDateBeforeNow(time)
            },
            verifyStatus() {
                let isOperate = false
                const userInfo = this.$storage.user.get();
                const status = userInfo.status
                const banLevel = userInfo.banLevel
                const loginSchoolId = userInfo.schoolId
                if (this.schoolId != loginSchoolId) {
                    uni.showToast({
                        title: '只有【' + this.schoolName + '】学生才可发布评论',
                        icon: 'none',
                        mask: true
                    })
                    return isOperate
                }
                if (status == '1') {
                    // 未认证
                    uni.showModal({
                        title: '院校认证',
                        content: '只有认证了院校的学生才可以发布内容！',
                        cancelText: '等等再说',
                        confirmText: '立即认证',
                        success: function(res) {
                            if (res.confirm) {
                                uni.redirectTo({
                                    url: '/package-user/my-update/my-update'
                                })
                            } else if (res.cancel) {

                            }
                        }
                    })
                } else if (status == '3') {
                    // 审核中
                    uni.showModal({
                        title: '院校认证',
                        content: '正在审核中，请稍后！',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {

                            }
                        }
                    })
                } else if (banLevel == '5') {
                    // 封禁
                    const banDay = userInfo.banDay
                    const banReason = userInfo.banReason
                    let content = '你的账户因[' + banReason + ']，已被禁止登录小程序'
                    if (banDay == '0') {
                        content = content + '。'
                    }
                    if (banDay == '1') {
                        content = content + '1天。'
                    }
                    if (banDay == '2') {
                        content = content + '7天。'
                    }
                    if (banDay == '3') {
                        content = content + '30天。'
                    }
                    if (banDay == '4') {
                        content = content + '360天。'
                    }
                    uni.showModal({
                        title: '封禁',
                        content: content,
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                uni.exitMiniProgram({
                                    success: function() {
                                        console.log('退出小程序成功')
                                    },
                                    fail: function(err) {
                                        console.log('退出小程序失败', err)
                                    }
                                })
                            }
                        }
                    })
                } else if (parseInt(banLevel) >= 2 && parseInt(banLevel) <= 4) {
                    const banDay = userInfo.banDay
                    const banReason = userInfo.banReason
                    let content = '你的账户因[' + banReason + ']，已被禁止发布评论'
                    if (banDay == '0') {
                        content = content + '。'
                    }
                    if (banDay == '1') {
                        content = content + '1天。'
                    }
                    if (banDay == '2') {
                        content = content + '7天。'
                    }
                    if (banDay == '3') {
                        content = content + '30天。'
                    }
                    if (banDay == '4') {
                        content = content + '360天。'
                    }
                    uni.showModal({
                        title: '封禁',
                        content: content,
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {

                            }
                        }
                    })
                } else {
                    isOperate = true
                }
                return isOperate
            },
            getSendCardDetail() {
                const param = 'cardId=' + this.cardId + '&studentId=' + this.loginStudentId
                this.$api.getSendCardDetail(param).then(res => {
                    // console.log('getSendCardDetail succes res:' + JSON.stringify(res))

                    this.cardItem = res.data
                    this.sendStudentId = this.cardItem.studentId
                    if (this.sendStudentId != this.loginStudentId) {
                        this.sendNikeNameId = this.cardItem.nikeNameId
                    }
                    this.schoolId = this.cardItem.schoolId
                    this.schoolName = this.cardItem.schoolName

                    if (this.schoolId == this.loginSchoolId) {
                        this.isShowComment = true
                    }
                    this.shareImgUrl = this.cardItem.shareImageUrl

                    this.isFirstLoading = false
                }).catch(res => {
                    // 失败进行的操作
                    this.isFirstLoading = false
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            getCardCommentList() {
                uni.showLoading({
                    title: '获取中...',
                    mask: true
                })

                const param = 'cardId=' + this.cardId + '&studentId=' + this.loginStudentId + '&pageNo=' + this.pageNo +
                    '&pageSize=' + this.pageSize
                this.$api.getCardCommentList(param).then(res => {
                    // console.log('getCardCommentList succes res:' + JSON.stringify(res))

                    this.commentList = res.data

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
            lookImage(imgUrl) {
                const imageList = [{
                    'pictureUrl': imgUrl
                }]
                this.previewImage(imageList, 0)
            },
            previewImage(imageList, index) {
                const urls = []
                for (let i = 0; i < imageList.length; i++) {
                    urls.push(imageList[i].pictureUrl)
                }
                uni.previewImage({
                    urls: urls,
                    current: index
                });
            },
            async openCommentPage() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }
                if (this.verifyStatus()) {
                    this.$refs.commentPopup.open('bottom')
                }
            },
            async openChooseImagePage() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                if (this.verifyStatus()) {
                    uni.chooseMedia({
                        count: 1,
                        mediaType: ['image'],
                        sourceType: ['album', 'camera'],
                        maxDuration: 30,
                        camera: 'back',
                        success(res) {
                            console.log(res.tempFiles)
                            const data = res.tempFiles[0].tempFilePath
                            _this.uploadImageUrl = data
                            _this.$refs.commentPopup.open('bottom')
                        }
                    })
                }
            },
            deleteImage() {
                this.uploadImageUrl = ''
            },
            commentPreviewImage() {
                const imageList = [{
                    'pictureUrl': this.uploadImageUrl
                }]
                this.previewImage(imageList, 0)
            },
            // 选择图片
            chooseImage() {
                const _this = this
                uni.chooseMedia({
                    count: 1,
                    mediaType: ['image'],
                    sourceType: ['album', 'camera'],
                    maxDuration: 30,
                    camera: 'back',
                    success(res) {
                        console.log(res.tempFiles)
                        const data = res.tempFiles[0].tempFilePath
                        _this.uploadImageUrl = data
                    }
                })
            },
            reset() {
                this.content = ''
                this.toStudentId = ''
                this.commentId = ''

                this.uploadImageUrl = ''
                this.pictureUrl = ''
            },
            sendCommentClick() {
                this.getLoginInfo()

                const _this = this
                if (this.content.trim() == '') {
                    uni.showToast({
                        title: '请输入内容',
                        icon: 'none'
                    })
                    return
                }

                uni.showLoading({
                    title: '发送中...',
                    mask: true
                })

                const param = {
                    cardId: this.cardId,
                    commentId: this.commentId,
                    sendStudentId: this.loginStudentId,
                    sendNikeName: this.loginShowNikeName,
                    toStudentId: this.toStudentId,
                    content: this.content,
                    pictureUrl: this.pictureUrl
                };

                if (this.uploadImageUrl == '') {
                    this.$api.saveCardComment(param).then(res => {
                        this.reset()
                        this.$refs.commentPopup.close()

                        this.getCardCommentList()

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
                } else {
                    const imagePromise = new Promise((resolve, reject) => {
                        uni.uploadFile({
                            url: this.$configData.file_url_server,
                            filePath: this.uploadImageUrl,
                            name: 'file',
                            formData: {
                                type: 'image'
                            },
                            success: (res) => resolve(res),
                            fail: (err) => reject(err)
                        })
                    })

                    // 执行所有上传
                    Promise.all([imagePromise])
                        .then((res) => {
                            if (res.length > 0) {
                                for (let i = 0; i < res.length; i++) {
                                    const data = JSON.parse(res[i].data)
                                    const url = data.data
                                    _this.pictureUrl = url
                                }
                            }

                            param.pictureUrl = _this.pictureUrl
                            this.$api.saveCardComment(param).then(res => {
                                this.reset()
                                this.$refs.commentPopup.close()

                                this.getCardCommentList()

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
                        })
                        .catch((err) => {
                            console.log('error video err:' + err)
                            uni.showToast({
                                icon: 'error',
                                title: err,
                                mask: true
                            })
                            uni.hideLoading()
                        })
                }
            },
            async commentLikeClick(commentId, sign, index) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                let likeSign = '0'
                if (sign == '0') {
                    likeSign = '1'
                }
                if (sign == '1') {
                    likeSign = '0'
                }

                const param = {
                    cardId: this.cardId,
                    sign: likeSign,
                    studentId: this.loginStudentId,
                    commentId: commentId
                };
                this.$api.updateCommentLikeSign(param).then(res => {
                    this.commentList[index].isLike = likeSign

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
            async replyCommentClick(commentId, sendStudentId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.commentId = commentId
                this.toStudentId = sendStudentId
                this.openCommentPage()
            },
            async replyLikeClick(commentId, sign, index, idx) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                let likeSign = '0'
                if (sign == '0') {
                    likeSign = '1'
                }
                if (sign == '1') {
                    likeSign = '0'
                }

                const param = {
                    cardId: this.cardId,
                    sign: likeSign,
                    studentId: this.loginStudentId,
                    commentId: commentId
                };
                this.$api.updateCommentLikeSign(param).then(res => {
                    this.commentList[index].replyList[idx].isLike = likeSign

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
            async likeClick(cardId, sign, index) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                let likeSign = '0'
                if (sign == '0') {
                    likeSign = '1'
                }
                if (sign == '1') {
                    likeSign = '0'
                }

                const param = {
                    cardId: cardId,
                    sign: likeSign,
                    studentId: this.loginStudentId
                };
                this.$api.updateLikeSign(param).then(res => {
                    this.cardItem.isLike = likeSign

                    let likeNumber = this.cardItem.likeNumber
                    if (sign == '0') {
                        likeNumber = likeNumber + 1
                    }
                    if (sign == '1') {
                        likeNumber = likeNumber - 1
                    }
                    this.cardItem.likeNumber = likeNumber

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
            async collectClick(cardId, sign, index) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                let collectSign = '0'
                if (sign == '0') {
                    collectSign = '1'
                }
                if (sign == '1') {
                    collectSign = '0'
                }

                const param = {
                    cardId: cardId,
                    sign: collectSign,
                    studentId: this.loginStudentId
                };
                this.$api.updateCollectSign(param).then(res => {
                    this.cardItem.isCollect = collectSign

                    let collectNumber = this.cardItem.collectNumber
                    if (sign == '0') {
                        collectNumber = collectNumber + 1
                    }
                    if (sign == '1') {
                        collectNumber = collectNumber - 1
                    }
                    this.cardItem.collectNumber = collectNumber

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
            async attentionClick(cardId, sign, index) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                let attentionSign = '0'
                if (sign == '0') {
                    attentionSign = '1'
                }
                if (sign == '1') {
                    attentionSign = '0'
                }

                const param = {
                    cardId: cardId,
                    sign: attentionSign,
                    studentId: this.loginStudentId
                };
                this.$api.updateAttentionSign(param).then(res => {
                    this.cardItem.isAttention = attentionSign

                    let attentionNumber = this.cardItem.attentionNumber
                    if (sign == '0') {
                        attentionNumber = attentionNumber + 1
                    }
                    if (sign == '1') {
                        attentionNumber = attentionNumber - 1
                    }
                    this.cardItem.attentionNumber = attentionNumber

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
            async openOperateMenu() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }
                console.log('====openOperateMenu====')
                // #ifdef H5
                uni.hideTabBar()
                // #endif
                this.$refs.operatePopupRef.open('bottom')
            },
            closeOperateMenu() {
                // #ifdef H5
                uni.showTabBar()
                // #endif
                this.$refs.operatePopupRef.close()
            },
            isTopClick(sign) {
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    cardId: this.cardId,
                    isTop: sign
                };
                this.$api.updateIsTopSign(param).then(res => {
                    this.cardItem.isTop = sign

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
            deleteCardClick() {
                const _this = this
                uni.showModal({
                    title: '提示',
                    content: '确定删除帖子？',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            _this.deleteCardInfo()
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            deleteCardInfo() {
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    cardId: this.cardId
                };
                this.$api.deleteCardInfo(param).then(res => {
                    uni.switchTab({
                        url: '/pages/index/index'
                    })

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
            shareCircle() {
                this.closeOperateMenu()
                this.shareTipShow = true
            },
            sharePosterClick() {
                uni.navigateTo({
                    url: '/package-content/poster-canvas/poster-canvas?cardId=' + this.cardId
                })
            },
            tipOffClick() {
                const _this = this
                uni.showModal({
                    title: '举报',
                    // content: '确定举报此帖？',
                    editable: true,
                    placeholderText: '请输入举报理由',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定:' + res.content);
                            _this.saveAccusationInfo(res.content)
                        } else if (res.cancel) {
                            console.log('用户点击取消:' + res.content);
                        }
                    }
                });
            },
            saveAccusationInfo(content) {
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    schoolId: this.schoolId,
                    cardId: this.cardId,
                    type: '1',
                    commentId: '',
                    studentId: this.loginStudentId,
                    reason: content
                };
                this.$api.saveAccusationInfo(param).then(res => {
                    uni.switchTab({
                        url: '/pages/index/index'
                    })

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
            closeShareTip() {
                this.shareTipShow = false
            },
            onShareAppMessage(res) {
                if (res.from === 'button') { // 来自页面内分享按钮
                    // 来自页面内转发按钮
                    console.log('来自页面内转发按钮')
                    // this.$refs.sharePopup.close()
                }

                // 最大14个字
                let title = "【" + this.cardItem.sectionName + "】" + this.cardItem.content
                if (title.length > 30) {
                    title = title.substring(0, 30) + "..."
                }
                let imageUrl = ''
                if (this.cardItem.pictureList.length > 0) {
                    imageUrl = this.cardItem.pictureList[0].pictureUrl
                }
                return {
                    title: title,
                    path: '/pages/carddetail/carddetail?cardId=' + this.cardId,
                    imageUrl: imageUrl,
                    success: function(res) {
                        // 转发成功
                        // console.log("转发成功:" + JSON.stringify(res));
                    },
                    fail: function(res) {
                        // 转发失败
                        // console.log("转发失败:" + JSON.stringify(res));
                    }
                }
            },
            onShareTimeLine() {
                // 最大14个字
                const title = "学长学姐强推！新生必备！"
                return {
                    title: title,
                    query: 'cardId=' + this.cardId,
                    imageUrl: '/static/img/other/share_image.jpg',
                    success: function(res) {
                        // 转发成功
                        // console.log("转发成功:" + JSON.stringify(res));
                    },
                    fail: function(res) {
                        // 转发失败
                        // console.log("转发失败:" + JSON.stringify(res));
                    }
                }
            },
            toUserDetailClick() {
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + this.sendStudentId +
                        '&lookNikeNameId=' +
                        this.sendNikeNameId
                })
            },
            commentToUserDetailClick(studentId) {
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + studentId
                })
            },
            openLocation() {
                uni.openLocation({
                    latitude: Number(this.cardItem.localLatitude),
                    longitude: Number(this.cardItem.localLongitude),
                    name: this.cardItem.localName,
                    address: this.cardItem.localAddress
                })
            },
            onVideoError(e) {
                console.error('Video play error:', e.detail.errMsg);
                // 处理错误，例如提示用户或更换视频源
            },
            // 视频全屏
            quanping() {
                const videoContent = uni.createVideoContext('videoId', this)
                videoContent.requestFullScreen()
                videoContent.play()
            },
            // 视频全屏事件
            fullscreenchange(e) {
                if (!e.detail.fullScreen) {
                    const videoContent = uni.createVideoContext('videoId', this)
                    videoContent.pause()
                    videoContent.exitFullScreen()
                }
            },
        }
    }
</script>

<style>
    .content {
        width: 100%;
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #FFFFFF 100%);
        position: relative;
    }

    .contentInsideView {
        width: 89%;
        position: absolute;
        z-index: 2;
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .cardDetailView {
        display: flex;
        flex-direction: column;
        border-bottom: 2rpx solid #F3F3F1;
    }

    .cardUserInfoView {
        display: flex;
        flex-direction: row;
        margin-top: 20rpx;
    }

    .cardUserAvatarView {
        width: 79rpx;
        height: 79rpx;
        position: relative;
    }

    .cardUserAvatarImg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .cardUserOtherView {
        width: 80%;
        display: flex;
        flex-direction: column;
        padding-left: 25rpx;
    }

    .cardUserNameAndMoreView {
        height: 46rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .cardUserNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .userInfoSexImg {
        width: 30rpx;
        height: 30rpx;
        margin-left: 10rpx;
    }

    .userInfoAuthImg {
        width: 77rpx;
        height: 42rpx;
        margin-left: 10rpx;
    }

    .cardUserMoreView {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .cardUserMoreImg {
        width: 31rpx;
        height: 8rpx;
    }

    .cardUserTimesView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        font-style: normal;
        text-transform: none;
    }

    .cardContentInfoView {
        margin-top: 10rpx;
    }

    .cardContentInfoText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .cardImageInfoView {
        margin-top: 20rpx;
    }

    .cardOneImage {
        max-width: 60%;
        border-radius: 19rpx;
    }

    .gridItemImg {
        width: 90%;
        height: 90%;
        border-radius: 19rpx;
    }

    .cardVideoInfoView {
        margin-top: 20rpx;
    }

    .cardAddressView {
        display: flex;
        align-items: center;
        margin-top: 30rpx;
    }

    .cardLocationView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .cardLocationImg {
        width: 24rpx;
        height: 30rpx;
    }

    .cardLocationText {
        margin-left: 10rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #20315E;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
    }

    .cardSectionNameView {
        display: flex;
        align-items: center;
        margin-top: 20rpx;
    }

    .cardSectionNameText {
        font-size: 28rpx;
        color: rgba(44, 171, 166, 1);
    }

    .bottomSendCardMenu {
        margin-top: 16rpx;
        margin-bottom: 14rpx;
        display: flex;
        flex-direction: row;
    }

    .bottomSendCardMenuItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .menuShareButton {
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
        line-height: 0;
        background-color: rgba(0, 0, 0, 0);
    }

    .menuShareButton::after {
        border: none;
    }

    .menuItemImg {
        width: 29rpx;
        height: 29rpx;
    }

    .menuItemText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 24rpx;
        color: #858585;
        line-height: 25rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        /* padding-top: 4rpx; */
        margin-left: 8rpx;
        margin-right: 20rpx;
    }

    .cardDetailCommentView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 37rpx;
    }

    .myInfoAvatarView {
        width: 79rpx;
        height: 79rpx;
        position: relative;
    }

    .commentLoginAvatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .avatarImgIcon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        bottom: -10rpx;
        left: 48rpx;
    }

    .cardDetailCommentBtnView {
        width: 80%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background: #F3F3F1;
        border: 1rpx solid #e3e3e3;
        border-radius: 40rpx;
        margin-left: 27rpx;
        padding: 16rpx 31rpx;
    }

    .cardDetailCommentBtnText {
        width: 90%;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .cardDetailCommentBtnImg {
        width: 33rpx;
        height: 29rpx;
    }

    .cardDetailCommentContentView {
        display: flex;
        flex-direction: column;
        margin-top: 31rpx;
    }

    .commentContentNumberView {
        height: 60rpx;
        display: flex;
        align-items: center;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        font-style: normal;
        text-transform: none;
    }

    .notCommentContentView {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .commentContentItemView {
        display: flex;
        flex-direction: row;
    }

    .itemLoginAvatarView {
        width: 120rpx;
    }

    .itemLoginAvatar {
        width: 79rpx;
        height: 79rpx;
        border-radius: 50%;
    }

    .itemCommentContentView {
        width: 80%;
        display: flex;
        flex-direction: column;
    }

    .itemCommentName {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .itemCommentContentText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-top: 6rpx;
    }

    .itemCommentImgView {
        width: 40%;
    }

    .itemCommentImg {
        width: 100%;
    }

    .itemCommentTimeAndBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 6rpx;
    }

    .itemCommentTimeText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .itemCommentBtnView {
        display: flex;
        flex-direction: row;
    }

    .itemCommentLoveBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #F3F3F1;
        padding: 10rpx 20rpx;
    }

    .loveBtnImg {
        width: 22rpx;
        height: 19rpx;
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
        padding: 10rpx 20rpx;
    }

    .replyBtnImg {
        width: 22rpx;
        height: 19rpx;
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

    .itemCommentReplyView {
        display: flex;
        flex-direction: row;
        margin-top: 29rpx;
    }

    .itemCommentReplyImgView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 29rpx;
    }

    .itemCommentReplyImg {
        width: 33rpx;
        height: 29rpx;
    }

    .itemCommentReplyImgText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #1f5eff;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-left: 10rpx;
    }

    .sendCommentPopup {
        padding: 20rpx 30rpx 50rpx 30rpx;
    }

    .sendCommentPopupTextarea {
        width: 94%;
        height: 70rpx;
        padding: 20rpx;
        border-radius: 30rpx;
        border: 2rpx solid #dcdbdb;
    }

    .sendCommentPopupBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 20rpx;
        padding: 0 20rpx;
    }

    .sendCommentPopupBtnIconView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .sendCommentPopupBtnIconImg {
        width: 50rpx;
        height: 44rpx;
    }

    .sendBtn {
        background-color: #94D4D2;
        color: #FFFFFF;
        border-radius: 40rpx;
    }

    .showUploadImgView {
        width: 100rpx;
        height: 100rpx;
        margin-top: 20rpx;
        position: relative;
    }

    .uploadImageDeleteImg {
        width: 37rpx;
        height: 37rpx;
        position: absolute;
        z-index: 2;
        top: 10rpx;
        right: 8rpx;
    }

    .uploadImageImg {
        width: 100%;
        height: 100%;
        border-radius: 19rpx;
    }

    .keyboardHeight {
        padding-bottom: 372px;
    }

    .operateMenuView {
        width: 100%;
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #FFFFFF 100%);
        border-radius: 65rpx 65rpx 65rpx 65rpx;
        position: relative;
    }

    .operateMenuInsideView {
        padding: 92rpx 75rpx 30rpx 75rpx;
    }

    .operateMenuIconView {
        position: absolute;
        top: -60rpx;
        left: 40%;
    }

    .operateMenuIconImg {
        width: 156rpx;
        height: 156rpx;
    }

    .titleView {
        display: flex;
        margin-right: 62rpx;
        position: relative;
    }

    .titleTextView {
        z-index: 2;
    }

    .titleLineView {
        height: 10rpx;
        background: #CCFA10;
        border-radius: 4rpx;
        margin-top: -13rpx;
        z-index: 1;
    }

    .operateMenuItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
        /* justify-content: space-around; */
        margin-top: 16rpx;
        margin-bottom: 36rpx;
    }

    .operateMenuOneView {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .shareButton {
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
        line-height: 0;
    }

    .shareButton::after {
        border: none;
    }

    .operateMenuOneImg {
        width: 46rpx;
        height: 46rpx;
    }

    .operateMenuOneText {
        margin-top: 12rpx;
        font-family: HarmonyOS_Sans_SC, HarmonyOS_Sans_SC;
        font-weight: normal;
        font-size: 21rpx;
        color: #838989;
        line-height: 29rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .operateMenuBtn {
        height: 80rpx;
        background: #000000;
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .shareTipBackgroup {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .shareTipDescribeView {
        display: flex;
        flex-direction: column;
        position: fixed;
        z-index: 11;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .shareTipDescribeImgView {
        display: flex;
        justify-content: flex-end;
    }

    .shareTipDescribeImg {
        width: 497rpx;
        height: 598rpx;
    }

    .shareTipDescribeTextView {
        margin-top: 41rpx;
    }

    .shareTipDescribeText {
        width: 192rpx;
        height: 75rpx;
        border-radius: 40rpx;
        border: 2rpx solid #FFFFFF;

        display: flex;
        align-items: center;
        justify-content: center;

        margin: auto 180rpx auto auto;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #FFFFFF;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
    }
</style>