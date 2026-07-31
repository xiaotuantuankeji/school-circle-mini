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

            <view v-if="studentSort=='3'&&permission=='2'&&agencySchoolList.length>0">
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
            <view class="playmateAddTopView">
                <view class="playmateAddTopText">活动类别</view>
                <view class="playmateAddTopTagView">
                    <view class="playmateAddTopTagItemView"
                        :style="(item.id==selectSortId)?'color: #FFFFFF;background: ' + item.backgroundColor:''"
                        v-for="(item, idx) in sortList" :key="idx" @click="sortClick(item)">{{item.name}}
                    </view>
                </view>
            </view>
            <view class="playmateAddTitleView">
                <input class="playmateAddTitleInput" v-model="title" type="text" placeholder="填写清晰的活动主题" />
            </view>
            <view class="playmateAddContentView">
                <textarea class="playmateAddContentTextarea" v-model="content"
                    placeholder="请输入活动详情以及对搭子的要求，以防错过真正想找的人哟~" placeholder-class="textareaPlaceholder"
                    maxlength="1000"></textarea>
            </view>
            <view class="playmateAddUploadView" v-if="is_open_upload == '1'">
                <view class="uploadImageView">
                    <view class="uploadImageContentView" v-for="(item, index) in imageList" :key="index"
                        v-if="imageList.length>0">
                        <image class="uploadImageContentDeleteImg" src="/static/img/other/image-delete.png"
                            @click="deleteImage(index)"></image>
                        <image class="uploadImageContentImg" :src="item" @click="previewImage(index)"></image>
                    </view>
                    <view class="uploadImageBtnView" @click="chooseImage" v-if="imageList.length<9">
                        <uni-icons type="plusempty" color="#CBCBCB" size="30"></uni-icons>
                        <view class="uploadImageBtnText">图片</view>
                    </view>
                </view>
            </view>
            <view class="playmateAddBottomView" style="border-bottom: 2rpx solid #F3F3F1;">
                <view class="playmateAddBottomUserNumView">
                    <image style="width: 33rpx;height: 33rpx;" src="/static/img/other/smiling-face.png"></image>
                    <view class="playmateAddBottomText">活动人数</view>
                </view>
                <view class="playmateAddBottomRightView">
                    <input class="playmateAddBottomRightInput" type="number" v-model="userNum" maxlength="4"
                        placeholder="请输入人数" />
                    <uni-icons type="forward" color="#858585"></uni-icons>
                </view>
            </view>
            <view class="playmateAddBottomView" :style="addressData.name==''?'border-bottom: 2rpx solid #F3F3F1;':''">
                <view class="playmateAddBottomUserNumView">
                    <image style="width: 33rpx;height: 39rpx;" src="/static/img/other/location.png"></image>
                    <view class="playmateAddBottomText">活动地点</view>
                </view>
                <view class="playmateAddBottomRightView" @click="chooseLocationClick">
                    <view class="playmateAddBottomRightInput">{{addressData.name==''?'去选择':addressData.name}}</view>
                    <uni-icons type="forward" color="#858585"></uni-icons>
                </view>
            </view>
            <!-- <view class="playmateAddBottomContentView" v-if="addressData.name!=''">
                <view class="playmateAddBottomContentText">{{addressData.name}}</view>
            </view> -->
            <view class="playmateAddBottomContentView" style="border-bottom: 2rpx solid #F3F3F1;"
                v-if="addressData.name!=''">
                <input type="text" v-model="addressInputVal" placeholder="如有需要，请填写精确地址" />
            </view>
            <view class="playmateAddBottomView" :style="showDateTimeVal==''?'border-bottom: 2rpx solid #F3F3F1;':''">
                <view class="playmateAddBottomUserNumView">
                    <image style="width: 33rpx;height: 33rpx;" src="/static/img/other/time.png"></image>
                    <view class="playmateAddBottomText">活动时间</view>
                </view>
                <view class="playmateAddBottomRightView">
                    <uni-datetime-picker v-model="datetimerange" type="datetimerange" :start="nowDateTime"
                        @change="changeDateTime">
                        <view class="playmateAddBottomRightInput">{{showDateTimeVal==''?'去选择':'重新选择'}}</view>
                    </uni-datetime-picker>
                    <uni-icons type="forward" color="#858585"></uni-icons>
                </view>
            </view>
            <view class="playmateAddBottomContentView" style="border-bottom: 2rpx solid #F3F3F1;"
                v-if="showDateTimeVal!=''">
                <view class="playmateAddBottomContentText">{{showDateTimeVal}}</view>
            </view>
            <view class="playmateAddBottomView" style="border-bottom: 2rpx solid #F3F3F1;">
                <view class="playmateAddBottomUserNumView">
                    <image style="width: 35rpx;height: 25rpx;" src="/static/img/other/join.png"></image>
                    <view class="playmateAddBottomText">谁能加入</view>
                </view>
                <view class="playmateAddBottomRightView">
                    <picker @change="userJoinChange" :value="userJoinIndex" :range="userJoinArray">
                        <view class="playmateAddBottomRightInput" v-if="userJoinIndex>-1">
                            {{userJoinArray[userJoinIndex]}}
                        </view>
                        <view class="playmateAddBottomRightInput" v-else>去选择</view>
                    </picker>
                    <uni-icons type="forward" color="#858585"></uni-icons>
                </view>
            </view>

            <view class="playmateAddButtonView">
                <button class="playmateAddButton" @click="submitPlaymate">发布凑搭</button>
            </view>

        </view>

        <uni-popup ref="schoolPlaymatePopup" type="bottom" background-color="#FFFFFF" :safe-area="false">
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

    </view>
