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
            <view class="myListView">
                <view class="myListItemView listBottomLine">
                    <view class="myListItemText"><span style="color: #FF0000;">*</span>认证学校</view>
                    <view class="myListItemRightView" @click="checkSchoolBtn">
                        <view class="myListItemRightText">{{checkSchoolName==''?'请选择学校':checkSchoolName}}</view>
                        <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                    </view>
                </view>
                <view class="myListItemView listBottomLine">
                    <view class="myListItemText"><span style="color: #FF0000;">*</span>认证身份</view>
                    <picker mode="selector" :range="identitysArray" :value="identitysIdx" @change="identitysChange">
                        <view class="myListItemRightView">
                            <view class="myListItemRightText">{{identitysArray[identitysIdx]}}</view>
                            <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                        </view>
                    </picker>
                </view>
                <view class="myListItemView listBottomLine">
                    <view class="myListItemText" v-if="identitysIdx==0"><span style="color: #FF0000;">*</span>入学年份
                    </view>
                    <view class="myListItemText" v-else><span style="color: #FF0000;">*</span>入职年份</view>
                    <picker mode="selector" :range="yearsArray" :value="yearsIdx" @change="yearsChange">
                        <view class="myListItemRightView">
                            <view class="myListItemRightText">{{yearsArray[yearsIdx]}}</view>
                            <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                        </view>
                    </picker>
                </view>
                <view class="myListItemView">
                    <view class="myListItemText"><span style="color: #FF0000;">*</span>专业</view>
                    <view class="myListItemRightView">
                        <view class="myListItemRightText">
                            <input type="text" v-model="major"
                                style="border-bottom: 2rpx solid #F3F3F1;text-align: right;" />
                        </view>
                        <uni-icons type="right" color="#bbb" size="16"></uni-icons>
                    </view>
                </view>
            </view>

            <view class="uploadImageView">
                <view class="topImageSortText" v-if="identitysIdx==0">请上传录取通知书/学生证/校园卡/学位证/毕业证照片</view>
                <view class="topImageSortText" v-else>请上传教师证照片</view>
            </view>
            <view class="cameraView">
                <!-- <image class="cameraImg" src="/static/img/my/camera.png" @click="chooseImage" v-if="uploadImgPath==''">
                </image> -->
                <image class="cameraImg" :src="uploadImgPath" @click="chooseImage"></image>
            </view>
            <view class="bottomDescribeView">
                <view class="bottomDescribeTitleView">说明:</view>
                <view class="bottomDescribeContentView">1.请在本页面提交一张录取通知书/学生证/校园卡/学位证/毕业证/教师证的正面照片或相关证明的其他照片。</view>
                <view class="bottomDescribeContentView">2.照片须保持清晰，且须保证姓名清晰可见，但我们不会采集或分析其中的信息，可以自行对学号、序列号、条形码等信息进行遮掩处理。
                </view>
                <view class="bottomDescribeContentView">3.后台将进行人工审核，保证信息符合要求。</view>
                <view class="bottomDescribeContentView">4.对于蓄意伪造、冒用以及歉诈够行为，本方保留封禁乃至报案的权利。</view>
                <view class="bottomDescribeContentView">5.其他用户无法查看您的实名认证信息。</view>
            </view>

            <view class="agreementView">
                <uni-icons type="circle" size="20" v-if="!agreementIsCheck" @click="agreementCheckClick"></uni-icons>
                <uni-icons type="checkbox" size="20" color="#2196F3" v-else @click="agreementCheckClick"></uni-icons>
                <view class="agreementTextView">我已阅读并同意</view>
                <view class="agreementLinkView" @click="openAgreement">《团团校园隐私保护指引》</view>
            </view>

            <view class="submitBtnView">
                <button class="submitBtn" @click="submitSchoolVerify">提交</button>
            </view>

        </view>

        <uni-popup ref="statusLayerRef" :mask-click="false">
            <view class="popupView">
                <view class="popupContentView">
                    <image class="popupStatusLayerImg" src="/static/img/my/pass.png" v-if="examineStatus=='2'"></image>
                    <image class="popupStatusLayerImg" src="/static/img/my/wait.png" v-if="examineStatus=='1'"></image>
                    <image class="popupStatusLayerImg" src="/static/img/my/reject.png" v-if="examineStatus=='3'">
                    </image>
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

                access_token: '',
                loginStudentId: '',
                loginSchoolId: '',
                loginSchoolName: '',

                checkSchoolId: '',
                checkSchoolName: '',

                identitysArray: ['学生', '教职工'],
                identitysIdx: 0,

                yearsArray: [],
                yearsIdx: 0,

                major: '',
                uploadImgPath: '/static/img/my/camera.png',
                agreementIsCheck: false,
                examineStatus: '',
                noticeBarContent: '',
            }
        },
        mounted() {
            const _this = this
            uni.$on('backSelectSchool', function(data) {
                //触发更新后
                // console.log('data:' + JSON.stringify(data))
                _this.checkSchoolId = data.id
                _this.checkSchoolName = data.name
                console.log('backSelectSchool checkSchoolId:' + _this.checkSchoolId)
            })
        },
        onUnload() {
            // 移除监听事件  
            uni.$off('backSelectSchool');
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.initialize()
            this.getAccessToken()
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
                this.loginSchoolName = userInfo.schoolName
                this.checkSchoolId = userInfo.schoolId
                this.checkSchoolName = userInfo.schoolName
                console.log('getLoginInfo checkSchoolId:' + this.checkSchoolId)
            },
            initialize() {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const yearsArray = []
                for (let i = 0; i < 30; i++) {
                    yearsArray.push(year - i)
                }
                this.yearsArray = yearsArray
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
            getVerifyRecord() {
                const param = 'studentId=' + this.loginStudentId
                this.$api.getVerifyRecord(param).then(res => {
                    // console.log('getVerifyRecord succes res:' + JSON.stringify(res))
                    if (res.data.length > 0) {
                        const data = res.data[0]
                        const examineStatus = data.examineStatus
                        this.examineStatus = examineStatus
                        if (examineStatus == '1') {
                            this.noticeBarContent = '你的校园认证审核已提交，请耐心等待身份审核！'
                        }
                        if (examineStatus == '2') {
                            this.noticeBarContent = '你的校园认证审核已通过，感谢配合！'
                        }
                        if (examineStatus == '3') {
                            this.noticeBarContent = '你的校园认证审核已驳回，驳回原因：' + data.reason
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
            identitysChange(e) {
                this.identitysIdx = e.detail.value
            },
            yearsChange(e) {
                this.yearsIdx = e.detail.value
            },
            changeBtn(e) {
                console.log('e:' + e.detail.value)
            },
            async checkSchoolBtn() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                uni.navigateTo({
                    url: '/pages/chooseschool/chooseschool?source=verify'
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
            checkContent(content) {
                const _this = this
                return new Promise((resolve, reject) => {
                    const param = {
                        access_token: _this.access_token,
                        content: content
                    }
                    this.$api.msgSecCheck(param).then(res => {
                        console.log('msgSecCheck succes res:' + JSON.stringify(res))
                        resolve(res.data)
                    }).catch(res => {
                        // 失败进行的操作
                        uni.showToast({
                            icon: 'error',
                            title: res,
                            mask: true
                        })
                    })
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
            async submitSchoolVerify() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                if (this.major == '') {
                    uni.showToast({
                        title: '请输入专业',
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
                                _this.saveSchoolVerify()
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    })
                } else {
                    _this.saveSchoolVerify()
                }
            },
            async saveSchoolVerify() {
                const _this = this

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                const res_major = await this.checkContent(this.major)
                // console.log("return checkContent res_major:" + JSON.stringify(res_major))
                if (res_major) {
                    uni.hideLoading()

                    uni.showToast({
                        title: '专业包含危险信息，请修改',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

                console.log('saveSchoolVerify checkSchoolId:' + this.checkSchoolId)
                const data = {
                    schoolId: this.checkSchoolId,
                    studentId: this.loginStudentId,
                    identitys: this.identitysIdx + 1,
                    enrolYear: this.yearsArray[this.yearsIdx],
                    major: this.major,
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
                                // for (let i = 0; i < res.length; i++) {
                                //     let data = JSON.parse(res[i].data)
                                //     let url = data.data
                                //     _this.uploadImgPath.push(url)
                                // }
                            }

                            data.authImage = _this.uploadImgPath
                            const param = {
                                data: JSON.stringify(data)
                            };
                            _this.$api.saveSchoolVerify(param).then(res => {
                                // console.log('savePlaymateData succes res:' + JSON.stringify(res))
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
            async closeLayer() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

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