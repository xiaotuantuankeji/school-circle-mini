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

        <view class="contentInsideView">
            <view v-if="studentSort=='3'&&permission=='2'&&agencySchoolList.length>0" style="margin-top: 10rpx;">
                <uni-data-select v-model="agencySchoolId" :localdata="agencySchoolList"
                    placeholder="请选择校园"></uni-data-select>
            </view>
            <view v-if="studentSort=='3'&&permission=='1'" style="margin-top: 10rpx;">
                <uni-data-select v-model="agencySendType" :localdata="agencySelectList" placeholder="请选择"
                    @clear="typeClear"></uni-data-select>
            </view>
            <view style="margin-top: 20rpx;" v-if="agencySendType==1">
                <uni-data-picker placeholder="请选择城市" popup-title="请选择城市" :localdata="cityList" v-model="cityId"
                    :map="{text:'name',value:'id'}">
                </uni-data-picker>
            </view>
            <view style="margin-top: 20rpx;" v-if="agencySendType==2">
                <view class="changeSchoolInput" @click="checkSchool">{{changeSchoolName}}</view>
            </view>
            <view class="sendCardTopView">
                <view class="sendCardTopLeftView">发布到</view>
                <view class="sendCardTopPartitionView" v-if="selectPartitionData.name != ''">
                    <image class="topPartitionImg" :src="`/static/img/partition/${selectPartitionData.iconName}.png`">
                    </image>
                    <view class="topPartitionText">{{selectPartitionData.name}}：</view>
                </view>
                <view class="sendCardTopRightView" @click="selectPartition">
                    <view class="topRightText">{{selectPartitionData.name==''?'去选择':'重新选择'}}</view>
                    <uni-icons type="right"></uni-icons>
                </view>
            </view>

            <view class="sendCardContentView">
                <textarea class="sendCardContentTextarea" v-model="content" placeholder="说点什么吧......"
                    placeholder-class="textareaPlaceholder" maxlength="2000"></textarea>
            </view>

            <view class="sendCardUploadView" v-if="is_open_upload == '1'">
                <view class="uploadImageView" v-if="imageList.length>0 || videoUrl==''">
                    <view class="uploadImageContentView" v-for="(item, index) in imageList" :key="index"
                        v-if="imageList.length>0">
                        <image class="uploadImageContentDeleteImg" src="/static/img/other/image-delete.png"
                            @click="deleteImage(index)"></image>
                        <image class="uploadImageContentImg" :src="item" @click="previewImage(index)"></image>
                    </view>
                    <view class="uploadImageBtnView" @click="chooseImage" v-if="imageList.length<9">
                        <image class="uploadImageBtnImg" src="/static/img/other/camera.png"></image>
                        <view class="uploadImageBtnText">图片</view>
                    </view>
                </view>
                <view class="uploadVideoView" v-if="videoUrl!='' || imageList.length==0">
                    <view class="uploadVideoContentView" v-if="videoUrl!=''">
                        <image class="uploadVideoContentDeleteImg" src="/static/img/other/image-delete.png"
                            @click="deleteVideo"></image>
                        <video id="videoId" style="width: 300rpx;height: 150rpx;" :src="videoUrl"
                            play-btn-position="center" show-fullscreen-btn="false" object-fit="cover"></video>
                    </view>
                    <view class="uploadVideoBtnView" @click="chooseVideo" v-if="videoUrl==''">
                        <image class="uploadVideoBtnImg" src="/static/img/other/video.png"></image>
                        <view class="uploadVideoBtnText">视频</view>
                    </view>
                </view>
            </view>

            <view class="sendCardLocationView">
                <image class="sendCardLocationImg" src="/static/img/other/location.png"></image>
                <view class="sendCardLocationText">{{(addressData.name=='')?'位置':addressData.name}}</view>
                <view class="sendCardLocationRightView" @click="chooseLocation">
                    <view class="locationRightText">{{addressData.name==''?'去选择':'重新选择'}}</view>
                    <uni-icons type="right"></uni-icons>
                </view>
            </view>

            <view class="sendCardButtonView">
                <button class="sendCardButton" @click="submitCard">发布帖子</button>
            </view>
        </view>

        <uni-popup ref="schoolPopup" type="bottom" background-color="#FFFFFF" :safe-area="false">
            <view class="popupContentTitle">
                <button type="default" size="mini" style="margin: 0;" @click="closePopup">取消</button>
                <uni-search-bar cancelButton="none" @confirm="searchSchool" style="width: 60%;"
                    @clear="clearSearchSchool"></uni-search-bar>
                <button type="primary" size="mini" style="margin: 0;" @click="confirmPopup">确定</button>
            </view>
            <view>
                <picker-view class="picker-view" @change="schoolPicker" :value="schoolKey">
                    <picker-view-column>
                        <view class="item" v-for="(item,index) in searchSchoolList" :key="index">{{item.name}}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </uni-popup>

        <!-- <canvas canvas-id="myCanvas" style="width: 300px; height: 240px;position: absolute;z-index: -1;"></canvas> -->

    </view>
