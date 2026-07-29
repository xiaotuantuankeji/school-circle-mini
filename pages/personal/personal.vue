<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">

            <view class="myInfoView" @click="openMyHomePage" v-if="!isFirstLoading">
                <view class="myInfoAvatarView">
                    <image class="myInfoAvatarImg" src="/static/img/logo/default-avatar.png" v-if="loginAvatar==''">
                    </image>
                    <image class="myInfoAvatarImg" :src="loginAvatar" v-else></image>
                    <image class="avatarImgIcon" :src="`/static/img/my/${loginIdentityIconUrl}.png`"
                        v-if="loginIdentityIconUrl!=''"></image>
                </view>
                <view class="myDetailInfoView">
                    <view class="myNikeNameView">
                        <view>{{loginShowNikeName}}</view>
                        <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="loginSex=='1'">
                        </image>
                        <image class="userInfoSexImg" src="/static/img/other/woman.png" v-if="loginSex=='2'"></image>
                        <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                            v-if="loginStatus=='2'&&loginStudentSort!='3'&&loginStudentSort!='4'">
                        </image>
                    </view>
                    <view class="mySchoolView">
                        <view class="mySchoolNameView">{{loginSchoolName}}</view>
                    </view>
                    <view class="myIdentityRemarkView" v-if="loginIdentityIconText != ''">
                        <image class="myIdentityRemarkImg" src="/static/img/my/white-v.png"></image>
                        <view class="myIdentityRemarkText">{{loginIdentityIconText}}</view>
                    </view>
                </view>
            </view>
            <view class="myCountInfoView" v-if="!isFirstLoading">
                <view class="myCountNumItemInfoView" @click="openMyHomePage">
                    <view class="itemNumView">{{cardCount}}</view>
                    <view class="itemTextView">帖子</view>
                </view>
                <view class="itemDividerView"></view>
                <view class="myCountNumItemInfoView" @click="onClick('1')">
                    <view class="itemNumView">{{commentCount}}</view>
                    <view class="itemTextView">评论</view>
                </view>
                <view class="itemDividerView"></view>
                <view class="myCountNumItemInfoView" @click="onClick('2')">
                    <view class="itemNumView">{{collectCount}}</view>
                    <view class="itemTextView">收藏</view>
                </view>
                <view class="itemDividerView"></view>
                <view class="myCountNumItemInfoView" @click="onClick('3')">
                    <view class="itemNumView">{{likeCount}}</view>
                    <view class="itemTextView">点赞</view>
                </view>
            </view>
            <personal-skeleton v-if="isFirstLoading" />
            <view class="myListView" v-if="!isFirstLoading">
                <view class="myListItemView">
                    <navigator class="contactBtn" url="/package-course/timetable/index">
                        <view class="myListItemText">我的课表</view>
                        <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                    </navigator>
                </view>
            </view>
            <view class="myListView" v-if="!isFirstLoading">
                <view class="myListItemView listBottomLine">
                    <navigator class="contactBtn" url="/package-user/my-about/my-about">
                        <view class="myListItemText">关于我们</view>
                        <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                    </navigator>
                </view>
                <view class="myListItemView listBottomLine">
                    <navigator class="contactBtn" url="/package-agreement/community-norms/community-norms">
                        <view class="myListItemText">社区规范</view>
                        <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                    </navigator>
                </view>
                <view class="myListItemView listBottomLine" @click="shareFriendClick">
                    <view class="myListItemText">邀请校友</view>
                    <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                </view>
                <view class="myListItemView">
                    <button class="contactBtn" open-type="contact">
                        <view class="myListItemText">联系我们</view>
                        <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                    </button>
                </view>
            </view>
            <!-- <view class="myListView">
                <uni-list>
                    <uni-list-item showArrow title="封禁申诉" />
                </uni-list>
            </view> -->
            <view class="myListView">
                <uni-list>
                    <uni-list-item showArrow title="隐私保护协议" link="navigateTo"
                        to="/package-agreement/privacy-agreement/privacy-agreement" />
                </uni-list>
            </view>

        </view>

        <uni-popup ref="sharePopupRef">
            <view class="sharePopupView" :style="{width: shareWidth + 'px'}">
                <image class="sharePopupImg" src="/static/img/other/share_friend.jpg"></image>
                <button class="sharePopupBtn" open-type="share">马上邀请好友</button>
            </view>
        </uni-popup>

    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    import personalSkeleton from '../../components/skeleton/personal-skeleton.vue'
    import verifySchool from '../../libs/verify_school'
    export default {
        components: {
            topBackground,
            personalSkeleton
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                shareWidth: 0,

                loginStudentId: '',
                loginSchoolId: '',
                loginSchoolName: '',
                loginNikeName: '',
                loginAvatar: '',
                loginShowNikeName: '',
                loginIdentityIconUrl: '',
                loginIdentityIconText: '',
                loginSex: '',
                loginStatus: '',
                loginStudentSort: '',

                cardCount: 0,
                commentCount: 0,
                collectCount: 0,
                likeCount: 0,

                isFirstLoading: true,
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
        },
        onShow() {
            this.getLoginInfo()
            this.getMyMessageCount()
        },
        methods: {
            // 获取设备信息
            getSystemInfo() {
                const that = this
                uni.getSystemInfo({
                    success: function(res) {
                        that.winWidth = res.windowWidth
                        that.winHeight = res.windowHeight
                        that.shareWidth = res.windowWidth - 44
                    }
                });
            },
            // 获取当前登录用户信息
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
                this.loginSchoolId = userInfo.schoolId
                this.loginSchoolName = userInfo.schoolName
                this.loginNikeName = userInfo.nikeName
                this.loginAvatar = userInfo.avatar
                this.loginShowNikeName = userInfo.showNikeName
                this.loginSex = userInfo.sex
                this.loginStudentSort = userInfo.sort
                this.loginStatus = userInfo.status
                const identityInfoRespVOList = userInfo.identityInfoRespVOList
                if (identityInfoRespVOList.length > 0) {
                    if (identityInfoRespVOList[0].examineStatus == '2') {
                        this.loginIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                        this.loginIdentityIconText = identityInfoRespVOList[0].remark
                    } else {
                        this.loginIdentityIconUrl = ''
                        this.loginIdentityIconText = ''
                    }
                } else {
                    this.loginIdentityIconUrl = ''
                    this.loginIdentityIconText = ''
                }
            },
            getMyMessageCount() {
                const param = 'loginStudentId=' + this.loginStudentId;
                this.$api.getMyMessageCount(param).then(res => {
                    // console.log('getMyMessageCount succes res:' + JSON.stringify(res))
                    const data = res.data
                    this.cardCount = data.cardCount
                    this.commentCount = data.commentCount
                    this.collectCount = data.collectCount
                    this.likeCount = data.likeCount
                    this.isFirstLoading = false
                }).catch(res => {
                    // 失败进行的操作
                    this.isFirstLoading = false
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                })
            },
            onClick(sort) {
                if (sort == '1' || sort == '2' || sort == '3') {
                    uni.navigateTo({
                        url: '/package-user/my-message/my-message?sort=' + sort
                    })
                }
            },
            async shareFriendClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                this.$refs.sharePopupRef.open()
            },
            openMyHomePage() {
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + this.loginStudentId
                })
            },
            onShareAppMessage(res) {
                if (res.from === 'button') { // 来自页面内分享按钮
                    // 来自页面内转发按钮
                    // this.$refs.sharePopup.close()
                }

                // 最大14个字
                const title = "学长学姐强推！新生必备！"
                return {
                    title: title,
                    path: '/pages/index/index',
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

    .myInfoView {
        display: flex;
        flex-direction: row;
        margin-top: 20rpx;
    }

    .myInfoAvatarView {
        width: 146rpx;
        height: 146rpx;
        position: relative;
    }

    .myInfoAvatarImg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .avatarImgIcon {
        width: 50rpx;
        height: 50rpx;
        position: absolute;
        bottom: 0;
        left: 100rpx;
    }

    .myDetailInfoView {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin-left: 10rpx;
    }

    .myNikeNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 33rpx;
        color: #000000;
        line-height: 46rpx;
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

    .mySchoolView {
        margin-top: 5rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .mySchoolNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .myIdentityRemarkView {
        margin-top: 5rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .myIdentityRemarkImg {
        width: 24rpx;
        height: 28rpx;
    }

    .myIdentityRemarkText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 24rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .myCountInfoView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx;
        margin-top: 10rpx;
    }

    .myCountNumItemInfoView {
        display: flex;
        flex-direction: column;
    }

    .itemNumView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .itemTextView {
        font-family: HarmonyOS_Sans_SC, HarmonyOS_Sans_SC;
        font-weight: normal;
        font-size: 21rpx;
        color: #000000;
        line-height: 29rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .itemDividerView {
        height: 30rpx;
        border: 2rpx solid #858585;
        opacity: 0.5;
    }

    .myListView {
        margin-top: 40rpx;
        border-radius: 20rpx;
        background-color: #FFFFFF;
    }

    .myListItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx;
    }

    .listBottomLine {
        border-bottom: 2rpx solid #F3F3F1;
    }

    .myListItemText {
        font-size: 14px;
        color: #3b4144;
    }

    .uni-list {
        border-radius: 19rpx;
        /* 这里的数值可以根据你的设计需求调整 */
        overflow: hidden;
        /* 确保子元素超出部分不显示 */
    }

    .sharePopupView {
        height: 540rpx;
        position: relative;
    }

    .sharePopupImg {
        width: 100%;
        height: 100%;
    }

    .sharePopupBtn {
        position: absolute;
        z-index: 2;
        top: 440rpx;
        right: 56rpx;
        padding: 20rpx 40rpx;

        background: #000000;
        border-radius: 40rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 25rpx;
        color: #8CE8ED;
        line-height: 35rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .contactBtn {
        /* all: unset; */
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        margin: 0;
        padding: 0;
        border: none;
        background: none;
        line-height: 1;
        font-size: inherit;
        color: inherit;
        border-radius: 0;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        -webkit-appearance: none;
    }

    .contactBtn::after {
        display: none;
    }


    .slot-box {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        align-items: center;
    }

    .slot-text {
        flex: 1;
        font-size: 14px;
        color: #4cd964;
        margin-right: 10px;
    }
</style>