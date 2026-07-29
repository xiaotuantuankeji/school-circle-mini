<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInsideView">
            <view class="myListView">
                <view class="myListItemView listBottomLine">
                    <view class="myListItemText"><span style="color: #FF0000;">*</span>认证身份</view>
                    <view class="myListItemRightView">
                        <uni-data-picker class="myListItemPickerRightText" :localdata="identityItems"
                            v-model="identitySort" popup-title="请选择身份"
                            :map="{text:'name',value:'id'}"></uni-data-picker>
                    </view>
                </view>
                <view class="myListItemView listBottomLine">
                    <view class="myListItemText"><span style="color: #FF0000;">*</span>身份角色</view>
                    <view class="myListItemRightView">
                        <view class="myListItemRightText">
                            <input type="text" v-model="identityRole" placeholder="如：健身达人"
                                style="border-bottom: 2rpx solid #F3F3F1;text-align: right;" />
                        </view>
                        <!-- <uni-icons type="right" color="#bbb" size="16"></uni-icons> -->
                    </view>
                </view>
                <view class="myListItemView listBottomLine">
                    <view class="myListItemText"><span style="color: #FF0000;">*</span>联系方式</view>
                    <view class="myListItemRightView">
                        <view class="myListItemRightText">
                            <input type="number" v-model="contact"
                                style="border-bottom: 2rpx solid #F3F3F1;text-align: right;" />
                        </view>
                        <!-- <uni-icons type="right" color="#bbb" size="16"></uni-icons> -->
                    </view>
                </view>
            </view>

            <view class="uploadImageView">
                <view class="topImageSortText" v-if="identitysIdx==0">请上传能证明身份的照片</view>
                <view class="topImageSortText" v-else>请上传认证照片</view>
            </view>
            <view class="cameraView">
                <!-- <image class="cameraImg" src="/static/img/my/camera.png" @click="chooseImage" v-if="uploadImgPath==''">
                </image> -->
                <image class="cameraImg" :src="uploadImgPath" @click="chooseImage"></image>
            </view>
            <view class="bottomDescribeView">
                <view class="bottomDescribeTitleView">说明:</view>
                <view class="bottomDescribeContentView">1.一个昵称只能认证一种身份，请慎重选择。</view>
                <view class="bottomDescribeContentView">2.请在本页面提交一张能证明身份的照片。</view>
                <view class="bottomDescribeContentView">3.照片须保持清晰，且须保证姓名清晰可见，但我们不会采集或分析其中的信息，可以自行对隐私信息进行遮掩处理。
                </view>
                <view class="bottomDescribeContentView">4.后台将进行人工审核，保证信息符合要求。</view>
                <view class="bottomDescribeContentView">5.对于蓄意伪造、冒用以及歉诈够行为，本方保留封禁乃至报案的权利。</view>
                <view class="bottomDescribeContentView">6.其他用户无法查看您的实名认证信息。</view>
            </view>

            <view class="agreementView">
                <uni-icons type="circle" size="20" v-if="!agreementIsCheck" @click="agreementCheckClick"></uni-icons>
                <uni-icons type="checkbox" size="20" color="#2196F3" v-else @click="agreementCheckClick"></uni-icons>
                <view class="agreementTextView">我已阅读并同意</view>
                <view class="agreementLinkView" @click="openAgreement">《团团校园隐私保护指引》</view>
            </view>

            <view class="submitBtnView">
                <button class="submitBtn" @click="submitIdentityVerify">提交</button>
            </view>

            <!-- <view class="statusLayerView" v-if="isShowLayer">
                <view class="statusLayerInsideView">
                    <image class="statusLayerImg" src="/static/img/other/share_image.jpg"></image>
                    <view class="statusLayerIdentityText" v-if="examineStatus=='2'">【{{loginIdentityText}}】</view>
                    <view class="statusLayerNoticeText">{{noticeBarContent}}</view>
                    <view class="statusLayerBtn" @click="closeLayer">重新提交</view>
                </view>
            </view> -->

        </view>

        <uni-popup ref="statusLayerRef" :mask-click="false">
            <view class="popupView">
                <view class="popupContentView">
                    <image class="popupStatusLayerImg" src="/static/img/my/pass.png" v-if="examineStatus=='2'"></image>
                    <image class="popupStatusLayerImg" src="/static/img/my/wait.png" v-if="examineStatus=='1'"></image>
                    <image class="popupStatusLayerImg" src="/static/img/my/reject.png" v-if="examineStatus=='3'">
                    </image>
                    <view class="popupStatusLayerIdentityText" v-if="examineStatus=='2'">【{{loginIdentityText}}】</view>
                    <view class="popupStatusLayerNoticeText">{{noticeBarContent}}</view>
                </view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="closeLayer">重新提交</button>
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
                loginSchoolId: '',
                loginIdentityText: '',

                identityItems: [],
                identitySort: '',
                identityRole: '',
                contact: '',

                uploadImgPath: '/static/img/my/camera.png',
                agreementIsCheck: false,
                examineStatus: '',
                noticeBarContent: '',

                isShowLayer: false,
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.initialize()
        },
        onShow() {
            this.getLoginInfo()
            this.getVerifyRecord()
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
                this.loginSchoolId = userInfo.schoolId
            },
            initialize() {
                const param = ''
                this.$api.getChildIdentityList(param).then(res => {
                    // console.log('getChildIdentityList succes res:' + JSON.stringify(res))
                    this.identityItems = res.data

                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            getVerifyRecord() {
                const param = 'studentId=' + this.loginStudentId
                this.$api.getIdentityVerifyRecord(param).then(res => {
                    // console.log('getVerifyRecord succes res:' + JSON.stringify(res))
                    if (res.data.length > 0) {
                        const data = res.data[0]
                        const examineStatus = data.examineStatus
                        this.examineStatus = examineStatus
                        if (examineStatus == '1') {
                            this.noticeBarContent = '你的身份认证审核已提交，请耐心等待身份审核！'
                        }
                        if (examineStatus == '2') {
                            this.loginIdentityText = data.remark
                            this.noticeBarContent = '你的身份认证审核已通过，感谢配合！'
                        }
                        if (examineStatus == '3') {
                            this.noticeBarContent = '你的身份认证审核已驳回，驳回原因：' + data.reason
                        }
                        this.$refs.statusLayerRef.open('bottom')
                    }

                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            agreementCheckClick() {
                const agreementIsCheck = this.agreementIsCheck
                if (agreementIsCheck) {
                    this.agreementIsCheck = false
                } else {
                    this.agreementIsCheck = true
                }
            },
            openAgreement() {
                uni.navigateTo({
                    url: '/package-agreement/privacy-agreement/privacy-agreement'
                })
            },
            async chooseImage() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                uni.chooseMedia({
                    count: 1,
                    mediaType: ['image'],
                    sourceType: ['album', 'camera'],
                    maxDuration: 30,
                    camera: 'back',
                    success(res) {
                        // console.log(res.tempFiles)
                        const tempFilePath = res.tempFiles[0].tempFilePath
                        _this.uploadImgPath = tempFilePath
                    }
                })
            },
            async submitIdentityVerify() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                if (this.identitySort == '') {
                    uni.showToast({
                        title: '请选择身份',
                        icon: 'none'
                    })
                    return
                }
                if (this.identityRole == '') {
                    uni.showToast({
                        title: '请输入身份角色',
                        icon: 'none'
                    })
                    return
                }
                if (this.contact == '') {
                    uni.showToast({
                        title: '请输入联系方式',
                        icon: 'none'
                    })
                    return
                }
                if (this.uploadImgPath == '') {
                    uni.showToast({
                        title: '请上传认证图片',
                        icon: 'none'
                    })
                    return
                }
                if (!this.agreementIsCheck) {
                    uni.showModal({
                        title: '提示',
                        content: '提交表示已读并同意隐私保护协议。',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                _this.agreementIsCheck = true
                                _this.saveIdentityVerify()
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    })
                } else {
                    _this.saveIdentityVerify()
                }
            },
            async saveIdentityVerify() {
                const _this = this

                this.getLoginInfo()

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const data = {
                    schoolId: this.loginSchoolId,
                    studentId: this.loginStudentId,
                    identitySortId: this.identitySort,
                    identityRole: this.identityRole,
                    contact: this.contact,
                    authImage: this.uploadImgPath
                }

                // 上传图片
                const imageList = []
                imageList.push(this.uploadImgPath)
                // console.log('imageList:' + imageList)
                if (imageList.length > 0) {
                    const imagePromises = imageList.map((path, index) => {
                        return new Promise((resolve, reject) => {
                            uni.uploadFile({
                                url: this.$configData.file_url_server,
                                filePath: path,
                                name: 'file',
                                formData: {
                                    type: 'image',
                                    index: index
                                },
                                success: (res) => resolve(res),
                                fail: (err) => reject(err)
                            })
                        })
                    })

                    // 执行所有上传
                    Promise.all(imagePromises)
                        .then((res) => {
                            // console.log('success image res:' + JSON.stringify(res))
                            if (res.length > 0) {
                                const data = JSON.parse(res[0].data)
                                const url = data.data
                                _this.uploadImgPath = url
                            }

                            data.authImage = _this.uploadImgPath
                            const param = {
                                data: JSON.stringify(data)
                            };
                            // console.log('param:' + param)
                            _this.$api.saveIdentityVerify(param).then(res => {
                                // console.log('savePlaymateData succes res:' + JSON.stringify(res))
                                if (res.code == 0) {
                                    uni.showToast({
                                        title: '提交成功',
                                        icon: 'none'
                                    })
                                    new Promise(function(resolve, reject) {
                                        _this.$wechatAuth.getUserDetail(_this.loginStudentId,
                                            resolve)
                                    }).then(function(msg) {
                                        if (msg == 'ok') {
                                            uni.navigateBack()
                                        }

                                        uni.hideLoading()
                                    })
                                } else {
                                    uni.showToast({
                                        icon: 'error',
                                        title: res.msg,
                                        mask: true
                                    })
                                    uni.hideLoading()
                                }
                            }).catch(res => {
                                // console.log('savePlaymateData err res:' + res)
                                // 失败进行的操作
                                uni.showToast({
                                    icon: 'error',
                                    title: res,
                                    mask: true
                                })
                                uni.hideLoading()
                            })
                        })
                        .catch((err) => {
                            // console.log('error image err:' + err)
                            uni.showToast({
                                icon: 'error',
                                title: err,
                                mask: true
                            })
                            uni.hideLoading()
                        })
                }
            },
            closeLayer() {
                this.$refs.statusLayerRef.close()
            },
        }
    }
</script>

<style>
    .content {
        background: linear-gradient(180deg, #94D4D2 0%, #FFFFFF 16%, #FFFFFF 100%);
        position: relative;
        overflow-y: hidden;
    }

    .contentInsideView {
        width: 89%;
        height: 96%;
        position: absolute;
        z-index: 2;
        padding: 10rpx 46rpx 50rpx 46rpx;
        overflow-y: auto;
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

    .myListItemRightView {
        display: flex;
        flex-direction: row;
    }

    .myListItemPickerRightText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #A6A6A6;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
    }

    .myListItemRightText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #A6A6A6;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
        margin-right: 28rpx;
    }

    .uploadImageView {
        display: flex;
        flex-direction: column;
        margin-top: 60rpx;
    }

    .topImageSortText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #000000;
        line-height: 38rpx;
        font-style: normal;
        text-transform: none;
    }

    .cameraView {
        margin-top: 40rpx;
    }

    .cameraImg {
        width: 100%;
        height: 325rpx;
    }

    .bottomDescribeView {
        padding: 30rpx 26rpx;
    }

    .bottomDescribeTitleView {
        font-size: 24rpx;
        color: #858585;
    }

    .bottomDescribeContentView {
        font-size: 22rpx;
        color: #A6A6A6;
    }

    .agreementView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 60rpx;
    }

    .agreementTextView {
        font-size: 28rpx;
        color: #000000;
    }

    .agreementLinkView {
        font-size: 28rpx;
        color: #2CABA6;
    }

    .submitBtnView {
        display: flex;
        justify-content: center;
        margin-top: 40rpx;
        margin-bottom: 20rpx;
    }

    .submitBtn {
        width: 96%;
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .statusLayerView {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(67, 67, 67, 0.95);
    }

    .statusLayerInsideView {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 100rpx;
    }

    .statusLayerImg {
        width: 400rpx;
        height: 300rpx;
        margin-top: 200rpx;
    }

    .statusLayerIdentityText {
        color: #2979FF;
        font-size: 30rpx;
        margin-top: 50rpx;
    }

    .statusLayerNoticeText {
        color: #2979FF;
        font-size: 30rpx;
        margin-top: 20rpx;
    }

    .statusLayerBtn {
        width: 200rpx;
        height: 80rpx;

        background: #000000;
        border-radius: 40rpx;
        color: #8CE8ED;

        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: 50rpx;
    }

    .popupView {
        background: linear-gradient(180deg, #2CABA6 0%, #FFFFFF 10%, #FFFFFF 100%);
        border-radius: 65rpx;
        display: flex;
        flex-direction: column;
        padding: 80rpx 30rpx 20rpx 30rpx;
    }

    .popupContentView {
        margin-top: 60rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .popupStatusLayerImg {
        width: 112rpx;
        height: 90rpx;
        margin-bottom: 56rpx;
    }

    .popupStatusLayerIdentityText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #000000;
        line-height: 98rpx;
    }

    .popupStatusLayerNoticeText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
    }

    .popupButtonView {
        margin-top: 100rpx;
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
</style>