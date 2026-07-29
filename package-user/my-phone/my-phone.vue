<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">
            <view class="topUserAvatarView">
                <image class="topUserAvatarImg" src="/static/img/logo/default-avatar.png" v-if="loginAvatar==''">
                </image>
                <image class="topUserAvatarImg" :src="loginAvatar" v-else></image>
            </view>

            <view class="middleTextView">
                <view class="middleTextTitleView">申请获取以下权限：</view>
                <view class="middleTextDescribeView">获取您的手机号用于登录绑定</view>
            </view>

            <button class="bottomBtn" open-type="getPhoneNumber" @getphonenumber="phoneClick">授权手机号</button>
        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginStudentId: '',
                loginAvatar: '',

                access_token: '',

                mobilePhone: '',
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getLoginInfo()
            this.getAccessToken()
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
                this.loginAvatar = userInfo.avatar
            },
            getAccessToken() {
                const param = ''
                this.$api.getAccessToken(param).then(res => {
                    // console.log('getAccessToken succes res:' + JSON.stringify(res))
                    this.access_token = res.data

                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            phoneClick(e) {
                const _this = this
                if (e.detail.errMsg == 'getPhoneNumber:ok') {
                    uni.showLoading({
                        title: '获取中...',
                        mask: true
                    })

                    const param = {
                        code: e.detail.code,
                        access_token: this.access_token
                    }
                    this.$api.getPhoneNumber(param).then(res => {
                        console.log('getPhoneNumber succes res:' + JSON.stringify(res))

                        _this.mobilePhone = res.data
                        _this.savePhone()

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
            savePhone() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId + '&mobilePhone=' + this.mobilePhone
                this.$api.saveMyMobilePhone(param).then(res => {
                    // console.log('saveMyMobilePhone succes res:' + JSON.stringify(res))

                    const userInfo = this.$storage.user.get()
                    userInfo.mobilePhone = this.mobilePhone
                    uni.setStorageSync("userInfo", userInfo)

                    uni.navigateBack()

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

    .topUserAvatarView {
        height: 400rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .topUserAvatarImg {
        width: 190rpx;
        height: 190rpx;
        border-radius: 50%;
        border: 4rpx solid #e2dede;
    }

    .middleTextView {
        margin-top: 100rpx;
        display: flex;
        flex-direction: column;
    }

    .middleTextTitleView {
        color: #858585;
        font-size: 25rpx;
    }

    .middleTextDescribeView {
        color: #A6A6A6;
        font-size: 23rpx;
    }

    .middleTextDescribeView::before {
        content: "• ";
        /* 这里使用•表示一个点 */
    }

    .bottomBtn {
        margin-top: 80rpx;
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }
</style>