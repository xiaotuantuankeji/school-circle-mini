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

        <view class="contentInside">
            <!-- #ifdef H5 -->
            <view class="h5PageTitle">选择学校</view>
            <!-- #endif -->
            <view class="topSearchView">
                <view class="topSearchInputView">
                    <image class="topSearchInputImg" src="/static/img/other/search.png"></image>
                    <input class="topSearchInput" type="text" v-model="searchValue" placeholder="请输入..."
                        placeholder-class="topSearchInputPlaceholder" confirm-type="search"
                        @confirm="searchSchoolClick">
                </view>
            </view>

            <!-- <view class="chooseSchoolNowView">
                <view class="titleView">
                    <view>
                        <view class="titleTextView">当前选择</view>
                        <view class="titleLineView"></view>
                    </view>
                </view>
                <view class="chooseSchoolContentView">
                    <view class="chooseSchoolContentItemView">
                        <image class="schoolImg" :src="selectSchoolData.schoolIcon">
                        </image>
                        <view class="schoolRightView">
                            <view class="schoolRightText">{{selectSchoolData.schoolName}}</view>
                            <view class="schoolRightStatusText">{{selectSchoolData.schoolStatus}}</view>
                        </view>
                        <image class="schoolRightCheckImg" src="/static/img/other/check.png"></image>
                    </view>
                </view>
            </view> -->

            <view class="schoolView">
                <view class="titleView">
                    <view>
                        <view class="titleTextView">已开通院校</view>
                        <view class="titleLineView"></view>
                    </view>
                </view>
                <!-- <view class="schoolDataView">

                    <view class="schoolDataItemView" v-for="(item, idx) in openSchoolData" :key="idx"
                        @click="chooseSchool(item)">
                        <image class="schoolDataItemImg" :src="item.iconUrl">
                        </image>
                        <view class="schoolDataItemText">{{item.name}}</view>
                    </view>

                </view> -->

                <view class="schoolListView">
                    <view class="schoolListTextView" v-for="(item, idx) in openSchoolData" :key="idx"
                        @click="chooseSchool(item)">{{item.name}}
                    </view>
                </view>
            </view>

            <!-- <view class="schoolView">
                <view class="titleView">
                    <view>
                        <view class="titleTextView">筹备中院校</view>
                        <view class="titleLineView"></view>
                    </view>
                </view>
                <view class="schoolDataView">

                    <view class="schoolDataItemView" v-for="(item, idx) in prepareSchoolData" :key="idx">
                        <image class="schoolDataItemImg" :src="item.iconUrl">
                        </image>
                        <view class="schoolDataItemText">{{item.name}}</view>
                    </view>

                </view>
            </view> -->

        </view>
    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    export default {
        components: {
            topBackground
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                source: '',
                searchValue: '',

                selectSchoolData: {
                    schoolIcon: '/static/default-school-icon.png',
                    schoolName: '南京艺术学院',
                    schoolStatus: '已开通'
                },
                openSchoolData: [],
                prepareSchoolData: []
            }
        },
        onLoad(opt) {
            let source = opt.source
            if (source == undefined) {
                source = ''
            }
            this.source = source

            this.getSystemInfo()
            this.getList()
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
            getList() {
                uni.showLoading({
                    title: '获取中...',
                    mask: true
                })

                const param = 'searchName=' + this.searchValue
                this.$api.getAllSchoolByStatus(param).then(res => {
                    // console.log('getAllSchoolByStatus succes res:' + JSON.stringify(res))

                    const data = res.data
                    this.openSchoolData = data.openList
                    this.prepareSchoolData = data.prepareList

                    uni.hideLoading()
                }).catch(res => {
                    console.log('getAllSchoolByStatus err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            chooseSchool(item) {
                const status = item.status
                if (status == '4') {
                    uni.showModal({
                        title: '关闭',
                        content: '[' + item.name + ']已被关闭，不能选择该校园',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {

                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                    return;
                }

                const _this = this
                uni.showModal({
                    title: '提示',
                    content: '已选择【' + item.name + '】，是否确认？',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            if (_this.source == 'verify') {
                                uni.navigateBack({
                                    delta: 1, // 返回层数，2则上上页
                                    success() {
                                        uni.$emit('backSelectSchool', item)
                                    }
                                })
                            } else {
                                _this.saveSchoole(item)
                            }
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            saveSchoole(item) {
                uni.showLoading({
                    title: '保存中...',
                    mask: true
                })

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId
                const schoolId = item.id
                const schoolName = item.name

                const param = {
                    studentId: studentId,
                    schoolId: schoolId
                }
                this.$api.saveStudentSchool(param).then(res => {
                    // console.log('saveStudentSchool succes res:' + JSON.stringify(res))

                    userInfo.schoolId = schoolId
                    userInfo.schoolName = schoolName

                    uni.removeStorageSync("userInfo")
                    uni.setStorageSync('userInfo', userInfo)

                    uni.switchTab({
                        url: "/pages/index/index"
                    })

                    uni.hideLoading()
                }).catch(res => {
                    console.log('saveStudentSchool err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            searchSchoolClick() {
                this.getList()
            },
        }
    }
</script>

<style scoped>
    .content {
        width: 100%;
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 16%, #FFFFFF 100%);
        position: relative;
    }

    .contentInside {
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .topSearchView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .topSearchInputView {
        width: 100%;
        padding: 18rpx 25rpx;
        background: linear-gradient(90deg, #F3F3F1 0%, rgba(255, 255, 255, 0) 100%);
        border-radius: 40rpx;
        border: 2rpx solid #000000;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .topSearchInputImg {
        width: 36rpx;
        height: 36rpx;
    }

    .topSearchInput {
        width: 88%;
        margin-left: 22rpx;
    }

    .topSearchInputPlaceholder {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .chooseSchoolNowView {
        display: flex;
        flex-direction: column;
        margin-top: 60rpx;
    }

    .titleView {
        display: flex;
        margin-right: 62rpx;
        position: relative;
    }

    .titleTextView {
        z-index: 2;
    }

    .titleLineView {
        height: 10rpx;
        background: #CCFA10;
        border-radius: 4rpx;
        margin-top: -13rpx;
        z-index: 1;
    }

    .chooseSchoolContentView {
        margin-top: 42rpx;
    }

    .chooseSchoolContentItemView {
        width: 100%;
        height: 104rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #FFFFFF;
        box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(0, 0, 0, 0.16);
        border-radius: 52rpx;
    }

    .schoolImg {
        width: 127rpx;
        height: 127rpx;
    }

    .schoolRightView {
        display: flex;
        flex-direction: column;
        margin-left: 27rpx;
    }

    .schoolRightText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .schoolRightStatusText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #2CABA6;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .schoolRightCheckImg {
        width: 46rpx;
        height: 46rpx;
        margin: auto 25rpx auto auto;
    }

    .schoolView {
        display: flex;
        flex-direction: column;
        margin-top: 40rpx;
    }

    .schoolDataView {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10rpx;
    }

    .schoolDataItemView {
        width: 25%;
        height: 180rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20rpx;
    }

    .schoolDataItemImg {
        width: 92rpx;
        height: 92rpx;
    }

    .schoolDataItemText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #000000;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .schoolListView {
        margin-top: 80rpx;
    }

    .schoolListTextView {
        padding: 10rpx 0;
        display: block;
        width: 100%;
        box-sizing: border-box;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 28rpx;
        color: #000000;
        line-height: 31rpx;
        font-style: normal;
        text-transform: none;
    }

    /* #ifdef H5 */
    /* H5 开发模式 view 默认 inline，需显式 block；元素选择器优先级低于 class，不会覆盖 flex 布局 */
    view {
        display: block;
    }

    .h5PageTitle {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: 500;
        font-size: 36rpx;
        color: #000000;
        line-height: 50rpx;
        text-align: left;
        margin-top: 20rpx;
        margin-bottom: 20rpx;
    }

    .topSearchInput {
        width: 88%;
        height: 40rpx;
        line-height: 40rpx;
        margin-left: 22rpx;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        -webkit-appearance: none;
        font-size: 29rpx;
        color: #000000;
    }
    /* #endif */
</style>