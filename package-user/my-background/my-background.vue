<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">
            <view class="topBackgroundView">
                <!-- <avatar selWidth="300px" selHeight="200px" @upload="myUpload" :avatarSrc="myBackground"
                    avatarStyle="width: 100%; height: 230px;">
                </avatar> -->
                <lxiaoxiao-cropper selWidth="300px" selHeight="200px" @upload="myUpload" :avatarSrc="myBackground"
                    avatarStyle="width: 100%; height: 230px;"></lxiaoxiao-cropper>
            </view>

            <!-- <button class="bottomBtn" @click="saveImageClick">保&nbsp;&nbsp;&nbsp;&nbsp;存</button> -->
        </view>
    </view>
</template>

<script>
    import avatar from '../../components/yq-avatar/yq-avatar'
    import verifySchool from '../../libs/verify_school'
    export default {
        components: {
            avatar
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                loginStudentId: '',
                myBackground: '',
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getLoginInfo()
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
                let myBackground = ''
                if (userInfo.backgroundImage == undefined || userInfo.backgroundImage == '') {
                    myBackground = '/static/img/other/my-background.jpg'
                } else {
                    myBackground = userInfo.backgroundImage
                }
                this.myBackground = myBackground
            },
            async myUpload(rsp) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const that = this
                uni.showLoading({
                    title: '上传中',
                    mask: true
                })

                const url = rsp.path
                // console.log('url:' + url)
                this.myBackground = url
                const imagePromise = new Promise((resolve, reject) => {
                    uni.uploadFile({
                        url: this.$configData.file_url_server,
                        filePath: this.myBackground,
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
                                that.myBackground = url
                            }
                        }

                        const param = 'loginStudentId=' + that.loginStudentId + '&myBackground=' + that
                            .myBackground
                        that.$api.saveMyBackground(param).then(res => {

                            const userInfo = this.$storage.user.get()
                            userInfo.backgroundImage = that.myBackground
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
            },
            saveImageClick() {

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
        position: absolute;
        z-index: 2;
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .topBackgroundView {
        height: 230px;
        margin-top: 30rpx;
    }

    .bottomBtn {
        margin-top: 60rpx;
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