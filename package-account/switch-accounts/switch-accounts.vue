<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">

            <view class="accountsItemView" v-for="(item, idx) in accountsList" :key="idx"
                @click="switchAccountsClick(item)">
                <view class="accountsItemAvatarView">
                    <image class="topUserAvatarImg" src="/static/img/logo/default-avatar.png" v-if="item.avatar==''">
                    </image>
                    <image class="topUserAvatarImg" :src="item.avatar" v-else></image>
                </view>
                <view class="accountsItemBasicView">
                    <view class="accountsItemBasicNikeView">
                        <view class="accountsItemBasicTagView" v-if="item.sort=='1'">主号</view>
                        <view class="accountsItemBasicTagView" v-if="item.sort=='2'">小号</view>
                        <view class="accountsItemBasicNikeText">{{item.nikeName}}</view>
                    </view>
                    <view class="accountsItemBasicSchoolView">{{item.schoolName}}</view>
                </view>
                <view class="accountsItemIconView">
                    <uni-icons type="checkbox-filled" color="#18bc37" size="30"
                        v-if="item.studentId==loginStudentId"></uni-icons>
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
                loginStudentSort: '0', //学生分类（0:未设置，1:内部管理，2:内部小号）
                loginSchoolId: '',
                loginSchoolName: '',
                loginNikeName: '',
                loginAvatar: '',
                loginNumId: '',

                accountsList: [],
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getLoginInfo()
            this.getAccountsInfo()
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
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
                this.loginStudentSort = userInfo.sort
                this.loginSchoolId = userInfo.schoolId
                this.loginSchoolName = userInfo.schoolName
                this.loginNikeName = userInfo.nikeName
                this.loginAvatar = userInfo.avatar
                this.loginNumId = userInfo.numId
            },
            getAccountsInfo() {
                uni.showLoading({
                    title: '处理中...',
                    mask: true
                })

                const param = 'loginStudentId=' + this.loginStudentId
                this.$api.getAccountsInfo(param).then(res => {
                    // console.log('getAccountsInfo succes res:' + JSON.stringify(res.data))

                    this.accountsList = res.data

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
            async switchAccountsClick(item) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                if (item.studentId != this.loginStudentId) {
                    uni.showModal({
                        title: '提示',
                        content: '是否确认切换此账号？',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                _this.switchAccounts(item.studentId)
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                }
            },
            switchAccounts(studentId) {
                uni.showLoading({
                    title: '切换中...',
                    mask: true
                })

                const that = this
                new Promise(function(resolve, reject) {
                    that.$wechatAuth.getUserDetail(studentId, resolve)
                }).then(function(msg) {
                    if (msg == 'ok') {
                        uni.reLaunch({
                            url: '/pages/index/index'
                        })
                    }

                    uni.hideLoading()
                })
            },
        }
    }
</script>

<style>
    .content {
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #FFFFFF 100%);
        position: relative;
    }

    .contentInsideView {
        width: 89%;
        height: 93%;
        position: absolute;
        z-index: 2;
        padding: 50rpx 46rpx;
    }

    .accountsItemView {
        height: 120rpx;
        padding: 20rpx 40rpx;
        border-radius: 40rpx;
        border: 2rpx solid #9a9a98;
        display: flex;
        flex-direction: row;
        margin-bottom: 40rpx;
    }

    .accountsItemAvatarView {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .topUserAvatarImg {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
    }

    .accountsItemBasicView {
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .accountsItemBasicNikeView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .accountsItemBasicTagView {
        padding: 5rpx 15rpx;
        border-radius: 30rpx;
        font-size: 24rpx;
        background-color: #2979ff;
        color: #FFFFFF;
    }

    .accountsItemBasicNikeText {
        font-size: 32rpx;
        margin-left: 20rpx;
    }

    .accountsItemBasicSchoolView {
        font-size: 32rpx;
    }

    .accountsItemIconView {
        width: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto 10rpx auto auto;
    }
</style>