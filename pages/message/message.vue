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
                    <view class="topMenuText" @click="messageMenuClick('1')">
                        <uni-badge :is-dot="true" text="0" absolute="rightTop" size="normal" :offset="[-35, -15]"
                            v-if="msgUnread&&msgUnread.commentCount>0" />评论
                    </view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='1'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="topMenuText" @click="messageMenuClick('2')">
                        <uni-badge :is-dot="true" text="0" absolute="rightTop" size="normal" :offset="[-35, -15]"
                            v-if="msgUnread&&msgUnread.likeCount>0" />点赞
                    </view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='2'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="topMenuText" @click="messageMenuClick('3')">
                        <uni-badge :is-dot="true" text="0" absolute="rightTop" size="normal" :offset="[-35, -15]"
                            v-if="msgUnread&&msgUnread.collectCount>0" />收藏
                    </view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='3'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="topMenuText" @click="messageMenuClick('4')">
                        <uni-badge :is-dot="true" text="0" absolute="rightTop" size="normal" :offset="[-35, -15]"
                            v-if="msgUnread&&(msgUnread.playmateCommentCount > 0 || msgUnread.playmateMemberCount > 0)" />搭子
                    </view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='4'"></view>
                </view>
                <view class="topMenuTextView">
                    <view class="messageMenuView">
                        <view class="topMenuText" @click="messageMenuClick('5')">
                            <uni-badge :is-dot="true" text="0" absolute="rightTop" size="normal" :offset="[-35, -15]"
                                v-if="msgUnread&&msgUnread.list&&(msgUnread.systemCount>0||msgUnread.list.length>0)" />私信
                        </view>
                        <image class="clearUnreadImg" src="/static/img/other/clear_unread.png" @click="clearUnreadClick"
                            v-if="menuSort=='5'"></image>
                    </view>
                    <view class="topMenuTextBottomLineView" v-if="menuSort=='5'"></view>
                </view>
            </view>

            <view class="messageBottomCommentAndPlaymateView" :style="{height: (winHeight - 49) + 'px'}"
                v-if="menuSort=='1'">
                <message-skeleton v-if="isFirstLoading" :count="4" type="comment" />
                <template v-else>
                <view class="messageBottomCPItemView" v-for="(item, idx) in commentList" :key="idx"
                    @click="toCardPage(item.cardId)">
                    <view class="CPItemImageView">
                        <view class="myInfoAvatarView">
                            <image class="CPItemImage" src="/static/img/logo/default-avatar.png"
                                v-if="item.sendAvatar == ''"></image>
                            <image class="CPItemImage" :src="item.sendAvatar" v-else></image>
                            <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                v-if="item.identityIconName!=''"></image>
                        </view>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="CPItemInfoNickNameView">{{item.sendNikeName}}</view>
                        <view class="CPItemTimesView">
                            <view class="CPItemText">评论了你的帖子</view>
                            <view class="CPItemTimes">{{item.dateTime}}</view>
                        </view>
                        <view class="CPItemContentText">{{item.content}}</view>
                        <view class="CPItemBtnView">
                            <view class="itemCommentLoveBtnView"
                                @click.native.stop="likeClick(item.cardId, item.cardCommentId, item.isLike, idx)">
                                <image class="loveBtnImg" src="/static/img/other/love.png" v-if="item.isLike=='0'">
                                </image>
                                <image class="loveBtnImg" src="/static/img/other/love-active.png" v-else></image>
                                <view class="loveBtnText">点赞</view>
                            </view>
                            <view class="itemCommentReplyBtnView"
                                @click.native.stop="openCommentPage(item.cardId, item.superiorCommentId, item.sendStudentId)">
                                <image class="replyBtnImg" src="/static/img/other/reply.png"></image>
                                <view class="replyBtnText">回复</view>
                            </view>
                        </view>
                    </view>
                </view>
                </template>
            </view>

            <view class="messageBottomCommentAndPlaymateView" :style="{height: (winHeight - 49) + 'px'}"
                v-if="menuSort=='4'">
                <message-skeleton v-if="isFirstLoading" :count="4" type="playmate" />
                <template v-else>
                <view class="messageBottomCPItemView" v-for="(item, idx) in playmateCommentList" :key="idx"
                    @click="toPlaymatePage(item.playmateId)">
                    <view class="CPItemImageView">
                        <view class="myInfoAvatarView">
                            <image class="CPItemImage" src="/static/img/logo/default-avatar.png"
                                v-if="item.sendAvatar == ''"></image>
                            <image class="CPItemImage" :src="item.sendAvatar" v-else></image>
                            <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                v-if="item.identityIconName!=''"></image>
                        </view>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="CPItemInfoNickNameView">{{item.sendNikeName}}</view>
                        <view class="CPItemTimesView">
                            <view class="CPItemText" v-if="item.playmateType=='1'">评论了你的凑搭</view>
                            <view class="CPItemText" v-if="item.playmateType=='2'">加入了你的凑搭</view>
                            <view class="CPItemTimes">{{item.dateTime}}</view>
                        </view>
                        <view class="CPItemContentText" v-if="item.playmateType=='1'">{{item.content}}</view>
                        <view class="CPItemBtnView" v-if="item.playmateType=='1'">
                            <view class="itemCommentLoveBtnView"
                                @click.native.stop="playmateLikeClick(item.playmateId, item.playmateCommentId, item.isLike, idx)">
                                <image class="loveBtnImg" src="/static/img/other/love.png" v-if="item.isLike=='0'">
                                </image>
                                <image class="loveBtnImg" src="/static/img/other/love-active.png" v-else></image>
                                <view class="loveBtnText">点赞</view>
                            </view>
                            <view class="itemCommentReplyBtnView"
                                @click.native.stop="openPlaymateCommentPage(item.playmateSort, item.playmateId, item.superiorPlaymateCommentId, item.sendStudentId)">
                                <image class="replyBtnImg" src="/static/img/other/reply.png"></image>
                                <view class="replyBtnText">回复</view>
                            </view>
                        </view>
                    </view>
                </view>
                </template>
            </view>

            <view class="messageBottomLikeAndCollectView" :style="{height: (winHeight - 49) + 'px'}"
                v-if="menuSort=='2'">
                <message-skeleton v-if="isFirstLoading" :count="4" type="like" />
                <template v-else>
                <view class="messageBottomCPItemView" v-for="(item, idx) in likeList" :key="idx"
                    @click="toCardPage(item.cardId)">
                    <view class="CPItemImageView">
                        <view class="myInfoAvatarView">
                            <image class="CPItemImage" src="/static/img/logo/default-avatar.png"
                                v-if="item.sendAvatar == ''"></image>
                            <image class="CPItemImage" :src="item.sendAvatar" v-else></image>
                            <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                v-if="item.identityIconName!=''"></image>
                        </view>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="CPItemInfoNickNameView">{{item.sendNikeName}}</view>
                        <view class="CPItemTimesView">
                            <view class="CPItemText">点赞了你的帖子</view>
                            <view class="CPItemTimes">{{item.dateTime}}</view>
                        </view>
                        <view class="LCItemContentView">
                            <view class="LCItemContentLine"></view>
                            <view class="LCItemContentText">{{item.content}}</view>
                        </view>
                    </view>
                </view>
                </template>
            </view>

            <view class="messageBottomLikeAndCollectView" :style="{height: (winHeight - 49) + 'px'}"
                v-if="menuSort=='3'">
                <message-skeleton v-if="isFirstLoading" :count="4" type="collect" />
                <template v-else>
                <view class="messageBottomCPItemView" v-for="(item, idx) in collectList" :key="idx"
                    @click="toCardPage(item.cardId)">
                    <view class="CPItemImageView">
                        <view class="myInfoAvatarView">
                            <image class="CPItemImage" src="/static/img/logo/default-avatar.png"
                                v-if="item.sendAvatar == ''"></image>
                            <image class="CPItemImage" :src="item.sendAvatar" v-else></image>
                            <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                v-if="item.identityIconName!=''"></image>
                        </view>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="CPItemInfoNickNameView">{{item.sendNikeName}}</view>
                        <view class="CPItemTimesView">
                            <view class="CPItemText">收藏了你的帖子</view>
                            <view class="CPItemTimes">{{item.dateTime}}</view>
                        </view>
                        <view class="LCItemContentView">
                            <view class="LCItemContentLine"></view>
                            <view class="LCItemContentText">{{item.content}}</view>
                        </view>
                    </view>
                </view>
                </template>
            </view>

            <view class="messageBottomSystemView" :style="{height: (winHeight - 49) + 'px'}" v-if="menuSort=='5'">
                <message-skeleton v-if="isFirstLoading" :count="3" type="chat" />
                <template v-else>
                <view class="messageBottomCPItemView" @click="toPage(systemData, 0, 'sys')">
                    <view class="CPItemImageView">
                        <uni-badge :text="msgUnread.systemCount>99?'99+':msgUnread.systemCount.toString()"
                            absolute="rightTop" size="normal" :offset="[-45, -45]"
                            v-if="msgUnread&&msgUnread.systemCount>0" />
                        <image class="CPItemImage" src="/static/img/logo/sys-msg.png"></image>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="sysItemTimesView">
                            <view class="CPItemInfoNickNameView">系统消息</view>
                            <view class="CPItemTimes">
                                {{(systemData==null||systemData.lastDateTime==null)?'':systemData.lastDateTime}}
                            </view>
                        </view>
                        <view class="SystemItemContentText">
                            {{(systemData==null||systemData.lastContent==null)?'':systemData.lastContent}}
                        </view>
                    </view>
                </view>

                <!-- <view class="sysMessageBottomCPItemView">
                    <view class="CPItemImageView">
                        <image class="CPItemImage" src="/static/img/logo/default-avatar.png"></image>
                    </view>
                    <view class="CPItemInfoView">
                        <view class="sysItemTimesView">
                            <view class="CPItemInfoNickNameView">团团校园圈</view>
                            <view class="CPItemTimes">2025-08-25 10:00</view>
                        </view>
                        <view class="SystemItemContentText">福建省开发商副书记符合双方尽快恢复健康后十分恐惧</view>
                    </view>
                </view> -->
                <uni-swipe-action>
                    <uni-swipe-action-item :right-options="swipeOptions" @click="swipeClick($event, item.id)"
                        v-for="(item, idx) in groupList" :key="idx">
                        <view class="sysMessageBottomCPItemView" @click="toPage(item, idx, 'chat')">

                            <view class="CPItemImageView">
                                <uni-badge :text="item.unreadNumber>99?'99+':item.unreadNumber.toString()"
                                    absolute="rightTop" size="normal" :offset="[-45, -45]" v-if="item.unreadNumber>0" />
                                <image class="CPItemImage" :src="item.memberList[0].avatar"
                                    v-if="item.sort=='1'&&item.memberList.length>0&&item.memberList[0].avatar!=''">
                                </image>
                                <image class="CPItemImage" src="/static/img/logo/default-avatar.png" v-else></image>
                            </view>
                            <view class="CPItemInfoView">
                                <view class="sysItemTimesView">
                                    <view class="CPItemInfoNickNameView"
                                        v-if="item.sort=='1'&&item.memberList.length>0">
                                        {{item.memberList[0].nikeName}}
                                    </view>
                                    <view class="CPItemInfoNickNameView" v-else>测试用户</view>
                                    <view class="CPItemInfoNickNameView" v-if="item.sort=='2'">{{item.name}}</view>
                                    <view class="CPItemTimes">{{item.lastSendTime}}</view>
                                </view>
                                <view class="SystemItemContentText">{{item.lastSendContent}}</view>
                            </view>
                        </view>
                    </uni-swipe-action-item>
                </uni-swipe-action>
                </template>
            </view>

        </view>

        <uni-popup ref="commentPopup" background-color="#ffffff" :safeArea="false">
            <view class="sendCommentPopup">
                <textarea class="sendCommentPopupTextarea" v-model="content" cursor-spacing="200"></textarea>
                <view class="sendCommentPopupBtnView">
                    <view class="sendCommentPopupBtnIconView">
                        <image class="sendCommentPopupBtnIconImg" src="/static/img/other/picture.png"
                            @click="chooseImage"></image>
                    </view>
                    <view class="sendCommentPopupBtnSendView">
                        <button class="sendBtn" size="mini" @click="sendCommentClick">发送</button>
                    </view>
                </view>
                <view class="showUploadImgView" v-if="uploadImageUrl!=''">
                    <image class="uploadImageDeleteImg" src="/static/img/other/image-delete.png" @click="deleteImage">
                    </image>
                    <image class="uploadImageImg" :src="uploadImageUrl" @click="previewImage"></image>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="playmateCommentPopup" background-color="#ffffff" :safeArea="false">
            <view class="sendCommentPopup">
                <textarea class="sendCommentPopupTextarea" v-model="content" cursor-spacing="200"></textarea>
                <view class="sendCommentPopupBtnView">
                    <view class="sendCommentPopupBtnIconView">
                        <image class="sendCommentPopupBtnIconImg" src="/static/img/other/picture.png"
                            @click="chooseImage"></image>
                    </view>
                    <view class="sendCommentPopupBtnSendView">
                        <button class="sendBtn" size="mini" @click="sendPlaymateCommentClick">发送</button>
                    </view>
                </view>
                <view class="showUploadImgView" v-if="uploadImageUrl!=''">
                    <image class="uploadImageDeleteImg" src="/static/img/other/image-delete.png" @click="deleteImage">
                    </image>
                    <image class="uploadImageImg" :src="uploadImageUrl" @click="previewImage"></image>
                </view>
            </view>
        </uni-popup>

    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    import messageSkeleton from '../../components/skeleton/message-skeleton.vue'
    import verifySchool from '../../libs/verify_school'
    export default {
        components: {
            topBackground,
            messageSkeleton
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginStudentId: '',
                menuSort: '1',

                commentList: [],
                likeList: [],
                collectList: [],
                playmateCommentList: [],
                systemData: null,
                groupList: [],

                cardId: 0,
                content: '',
                toStudentId: '',
                commentId: '',
                uploadImageUrl: '',
                pictureUrl: '',
                playmateId: '',
                playmateCommentId: '',
                playmateSort: '',

                swipeOptions: [{
                    text: '删除',
                    style: {
                        backgroundColor: '#FF0000'
                    }
                }],

                msgUnread: {},

                isFirstLoading: true,
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getLoginInfo()
            this.getList()
        },
        onShow() {
            this.getUnreadCount()
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
            },
            messageMenuClick(menuSort) {
                this.menuSort = menuSort
                this.getList()
            },
            getList() {
                const menuSort = this.menuSort
                this.isFirstLoading = true
                if (menuSort == '1') {
                    this.getMessageCommentList()
                    if (this.msgUnread.commentCount > 0) {
                        this.msgUnread.commentCount = 0
                        this.refreshMenuCount()
                        this.$storage.unread.set(this.msgUnread)
                        this.updateUnreadCount('1', this.msgUnread.commentId)
                    }
                } else if (menuSort == '2') {
                    this.getMessageLikeList()
                    if (this.msgUnread.likeCount > 0) {
                        this.msgUnread.likeCount = 0
                        this.refreshMenuCount()
                        this.$storage.unread.set(this.msgUnread)
                        this.updateUnreadCount('2', this.msgUnread.likeId)
                    }
                } else if (menuSort == '3') {
                    this.getMessageCollectList()
                    if (this.msgUnread.collectCount > 0) {
                        this.msgUnread.collectCount = 0
                        this.refreshMenuCount()
                        this.$storage.unread.set(this.msgUnread)
                        this.updateUnreadCount('3', this.msgUnread.collectId)
                    }
                } else if (menuSort == '4') {
                    this.getMessagePlaymateCommentList()
                    if (this.msgUnread.playmateCommentCount > 0 || this.msgUnread.playmateMemberCount > 0) {
                        this.msgUnread.playmateCommentCount = 0
                        this.msgUnread.playmateMemberCount = 0
                        this.refreshMenuCount()
                        this.$storage.unread.set(this.msgUnread)
                        this.updateUnreadCount('4', this.msgUnread.playmateCommentId)
                        this.updateUnreadCount('7', this.msgUnread.playmateMemberId)
                    }
                } else if (menuSort == '5') {
                    this.getMessageSystemList()
                    this.getGroupList()
                }
            },
            getMessageCommentList() {
                const param = 'loginStudentId=' + this.loginStudentId;
                this.$api.getMessageCommentList(param).then(res => {
                    // console.log('getMessageCommentList success data:', JSON.stringify(res))
                    this.commentList = res.data
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
            getMessageLikeList() {
                const param = 'loginStudentId=' + this.loginStudentId;
                this.$api.getMessageLikeList(param).then(res => {
                    // console.log('getMessageLikeList success data:', JSON.stringify(res))
                    this.likeList = res.data
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
            getMessageCollectList() {
                const param = 'loginStudentId=' + this.loginStudentId;
                this.$api.getMessageCollectList(param).then(res => {
                    // console.log('getMessageCollectList success data:', JSON.stringify(res))
                    this.collectList = res.data
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
            getMessagePlaymateCommentList() {
                const param = 'loginStudentId=' + this.loginStudentId;
                this.$api.getMessagePlaymateCommentList(param).then(res => {
                    // console.log('getMessagePlaymateCommentList success data:', JSON.stringify(res))
                    this.playmateCommentList = res.data
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
            getMessageSystemList() {
                const param = 'loginStudentId=' + this.loginStudentId;
                this.$api.getMessageSystemList(param).then(res => {
                    // console.log('getMessageSystemList success data:', JSON.stringify(res))
                    this.systemData = res.data
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
            getGroupList() {
                const param = 'studentId=' + this.loginStudentId;
                this.$api.getGroupList(param).then(res => {
                    // console.log('getGroupList success data:', JSON.stringify(res))
                    this.groupList = res.data
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
            toCardPage(cardId) {
                uni.navigateTo({
                    url: '/pages/carddetail/carddetail?cardId=' + cardId
                })
            },
            toPlaymatePage(playmateId) {
                uni.navigateTo({
                    url: '/package-playmate/playmate-detail/playmate-detail?playmateId=' + playmateId
                })
            },
            async openCommentPage(cardId, cardCommentId, toStudentId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.cardId = cardId
                this.commentId = cardCommentId
                this.toStudentId = toStudentId
                this.$refs.commentPopup.open('bottom')
            },
            async openPlaymateCommentPage(playmateSort, playmateId, playmateCommentId, toStudentId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.playmateSort = playmateSort
                this.playmateId = playmateId
                this.playmateCommentId = playmateCommentId
                this.toStudentId = toStudentId
                this.$refs.playmateCommentPopup.open('bottom')
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
                        // console.log(res.tempFiles)
                        const data = res.tempFiles[0].tempFilePath
                        _this.uploadImageUrl = data
                    }
                })
            },
            deleteImage() {
                this.uploadImageUrl = ''
            },
            previewImage() {
                const imageList = [this.uploadImageUrl]
                uni.previewImage({
                    urls: imageList
                });
            },
            reset() {
                this.content = ''
                this.toStudentId = ''
                this.commentId = ''
                this.playmateId = ''
                this.playmateCommentId = ''

                this.uploadImageUrl = ''
                this.pictureUrl = ''
            },
            sendCommentClick() {
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
                    toStudentId: this.toStudentId,
                    content: this.content,
                    pictureUrl: this.pictureUrl
                };

                if (this.uploadImageUrl == '') {
                    this.$api.saveCardComment(param).then(res => {
                        this.reset()
                        this.$refs.commentPopup.close()

                        uni.showToast({
                            title: '发布评论成功',
                            icon: 'none',
                            mask: true
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

                                uni.showToast({
                                    title: '发布评论成功',
                                    icon: 'none',
                                    mask: true
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
                        })
                        .catch((err) => {
                            // console.log('error video err:' + err)
                            uni.showToast({
                                icon: 'error',
                                title: err,
                                mask: true
                            })
                            uni.hideLoading()
                        })
                }
            },
            sendPlaymateCommentClick() {
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
                    sort: this.playmateSort,
                    bureauId: this.playmateId,
                    commentId: this.playmateCommentId,
                    sendStudentId: this.loginStudentId,
                    toStudentId: this.toStudentId,
                    content: this.content,
                    pictureUrl: this.pictureUrl
                };

                if (this.uploadImageUrl == '') {
                    this.$api.savePlaymateComment(param).then(res => {
                        this.reset()
                        this.$refs.playmateCommentPopup.close()

                        uni.showToast({
                            title: '发布评论成功',
                            icon: 'none',
                            mask: true
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
                            this.$api.savePlaymateComment(param).then(res => {
                                this.reset()
                                this.$refs.playmateCommentPopup.close()

                                uni.showToast({
                                    title: '发布评论成功',
                                    icon: 'none',
                                    mask: true
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
                        })
                        .catch((err) => {
                            // console.log('error video err:' + err)
                            uni.showToast({
                                icon: 'error',
                                title: err,
                                mask: true
                            })
                            uni.hideLoading()
                        })
                }
            },
            async likeClick(cardId, commentId, sign, index) {
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
            async playmateLikeClick(playmateId, playmateCommentId, sign, idx) {
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
                    bureauId: playmateId,
                    sign: likeSign,
                    loginStudentId: this.loginStudentId,
                    commentId: playmateCommentId
                };
                this.$api.playmateUpdateLikeSign(param).then(res => {
                    this.playmateCommentList[idx].isLike = likeSign

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
            async swipeClick(e, groupId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }
                // console.log('e:' + JSON.stringify(e))
                // console.log('点击了' + (e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
                // console.log('groupId:' + groupId)
                const idx = e.index
                if (idx == 0) {
                    uni.showLoading({
                        title: '提交中...',
                        mask: true
                    })

                    const param = {
                        id: groupId,
                        studentId: this.loginStudentId
                    };
                    this.$api.deleteGroupList(param).then(res => {
                        this.groupList.splice(idx, 1)

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
                }
            },
            verifyStatus() {
                let isOperate = false
                const userInfo = this.$storage.user.get();
                const status = userInfo.status
                const banLevel = userInfo.banLevel
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
                    const banEndDay = userInfo.banEndDay
                    const banReason = userInfo.banReason
                    let content = '你的账户因[' + banReason + ']，已被禁止登录小程序'
                    if (banDay == '0') {
                        content = content + '。'
                    }
                    if (banDay == '1') {
                        content = content + '1天。截止：' + banEndDay
                    }
                    if (banDay == '2') {
                        content = content + '7天。截止：' + banEndDay
                    }
                    if (banDay == '3') {
                        content = content + '30天。截止：' + banEndDay
                    }
                    if (banDay == '4') {
                        content = content + '360天。截止：' + banEndDay
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
                } else if (parseInt(banLevel) >= 3 && parseInt(banLevel) <= 4) {
                    const banDay = userInfo.banDay
                    const banEndDay = userInfo.banEndDay
                    const banReason = userInfo.banReason
                    let content = '你的账户因[' + banReason + ']，已被禁止私信'
                    if (banDay == '0') {
                        content = content + '。'
                    }
                    if (banDay == '1') {
                        content = content + '1天。截止：' + banEndDay
                    }
                    if (banDay == '2') {
                        content = content + '7天。截止：' + banEndDay
                    }
                    if (banDay == '3') {
                        content = content + '30天。截止：' + banEndDay
                    }
                    if (banDay == '4') {
                        content = content + '360天。截止：' + banEndDay
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
            async toPage(item, idx, sign) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                if (sign == 'chat') {
                    if (!this.verifyStatus()) {
                        return;
                    }

                    if (this.msgUnread.list.length > 0) {
                        const list = this.msgUnread.list
                        for (let i = 0; i < list.length; i++) {
                            const unreadItem = list[i]
                            if (unreadItem.groupId == item.id) {
                                list.splice(i, 1)
                                break;
                            }
                        }
                        if (list.length == 0) {
                            this.msgUnread.list = []
                            this.refreshMenuCount()
                            this.$storage.unread.set(this.msgUnread)
                            this.updateUnreadCount('6', this.msgUnread.groupId)
                        } else {
                            this.msgUnread.list = list
                            this.refreshMenuCount()
                            this.$storage.unread.set(this.msgUnread)
                        }
                    }
                    this.groupList[idx].unreadNumber = 0
                    const nikeName = item.memberList[0].nikeName
                    uni.navigateTo({
                        url: '/package-content/group-content/group-content?groupId=' + item.id + '&sign=' +
                            sign +
                            '&nikeName=' + nikeName
                    })
                }
                if (sign == 'sys') {
                    if (item == null) {
                        uni.showToast({
                            title: '暂无系统消息',
                            icon: 'none',
                            mask: true
                        })
                    } else {
                        if (this.msgUnread.systemCount > 0) {
                            this.msgUnread.systemCount = 0
                            this.refreshMenuCount()
                            this.$storage.unread.set(this.msgUnread)
                            this.updateUnreadCount('5', this.msgUnread.messageId)
                        }
                        uni.navigateTo({
                            url: '/package-content/group-content/group-content?groupId=' + item.messageId +
                                '&sign=' +
                                sign
                        })
                    }
                }
            },
            async clearUnreadClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                console.log('clearUnreadClick')
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = {
                    studentId: this.loginStudentId
                };
                this.$api.updateBatchRead(param).then(res => {
                    this.groupList.forEach(item => {
                        item.unreadNumber = 0; // 直接修改原数组元素
                    });

                    if (this.msgUnread.systemCount > 0 || this.msgUnread.list.length > 0) {
                        this.msgUnread.systemCount = 0
                        this.msgUnread.list = []
                        this.refreshMenuCount()
                        this.$storage.unread.set(this.msgUnread)
                        this.updateUnreadCount('5', this.msgUnread.messageId)
                        this.updateUnreadCount('6', this.msgUnread.groupId)
                    }

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
            getUnreadCount() {
                // this.msgUnread = uni.getStorageSync('msgUnread')
                this.msgUnread = this.$storage.unread.get()
            },
            updateUnreadCount(sort, lastId) {
                const param = {
                    sort: sort,
                    studentId: this.loginStudentId,
                    lastId: lastId
                };
                this.$api.updateUnreadCount(param).then(res => {}).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            refreshMenuCount() {
                const data = this.msgUnread

                const commentCount = parseInt(data.commentCount)
                const likeCount = parseInt(data.likeCount)
                const collectCount = parseInt(data.collectCount)
                const playmateCommentCount = parseInt(data.playmateCommentCount)
                const playmateMemberCount = parseInt(data.playmateMemberCount)
                const systemCount = parseInt(data.systemCount)
                const list = data.list
                let listCount = 0
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        const obj = list[i]
                        const unreadNumber = parseInt(obj.unreadNumber)
                        listCount = listCount + unreadNumber
                    }
                }

                const total = commentCount + likeCount + collectCount + playmateCommentCount + playmateMemberCount +
                    systemCount + listCount
                console.log('refreshMenuCount_total:' + total)
                if (total > 0) {
                    const badgeText = total > 99 ? '99+' : total.toString();
                    uni.setTabBarBadge({
                        index: 1, // 消息tab的索引
                        text: badgeText
                    });
                } else {
                    uni.removeTabBarBadge({
                        index: 1
                    });
                }
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

    .messageMenuView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .topMenuText {
        z-index: 2;
    }

    .clearUnreadImg {
        width: 30rpx;
        height: 30rpx;
        margin-left: 10rpx;
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
        overflow-y: auto;
    }

    .messageBottomCPItemView {
        display: flex;
        flex-direction: row;
        margin-top: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #F3F3F1;
    }

    .sysMessageBottomCPItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #F3F3F1;
    }

    .CPItemImageView {
        width: 100rpx;
        height: 100rpx;
    }

    .myInfoAvatarView {
        width: 92rpx;
        height: 92rpx;
        position: relative;
    }

    .CPItemImage {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .avatarImgIcon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        bottom: -10rpx;
        left: 56rpx;
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

    .SystemItemContentText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;

        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        margin-top: 5rpx;
        padding-right: 20rpx;
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
        overflow-y: auto;
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

    .messageBottomSystemView {
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
        overflow-y: auto;
    }

    .sysItemTimesView {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5rpx;
        padding-right: 20rpx;
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

    .uni-badge-left-margin {
        margin-left: 10px;
    }
</style>