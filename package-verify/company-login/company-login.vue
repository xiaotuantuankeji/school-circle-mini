<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <view class="contentInside">
            <view class="itemsView uni-mt-10">
                <view class="itemsTitleTextView">登录名</view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput v-model="loginName" placeholder="请输入登录名" maxlength="20"></uni-easyinput>
                    </view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">登录密码</view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput type="password" v-model="loginPass" placeholder="请输入密码"
                            maxlength="30"></uni-easyinput>
                    </view>
                </view>
            </view>
            <view class="itemsButtonView uni-mt-10">
                <button type="primary" size="mini" @click="companyLogin">登录</button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginName: '',
                loginPass: '',
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
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
            companyLogin() {
                const _this = this
                if (this.loginName.trim() == '') {
                    uni.showToast({
                        title: '请输入登录名',
                        icon: 'none'
                    })
                    return
                }
                if (this.loginPass.trim() == '') {
                    uni.showToast({
                        title: '请输入密码',
                        icon: 'none'
                    })
                    return
                }

                uni.showLoading({
                    title: '登录中...',
                    mask: true
                })

                const data = {
                    loginName: this.loginName,
                    loginPass: this.loginPass
                }
                const param = {
                    data: JSON.stringify(data)
                };
                this.$api.loginAgencyAccount(param).then(res => {
                    // console.log('saveAgencyInfo succes res:' + JSON.stringify(res))

                    uni.hideLoading()

                    if (res.code == 0) {
                        uni.reLaunch({
                            url: '/pages/index/index?id=' + res.data
                        });
                    } else {
                        uni.showToast({
                            icon: 'error',
                            title: res.msg,
                            mask: true
                        })
                    }
                }).catch(res => {
                    // console.log('saveAgencyInfo err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
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
        overflow-y: hidden;
    }

    .contentInside {
        padding: 60rpx 40rpx 100rpx;
    }

    .itemsView {}

    .itemsTitleTextView {
        height: 60rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
    }

    .itemsRightShowContentView {
        margin-left: 6rpx;
        display: flex;
        flex-direction: column;
    }

    .itemsButtonView {
        text-align: center;
    }
</style>