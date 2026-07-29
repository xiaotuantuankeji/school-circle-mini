<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">

            <playmate-detail-skeleton v-if="isFirstLoading" />

            <template v-else>
            <view class="playmateDetailTopView">
                <view class="playmateUserInfoView">
                    <view class="playmateUserAvatarView"
                        @click="toUserDetailClick(playmateItem.studentId, playmateItem.nikeNameId)">
                        <image class="playmateUserAvatarImg" :src="playmateItem.avatar"
                            v-if="playmateItem.avatar != ''"></image>
                        <image class="playmateUserAvatarImg" src="/static/img/logo/default-avatar.png" v-else></image>
                        <image class="avatarImgIcon" :src="`/static/img/my/${playmateItem.identityIconName}.png`"
                            v-if="playmateItem.identityIconName!=''"></image>
                    </view>
                    <view class="playmateUserOtherView">
                        <view class="playmateUserNameAndMoreView">
                            <view class="playmateUserNameView">
                                <view @click="toUserDetailClick(playmateItem.studentId, playmateItem.nikeNameId)">
                                    {{playmateItem.nikeName}}
                                </view>
                                <image class="userInfoSexImg" src="/static/img/other/male.png"
                                    v-if="playmateItem.sex=='1'">
                                </image>
                                <image class="userInfoSexImg" src="/static/img/other/woman.png"
                                    v-if="playmateItem.sex=='2'"></image>
                                <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                    v-if="playmateItem.studentStatus=='2'&&playmateItem.studentSort!='3'&&playmateItem.studentSort!='4'">
                                </image>
                            </view>
                            <view class="playmateUserMoreView" @click="openOperateMenu(playmateItem.studentId)"
                                v-if="playmateItem.studentId==loginStudentId">
                                <image class="playmateUserMoreImg" src="/static/img/other/more-black.png"></image>
                            </view>
                        </view>
                        <view class="playmateUserTimesView">{{formatTime(playmateItem.createTime)}}</view>
                    </view>
                </view>
                <view class="playmateTitleView">
                    <view class="playmateTitleText">{{playmateItem.title}}</view>
                    <view class="playmateShareView">
                        <button class="shareButton" open-type="share">
                            <image class="playmateShareImg" src="/static/img/other/share-arrow.png"></image>
                            <view class="playmateShareText">分享</view>
                        </button>
                    </view>
                </view>
                <view class="playmateTagView">
                    <label class="playmateStatusTagView inProgressBackground"
                        v-if="playmateItem.status == '1'">进行中</label>
                    <label class="playmateStatusTagView finishBackground" v-if="playmateItem.status == '2'">已完成</label>
                    <label class="playmateStatusTagView expireBackground" v-if="playmateItem.status == '3'">已过期</label>
                    <label class="playmateSortTag"
                        :style="'background: ' + playmateItem.sortBackgroundColor">{{playmateItem.sortName}}</label>
                </view>
                <view class="playmateParameterView">
                    <view class="playmateParameterItemView">
                        <image style="width: 26rpx;height: 26rpx;" src="/static/img/other/smiling-face-black.png">
                        </image>
                        <view class="playmateParameterItemText">{{playmateItem.totalNumber}}人</view>
                    </view>
                    <view class="playmateParameterItemView">
                        <image style="width: 26rpx;height: 26rpx;" src="/static/img/other/location-black.png"></image>
                        <view class="playmateParameterItemText">{{playmateItem.localName}}</view>
                    </view>
                    <view class="playmateParameterItemView">
                        <image style="width: 26rpx;height: 26rpx;" src="/static/img/other/time-black.png"></image>
                        <view class="playmateParameterItemText">{{playmateItem.startTime}} - {{playmateItem.endTime}}
                        </view>
                    </view>
                </view>
                <view class="playmateContentView">
                    <view class="playmateContentTitle">活动介绍</view>
                    <text class="playmateContentText">{{playmateItem.content}}</text>
                </view>
                <view class="playmateImageInfoView"
                    v-if="playmateItem.pictureList != null && playmateItem.pictureList.length > 0">
                    <image class="playmateOneImage" :src="playmateItem.pictureList[0].pictureUrl"
                        v-if="playmateItem.pictureList.length == 1" mode="widthFix"
                        @click="previewImage(playmateItem.pictureList, 0)"></image>
                    <uni-grid :column="3" :show-border="false" :square="true" v-else>
                        <uni-grid-item v-for="(item, idx) in playmateItem.pictureList" :index="idx" :key="idx">
                            <image class="gridItemImg" :src="item.pictureUrl" mode="aspectFill"
                                @click="previewImage(playmateItem.pictureList, idx)" />
                        </uni-grid-item>
                    </uni-grid>
                </view>
            </view>
            <view class="playmateAddMiddleView" v-if="playmateItem.memberList != undefined">
                <view class="playmateMiddleMemberView">
                    <label class="playmateMiddleMemberTag"
                        :style="'background: ' + playmateItem.sortBackgroundColor">{{playmateItem.createSortName}}</label>
                </view>
                <view class="playmateMiddleAvatarView">
                    <!-- <view v-for="(memberItem, idx) in playmateItem.memberList" :key="idx"
                        @click="toUserDetailClick(memberItem.studentId, memberItem.nikeNameId)">
                        <image class="playmateMiddleAvatarImg" src="/static/img/logo/default-avatar.png"
                            v-if="memberItem.avatar==''"></image>
                        <image class="playmateMiddleAvatarImg" :src="memberItem.avatar" v-else></image>
                    </view> -->
                    <view class="memberAvatarView" v-if="playmateItem.totalNumber>7">
                        <view class="memberAvatarItemView"
                            v-for="(memberItem, idx) in playmateItem.memberList.slice(0,6)" :key="idx"
                            @click="toUserDetailClick(memberItem.studentId, memberItem.nikeNameId)">
                            <image :class="(idx==0)?'playmateMiddleCreateAvatarImg':'playmateMiddleAvatarImg'"
                                :style="(idx==0)?'border: 2rpx solid ' + playmateItem.sortBackgroundColor:''"
                                src="/static/img/logo/default-avatar.png" v-if="memberItem.avatar==''"></image>
                            <image :class="(idx==0)?'playmateMiddleCreateAvatarImg':'playmateMiddleAvatarImg'"
                                :style="(idx==0)?'border: 2rpx solid ' + playmateItem.sortBackgroundColor:''"
                                :src="memberItem.avatar" v-else></image>
                        </view>
                        <view class="memberAvatarItemView" v-for="idx in (6 - playmateItem.memberList.length)"
                            :key="idx" v-if="playmateItem.memberList.length<6">
                            <view class="memberAddView" @click="joinMemberClick">
                                <uni-icons type="plusempty" size="16" color="#FFFFFF"></uni-icons>
                            </view>
                        </view>
                        <view class="playmateMiddleAvatarImg">...</view>
                    </view>
                    <view class="memberAvatarView" v-else>
                        <view class="memberAvatarItemView" v-for="(memberItem, idx) in playmateItem.memberList"
                            :key="idx" @click="toUserDetailClick(memberItem.studentId, memberItem.nikeNameId)">
                            <image :class="(idx==0)?'playmateMiddleCreateAvatarImg':'playmateMiddleAvatarImg'"
                                :style="(idx==0)?'border: 2rpx solid ' + playmateItem.sortBackgroundColor:''"
                                src="/static/img/logo/default-avatar.png" v-if="memberItem.avatar==''"></image>
                            <image :class="(idx==0)?'playmateMiddleCreateAvatarImg':'playmateMiddleAvatarImg'"
                                :style="(idx==0)?'border: 2rpx solid ' + playmateItem.sortBackgroundColor:''"
                                :src="memberItem.avatar" v-else></image>
                        </view>
                        <view class="memberAvatarItemView"
                            v-for="idx in (playmateItem.totalNumber - playmateItem.memberList.length)" :key="idx">
                            <view class="memberAddView" @click="joinMemberClick">
                                <uni-icons type="plusempty" size="16" color="#FFFFFF"></uni-icons>
                            </view>
                        </view>
                    </view>
                    <view class="memberListView" @click="viewMemberClick">
                        <text>查看成员</text>
                    </view>
                </view>
            </view>
            <view class="playmateAddBottomView">
                <view class="playmateAddBottomMenuView">
                    <view class="playmateBottomMenuTextView">
                        <view class="playmateBottomMenuText" @click="playmateMenuClick('1')">公开讨论</view>
                        <view class="playmateBottomMenuTextBottomLineView" v-if="menuSort=='1'"></view>
                    </view>
                    <view class="playmateBottomMenuTextView" v-if="playmateItem.isJoin=='1'">
                        <view class="playmateBottomMenuText" @click="playmateMenuClick('2')">私聊</view>
                        <view class="playmateBottomMenuTextBottomLineView" v-if="menuSort=='2'"></view>
                    </view>
                </view>
                <view class="playmateDetailCommentView" v-if="playmateItem.status!='3' && isShowComment">
                    <view class="myInfoAvatarView">
                        <image class="commentLoginAvatar" src="/static/img/logo/default-avatar.png"
                            v-if="loginAvatar==''">
                        </image>
                        <image class="commentLoginAvatar" :src="loginAvatar" v-else></image>
                        <image class="avatarImgIcon" :src="`/static/img/my/${loginIdentityIconUrl}.png`"
                            v-if="loginIdentityIconUrl!=''"></image>
                    </view>
                    <view class="playmateDetailCommentBtnView">
                        <view class="playmateDetailCommentBtnText" @click="openCommentPage">说点什么…</view>
                        <image class="playmateDetailCommentBtnImg" src="/static/img/other/picture.png"
                            @click="openChooseImagePage" v-if="is_open_upload == '1'"></image>
                    </view>
                </view>
                <view class="cardDetailCommentContentView">
                    <view class="notCommentContentView" v-if="commentList.length==0">暂无评论</view>
                    <!-- 评论 -->
                    <view class="commentContentItemView" v-for="(item, index) in commentList" :key="index" v-else>
                        <view class="itemLoginAvatarView">
                            <view class="cardUserAvatarView">
                                <image class="itemLoginAvatar" src="/static/img/logo/default-avatar.png"
                                    v-if="item.avatar==''">
                                </image>
                                <image class="itemLoginAvatar" :src="item.avatar" v-else></image>
                                <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                    v-if="item.identityIconName!=''"></image>
                            </view>
                        </view>
                        <view class="itemCommentContentView">
                            <view class="itemCommentName">
                                <view>{{item.nikeName}}</view>
                                <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="item.sex=='1'">
                                </image>
                                <image class="userInfoSexImg" src="/static/img/other/woman.png" v-if="item.sex=='2'">
                                </image>
                                <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                    v-if="item.studentStatus=='2'"></image>
                            </view>
                            <view class="itemCommentContentText">
                                <text>{{item.content}}</text>
                            </view>
                            <view class="itemCommentImgView" v-if="item.pictureUrl!=''"
                                @click="lookImage(item.pictureUrl)">
                                <image class="itemCommentImg" :src="item.pictureUrl" mode="widthFix">
                                </image>
                            </view>
                            <view class="itemCommentTimeAndBtnView">
                                <view class="itemCommentTimeText">{{formatTime(item.updateTime)}}</view>
                                <view class="itemCommentBtnView">
                                    <view class="itemCommentLoveBtnView"
                                        @click="commentLikeClick(item.id, item.isLike, index)">
                                        <image class="loveBtnImg" src="/static/img/other/love.png"
                                            v-if="item.isLike=='0'">
                                        </image>
                                        <image class="loveBtnImg" src="/static/img/other/love-active.png" v-else>
                                        </image>
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
                                <view class="itemLoginAvatarView">
                                    <view class="cardUserAvatarView">
                                        <image class="itemLoginAvatar" src="/static/img/logo/default-avatar.png"
                                            v-if="replyItem.avatar==''">
                                        </image>
                                        <image class="itemLoginAvatar" :src="replyItem.avatar" v-else></image>
                                        <image class="avatarImgIcon"
                                            :src="`/static/img/my/${replyItem.identityIconName}.png`"
                                            v-if="replyItem.identityIconName!=''"></image>
                                    </view>
                                </view>

                                <view class="itemCommentContentView">
                                    <view class="itemCommentName">
                                        <view>{{replyItem.nikeName}}</view>
                                        <image class="userInfoSexImg" src="/static/img/other/male.png"
                                            v-if="replyItem.sex=='1'">
                                        </image>
                                        <image class="userInfoSexImg" src="/static/img/other/woman.png"
                                            v-if="replyItem.sex=='2'"></image>
                                        <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                            v-if="replyItem.studentStatus=='2'"></image>
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
                                                <image class="loveBtnImg" src="/static/img/other/love-active.png"
                                                    v-else>
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
            </view>

            <view class="playmateButtonView">
                <button class="playmateButton" @click="quitPlaymateClick"
                    v-if="playmateItem.loginStudentBtnStatus=='3'">我要退出</button>
                <button class="playmateButton" @click="joinPlaymateClick"
                    v-if="playmateItem.loginStudentBtnStatus=='2' && isJoin">立即加入</button>
                <button class="playmateButton" @click="finishPlaymateClick"
                    v-if="playmateItem.loginStudentBtnStatus=='1'">完成凑搭</button>
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
                    <image class="uploadImageImg" :src="uploadImageUrl" @click="previewImage"></image>
                </view>
            </view>
        </uni-popup>

        <uni-popup ref="memberPopup">
            <view class="memberPopupView">
                <view class="memberTitleView">
                    <view></view>
                    <view class="memberTitleTextView">搭子成员</view>
                    <view @click="closeMemberClick">
                        <uni-icons type="closeempty" size="20" color="#858585"></uni-icons>
                    </view>
                </view>
                <view class="memberTableView">
                    <uni-table ref="table" border stripe :loading="false">
                        <uni-tr>
                            <uni-th width="30" align="center">头像</uni-th>
                            <uni-th width="70" align="center">昵称</uni-th>
                            <uni-th width="50" align="center"></uni-th>
                        </uni-tr>
                        <uni-tr v-for="(item, index) in playmateItem.memberList" :key="index">
                            <uni-td align="center">
                                <image class="tableAvatar" src="/static/img/logo/default-avatar.png"
                                    @click="toUserDetailClick(item.studentId, item.nikeNameId)" v-if="item.avatar==''">
                                </image>
                                <image class="tableAvatar" :src="item.avatar"
                                    @click="toUserDetailClick(item.studentId, item.nikeNameId)" v-else></image>
                            </uni-td>
                            <uni-td align="center">
                                <view @click="toUserDetailClick(item.studentId, item.nikeNameId)">{{ item.nikeName }}
                                </view>
                            </uni-td>
                            <uni-td align="center">
                                <view>{{ (item.type=='1')?playmateItem.createSortName:'' }}</view>
                            </uni-td>
                        </uni-tr>
                    </uni-table>
                </view>
            </view>
        </uni-popup>

    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    import playmateDetailSkeleton from '../../components/skeleton/playmate-detail-skeleton.vue'
    import util from '../../common/util';
    import verifySchool from '../../libs/verify_school'
    export default {
        components: {
            topBackground,
            playmateDetailSkeleton
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                isFirstLoading: true,

                keyboardHeight: 0,

                is_open_upload: '0', // 0：关闭，1：打开

                isShowComment: false,

                pageNo: 1,
                pageSize: this.$configData.pageSize,

                shareTipShow: false,
                menuSort: '1',
                loginStudentId: 0,
                loginShowNikeName: '',
                loginSchoolId: '',
                loginAvatar: '',
                loginIdentityIconUrl: '',
                loginStudentSort: '',

                playmateId: 0,

                sortList: [],

                playmateItem: {},
                isJoin: false,
                uploadImageUrl: '',
                commentList: [],
                commentId: '',
                toStudentId: '',
                pictureUrl: '',
                content: '',
            }
        },
        onLoad(opt) {
            let playmateId = opt.playmateId
            if (playmateId == undefined) {
                playmateId = 0
            }
            this.playmateId = playmateId

            this.getSystemInfo()
            this.getLoginInfo()
            this.getPlaymateSort()
            this.getPlaymateDetail()
            this.getPlaymateCommentList()
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
                this.loginStudentId = userInfo.studentId
                this.loginSchoolId = userInfo.schoolId
                this.loginAvatar = userInfo.avatar
                this.loginShowNikeName = userInfo.showNikeName
                this.loginStudentSort = userInfo.sort
                const identityInfoRespVOList = userInfo.identityInfoRespVOList
                if (identityInfoRespVOList.length > 0) {
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

                const schoolId = this.playmateItem.schoolId
                const schoolName = this.playmateItem.schoolName
                if (schoolId != loginSchoolId) {
                    uni.showToast({
                        title: '只有【' + schoolName + '】学生才可发布评论',
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
            getPlaymateSort() {
                const param = ''
                this.$api.getPlaymateSort(param).then(res => {
                    // console.log('getPlaymateSort succes res:' + JSON.stringify(res))

                    this.sortList = res.data
                }).catch(res => {
                    console.log('getPlaymateSort err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            getPlaymateDetail() {
                const param = 'loginStudentId=' + this.loginStudentId + '&id=' + this.playmateId;
                this.$api.getPlaymateDetail(param).then(res => {
                    // console.log('getPlaymateDetail succes res:' + JSON.stringify(res))

                    const data = res.data

                    const playmateSchoolId = res.data.schoolId
                    const joinType = res.data.joinType
                    if (joinType == '1') {
                        this.isJoin = true
                        this.isShowComment = true
                    } else {
                        if (playmateSchoolId == this.loginSchoolId) {
                            this.isJoin = true
                            this.isShowComment = true
                        } else {
                            this.isJoin = false
                            this.isShowComment = false
                        }
                    }

                    this.playmateItem = res.data

                    this.isFirstLoading = false
                }).catch(res => {
                    // console.log('getPlaymateList err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                    this.isFirstLoading = false
                })
            },
            playmateMenuClick(menuSort) {
                this.menuSort = menuSort
                this.getPlaymateCommentList()
            },
            getPlaymateCommentList() {
                uni.showLoading({
                    title: '获取中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&id=' + this.playmateId + '&menuSort=' + this
                    .menuSort;
                this.$api.getPlaymateCommentList(param).then(res => {
                    // console.log('getPlaymateCommentList succes res:' + JSON.stringify(res))

                    this.commentList = res.data

                    uni.hideLoading()
                }).catch(res => {
                    // console.log('getPlaymateList err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                    uni.hideLoading()
                })
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
            lookImage(imgUrl) {
                const imageList = [{
                    pictureUrl: imgUrl
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
            async replyCommentClick(commentId, sendStudentId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.commentId = commentId
                this.toStudentId = sendStudentId
                this.openCommentPage()
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
                    sort: this.menuSort,
                    bureauId: this.playmateId,
                    commentId: this.commentId,
                    sendStudentId: this.loginStudentId,
                    sendNikeName: this.loginShowNikeName,
                    toStudentId: this.toStudentId,
                    content: this.content,
                    pictureUrl: this.pictureUrl
                };

                if (this.uploadImageUrl == '') {
                    this.$api.savePlaymateComment(param).then(res => {
                        this.reset()
                        this.$refs.commentPopup.close()

                        this.getPlaymateCommentList()

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
                                this.$refs.commentPopup.close()

                                this.getPlaymateCommentList()

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
                    bureauId: this.playmateId,
                    sign: likeSign,
                    loginStudentId: this.loginStudentId,
                    commentId: commentId
                };
                this.$api.playmateUpdateLikeSign(param).then(res => {
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
                    bureauId: this.playmateId,
                    sign: likeSign,
                    loginStudentId: this.loginStudentId,
                    commentId: commentId
                };
                this.$api.playmateUpdateLikeSign(param).then(res => {
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
            async openOperateMenu(studentId) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                const loginStudentId = this.loginStudentId
                if (loginStudentId == studentId) {
                    uni.showActionSheet({
                        itemList: ['解散'],
                        success: function(res) {
                            // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
                            _this.disbandClick()
                        },
                        fail: function(res) {
                            console.log(res.errMsg);
                        }
                    });
                } else {
                    uni.showActionSheet({
                        itemList: ['举报'],
                        success: function(res) {
                            // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
                            _this.tipOffClick()
                        },
                        fail: function(res) {
                            console.log(res.errMsg);
                        }
                    });
                }
            },
            disbandClick() {
                const _this = this
                uni.showModal({
                    title: '解散',
                    editable: true,
                    placeholderText: '请输入解散原因',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定:' + res.content);
                            _this.disbandPlaymateClick(res.content)
                        } else if (res.cancel) {
                            console.log('用户点击取消:' + res.content);
                        }
                    }
                });
            },
            disbandPlaymateClick(content) {
                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    bureauId: this.playmateId,
                    reason: content
                };
                this.$api.disbandPlaymate(param).then(res => {
                    this.getPlaymateDetail()

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
            tipOffClick() {
                const _this = this
                uni.showModal({
                    title: '举报',
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
            joinMemberClick() {
                const loginStudentBtnStatus = this.playmateItem.loginStudentBtnStatus
                if (loginStudentBtnStatus == '0') {
                    uni.showToast({
                        icon: 'none',
                        title: '凑搭已完成，无法加入',
                        mask: true
                    })
                }
                if (loginStudentBtnStatus == '1') {
                    uni.showToast({
                        icon: 'none',
                        title: '创建人无法加入',
                        mask: true
                    })
                }
                if (loginStudentBtnStatus == '2' && this.isJoin) {
                    this.joinPlaymateClick()
                }
                if (loginStudentBtnStatus == '3') {
                    uni.showToast({
                        icon: 'none',
                        title: '已加入，请勿重复加入',
                        mask: true
                    })
                }
            },
            async joinPlaymateClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    bureauId: this.playmateId,
                    loginStudentId: this.loginStudentId
                };
                this.$api.joinPlaymate(param).then(res => {
                    if (res.code == 0) {
                        this.getPlaymateDetail()
                    } else {
                        uni.showToast({
                            icon: 'error',
                            title: res.msg,
                            mask: true
                        })
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
            async quitPlaymateClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    bureauId: this.playmateId,
                    loginStudentId: this.loginStudentId
                };
                this.$api.quitPlaymate(param).then(res => {
                    this.getPlaymateDetail()

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
            async finishPlaymateClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const param = {
                    bureauId: this.playmateId
                };
                this.$api.finishPlaymate(param).then(res => {
                    this.getPlaymateDetail()

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
                if (studentId == this.loginStudentId) {
                    nikeNameId = ''
                }
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + studentId + '&lookNikeNameId=' +
                        nikeNameId
                })
            },
            onShareAppMessage(res) {
                if (res.from === 'button') { // 来自页面内分享按钮
                    // 来自页面内转发按钮
                    console.log('来自页面内转发按钮')
                    // this.$refs.sharePopup.close()
                }

                // 最大14个字
                let title = "【" + this.playmateItem.sortName + "】" + this.playmateItem.title
                if (title.length > 30) {
                    title = title.substring(0, 30) + "..."
                }
                let imageUrl = ""
                if (this.playmateItem.pictureList.length > 0) {
                    imageUrl = this.playmateItem.pictureList[0].pictureUrl
                }
                return {
                    title: title,
                    path: '/package-playmate/playmate-detail/playmate-detail?playmateId=' + this.playmateId,
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
            viewMemberClick() {
                this.$refs.memberPopup.open()
            },
            closeMemberClick() {
                this.$refs.memberPopup.close()
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

    .playmateDetailTopView {
        display: flex;
        flex-direction: column;
        border-bottom: 2rpx solid #F3F3F1;
    }

    .playmateUserInfoView {
        display: flex;
        flex-direction: row;
        margin-top: 20rpx;
    }

    .playmateUserAvatarView {
        width: 79rpx;
        height: 79rpx;
        position: relative;
    }

    .playmateUserAvatarImg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .playmateUserOtherView {
        width: 80%;
        display: flex;
        flex-direction: column;
        padding-left: 25rpx;
    }

    .playmateUserNameAndMoreView {
        height: 46rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .playmateUserNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
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

    .playmateUserMoreView {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .playmateUserMoreImg {
        width: 31rpx;
        height: 8rpx;
    }

    .playmateUserTimesView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        font-style: normal;
        text-transform: none;
    }

    .playmateTitleView {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 35rpx;
    }

    .playmateTitleText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateShareView {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .shareButton {
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
        line-height: 0;
        background-color: transparent;
    }

    .shareButton::after {
        border: none;
    }

    .playmateShareImg {
        width: 39rpx;
        height: 29rpx;
    }

    .playmateShareText {
        margin-top: 2rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #000000;
        line-height: 31rpx;
        font-style: normal;
        text-transform: none;
    }

    .playmateTagView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10rpx;
    }

    .playmateStatusTagView {
        border-radius: 10rpx;
        padding: 5rpx 20rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #FFFFFF;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .inProgressBackground {
        background: #2CABA6;
    }

    .finishBackground {
        background: #e3574c;
    }

    .expireBackground {
        background: #727272;
    }

    .playmateSortTag {
        border-radius: 10rpx;
        padding: 5rpx 20rpx;
        margin-left: 15rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #FFFFFF;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .playmateParameterView {
        display: flex;
        flex-direction: column;
        margin-top: 10rpx;
    }

    .playmateParameterItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .playmateParameterItemText {
        margin-left: 14rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateContentView {
        display: flex;
        flex-direction: column;
        margin: 20rpx 0;
    }

    .playmateContentTitle {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateContentText {
        margin-top: 10rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateImageInfoView {
        margin-top: 20rpx;
    }

    .playmateOneImage {
        max-width: 60%;
        border-radius: 19rpx;
    }

    .gridItemImg {
        width: 90%;
        height: 90%;
        border-radius: 19rpx;
    }

    .playmateAddMiddleView {
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
        border-bottom: 2rpx solid #F3F3F1;
        padding-bottom: 20rpx;
    }

    .playmateMiddleMemberView {}

    .playmateMiddleMemberTag {
        border-radius: 10rpx;
        padding: 4rpx 8rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 18rpx;
        color: #FFFFFF;
        line-height: 24rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .playmateMiddleAvatarView {
        display: flex;
        /* flex-wrap: wrap; */
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 10rpx;
    }

    .memberAvatarView {
        width: 90%;
        display: flex;
        flex-direction: row;
        align-items: center;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .memberAvatarItemView {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .memberListView {
        width: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 20rpx;
        color: #858585;
        line-height: 24rpx;
    }

    .playmateMiddleCreateAvatarImg {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 18rpx;
    }

    .playmateMiddleAvatarImg {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 18rpx;
    }

    .memberAddView {
        width: 60rpx;
        height: 60rpx;
        background-color: #8CE8ED;
        border-radius: 50%;
        margin-right: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .playmateAddBottomView {
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
        margin-bottom: 100rpx;
    }

    .playmateAddBottomMenuView {
        display: flex;
        flex-direction: row;
    }

    .playmateBottomMenuTextView {
        margin-right: 62rpx;
        position: relative;
    }

    .playmateBottomMenuText {
        z-index: 2;
    }

    .playmateBottomMenuTextBottomLineView {
        height: 10rpx;
        background: #CCFA10;
        border-radius: 4rpx;
        margin-top: -13rpx;
        z-index: 1;
    }

    .playmateDetailCommentView {
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

    .playmateDetailCommentBtnView {
        width: 80%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background: #F3F3F1;
        border-radius: 40rpx;
        margin-left: 27rpx;
        padding: 16rpx 31rpx;
    }

    .playmateDetailCommentBtnText {
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

    .playmateDetailCommentBtnImg {
        width: 33rpx;
        height: 29rpx;
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
        width: 33rpx;
        height: 29rpx;
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

    .cardDetailCommentContentView {
        display: flex;
        flex-direction: column;
        margin-top: 31rpx;
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

    .cardUserAvatarView {
        width: 79rpx;
        height: 79rpx;
        position: relative;
    }

    .itemLoginAvatar {
        width: 100%;
        height: 100%;
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

    .playmateButtonView {
        width: 88%;
        position: fixed;
        bottom: 50rpx;
    }

    .playmateButton {
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .memberPopupView {
        width: 600rpx;
        max-height: 840rpx;
        background-color: #FFFFFF;
        overflow-y: auto;
        border-radius: 20rpx;
    }

    .memberTitleView {
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .memberTitleTextView {
        font-size: 36rpx;
        color: #000000;
    }

    .memberTableView {
        padding: 0 50rpx 50rpx 50rpx;
    }

    .tableAvatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
    }
</style>