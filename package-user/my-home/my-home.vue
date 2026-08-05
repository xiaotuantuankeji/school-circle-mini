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

        <view class="topBackgroundView">
            <image class="topBackgroundImg" :src="showBackground"></image>
        </view>

                <my-home-skeleton v-if="isFirstLoading" :count="3" />

                <template v-else>
                <view class="topUserInfoView">
                    <view class="userInfoView">
                        <view class="userInfoAvatarView">
                            <image class="userInfoAvatarImg" src="/static/img/logo/default-avatar.png" v-if="showAvatar==''">
                            </image>
                            <image class="userInfoAvatarImg" :src="showAvatar" v-else></image>
                            <image class="avatarImgIcon" :src="`/static/img/my/${showIdentityIconUrl}.png`"
                                v-if="showIdentityIconUrl!=''"></image>
                        </view>
                        <view class="userInfoDetailView">
                            <view class="userInfoNumIdView" v-if="lookStudentId==loginStudentId">ID: {{showNumId}}</view>
                            <view class="userInfoNameAndSexView">
                                <view class="userInfoNameAndSexLeftView">
                                    <view class="userInfoNameView">{{showNikeName}}</view>
                                    <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="showSex=='1'"></image>
                                    <image class="userInfoSexImg" src="/static/img/other/woman.png" v-if="showSex=='2'"></image>
                                    <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                        v-if="showStatus=='2'&&showStudentSort!='3'&&showStudentSort!='4'">
                                    </image>
                                </view>
                                <view class="userInfoFollowView" @click="followClick">
                                    <view class="userInfoFollowText">关注</view>
                                    <view class="userInfoFollowNum">{{showFollowUserNumber}}</view>
                                </view>
                            </view>
                            <view class="userInfoSchoolAndButtomView">
                                <view class="userInfoSchoolView">{{showSchoolName}}</view>
                                <view class="userInfoButtomView" @click="openMyInfoPage">
                                    <view class="userInfoButtomText" v-if="lookStudentId==loginStudentId">设置个人信息</view>
                                    <view class="userInfoButtomText" v-else>查看完整资料</view>
                                    <uni-icons type="right" color="#FFFFFF"></uni-icons>
                                </view>
                            </view>
                            <view class="myIdentityRemarkView" v-if="showIdentityIconText != ''">
                                <image class="myIdentityRemarkImg" src="/static/img/my/white-v.png"></image>
                                <view class="myIdentityRemarkText">{{showIdentityIconText}}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="bottomCardInfoView" :style="{height: (winHeight - 230 + 10) + 'px',top: (230 - 10) + 'px'}">
                    <view class="bottomCardInfoInsideView">

                        <view class="bottomCardTitleView">
                            <view class="cardTitleTextView">
                                <view class="cardTitleText" v-if="lookStudentId==loginStudentId">我的动态</view>
                                <view class="cardTitleText" v-else>TA的动态</view>
                                <view class="cardTitleTextBottomLineView"></view>
                            </view>
                            <picker @change="settingChange" :value="settingIndex" :range="settingArray"
                                v-if="lookStudentId==loginStudentId">
                                <view class="userCardSettingBtnView">
                                    <image class="userCardSettingBtnImg" src="/static/img/other/setting.png"></image>
                                    <view class="userCardSettingBtnText">权限设置</view>
                                </view>
                            </picker>

                        </view>
                        <view class="userSettingDescribeView" v-if="lookStudentId==loginStudentId && cardVisibleRange==3">
                            <view class="userSettingDescribeLine"></view>
                            <view class="userSettingDescribeText">以下内容对其他用户不可见</view>
                            <view class="userSettingDescribeLine"></view>
                        </view>
                        <view class="bottomSendCrad">
                            <card-item :cardList="cardList" :loginStudentSort="showStudentSort" :isOpenUpload="is_open_upload"
                                @callBackCard="callBackCard" @shareCallBack="shareCallBack"></card-item>
                        </view>
                    </view>

                    <view class="bottomButtonView" v-if="lookStudentId!=loginStudentId">
                        <button class="bottomButtonLeftView" @click="saveStudentFollow('2')" v-if="isFollow">取消关注</button>
                        <button class="bottomButtonLeftView" @click="saveStudentFollow('1')" v-else>关注</button>
                        <button class="bottomButtonRightView" @click="saveGroupList">私信</button>
                    </view>
                </view>
                </template>

    </view>
</template>