</template>

<script>
    import verifySchool from '../../libs/verify_school'
    import dateUtil from '../../common/util'
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                access_token: '',
                is_open_upload: '0', // 0：关闭，1：打开

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

                sortList: [],
                selectSortId: 0,

                title: '',
                content: '',
                imageList: [],
                userNum: '',

                userJoinIndex: -1,
                userJoinArray: [],

                datetimerange: [],
                showDateTimeVal: '',

                addressData: {
                    name: '', // 位置名称
                    address: '', // 地址
                    latitude: '', // 纬度
                    longitude: '' // 经度
                },
                addressInputVal: '', // 输入的地址

                uploadImageUrl: [],

                nowDateTime: '',
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getLoginInfo()
            this.initializeData()
            this.getPlaymateSort()
            this.getAccessToken()
            this.getSchoolList()
            this.getCityList()
        },
        onShow() {
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
                this.studentId = userInfo.studentId
                this.schoolId = userInfo.schoolId
                this.showNikeName = userInfo.showNikeName
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
            initializeData() {
                this.userJoinArray = [
                    '不限',
                    '本校'
                ]

                this.nowDateTime = dateUtil.getNowDate() + ' ' + dateUtil.getNowTime()
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
                this.$refs.schoolPlaymatePopup.open()
            },
            closePopup() {
                this.$refs.schoolPlaymatePopup.close()
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
            getPlaymateSort() {
                const param = ''
                this.$api.getPlaymateSort(param).then(res => {
                    // console.log('getPlaymateSort succes res:' + JSON.stringify(res))

                    this.sortList = res.data
                }).catch(res => {
                    console.log('getPlaymateSort err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            async sortClick(item) {
                const isFreeze = await verifySchool.verifySchoolIsFreeze();
                if (isFreeze) {
                    return;
                }
                this.selectSortId = item.id
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
            userJoinChange: function(e) {
                this.userJoinIndex = e.detail.value
            },
            changeDateTime(e) {
                // console.log('e:' + e)
                this.showDateTimeVal = e[0] + ' 至 ' + e[1]
            },
            async chooseLocationClick() {
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
            checkImage(path) {
                const _this = this
                return new Promise((resolve, reject) => {
                    uni.uploadFile({
                        url: "https://api.weixin.qq.com/wxa/img_sec_check?access_token=" + _this
                            .access_token,
                        filePath: path,
                        name: 'file',
                        formData: {
                            media: path
                        },
                        success: (res) => resolve(res.data),
                        fail: (err) => reject(err)
                    })
                })
            },
            async submitPlaymate() {
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

                if (this.selectSortId == 0) {
                    uni.showToast({
                        title: '请选择类别',
                        icon: 'none'
                    })
                    return
                }

                if (this.title.trim() == '') {
                    uni.showToast({
                        title: '请输入主题',
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

                if (this.userNum == '' || this.userNum <= 0) {
                    uni.showToast({
                        title: '输入活动人数非法',
                        icon: 'none'
                    })
                    return
                }

                if (this.addressData.name == '') {
                    uni.showToast({
                        title: '请选择活动地点',
                        icon: 'none'
                    })
                    return
                }

                if (this.showDateTimeVal == '') {
                    uni.showToast({
                        title: '请选择活动时间',
                        icon: 'none'
                    })
                    return
                }
                if (this.datetimerange[1] <= this.datetimerange[0]) {
                    uni.showToast({
                        title: '结束时间不能大于或等于开始时间',
                        icon: 'none'
                    })
                    return
                }
                const nowDateTime = dateUtil.getNowDate() + ' ' + dateUtil.getNowTime()
                if (this.datetimerange[1] <= nowDateTime) {
                    uni.showToast({
                        title: '结束时间必须大于当前时间',
                        icon: 'none'
                    })
                    return
                }

                if (this.userJoinIndex == -1) {
                    uni.showToast({
                        title: '请选择谁能加入',
                        icon: 'none'
                    })
                    return
                }

                if (this.studentSort == '4') {
                    this.agencySchoolId = 'all'
                }

                this.getLoginInfo()

                uni.showLoading({
                    title: '发布中...',
                    mask: true
                })

                const res_title = await this.checkContent(this.title)
                // console.log("return checkContent res_title:" + JSON.stringify(res_title))
                if (res_title) {
                    uni.hideLoading()

                    uni.showToast({
                        title: '主题包含危险信息，请修改',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

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
                //     for (var i = 0; i < this.imageList.length; i++) {
                //         let path = this.imageList[i]
                //         console.log('path:' + path)
                //         let res = await _this.checkImage(path)
                //         // console.log("return checkImage res:" + JSON.stringify(JSON.parse(res)))
                //         if (JSON.parse(res).errcode == 87014) {
                //             uni.showToast({
                //                 title: '图片内容包含危险信息，请修改后上传',
                //                 icon: 'none',
                //                 mask: true
                //             })
                //             uni.hideLoading()
                //             return
                //         }
                //     }
                // }

                if (this.addressInputVal != '') {
                    this.addressData.name = this.addressData.name + '#' + this.addressInputVal
                }

                const joinType = parseInt(this.userJoinIndex) + 1

                // 创建表单数据
                const data = {
                    selectSortId: this.selectSortId,
                    schoolId: this.schoolId,
                    studentId: this.studentId,
                    nikeName: this.showNikeName,
                    title: this.title,
                    content: this.content,
                    userNum: this.userNum,
                    address: this.addressData,
                    dateTimeRange: this.datetimerange,
                    joinType: joinType,
                    access_token: this.access_token,
                    agencySchoolId: this.agencySchoolId,
                    agencySendType: this.agencySendType,
                    cityId: this.cityId,
                    selectSchoolId: this.selectSchoolId
                }

                // 如果没有图片和视频，直接提交内容
                if (this.imageList.length == 0) {
                    const param = {
                        data: JSON.stringify(data)
                    };
                    this.$api.savePlaymateData(param).then(res => {
                        // console.log('savePlaymateData succes res:' + JSON.stringify(res))
                        uni.showToast({
                            title: '发布成功',
                            icon: 'none'
                        })

                        const pages = getCurrentPages();
                        const prevPage = pages[pages.length - 2]; //上一个页面

                        uni.navigateBack({
                            success: function(res) {
                                prevPage.$vm.getPlaymateList()
                            }
                        })

                        uni.hideLoading()
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
                } else {
                    // 上传图片
                    if (this.imageList.length > 0) {
                        const playmateImagePromises = this.imageList.map((path, index) => {
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
                        Promise.all(playmateImagePromises)
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
                                this.$api.savePlaymateData(param).then(res => {
                                    // console.log('savePlaymateData succes res:' + JSON.stringify(res))
                                    uni.showToast({
                                        title: '发布成功',
                                        icon: 'none'
                                    })

                                    const pages = getCurrentPages();
                                    const prevPage = pages[pages.length - 2]; //上一个页面

                                    uni.navigateBack({
                                        success: function(res) {
                                            prevPage.$vm.getPlaymateList()
                                        }
                                    })

                                    uni.hideLoading()
                                }).catch(res => {
                                    // console.log('savePlaymateData err res:' + res)
                                    // 失败进行的操作
                                    uni.showToast({
                                        icon: 'error',
                                        title: res.msg,
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
                }
            }
        }
    }
</script>

<style>
    .content {}

    .contentInsideView {
        padding: 20rpx 37rpx 37rpx 44rpx;
    }

    .playmateAddTopView {
        display: flex;
        flex-direction: column;
        border-top: 2rpx solid #F3F3F1;
        border-bottom: 2rpx solid #F3F3F1;
        margin-top: 10rpx;
    }

    .playmateAddTopText {
        margin-top: 17rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateAddTopTagView {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        margin-bottom: 20rpx;
        margin-top: 20rpx;
    }

    .playmateAddTopTagItemView {
        background: #F3F3F1;
        border-radius: 31rpx;
        padding: 8rpx 26rpx;
        flex: 0 0 10%;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .playmateAddTitleView {
        border-bottom: 2rpx solid #F3F3F1;
        padding: 20rpx 0;
    }

    .playmateAddTitleInput {
        height: 40rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateAddContentView {
        margin-top: 10rpx;
    }

    .playmateAddContentTextarea {
        width: 100%;
        height: 400rpx;
        border-radius: 20rpx;
        padding: 20rpx 0;

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

    .playmateAddUploadView {
        margin-top: 27rpx;
        display: flex;
        flex-direction: row;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #F3F3F1;
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

    .playmateAddBottomView {
        height: 70rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .playmateAddBottomContentView {
        padding-left: 40rpx;
    }

    .playmateAddBottomContentText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 27rpx;
        color: #858585;
        line-height: 38rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateAddBottomUserNumView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .playmateAddBottomText {
        margin-left: 23rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .playmateAddBottomRightView {
        width: 70%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }

    .playmateAddBottomRightInput {
        text-align: right;
        margin-right: 10rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 38rpx;
        font-style: normal;
        text-transform: none;

        white-space: nowrap;
        /* 控制元素不换行 */
        overflow: hidden;
        /* p标签超出部分隐藏*/
        text-overflow: ellipsis;
        /* 文本超出部分为省略号 */
    }

    .playmateAddButtonView {
        display: flex;
        justify-content: center;
        margin-top: 40rpx;
        margin-bottom: 20rpx;
    }

    .playmateAddButton {
        width: 80%;
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