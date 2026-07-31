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
    <view v-if="cardList.length > 0">
        <view class="bottomSendCradView" v-for="(cardItem, index) in cardList" :key="index"
            @click="openCardDetail(cardItem)">

            <view class="bottomSendCardLayerView" @click.native.stop="layerClick()" v-if="cardItem.status=='3'">
                <view class="layerInsideView">
                    <view class="layerTextView" v-if="cardItem.appealStatus!='3'">你的帖子已被封禁</view>
                    <view class="layerTextView" v-else>申诉的处理意见：{{cardItem.resultContent}}</view>
                    <view class="layerButtonView">
                        <view class="layerLeftButtonView" @click="appealClick(cardItem.cardId, cardItem.appealStatus)"
                            v-if="cardItem.appealStatus!='3'">我要申诉</view>
                        <view class="layerRightButtonView" @click="layerDeleteClick(cardItem.cardId)">删除</view>
                    </view>
                </view>
            </view>

            <view class="bottomSendCradInsideView">
                <view class="cardUserInfoView">
                    <view class="cardUserAvatarView"
                        @click.native.stop="toUserDetailClick(cardItem.studentId, cardItem.nikeNameId)">
                        <image class="cardUserAvatarImg" :src="cardItem.avatar" v-if="cardItem.avatar != ''"></image>
                        <image class="cardUserAvatarImg" src="/static/img/logo/default-avatar.png" v-else></image>
                        <image class="avatarImgIcon" :src="`/static/img/my/${cardItem.identityIconName}.png`"
                            v-if="cardItem.identityIconName!=''"></image>
                    </view>
                    <view class="cardUserOtherView">
                        <view class="cardUserNameAndMoreView">
                            <view class="cardUserNameView">
                                <view @click.native.stop="toUserDetailClick(cardItem.studentId, cardItem.nikeNameId)">
                                    {{cardItem.nikeName}}
                                </view>
                                <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="cardItem.sex=='1'">
                                </image>
                                <image class="userInfoSexImg" src="/static/img/other/woman.png"
                                    v-if="cardItem.sex=='2'"></image>
                                <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                    v-if="cardItem.studentStatus=='2'&&cardItem.studentSort!='3'&&cardItem.studentSort!='4'">
                                </image>
                            </view>
                            <view class="cardUserMoreView" @click.native.stop="openOperateMenu(cardItem, index)">
                                <image class="cardUserMoreImg" src="/static/img/other/more.png"></image>
                            </view>
                        </view>
                        <view class="cardUserTimesView">
                            <view>{{formatTime(cardItem.updateTime)}}</view>
                            <view>{{cardItem.schoolName}}</view>
                        </view>
                    </view>
                </view>
                <view class="cardContentInfoView">
                    <view class="cardContentInfoText">
                        <text>{{cardItem.content}}</text>
                    </view>
                </view>
                <view class="cardVideoInfoView" style="position: relative;" v-if="cardItem.videoUrl!=''">
                    <video id="videoId" style="width: 300rpx;height: 150rpx;" :src="cardItem.videoUrl"
                        play-btn-position="center" show-fullscreen-btn="false" object-fit="cover" muted="true"
                        show-mute-btn="true" binderror="onVideoError"></video>
                    <view style="position: absolute;top: 0;left: 0;width: 300rpx;height: 150rpx;">
                    </view>
                </view>
                <view class="cardImageInfoView" v-if="cardItem.pictureList!=null && cardItem.pictureList.length > 0">
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
                <view class="cardSectionNameView">
                    <view class="cardSectionNameText"
                        @click.native.stop="sectionClick(cardItem.sectionId, cardItem.sectionName)">
                        #{{cardItem.sectionName}}</view>
                </view>
                <view class="bottomSendCardMenu">
                    <view class="bottomSendCardMenuItemView"
                        @click.native.stop="likeClick(cardItem.cardId, cardItem.isLike, index)">
                        <image class="menuItemImg" src="/static/img/other/love.png" v-if="cardItem.isLike=='0'"></image>
                        <image class="menuItemImg" src="/static/img/other/love-active.png" v-else>
                        </image>
                        <view class="menuItemText" v-if="cardItem.likeNumber>0">
                            {{(cardItem.likeNumber>99)?'99+':cardItem.likeNumber}}
                        </view>
                        <view class="menuItemText" v-else>点赞</view>
                    </view>
                    <view class="bottomSendCardMenuItemView"
                        @click.native.stop="collectClick(cardItem.cardId, cardItem.isCollect, index)">
                        <image class="menuItemImg" src="/static/img/other/star.png" v-if="cardItem.isCollect=='0'">
                        </image>
                        <image class="menuItemImg" src="/static/img/other/star-active.png" v-else></image>
                        <view class="menuItemText" v-if="cardItem.collectNumber>0">
                            {{(cardItem.collectNumber>99)?'99+':cardItem.collectNumber}}
                        </view>
                        <view class="menuItemText" v-else>收藏</view>
                    </view>
                    <!-- <view class="bottomSendCardMenuItemView"
                        @click.native.stop="attentionClick(cardItem.cardId, cardItem.isAttention, index)">
                        <image class="menuItemImg" src="/static/img/other/eye.png" v-if="cardItem.isAttention=='0'">
                        </image>
                        <image class="menuItemImg" src="/static/img/other/eye-active.png" v-else></image>
                        <view class="menuItemText" v-if="cardItem.attentionNumber>0">
                            {{(cardItem.attentionNumber>99)?'99+':cardItem.attentionNumber}}
                        </view>
                        <view class="menuItemText" v-else>关注</view>
                    </view> -->
                    <!-- <view class="menuItemCommentView">
                        <view class="menuItemCommentBtn" v-if="cardItem.commentNumber>0">
                            <view>评论</view>
                            <view class="menuItemCommentBtnNumber">
                                {{(cardItem.commentNumber>99)?'99+':cardItem.commentNumber}}
                            </view>
                        </view>
                        <view class="menuItemCommentBtn" v-else>评论</view>
                    </view> -->
                </view>
            </view>
        </view>

        <uni-popup ref="operatePopupRef" background-color="none" :is-mask-click="false" :safeArea="false"
            maskBackgroundColor="rgba(0, 0, 0, 0.7)">
            <view class="operateMenuView">
                <top-background></top-background>

                <view class="operateMenuInsideView">
                    <view class="operateMenuIconView">
                        <image class="operateMenuIconImg" src="/static/img/logo/logo-top.png"></image>
                    </view>

                    <view class="titleView" v-if="createStudentId==loginStudentId">
                        <view>
                            <view class="titleTextView">操作帖子</view>
                            <view class="titleLineView"></view>
                        </view>
                    </view>

                    <view class="operateMenuItemView" v-if="createStudentId==loginStudentId">
                        <!-- <view class="operateMenuOneView" @click="editCardClick">
                            <image class="operateMenuOneImg" src="/static/img/other/edit-black.png"></image>
                            <view class="operateMenuOneText">编辑帖子</view>
                        </view> -->
                        <view class="operateMenuOneView" v-if="isTop=='1'" @click="isTopClick('2')">
                            <image class="operateMenuOneImg" src="/static/img/other/pin.png"></image>
                            <view class="operateMenuOneText">个人主页置顶</view>
                        </view>
                        <view class="operateMenuOneView" v-if="isTop=='2'" @click="isTopClick('1')">
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
                            <button class="shareButton" open-type="share" @click="shareFriends">
                                <image class="operateMenuOneImg" src="/static/img/other/share-black.png"></image>
                                <view class="operateMenuOneText">分享给朋友</view>
                            </button>
                        </view>
                    </view>
                    <view class="operateMenuItemView" v-if="createStudentId!=loginStudentId">
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

        <uni-popup ref="appealPopup" background-color="#ffffff" :safeArea="false">
            <view class="sendAppealPopup">
                <textarea class="sendAppealPopupTextarea" v-model="content" cursor-spacing="200"
                    maxlength="100"></textarea>
                <view class="sendAppealPopupBtnView">
                    <view class="sendAppealPopupBtnIconView">
                        <image class="sendAppealPopupBtnIconImg" src="/static/img/other/picture.png"
                            @click="chooseImage" v-if="isOpenUpload == '1'"></image>
                    </view>
                    <view class="sendAppealPopupBtnSendView">
                        <button class="sendBtn" size="mini" @click="sendAppealClick">发送</button>
                    </view>
                </view>
                <view class="showUploadImgView" v-if="uploadImageUrl!=''">
                    <image class="uploadImageDeleteImg" src="/static/img/other/image-delete.png" @click="deleteImage">
                    </image>
                    <image class="uploadImageImg" :src="uploadImageUrl" @click="appealPreviewImage"></image>
                </view>
            </view>
        </uni-popup>

    </view>