</template>

<script>
    import verifySchool from '../../libs/verify_school'
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                videoMaxSize: 52428800, // 50MB

                access_token: '',
                is_open_upload: '0', // 0：关闭，1：打开

                cardType: '0', // 类型（0:论坛、1:社团生活、2:兼职跑腿、3:闲置交易）

                studentId: 0,
                showNikeName: '',
                schoolId: '',
                studentSort: '',
                permission: '2',

                agencySendType: 0,

                agencySelectList: [{
                    value: 0,
                    text: '全部'
                }, {
                    value: 1,
                    text: '指定省份'
                }, {
                    value: 2,
                    text: '指定校园'
                }],

                cityList: [],
                cityId: 0,

                schoolList: [],
                searchSchoolList: [],
                selectSchoolId: 0,
                schoolKey: [0],
                changeSchoolName: '请选择校园',

                agencySchoolList: [],
                agencySchoolId: '',

                content: '',
                imageList: [],
                videoUrl: '',

                addressData: {
                    name: '', // 位置名称
                    address: '', // 地址
                    latitude: '', // 纬度
                    longitude: '' // 经度
                },
                selectPartitionData: {
                    id: 0,
                    name: '',
                    iconName: ''
                },

                uploadImageUrl: [],
                uploadVideoUrl: ''
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getAccessToken()
            this.getSchoolList()
            this.getCityList()
        },
        onShow() {
            this.getLoginInfo()
            this.verifyStatus()
            this.getGlobalSettings()
        },
        mounted() {
            const _this = this
            uni.$on('backSelectPartition', function(data) {
                //触发更新后
                // console.log('data:' + JSON.stringify(data))
                _this.selectPartitionData = data
            })
        },
        onUnload() {
            // 移除监听事件  
            uni.$off('backSelectPartition');
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
                this.studentId = userInfo.studentId
                this.showNikeName = userInfo.showNikeName
                this.schoolId = userInfo.schoolId
                this.studentSort = userInfo.sort
                this.permission = userInfo.permission
                this.getAgencySchoolData()
            },
            getAgencySchoolData() {
                const param = 'studentId=' + this.studentId
                this.$api.getAgencySchoolData(param).then(res => {
                    const data = res.data
                    let agencySchoolList = []
                    if (data.length > 0) {
                        agencySchoolList = [{
                            value: 'all',
                            text: '全部'
                        }]
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i]

                            const schools = {
                                value: item.id,
                                text: item.name
                            }
                            agencySchoolList.push(schools)
                        }
                    }
                    this.agencySchoolList = agencySchoolList

                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            getCityList() {
                this.$api.getAreaTree().then(res => {
                    const data = res.data
                    this.cityList = data
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            getSchoolList() {
                const param = ''
                this.$api.getAllSchoolByStatus(param).then(res => {

                    const data = res.data
                    this.schoolList = data.openList
                    this.searchSchoolList = data.openList
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            typeClear() {
                this.agencySendType = 0
                this.cityId = 0
                this.selectSchoolId = 0
                this.changeSchoolName = '请选择校园'
            },
            checkSchool() {
                this.$refs.schoolPopup.open()
            },
            closePopup() {
                this.$refs.schoolPopup.close()
            },
            searchSchool(e) {
                const searchValue = e.value
                if (searchValue == '') {
                    this.searchSchoolList = this.schoolList
                    this.schoolKey = [0]
                } else {
                    uni.showLoading({
                        title: '查询中...'
                    })
                    const schoolArray = this.schoolList
                    const searchArray = schoolArray.filter(item => item.name.includes(searchValue));
                    this.searchSchoolList = searchArray
                    this.schoolKey = [0]
                    uni.hideLoading()
                }
            },
            clearSearchSchool() {
                this.searchSchoolList = this.schoolList
                this.schoolKey = [0]
            },
            schoolPicker(e) {
                this.schoolKey = e.detail.value
            },
            confirmPopup() {
                const item = this.searchSchoolList[this.schoolKey]
                this.changeSchoolName = item.name
                this.selectSchoolId = item.id
                this.closePopup()
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
            verifyStatus() {
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
                                uni.switchTab({
                                    url: '/pages/index/index'
                                })
                            }
                        }
                    })
                }
                if (status == '3') {
                    // 审核中
                    uni.showModal({
                        title: '院校认证',
                        content: '正在审核中，请稍后！',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                uni.redirectTo({
                                    url: '/pages/index/index'
                                })
                            }
                        }
                    })
                }
                if (banLevel == '5') {
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
                } else if (parseInt(banLevel) >= 1 && parseInt(banLevel) <= 4) {
                    const banDay = userInfo.banDay
                    const banEndDay = userInfo.banEndDay
                    const banReason = userInfo.banReason
                    let content = '你的账户因[' + banReason + ']，已被禁止发帖'
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
                                uni.switchTab({
                                    url: '/pages/index/index'
                                })
                            }
                        }
                    })
                }
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
            reset() {
                this.content = ''
                this.imageList = []
                this.videoUrl = ''

                this.addressData = {
                    name: '', // 位置名称
                    address: '', // 地址
                    latitude: '', // 纬度
                    longitude: '' // 经度
                }
                this.selectPartitionData = {
                    id: 0,
                    name: '',
                    iconName: ''
                }

                this.uploadImageUrl = []
                this.uploadVideoUrl = ''
            },
            // 选择图片
            async chooseImage() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                uni.chooseMedia({
                    count: 9 - _this.imageList.length,
                    mediaType: ['image'],
                    sourceType: ['album', 'camera'],
                    maxDuration: 30,
                    camera: 'back',
                    success(res) {
                        // console.log(res.tempFiles)
                        const data = res.tempFiles
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i]
                            _this.imageList.push(item.tempFilePath)
                        }
                    }
                })
            },
            // 预览图片
            previewImage(index) {
                uni.previewImage({
                    urls: this.imageList,
                    current: index
                });
            },
            // 删除图片
            deleteImage(idx) {
                this.imageList.splice(idx, 1)
            },

            // 选择视频
            async chooseVideo() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                const _this = this
                uni.chooseVideo({
                    sourceType: ['camera', 'album'],
                    success: function(res) {
                        const size = res.size
                        if (size > _this.videoMaxSize) {
                            uni.showToast({
                                title: '视频大小不能超过50MB',
                                icon: 'none'
                            })
                            return
                        }
                        _this.videoUrl = res.tempFilePath;
                    }
                });
            },
            // 删除视频
            deleteVideo() {
                this.videoUrl = ''
            },
            // 视频全屏
            quanping() {
                const videoContent = uni.createVideoContext('videoId', this)
                videoContent.requestFullScreen()
                videoContent.play()
            },
            // 视频全屏事件
            fullscreenchange(e) {
                if (!e.detail.fullScreen) {
                    const videoContent = uni.createVideoContext('videoId', this)
                    videoContent.pause()
                    videoContent.exitFullScreen()
                }
            },
            // 打开地图选择位置
            async chooseLocation() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }
                const _this = this
                uni.chooseLocation({
                    success: function(res) {
                        // console.log('位置名称：' + res.name);
                        // console.log('详细地址：' + res.address);
                        // console.log('纬度：' + res.latitude);
                        // console.log('经度：' + res.longitude);
                        _this.addressData = {
                            name: res.name,
                            address: res.address,
                            latitude: res.latitude,
                            longitude: res.longitude
                        }
                    }
                });
            },
            async selectPartition() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }

                console.log('====selectPartition====')
                uni.navigateTo({
                    url: '/package-content/partition/partition'
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
                        // console.log('msgSecCheck succes res:' + JSON.stringify(res))
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
            checkImage(type, path) {
                const _this = this
                const param = {
                    access_token: _this.access_token,
                    path: path,
                    type: type,
                    studentId: _this.studentId
                }
                _this.$api.mediaSecCheck(param).then(res => {
                    // console.log('mediaSecCheck succes res:' + JSON.stringify(res))
                    return res.data
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                })
            },
            async submitCard() {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }
                const _this = this

                if (this.permission == '1') {
                    if (this.agencySendType == '1' && this.cityId == 0) {
                        uni.showToast({
                            title: '请选择校园',
                            icon: 'none'
                        })
                        return
                    }
                    if (this.agencySendType == '2' && this.selectSchoolId == 0) {
                        uni.showToast({
                            title: '请选择校园',
                            icon: 'none'
                        })
                        return
                    }
                }

                if (this.permission == '2' && this.studentSort == '3' && this.agencySchoolList.length > 0 && this
                    .agencySchoolId == '') {
                    uni.showToast({
                        title: '请选择校园',
                        icon: 'none'
                    })
                    return
                }

                if (this.selectPartitionData.id == 0) {
                    uni.showToast({
                        title: '请选择分区',
                        icon: 'none'
                    })
                    return
                }

                if (this.content.trim() == '') {
                    uni.showToast({
                        title: '请输入内容',
                        icon: 'none'
                    })
                    return
                }

                if (this.studentSort == '4') {
                    this.agencySchoolId = 'all'
                }

                uni.showLoading({
                    title: '发布中...',
                    mask: true
                })

                const res_content = await this.checkContent(this.content)
                // console.log("return checkContent res_content:" + JSON.stringify(res_content))
                if (res_content) {
                    uni.hideLoading()

                    uni.showToast({
                        title: '内容包含危险信息，请修改',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

                // if (this.imageList.length > 0) {
                //     let imgList = this.imageList
                //     for (var i = 0; i < imgList.length; i++) {
                //         let path = imgList[i]
                //         uni.uploadFile({
                //             url: _this.$configData.file_url_server,
                //             filePath: path,
                //             name: 'file',
                //             formData: {
                //                 type: 'image'
                //             },
                //             success: (uploadFileRes) => {
                //                 console.log('success image uploadFileRes:' + JSON.stringify(
                //                     uploadFileRes))

                //                 _this.uploadImageUrl.push(uploadFileRes.data)

                //                 let res = _this.checkImage(2, uploadFileRes.data)
                //                 console.log("return checkImage res:" + JSON.stringify(res))
                //                 if (res) {
                //                     uni.showToast({
                //                         title: '图片包含危险信息，请重新上传',
                //                         icon: 'none',
                //                         mask: true
                //                     })
                //                     uni.hideLoading()
                //                     return
                //                 }
                //             },
                //             fail: (err) => {

                //             }
                //         })
                //     }
                // }

                // 创建表单数据
                const data = {
                    type: this.cardType,
                    schoolId: this.schoolId,
                    studentId: this.studentId,
                    studentNikeName: this.showNikeName,
                    content: this.content,
                    address: this.addressData,
                    partition: this.selectPartitionData,
                    access_token: this.access_token,
                    agencySchoolId: this.agencySchoolId,
                    agencySendType: this.agencySendType,
                    cityId: this.cityId,
                    selectSchoolId: this.selectSchoolId
                }

                // 如果没有图片和视频，直接提交内容
                if (this.imageList.length == 0 && this.videoUrl == '') {
                    const param = {
                        data: JSON.stringify(data)
                    };
                    this.$api.saveCardData(param).then(res => {
                        // console.log('saveCardData succes res:' + JSON.stringify(res))
                        uni.hideLoading()

                        const cardData = res.data
                        const cardId = cardData.cardId
                        const sectionId = cardData.sectionId
                        const sectionName = cardData.sectionName
                        console.log('cardId:' + cardId)
                        console.log('sectionId:' + sectionId)
                        console.log('sectionName:' + sectionName)

                        // this.generateImage(cardId, this.content)

                        uni.showToast({
                            title: '发布成功',
                            icon: 'none'
                        })
                        this.reset()

                        uni.setStorageSync('section', cardData)
                        uni.switchTab({
                            url: "/pages/index/index"
                        })

                    }).catch(res => {
                        // console.log('saveCardData err res:' + res)
                        uni.hideLoading()
                        // 失败进行的操作
                        uni.showToast({
                            icon: 'error',
                            title: res,
                            mask: true
                        })
                    })
                } else {
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
                                    imagesUrl: _this.uploadImageUrl
                                };
                                this.$api.saveCardData(param).then(res => {
                                    // console.log('saveCardData succes res:' + JSON.stringify(res))

                                    const cardData = res.data
                                    const cardId = cardData.cardId
                                    const sectionId = cardData.sectionId
                                    const sectionName = cardData.sectionName

                                    // this.generateImage(cardId, this.content)
                                    uni.hideLoading()

                                    uni.showToast({
                                        title: '发布成功',
                                        icon: 'none'
                                    })
                                    this.reset()

                                    uni.setStorageSync('section', cardData)
                                    uni.switchTab({
                                        url: "/pages/index/index"
                                    })
                                }).catch(res => {
                                    // console.log('saveCardData err res:' + res)
                                    uni.hideLoading()
                                    // 失败进行的操作
                                    uni.showToast({
                                        icon: 'error',
                                        title: res,
                                        mask: true
                                    })
                                })
                            })
                            .catch((err) => {
                                // console.log('error image err:' + err)
                                uni.hideLoading()
                                uni.showToast({
                                    icon: 'error',
                                    title: err,
                                    mask: true
                                })
                            })
                    }


                    // 上传视频
                    if (this.videoUrl != '') {
                        const videoPromise = new Promise((resolve, reject) => {
                            console.log('this.videoUrl:' + this.videoUrl)
                            uni.uploadFile({
                                url: this.$configData.file_url_server,
                                filePath: this.videoUrl,
                                name: 'file',
                                formData: {
                                    type: 'video'
                                },
                                success: (res) => resolve(res),
                                fail: (err) => reject(err)
                            })
                        })

                        // 执行所有上传
                        Promise.all([videoPromise])
                            .then((res) => {
                                if (res.length > 0) {
                                    for (let i = 0; i < res.length; i++) {
                                        const data = JSON.parse(res[i].data)
                                        const url = data.data
                                        console.log('url:' + url)
                                        _this.uploadVideoUrl = url
                                    }
                                }

                                const param = {
                                    data: JSON.stringify(data),
                                    videoUrl: _this.uploadVideoUrl
                                };
                                this.$api.saveCardData(param).then(res => {
                                    // console.log('saveCardData succes res:' + JSON.stringify(
                                    //     res))

                                    const cardData = res.data
                                    const cardId = cardData.cardId
                                    const sectionId = cardData.sectionId
                                    const sectionName = cardData.sectionName

                                    // this.generateImage(cardId, this.content)
                                    uni.hideLoading()

                                    uni.showToast({
                                        title: '发布成功',
                                        icon: 'none'
                                    })
                                    this.reset()

                                    uni.setStorageSync('section', cardData)
                                    uni.switchTab({
                                        url: "/pages/index/index"
                                    })
                                }).catch(res => {
                                    // console.log('saveCardData err res:' + res)
                                    uni.hideLoading()
                                    // 失败进行的操作
                                    uni.showToast({
                                        icon: 'error',
                                        title: res,
                                        mask: true
                                    })
                                })
                            })
                            .catch((err) => {
                                // console.log('error video err:' + err)
                                uni.hideLoading()
                                uni.showToast({
                                    icon: 'error',
                                    title: err,
                                    mask: true
                                })
                            })
                    }
                }
            },
            generateImage(cardId, content) {
                const _this = this
                const canvasWidth = 300;
                const canvasHeight = (canvasWidth / 5) * 4
                const fontSize = 18
                let text = content
                const fontFamily = 'Arial'
                const lineHeight = 1.5
                if (text.length > 80) {
                    text = text.substring(0, 80)
                }

                // 获取canvas上下文
                const ctx = uni.createCanvasContext('myCanvas', this);
                const padding = 20; // 内边距
                const maxWidth = canvasWidth - padding * 2; // 文字最大宽度
                const maxHeight = canvasHeight - padding * 2; // 文字最大高度

                ctx.setFillStyle('#94D4D2');
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                ctx.draw();

                // 设置字体样式
                ctx.setFontSize(fontSize);
                ctx.setFillStyle('#F3F3F3'); // 文字颜色
                ctx.setTextAlign('center'); // 文字水平居中

                // 文字换行和超出处理
                const lines = [];
                let line = '';
                let totalHeight = 0;
                const characters = text.split('');
                const font = `${fontSize}px ${fontFamily}`;

                for (let i = 0; i < characters.length; i++) {
                    // 测量当前行文本宽度
                    const metrics = ctx.measureText(line + characters[i]);
                    if (metrics.width > maxWidth && line !== '') {
                        // 如果当前行宽度超过最大宽度，则换行
                        lines.push(line);
                        line = characters[i];
                        // 计算总高度，如果已经超过最大高度，则停止处理后续文字
                        totalHeight += fontSize * lineHeight;
                        if (totalHeight > maxHeight) {
                            break;
                        }
                    } else {
                        line += characters[i];
                    }
                }
                lines.push(line); // 添加最后一行

                // 计算垂直起始位置，使文字整体垂直居中
                const textBlockHeight = lines.length * fontSize * lineHeight;
                const startY = padding + (maxHeight - textBlockHeight) / 2 + fontSize; // 垂直居中调整，加上fontSize是为了基准线对齐

                // 绘制每一行文字
                for (let i = 0; i < lines.length; i++) {
                    // 确保不会绘制到canvas底部之外
                    if (startY + i * (fontSize * lineHeight) <= canvasHeight - padding) {
                        ctx.fillText(lines[i], canvasWidth / 2, startY + i * (fontSize * lineHeight));
                    }
                }

                // 绘制到canvas
                ctx.draw(true, () => {
                    // 导出canvas为图片
                    uni.canvasToTempFilePath({
                        canvasId: 'myCanvas',
                        success: (res) => {
                            console.log('tempFilePath:' + res.tempFilePath)
                            uni.uploadFile({
                                url: _this.$configData
                                    .file_url_server, //仅为示例，非真实的接口地址
                                filePath: res.tempFilePath, // 输出图片的临时路径
                                name: 'file',
                                formData: {
                                    type: 'image'
                                },
                                success: (uploadFileRes) => {
                                    const url = JSON.parse(uploadFileRes.data)
                                    const shareImgUrl = url.data

                                    const param = {
                                        cardId: cardId,
                                        shareImgUrl: shareImgUrl
                                    };
                                    _this.$api.updateShareImageUrl(param).then(res => {
                                        // console.log('updateShareImageUrl succes res:' + JSON.stringify(
                                        //     res))
                                    }).catch(res => {
                                        // 失败进行的操作
                                        uni.showToast({
                                            icon: 'error',
                                            title: res,
                                            mask: true
                                        })
                                    })
                                }
                            });
                        },
                        fail: (err) => {
                            console.error('导出图片失败:', err);
                        }
                    }, _this);
                });
            },
        }
    }