<script>
    import cardItem from '../../components/card-item/card-item.vue'
    import myHomeSkeleton from '../../components/skeleton/my-home-skeleton.vue'
    import verifySchool from '../../libs/verify_school'
    export default {
        components: {
            cardItem,
            myHomeSkeleton
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                is_open_upload: '0', // 0：关闭，1：打开

                loginStudentId: '',
                loginNikeNameId: '',
                loginSchoolId: '',
                loginSchoolName: '',
                loginNikeName: '',
                loginAvatar: '',
                loginNumId: '',
                loginSex: '0',
                loginStatus: '',
                loginStudentSort: '',
                cardVisibleRange: '', //帖子可见范围，0：全部、1：一个月、2：半年、3：不可见

                lookStudentId: '',
                lookNikeNameId: '',

                showStudentId: '',
                showBackground: '',
                showNikeName: '',
                showAvatar: '',
                showNumId: '',
                showSex: '0',
                showStatus: '',
                showSchoolName: '',
                showIdentityIconUrl: '',
                showIdentityIconText: '',
                showFollowUserNumber: 0,
                showStudentSort: '',

                myBackground: '',
                shareCardId: 0,
                shareImgUrl: '',

                cardList: [],

                settingIndex: 0,
                settingArray: ['全部', '一个月', '半年', '不可见'],

                isFollow: false,

                isFirstLoading: true,
            }
        },
        onLoad(opt) {
            let lookStudentId = opt.lookStudentId
            if (lookStudentId == undefined) {
                lookStudentId = ''
            }
            this.lookStudentId = lookStudentId
            // this.lookStudentId = '28'

            let lookNikeNameId = opt.lookNikeNameId
            if (lookNikeNameId == undefined) {
                lookNikeNameId = ''
            }
            this.lookNikeNameId = lookNikeNameId

            this.getSystemInfo()
        },
        onShow() {
            this.getLoginInfo()
            this.getList()
            this.getStudentFollow()
            this.getFollowUserNumber()
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
                this.loginNikeNameId = userInfo.nikeNameId
                this.loginSchoolId = userInfo.schoolId
                this.loginSchoolName = userInfo.schoolName
                this.loginNikeName = userInfo.nikeName
                this.loginAvatar = userInfo.avatar
                this.loginNumId = userInfo.numId
                this.loginSex = userInfo.sex
                this.loginStatus = userInfo.status
                this.loginStudentSort = userInfo.sort
                let myBackground = ''
                if (userInfo.backgroundImage == undefined || userInfo.backgroundImage == '') {
                    myBackground = '/static/img/other/my-background.jpg'
                } else {
                    myBackground = userInfo.backgroundImage
                }
                this.myBackground = myBackground
                this.cardVisibleRange = userInfo.cardVisibleRange
                this.settingIndex = userInfo.cardVisibleRange

                if (this.lookStudentId == '' || this.loginStudentId == this.lookStudentId) {
                    this.showStudentId = this.loginStudentId
                    this.showBackground = myBackground
                    this.showNikeName = userInfo.showNikeName
                    this.showAvatar = this.loginAvatar
                    this.showNumId = this.loginNumId
                    this.showSex = this.loginSex
                    this.showStatus = this.loginStatus
                    this.showStudentSort = this.loginStudentSort
                    this.showSchoolName = this.loginSchoolName
                    const identityInfoRespVOList = userInfo.identityInfoRespVOList
                    if (identityInfoRespVOList && identityInfoRespVOList.length > 0) {
                        if (identityInfoRespVOList[0].examineStatus == '2') {
                            this.showIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                            this.showIdentityIconText = identityInfoRespVOList[0].remark
                        } else {
                            this.showIdentityIconUrl = ''
                            this.showIdentityIconText = ''
                        }
                    } else {
                        this.showIdentityIconUrl = ''
                        this.showIdentityIconText = ''
                    }
                    this.isFirstLoading = false
                } else {
                    this.getStudentInfo()
                }
            },
            getStudentInfo() {
                const param = 'id=' + parseInt(this.lookStudentId) + '&nikeNameId=' + this.lookNikeNameId
                this.$api.getStudentInfo(param).then(res => {
                    // console.log('getStudentInfo succes res:' + JSON.stringify(res))

                    const userData = res.data
                    let myBackground = ''
                    if (userData.backgroundImage == undefined || userData.backgroundImage == '') {
                        myBackground = '/static/img/other/my-background.jpg'
                    } else {
                        myBackground = userData.backgroundImage
                    }
                    this.showStudentId = userData.studentId
                    this.showBackground = myBackground
                    this.showNikeName = userData.showNikeName
                    this.showAvatar = userData.avatar
                    this.showNumId = userData.numId
                    this.showSex = userData.sex
                    this.showStatus = userData.status
                    this.showStudentSort = userData.sort
                    this.showSchoolName = userData.schoolName
                    const identityInfoRespVOList = userData.identityInfoRespVOList
                    if (identityInfoRespVOList && identityInfoRespVOList.length > 0) {
                        if (identityInfoRespVOList[0].examineStatus == '2') {
                            this.showIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                            this.showIdentityIconText = identityInfoRespVOList[0].remark
                        } else {
                            this.showIdentityIconUrl = ''
                            this.showIdentityIconText = ''
                        }
                    } else {
                        this.loginIdentityIconUrl = ''
                        this.loginIdentityIconText = ''
                    }
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
            followClick() {
                let nikeNameId = ''
                if (this.lookStudentId == this.loginStudentId) {
                    nikeNameId = this.loginNikeNameId
                } else {
                    nikeNameId = this.lookNikeNameId
                }
                uni.navigateTo({
                    url: '/package-user/my-follow/my-follow?lookNikeNameId=' + nikeNameId
                })
            },
            openMyInfoPage() {
                if (this.lookStudentId == this.loginStudentId) {
                    uni.navigateTo({
                        url: '/package-user/my-update/my-update'
                    })
                } else {
                    uni.navigateTo({
                        url: '/package-user/my-info/my-info?lookStudentId=' + this.lookStudentId +
                            '&lookNikeNameId=' +
                            this.lookNikeNameId
                    })
                }
            },
            getList() {
                if (this.cardVisibleRange != '3') {
                    let searchStudentId = ''
                    let searchNikeNameId = ''
                    if (this.loginStudentId == this.lookStudentId) {
                        searchStudentId = this.loginStudentId
                    } else {
                        searchStudentId = this.lookStudentId
                        searchNikeNameId = this.lookNikeNameId
                    }
                    const param = 'schoolId=&searchContent=&searchSectionId=&studentId=' + this.loginStudentId +
                        '&lookStudentId=' + searchStudentId + '&lookNikeNameId=' + searchNikeNameId +
                        '&pageNo=1&pageSize=-1&isRange=' + this.cardVisibleRange + '&menuSort='
                    this.$api.getSendCardList(param).then(res => {
                        // console.log('getSendCardList succes res:' + JSON.stringify(res))

                        this.cardList = res.data || []
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
                } else {
                    this.isFirstLoading = false
                }
            },
            getStudentFollow() {
                const param = 'followerId=' + this.loginNikeNameId + '&followingId=' + this.lookNikeNameId
                this.$api.isFollowingUser(param).then(res => {
                    // console.log('isFollowingUser succes res:' + JSON.stringify(res))

                    this.isFollow = res.data
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            getFollowUserNumber() {
                let searchNikeNameId = ''
                if (this.loginStudentId == this.lookStudentId) {
                    searchNikeNameId = this.loginNikeNameId
                } else {
                    searchNikeNameId = this.lookNikeNameId
                }
                const param = 'studentId=' + searchNikeNameId
                this.$api.getFollowUserNumber(param).then(res => {
                    // console.log('isFollowingUser succes res:' + JSON.stringify(res))

                    this.showFollowUserNumber = res.data
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
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
            async saveStudentFollow(sign) {
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
                    followingId: this.lookNikeNameId,
                    followingNickName: this.showNikeName,
                    actionType: sign
                }
                this.$api.followUser(param).then(res => {
                    // console.log('followUser succes res:' + JSON.stringify(res))

                    if (sign == '1') {
                        this.isFollow = true
                    } else if (sign == '2') {
                        this.isFollow = false
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
            async saveGroupList() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                if (!this.verifyStatus()) {
                    return;
                }

                uni.showLoading({
                    title: '请稍后...',
                    mask: true
                })

                const param = 'sendStudentId=' + this.loginStudentId + '&sendNikeNameId=' + this.loginNikeNameId +
                    '&toStudentId=' + this.lookStudentId + '&toNikeNameId=' + this.lookNikeNameId
                this.$api.saveGroupList(param).then(res => {
                    // console.log('saveGroupList succes res:' + JSON.stringify(res))

                    const groupId = res.data
                    uni.navigateTo({
                        url: '/package-content/group-content/group-content?groupId=' + groupId +
                            '&sign=chat' +
                            '&nikeName=' + this.showNikeName
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
            callBackCard() {
                console.log('====callBackCard=====')
                this.getList()
            },
            shareCallBack(shareCardId, shareImgUrl) {
                console.log('====shareCallBack=====')
                this.shareCardId = shareCardId
                this.shareImgUrl = shareImgUrl
            },
            async settingChange(e) {
                // console.log('picker发送选择改变，携带值为', e.detail.value)
                this.settingIndex = e.detail.value

                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&cardVisibleRange=' + this.settingIndex
                this.$api.saveCardLookPurview(param).then(res => {
                    // console.log('saveCardLookPurview succes res:' + JSON.stringify(res))

                    this.cardVisibleRange = this.settingIndex

                    const userInfo = this.$storage.user.get()
                    userInfo.cardVisibleRange = this.cardVisibleRange
                    uni.setStorageSync("userInfo", userInfo)

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
            onShareAppMessage(res) {
                console.log('============分享好友===============')
                if (res.from === 'button') { // 来自页面内分享按钮
                    // 来自页面内转发按钮
                    console.log('来自页面内转发按钮')
                    // this.$refs.sharePopup.close()
                }

                // 最大14个字
                const title = "学长学姐强推！新生必备！"
                let imageUrl = '/static/img/other/share_image.jpg'
                if (this.shareImgUrl != '') {
                    imageUrl = this.shareImgUrl
                }

                return {
                    title: title,
                    path: '/pages/carddetail/carddetail?cardId=' + this.shareCardId,
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
        }
    }
</script>

<style>
    .content {
        background: #F3F3F1;
    }

    .topBackgroundView {
        height: 230px;
    }

    .topBackgroundImg {
        width: 100%;
        height: 100%;
    }

    .topUserInfoView {
        width: 100%;
        height: 230px;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
    }

    .userInfoView {
        display: flex;
        flex-direction: row;
        margin-top: 185rpx;
        padding: 30rpx 46rpx;
    }

    .userInfoAvatarView {
        width: 146rpx;
        height: 146rpx;
        position: relative;
    }

    .userInfoAvatarImg {
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

    .userInfoDetailView {
        width: 75%;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .userInfoNumIdView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #d9e6e3;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .userInfoNameAndSexView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .userInfoNameAndSexLeftView {
        display: flex;
        flex-direction: row;
    }

    .userInfoNameView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 33rpx;
        color: #F3F3F1;
        line-height: 46rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .userInfoSexImg {
        width: 32rpx;
        height: 32rpx;
        margin-left: 10rpx;
    }

    .userInfoAuthImg {
        width: 77rpx;
        height: 42rpx;
        margin-left: 10rpx;
    }

    .userInfoFollowView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .userInfoFollowText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #F3F3F1;
        line-height: 46rpx;
    }

    .userInfoFollowNum {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #F3F3F1;
        line-height: 46rpx;
        margin-left: 4rpx;
    }

    .userInfoSchoolAndButtomView {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
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
        color: #FFFFFF;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .userInfoSchoolView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #F3F3F1;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .userInfoButtomView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .userInfoButtomText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #FFFFFF;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .bottomCardInfoView {
        width: 100%;
        background: #F3F3F1;
        border-radius: 30rpx 30rpx 0 0;
        position: fixed;
        z-index: 2;
        overflow-y: auto;
    }

    .bottomCardInfoInsideView {
        padding: 40rpx 40rpx 160rpx 40rpx;
    }

    .bottomCardTitleView {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .cardTitleTextView {
        position: relative;
    }

    .cardTitleText {
        z-index: 2;
    }

    .cardTitleTextBottomLineView {
        height: 10rpx;
        background: #CCFA10;
        border-radius: 4rpx;
        margin-top: -13rpx;
        z-index: 1;
    }

    .userCardSettingBtnView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .userCardSettingBtnImg {
        width: 22rpx;
        height: 23rpx;
    }

    .userCardSettingBtnText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-left: 10rpx;
    }

    .userSettingDescribeView {
        height: 150rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .userSettingDescribeLine {
        width: 38rpx;
        border: 2rpx solid #858585;
    }

    .userSettingDescribeText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-left: 20rpx;
        margin-right: 20rpx;
    }

    .bottomButtonView {
        width: 100%;
        bottom: 30px;
        position: fixed;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .bottomButtonLeftView {
        width: 40%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .bottomButtonRightView {
        width: 40%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 40rpx;
        border: 2rpx solid #858585;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #858585;
        font-style: normal;
        text-transform: none;
    }
</style>