</template>

<script>
    import util from '../../common/util';
    import verifySchool from '../../libs/verify_school';

    export default {
        name: "CardItem",
        props: {
            'cardList': {
                type: Array,
                default: function() {
                    return []
                }
            },
            'isOpenUpload': {
                type: String,
                default: '0'
            },
            'loginStudentSort': {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                cardId: 0,
                schoolId: '',
                isTop: '0',
                isTopIdx: 0,
                createStudentId: '',
                loginStudentId: '',
                loginIdentityIconUrl: '',

                is_open_upload: '0', // 0：关闭，1：打开
                uploadImageUrl: '',
                pictureUrl: '',
                content: '',
                shareImgUrl: '',
            };
        },
        methods: {
            formatTime(time) {
                return util.getDateBeforeNow(time)
            },
            previewImage(items, index) {
                // let pictureUrls = []
                // for (var i = 0; i < items.length; i++) {
                //     let pictureUrl = items[i].pictureUrl
                //     pictureUrls.push(pictureUrl)
                // }
                // uni.previewImage({
                //     urls: pictureUrls,
                //     current: index
                // });
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

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                const param = {
                    cardId: cardId,
                    sign: likeSign,
                    studentId: studentId
                };
                this.$api.updateLikeSign(param).then(res => {
                    this.cardList[index].isLike = likeSign

                    let likeNumber = this.cardList[index].likeNumber
                    if (sign == '0') {
                        likeNumber = likeNumber + 1
                    }
                    if (sign == '1') {
                        likeNumber = likeNumber - 1
                    }
                    this.cardList[index].likeNumber = likeNumber

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

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                const param = {
                    cardId: cardId,
                    sign: collectSign,
                    studentId: studentId
                };
                this.$api.updateCollectSign(param).then(res => {
                    this.cardList[index].isCollect = collectSign

                    let collectNumber = this.cardList[index].collectNumber
                    if (sign == '0') {
                        collectNumber = collectNumber + 1
                    }
                    if (sign == '1') {
                        collectNumber = collectNumber - 1
                    }
                    this.cardList[index].collectNumber = collectNumber

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

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                const param = {
                    cardId: cardId,
                    sign: attentionSign,
                    studentId: studentId
                };
                this.$api.updateAttentionSign(param).then(res => {
                    this.cardList[index].isAttention = attentionSign

                    let attentionNumber = this.cardList[index].attentionNumber
                    if (sign == '0') {
                        attentionNumber = attentionNumber + 1
                    }
                    if (sign == '1') {
                        attentionNumber = attentionNumber - 1
                    }
                    this.cardList[index].attentionNumber = attentionNumber

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
            openCardDetail(item) {
                uni.navigateTo({
                    url: '/pages/carddetail/carddetail?cardId=' + item.cardId
                })
            },
            async openOperateMenu(cardItem, index) {
                // console.log('====openOperateMenu====cardItem:' + JSON.stringify(cardItem))
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.cardId = cardItem.cardId
                this.schoolId = cardItem.schoolId
                this.isTop = cardItem.isTop
                this.isTopIdx = index
                this.createStudentId = cardItem.studentId
                this.shareImgUrl = cardItem.shareImageUrl

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId
                this.loginStudentId = studentId

                this.$refs.operatePopupRef.open('bottom')
            },

            closeOperateMenu() {
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
                    this.cardList[this.isTopIdx].isTop = sign
                    this.isTop = sign

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
                const _this = this
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    cardId: this.cardId
                };
                this.$api.deleteCardInfo(param).then(res => {
                    uni.hideLoading()
                    _this.closeOperateMenu()

                    _this.$emit("callBackCard")

                }).catch(res => {
                    uni.hideLoading()
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            shareCircle() {
                uni.navigateTo({
                    url: '/pages/carddetail/carddetail?cardId=' + this.cardId + '&shareTip=true'
                })
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

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                const param = {
                    schoolId: this.schoolId,
                    cardId: this.cardId,
                    type: '1',
                    commentId: '',
                    studentId: studentId,
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
            shareFriends() {
                console.log('shareFriends')
                this.$emit('shareCallBack', this.cardId, this.shareImgUrl)
            },
            // 防止点击层时触发下层点击事件
            layerClick() {

            },
            appealClick(cardId, appealStatus) {
                if (appealStatus == '2') {
                    uni.showToast({
                        title: '申诉处理中，请稍后...',
                        icon: 'none',
                        mask: true
                    })
                } else {
                    this.cardId = cardId
                    this.$refs.appealPopup.open('bottom')
                }
            },
            layerDeleteClick(cardId) {
                this.cardId = cardId
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

            deleteImage() {
                this.uploadImageUrl = ''
            },
            appealPreviewImage() {
                const urls = []
                urls.push(this.uploadImageUrl)
                uni.previewImage({
                    urls: urls,
                    current: 0
                });
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
                this.cardId = 0;
                this.content = ''

                this.uploadImageUrl = ''
                this.pictureUrl = ''
            },
            toUserDetailClick(studentId, nikeNameId) {
                const userInfo = this.$storage.user.get();
                const loginStudentId = userInfo.studentId
                if (studentId == loginStudentId) {
                    nikeNameId = ''
                }
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + studentId + '&lookNikeNameId=' +
                        nikeNameId
                })
            },
            sendAppealClick() {
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
                    sort: '1',
                    dataId: this.cardId,
                    content: this.content,
                    pictureUrl: this.pictureUrl
                };

                if (this.uploadImageUrl == '') {
                    this.$api.saveExamineAppeal(param).then(res => {
                        this.reset()
                        this.$refs.appealPopup.close()

                        this.$emit("callBackCard")

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
                            this.$api.saveExamineAppeal(param).then(res => {
                                this.reset()
                                this.$refs.appealPopup.close()

                                this.$emit("callBackCard")

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
            sectionClick(sectionId, sectionName) {
                uni.navigateTo({
                    url: '/package-content/partition-list/partition-list?sectionId=' + sectionId +
                        '&sectionName=' +
                        sectionName
                })
            },
        }
    }
</script>

<style>
    .bottomSendCradView {
        margin-top: 22rpx;
        background: linear-gradient(rgba(247, 247, 246, 1) 0%, rgba(255, 255, 255, 1) 100%);
        border-radius: 0rpx 0rpx 19rpx 19rpx;

        position: relative;
    }

    .bottomSendCardLayerView {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(166, 166, 166, 0.87);
        border-radius: 20rpx;
    }

    .layerInsideView {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .layerTextView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #FFFFFF;
        font-style: normal;
    }

    .layerButtonView {
        display: flex;
        flex-direction: row;
        margin-top: 14rpx;
    }

    .layerLeftButtonView {
        width: 200rpx;
        height: 40rpx;
        border-radius: 20rpx;
        background-color: #000000;
        margin-right: 24rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 24rpx;
        color: #8CE8ED;
        font-style: normal;

        text-align: center;
    }

    .layerRightButtonView {
        width: 200rpx;
        height: 40rpx;
        border-radius: 20rpx;
        border: 2rpx solid #000000;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 24rpx;
        color: #000000;
        font-style: normal;

        text-align: center;
    }

    .bottomSendCradInsideView {
        padding: 20rpx 30rpx 14rpx 30rpx;
        display: flex;
        flex-direction: column;
    }

    .cardUserInfoView {
        display: flex;
        flex-direction: row;
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

    .avatarImgIcon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        bottom: -10rpx;
        left: 48rpx;
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
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

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

        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .cardVideoInfoView {
        margin-top: 20rpx;
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

    .menuItemAppealView {
        margin: auto 6rpx auto auto;
    }

    .menuItemAppealBtn {
        border-radius: 20rpx;
        background-color: #000000;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 24rpx;
        color: #8CE8ED;
        line-height: 31rpx;
        font-style: normal;
        text-transform: none;

        padding: 6rpx 30rpx;

        display: flex;
        flex-direction: row;
    }

    .menuItemAppealBtnNumber {
        margin-left: 6rpx;
    }


    .operateMenuView {
        width: 100%;
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #FFFFFF 100%);
        border-radius: 65rpx 65rpx 0 0;
        position: relative;
    }

    .operateMenuInsideView {
        padding: 92rpx 75rpx 30rpx 75rpx;
    }

    .operateMenuIconView {
        position: fixed;
        top: -30rpx;
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

    .sendAppealPopup {
        padding: 20rpx 30rpx 50rpx 30rpx;
    }

    .sendAppealPopupTextarea {
        width: 94%;
        height: 70rpx;
        padding: 20rpx;
        border-radius: 30rpx;
        border: 2rpx solid #dcdbdb;
    }

    .sendAppealPopupBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 20rpx;
        padding: 0 20rpx;
    }

    .sendAppealPopupBtnIconView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .sendAppealPopupBtnIconImg {
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
</style>