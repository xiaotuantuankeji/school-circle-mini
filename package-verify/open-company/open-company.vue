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
        <view class="contentInside">
            <view class="itemsView">
                <view class="itemsTitleTextView">机构全称<span class="requiredItemSpan uni-ml-3">*</span></view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput v-model="name" placeholder="请输入机构全称" maxlength="80"></uni-easyinput>
                    </view>
                    <view class="itemsRemarkView">主体名称需严格按照证件填写，在注册确认后不可更改。</view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">工商营业执照<span class="requiredItemSpan uni-ml-3">*</span></view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-file-picker v-model="filePath" file-extname="png,jpg" :limit="1" @select="fileUploadSelect"
                            @delete="fileUploadDelete"></uni-file-picker>
                    </view>
                    <view class="itemsRemarkView">
                        请上传最新的营业执照，<br />格式要求:原件照片、扫描件或者加盖公章的复印件，支持.jpg.png格式照片，大小不超过10M.</view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">统一社会信用代码<span class="requiredItemSpan uni-ml-3">*</span></view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput v-model="code" placeholder="请输入统一社会信用代码" maxlength="80"></uni-easyinput>
                    </view>
                    <view class="itemsRemarkView">务必与营业执照上的注册号或统一社会信用代码一致</view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">联系人姓名<span class="requiredItemSpan uni-ml-3">*</span></view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput v-model="userName" placeholder="请输入联系人姓名" maxlength="10"></uni-easyinput>
                    </view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">联系人身份证号码<span class="requiredItemSpan uni-ml-3">*</span></view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput type="idcard" v-model="identityCard" placeholder="请输入联系人身份证号码"
                            maxlength="18"></uni-easyinput>
                    </view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">联系人手机<span class="requiredItemSpan uni-ml-3">*</span></view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput type="number" v-model="mobilePhone" placeholder="请输入联系人手机"
                            maxlength="11"></uni-easyinput>
                    </view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">联系人座机</view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput v-model="phone" placeholder="请输入联系人座机" maxlength="20"></uni-easyinput>
                    </view>
                    <view class="itemsRemarkView">请完整地填写区号、座机号和分机号，用于手机联系不到你时备用。</view>
                </view>
            </view>
            <view class="itemsView uni-mt-5">
                <view class="itemsTitleTextView">电子邮箱</view>
                <view class="itemsRightShowContentView">
                    <view>
                        <uni-easyinput v-model="email" placeholder="请输入电子邮箱" maxlength="80"></uni-easyinput>
                    </view>
                </view>
            </view>
            <view class="itemsButtonView uni-mt-10">
                <button type="primary" size="mini" @click="saveCompany">提交</button>
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

                imageList: [],
                uploadImageUrl: [],

                name: '',
                filePath: [],
                code: '',
                userName: '',
                identityCard: '',
                mobilePhone: '',
                phone: '',
                email: '',
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
            fileUploadSelect(e) {
                this.imageList.push(e.tempFiles[0].path)
            },
            fileUploadDelete(e) {
                this.imageList = []
            },
            async saveCompany() {
                const _this = this
                if (this.name.trim() == '') {
                    uni.showToast({
                        title: '请输入机构全称',
                        icon: 'none'
                    })
                    return
                }

                if (this.imageList.length == 0) {
                    uni.showToast({
                        title: '请上传工商营业执照',
                        icon: 'none'
                    })
                    return
                }

                if (this.code.trim() == '') {
                    uni.showToast({
                        title: '请输入统一社会信用代码',
                        icon: 'none'
                    })
                    return
                }

                if (this.userName.trim() == '') {
                    uni.showToast({
                        title: '请输入联系人姓名',
                        icon: 'none'
                    })
                    return
                }

                if (this.identityCard.trim() == '') {
                    uni.showToast({
                        title: '请输入联系人身份证号码',
                        icon: 'none'
                    })
                    return
                }

                if (this.mobilePhone.trim() == '') {
                    uni.showToast({
                        title: '请输入手机号码',
                        icon: 'none'
                    })
                    return
                }

                uni.showLoading({
                    title: '提交中...',
                    mask: true
                })

                // 创建表单数据
                const data = {
                    category: '1',
                    name: this.name,
                    creditCode: this.code,
                    contactName: this.userName,
                    identityCard: this.identityCard,
                    mobilePhone: this.mobilePhone,
                    phone: this.phone,
                    email: this.email,
                }

                // 上传图片
                if (this.imageList.length > 0) {
                    const imagePromises = this.imageList.map((path, index) => {
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
                                for (let i = 0; i < res.length; i++) {
                                    const data = JSON.parse(res[i].data)
                                    const url = data.data
                                    _this.uploadImageUrl.push(url)
                                }
                            }

                            const param = {
                                data: JSON.stringify(data),
                                licenseUrl: _this.uploadImageUrl
                            };
                            this.$api.saveAgencyInfo(param).then(res => {
                                // console.log('saveAgencyInfo succes res:' + JSON.stringify(res))

                                uni.hideLoading()

                                if (res.code == 0) {
                                    this.reset()

                                    uni.showModal({
                                        title: '提交成功',
                                        content: '请保持电话畅通，会有客服人员与你联系。',
                                        showCancel: false,
                                        success: function(res) {
                                            if (res.confirm) {
                                                uni.exitMiniProgram({
                                                    success: function() {
                                                        console.log('退出小程序成功')
                                                    },
                                                    fail: function(err) {
                                                        console.log('退出小程序失败',
                                                            err)
                                                    }
                                                })
                                            } else if (res.cancel) {
                                                // console.log('用户点击取消');
                                            }
                                        }
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
            reset() {
                this.name = ''
                this.code = ''
                this.filePath = []
                this.userName = ''
                this.identityCard = ''
                this.mobilePhone = ''
                this.phone = ''
                this.email = ''
                this.imageList = []
                this.uploadImageUrl = []
            },
        }
    }
</script>

<style>
    .content {
        overflow-y: auto;
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

    .itemsRemarkView {
        font-size: 24rpx;
        color: #8e8e8e;
        margin-top: 5rpx;
    }

    .itemsButtonView {
        text-align: center;
    }

    .requiredItemSpan {
        color: #ff0000;
    }
</style>