</script>

<style>
    .content {
        position: relative;
    }

    .contentInsideView {
        width: 90%;
        padding: 0 37rpx 37rpx 44rpx;
        background-color: #FFFFFF;
        position: absolute;
        z-index: 1;
    }

    .sendCardTopView {
        height: 77rpx;
        border-bottom: 2rpx solid #F3F3F1;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 27rpx;
    }

    .sendCardTopLeftView {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .sendCardTopPartitionView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 20rpx;
    }

    .topPartitionImg {
        width: 40rpx;
        height: 40rpx;
    }

    .topPartitionText {
        margin-left: 10rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .sendCardTopRightView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: auto 0 auto auto;
    }

    .topRightText {
        margin-right: 10rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 38rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .sendCardContentView {
        margin-top: 27rpx;
    }

    .sendCardContentTextarea {
        width: 93%;
        height: 400rpx;
        border-radius: 20rpx;
        padding: 20rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .textareaPlaceholder {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .sendCardUploadView {
        margin-top: 27rpx;
        display: flex;
        flex-direction: row;
    }

    .uploadImageView {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .uploadImageContentView {
        width: 150rpx;
        height: 150rpx;
        margin-right: 15rpx;
        margin-bottom: 10rpx;
        position: relative;
    }

    .uploadImageContentDeleteImg {
        width: 37rpx;
        height: 37rpx;
        position: absolute;
        z-index: 2;
        top: 10rpx;
        right: 8rpx;
    }

    .uploadImageContentImg {
        width: 100%;
        height: 100%;
        border-radius: 19rpx;
    }

    .uploadImageBtnView {
        width: 150rpx;
        height: 150rpx;
        background: #F7F7F7;
        border-radius: 19rpx;
        border: 2rpx solid #F3F3F1;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .uploadImageBtnImg {
        width: 44rpx;
        height: 37rpx;
    }

    .uploadImageBtnText {
        margin-top: 2rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .uploadVideoView {
        margin-left: 20rpx;
    }

    .uploadVideoContentView {
        /* width: 150rpx; */
        /* height: 150rpx; */
        position: relative;
    }

    .uploadVideoContentDeleteImg {
        width: 37rpx;
        height: 37rpx;
        position: absolute;
        z-index: 2;
        top: 10rpx;
        right: 8rpx;
    }

    .uploadVideoBtnView {
        width: 150rpx;
        height: 150rpx;
        background: #F7F7F7;
        border-radius: 19rpx;
        border: 2rpx solid #F3F3F1;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .uploadVideoBtnImg {
        width: 44rpx;
        height: 37rpx;
    }

    .uploadVideoBtnText {
        margin-top: 2rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .sendCardLocationView {
        height: 51rpx;
        border-top: 2rpx solid #F3F3F1;
        border-bottom: 2rpx solid #F3F3F1;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 29rpx;
        padding: 20rpx 0 20rpx 20rpx;
    }

    .sendCardLocationImg {
        width: 33rpx;
        height: 40rpx;
    }

    .sendCardLocationText {
        width: 70%;
        margin-left: 12rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .sendCardLocationRightView {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: auto 0 auto auto;
    }

    .locationRightText {
        margin-right: 10rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 38rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .sendCardButtonView {
        width: 88%;
        position: fixed;
        bottom: 20rpx;
    }

    .sendCardButton {
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }

    .popupContentTitle {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 10rpx;
        border-bottom-color: 1rpx sold #858585;
    }

    .picker-view {
        height: 600rpx;
        margin: 20rpx 0;
    }

    .item {
        line-height: 70rpx;
        text-align: center;
    }

    .changeSchoolInput {
        border: 2rpx solid #e5e5e5;
        border-radius: 10rpx;
        font-size: 25rpx;
        padding: 0 20rpx;
        height: 68rpx;
        display: flex;
        align-items: center;
        color: #808080;
    }
</style>