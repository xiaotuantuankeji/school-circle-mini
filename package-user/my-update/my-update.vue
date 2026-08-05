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
            <view class="topUserAvatarView">
                <!-- #ifndef H5 -->
                <button class="avatarBtn" open-type="chooseAvatar" @chooseavatar="avatarClick">
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <button class="avatarBtn" @click="chooseAvatarH5">
                <!-- #endif -->
                    <view class="avatarImgIconView">
                        <image class="topUserAvatarImg" src="/static/img/logo/default-avatar.png"
                            v-if="loginAvatar==''">
                        </image>
                        <image class="topUserAvatarImg" :src="loginAvatar" v-else></image>
                        <image class="avatarImgIcon" :src="`/static/img/my/${loginIdentityIconUrl}.png`"
                            v-if="loginIdentityIconUrl!=''"></image>
                    </view>
                </button>
                <view class="switchNikeNameView" @click="switchNikeName"
                    v-if="loginStudentSort!='3'&&loginStudentSort!='4'">
                    <image class="switchNikeNameImg" src="/static/img/my/switch.png"></image>
                    <view class="switchNikeNameText">切换昵称</view>
                </view>
            </view>

            <view class="basicInfoView" v-if="loginStudentSort!='3'&&loginStudentSort!='4'">
                <uni-list>
                    <uni-list-item showArrow title="昵称" :rightText="loginShowNikeName" link="navigateTo"
                        to="/package-user/my-nike/my-nike"></uni-list-item>
                    <uni-list-item showArrow title="主页背景" :rightText="myBackground==''?'未设置':'已设置'" clickable
                        @click="openBackgroundClick"></uni-list-item>
                    <uni-list-item showArrow title="学校" :rightText="loginSchoolName"></uni-list-item>
                    <uni-list-item showArrow title="手机号" :rightText="loginMobilePhone==''?'未绑定':'已绑定'" clickable
                        @click="openPhoneClick"></uni-list-item>
                    <uni-list-item showArrow title="数字ID" :rightText="loginNumId"></uni-list-item>
                    <uni-list-item showArrow title="校园认证" :rightText="loginStatusText" link="navigateTo"
                        to="/package-verify/school-verify/school-verify" v-if="loginStudentSort!='2'"></uni-list-item>
                    <uni-list-item showArrow title="身份认证" :rightText="loginIdentityText" link="navigateTo"
                        to="/package-verify/Identity-verify/Identity-verify"
                        v-if="loginStatus=='2'&&loginStudentSort!='2'"></uni-list-item>
                </uni-list>
            </view>
            <view class="basicInfoView" v-if="loginStudentSort!='3'&&loginStudentSort!='4'">
                <uni-list>
                    <uni-list-item showArrow title="修改个人资料" clickable @click="toUserPage"></uni-list-item>
                    <uni-list-item showArrow title="展示个人信息" note="开启后你的头像卡片中将展示年龄和家乡信息" :show-switch="true"
                        :switchChecked="userSwitchCheck" @switchChange="userSwitchChange"></uni-list-item>
                    <!-- <uni-list-item showArrow title="个人主页展示 ID" note="关闭后，个人主页将隐藏ID" :show-switch="true"
                        :switchChecked="numIdSwitchCheck" @switchChange="numIdSwitchChange"></uni-list-item> -->
                </uni-list>
            </view>
            <view class="basicInfoView" v-if="loginStudentSort!='3'&&loginStudentSort!='4'">
                <uni-list>
                    <!-- <uni-list-item showArrow title="切换昵称" link="navigateTo"
                        to="/pages/switch-nike/switch-nike"></uni-list-item> -->
                    <uni-list-item showArrow title="切换账号" link="navigateTo"
                        to="/package-account/switch-accounts/switch-accounts"
                        v-if="loginStudentSort!='0'"></uni-list-item>
                </uni-list>
            </view>
            <view class="basicInfoView" v-if="loginStudentSort!='3'&&loginStudentSort!='4'">
                <view class="deleteAccountTextView" @click.native.stop="deleteAccountClick">注 销</view>
            </view>

            <view class="basicInfoView" v-if="loginStudentSort=='3'||loginStudentSort=='4'">
                <uni-list>
                    <uni-list-item showArrow title="昵称" :rightText="loginShowNikeName"></uni-list-item>
                    <uni-list-item showArrow title="机构名称" :rightText="loginSchoolName"></uni-list-item>
                    <uni-list-item showArrow title="数字ID" :rightText="loginNumId"></uni-list-item>
                    <uni-list-item showArrow title="修改个人资料" clickable @click="toUserPage"></uni-list-item>
                    <uni-list-item showArrow title="修改密码" clickable @click="openUpdatePass"></uni-list-item>
                </uni-list>
            </view>
            <view class="quitLoginButtonView" v-if="loginStudentSort=='3'||loginStudentSort=='4'">
                <button class="quitLoginButton" @click="quitLogin">退 出</button>
            </view>
        </view>

        <uni-popup ref="passPopupRef">
            <view class="popupView">
                <view class="popupTitleView">
                    <view class="popupTitleText">修改密码</view>
                </view>
                <view class="popupContentView">
                    <view class="popupContentInsideView">
                        <view>
                            <uni-easyinput type="password" v-model="newPass" placeholder="请输入密码"
                                maxlength="30"></uni-easyinput>
                        </view>
                        <view style="margin-top: 20rpx;">
                            <uni-easyinput type="password" v-model="confirmPass" placeholder="请输入确认密码"
                                maxlength="30"></uni-easyinput>
                        </view>
                    </view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="updatePass">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
                </view>
            </view>
        </uni-popup>

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
                loginStudentSort: '0', //学生分类（0:未设置，1:内部管理，2:内部小号）
                loginSchoolId: '',
                loginSchoolName: '',
                loginNikeName: '',
                loginAvatar: '',
                loginNumId: '',
                loginMobilePhone: '',
                myBackground: '',
                loginShowNikeName: '',
                loginStatus: '',
                loginStatusText: '',
                loginIdentityText: '',
                loginIdentityIconUrl: '',

                userSwitchCheck: false,
                numIdSwitchCheck: true,

                myAvatar: '',

                newPass: '',
                confirmPass: '',
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
        },
        onShow() {
            this.getLoginInfo()
        },
        methods: {
            // 获取设备信息
            getSystemInfo() {
                const that = this
                const winInfo = uni.getWindowInfo()
                // console.log('winInfo:' + JSON.stringify(winInfo))
                that.winWidth = winInfo.windowWidth
                that.winHeight = winInfo.windowHeight
            },
            // 获取当前登录用户信息
            getLoginInfo() {
                const _this = this
                const userInfo = _this.$storage.user.get();
                _this.loginStudentId = userInfo.studentId
                new Promise(function(resolve, reject) {
                    _this.$wechatAuth.getUserDetail(_this.loginStudentId,
                        resolve)
                }).then(function(msg) {
                    if (msg == 'ok') {
                        const userInfo = _this.$storage.user.get();
                        _this.loginStudentId = userInfo.studentId
                        _this.loginStudentSort = userInfo.sort
                        _this.loginSchoolId = userInfo.schoolId
                        _this.loginSchoolName = userInfo.schoolName
                        _this.loginNikeName = userInfo.nikeName
                        _this.loginAvatar = userInfo.avatar
                        _this.loginNumId = userInfo.numId
                        _this.loginMobilePhone = userInfo.mobilePhone
                        let myBackground = ''
                        if (userInfo.backgroundImage == undefined || userInfo.backgroundImage == '') {
                            myBackground = ''
                        } else {
                            myBackground = userInfo.backgroundImage
                        }
                        _this.myBackground = myBackground

                        const isShowInfo = userInfo.isShowInfo
                        if (isShowInfo == '0') {
                            _this.userSwitchCheck = true
                        } else if (isShowInfo == '1') {
                            _this.userSwitchCheck = false
                        }

                        const isShowNumId = userInfo.isShowNumId
                        if (isShowNumId == '0') {
                            _this.numIdSwitchCheck = true
                        } else if (isShowNumId == '1') {
                            _this.numIdSwitchCheck = false
                        }

                        _this.loginShowNikeName = userInfo.showNikeName
                        const status = userInfo.status
                        if (status == '1') {
                            _this.loginStatusText = '未认证'
                        }
                        if (status == '2') {
                            _this.loginStatusText = '已认证'
                        }
                        if (status == '3') {
                            _this.loginStatusText = '审核中'
                        }
                        _this.loginStatus = status

                        const identityInfoRespVOList = userInfo.identityInfoRespVOList
                        if (!identityInfoRespVOList || identityInfoRespVOList.length == 0) {
                            _this.loginIdentityText = '未认证'
                            _this.loginIdentityIconUrl = ''
                        } else {
                            const examineStatus = identityInfoRespVOList[0].examineStatus
                            if (examineStatus == '1') {
                                _this.loginIdentityText = '审核中'
                            }
                            if (examineStatus == '2') {
                                _this.loginIdentityText = identityInfoRespVOList[0].remark
                                _this.loginIdentityIconUrl = identityInfoRespVOList[0].identityIconName
                            }
                            if (examineStatus == '3') {
                                _this.loginIdentityText = '已驳回'
                            }
                        }
                    }
                })
            },
            async avatarClick(e) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                // console.log("选择头像:" + e.detail.avatarUrl)
                const avatarUrl = e.detail.avatarUrl
                this.uploadAvatar(avatarUrl)
            },
            // #ifdef H5
            async chooseAvatarH5() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                    success: (res) => {
                        this.uploadAvatar(res.tempFilePaths[0])
                    },
                    fail: () => {
                        uni.showToast({
                            icon: 'error',
                            title: '选择头像失败',
                            mask: true
                        })
                    }
                })
            },
            // #endif
            uploadAvatar(avatarUrl) {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const that = this
                const imagePromise = new Promise((resolve, reject) => {
                    uni.uploadFile({
                        url: this.$configData.file_url_server,
                        filePath: avatarUrl,
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
                                that.myAvatar = url
                            }
                        }

                        const param = 'loginStudentId=' + that.loginStudentId + '&avatarUrl=' + that.myAvatar
                        that.$api.saveMyAvatar(param).then(res => {
                            // console.log('saveMyAvatar succes res:' + JSON.stringify(res))

                            that.loginAvatar = avatarUrl

                            const userInfo = that.$storage.user.get()
                            userInfo.avatar = avatarUrl
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
                    })
                    .catch((err) => {
                        // console.log('error video err:' + err)
                        uni.showToast({
                            icon: 'error',
                            title: '出错了...',
                            mask: true
                        })
                        uni.hideLoading()
                    })
            },
            userSwitchChange(e) {
                const check = e.value

                let isShowInfo = ''
                if (check) {
                    isShowInfo = '0'
                } else {
                    isShowInfo = '1'
                }
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&isShowInfo=' + isShowInfo
                this.$api.saveMyIsShowInfo(param).then(res => {
                    // console.log('saveMyIsShowInfo succes res:' + JSON.stringify(res))
                    this.userSwitchCheck = check

                    const userInfo = this.$storage.user.get()
                    userInfo.isShowInfo = isShowInfo
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
            numIdSwitchChange(e) {
                const check = e.value

                let isShowNumId = ''
                if (check) {
                    isShowNumId = '0'
                } else {
                    isShowNumId = '1'
                }
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&isShowNumId=' + isShowNumId
                this.$api.saveMyIsShowNumId(param).then(res => {
                    // console.log('saveMyIsShowNumId succes res:' + JSON.stringify(res))
                    this.numIdSwitchCheck = check

                    const userInfo = this.$storage.user.get()
                    userInfo.isShowNumId = isShowNumId
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
            toUserPage() {
                uni.navigateTo({
                    url: '/package-user/my-info/my-info?lookStudentId=' + this.loginStudentId
                })
            },
            async switchNikeName() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.navigateTo({
                    url: '/package-account/switch-nike/switch-nike'
                })
            },
            async openPhoneClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.navigateTo({
                    url: '/package-user/my-phone/my-phone'
                })
            },
            async openBackgroundClick() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.navigateTo({
                    url: '/package-user/my-background/my-background'
                })
            },
            openUpdatePass() {
                this.$refs.passPopupRef.open('bottom')
            },
            updatePass() {
                if (this.newPass == '' || this.confirmPass == '') {
                    uni.showToast({
                        title: '密码不能为空',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

                if (this.newPass.length < 6 || this.confirmPass.length < 6) {
                    uni.showToast({
                        title: '密码长度不能小于6位',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

                if (this.newPass != this.confirmPass) {
                    uni.showToast({
                        title: '两个密码输入不一致',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = {
                    studentId: this.loginStudentId,
                    pass: this.newPass
                };
                this.$api.updateLoginPass(param).then(res => {
                    // console.log('saveMyBodyHeight succes res:' + JSON.stringify(res))
                    uni.reLaunch({
                        url: '/package-verify/company-login/company-login'
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
            quitLogin() {
                uni.showModal({
                    title: '安全退出',
                    content: '是否确定退出登录？',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            uni.removeStorageSync("userInfo")
                            uni.reLaunch({
                                url: '/pages/company-login/company-login'
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            deleteAccountClick() {
                const _this = this
                uni.showModal({
                    title: '注销',
                    content: '注销后将永久删除无法恢复，是否确定注销账号？',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            _this.submitDeleteAccount()
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            submitDeleteAccount() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = {
                    studentId: this.loginStudentId
                };
                this.$api.deleteAccount(param).then(res => {
                    // console.log('saveMyBodyHeight succes res:' + JSON.stringify(res))

                    uni.clearStorageSync()

                    uni.exitMiniProgram({
                        success: function() {
                            console.log('退出小程序成功')
                        },
                        fail: function(err) {
                            console.log('退出小程序失败', err)
                        }
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
        }
    }
</script>

<style>
    .content {
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #F3F3F1 100%);
        position: relative;
    }

    .contentInsideView {
        width: 89%;
        height: 96%;
        position: absolute;
        z-index: 2;
        padding: 10rpx 46rpx 50rpx 46rpx;
        overflow-y: auto;
    }

    .topUserAvatarView {
        height: 260rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .avatarBtn {
        background-color: transparent;
    }

    .avatarBtn::after {
        border: none;
    }

    .avatarImgIconView {
        position: relative;
    }

    .topUserAvatarImg {
        width: 190rpx;
        height: 190rpx;
        border-radius: 50%;
    }

    .avatarImgIcon {
        width: 70rpx;
        height: 70rpx;
        position: absolute;
        bottom: 0;
        left: 120rpx;
    }

    .switchNikeNameView {
        position: absolute;
        right: 60rpx;
        top: 200rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .switchNikeNameImg {
        width: 26rpx;
        height: 21rpx;
    }

    .switchNikeNameText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #2CABA6;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
        margin-left: 4rpx;
    }

    .basicInfoView {
        margin-bottom: 40rpx;
    }

    .uni-list {
        border-radius: 19rpx;
        /* 这里的数值可以根据你的设计需求调整 */
        overflow: hidden;
        /* 确保子元素超出部分不显示 */
    }

    .popupView {
        background: linear-gradient(180deg, #2CABA6 0%, #FFFFFF 20%, #FFFFFF 100%);
        border-radius: 65rpx;
        display: flex;
        flex-direction: column;
        padding: 80rpx 30rpx 20rpx 30rpx;
    }

    .popupTitleView {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .popupTitleText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 33rpx;
        color: #000000;
        line-height: 46rpx;
        font-style: normal;
        text-transform: none;
    }

    .popupContentView {
        margin-top: 40rpx;
    }

    .popupContentInsideView {
        padding: 40rpx;
    }

    .popupButtonView {
        margin-top: 40rpx;
    }

    .popupButton {
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .quitLoginButtonView {
        width: 88%;
        position: fixed;
        bottom: 80rpx;
    }

    .quitLoginButton {
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .deleteAccountTextView {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20rpx;
        background-color: #FFFFFF;
        font-size: 28rpx;
        color: #3b4144;
        padding: 24rpx 0;
    }
</style>