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

        <!-- 自定义导航栏 -->
        <view class="navBarBox">
            <!-- 状态栏占位 -->
            <view class="statusBar" :style="{ paddingTop:statusBarHeight+'px' }"></view>
            <!--paddingTop是导航栏的顶部到手机顶部的距离，即显示wifi和电量的部分-->
            <!-- 真正的导航栏内容 ，即与胶囊平行部分-->
            <view class="navBar" :style="{ height:navBarHeight+'px' }">
                <view style="display: flex;align-items: center;">
                    <image src="../../static/img/logo/default-avatar.png"
                        style="width: 63rpx;height: 63rpx;border-radius: 50%;"></image>
                </view>
                <view style="display: flex;flex-direction: column;margin-left: 16rpx;">
                    <view
                        style="font-size: 28rpx;font-weight: 700;color: #000000;font-family: PangMenZhengDao, PangMenZhengDao;">
                        团团校园</view>
                    <view style="font-size: 20rpx;color: #000000;font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;">
                        {{loginSchoolName}}
                    </view>
                </view>
            </view>
        </view>

        <view :style="{width: winWidth + 'px',height: (winHeight - statusBarHeight - navBarHeight) + 'px'}"
            style="overflow-y: auto;position: relative;">
            <view style="width: 100%;position: fixed;display: flex;justify-content: flex-end;z-index: 1;">
                <image src="/static/img/other/more-round-dot.png" style="height: 88rpx;" mode="heightFix"></image>
            </view>

            <view class="contentInside">
                <view class="topSearchView">
                    <view class="topSearchLeftView">
                        <image class="topSearchLeftImg" src="/static/img/other/search.png"></image>
                        <input class="topSearchLeftInput" type="text" v-model="searchContent" placeholder="请输入内容"
                            confirm-type="search" @confirm="searchClick" />
                    </view>
                </view>

                <view class="swiperView">
                    <swiper-image :swiperList="swiperList"></swiper-image>
                </view>

                <view class="topButtonView">
                    <view class="topButtonLeftView">
                        <image class="topButtonRightImg" src="/static/img/playmate/my-join.png" @click="typeClick(2)">
                        </image>
                    </view>
                    <view class="topButtonRightView">
                        <image class="topButtonRightImg" src="/static/img/playmate/add-btn.png" @click="addClick">
                        </image>
                    </view>
                </view>

                <view class="scrollView">
                    <view class="sortChangeLayerView">
                        <view class="middleMenuTextAllView">
                            <view class="middleMenuTextAllItem" @click="typeClick(0)">
                                <view class="middleMenuText">全部</view>
                                <view class="middleMenuTextBottomLineView" v-if="menuType==0"></view>
                            </view>
                            <view class="middleMenuTextAllItem">
                                <view class="middleMenuText">/</view>
                            </view>
                            <view class="middleMenuTextAllItem" @click="typeClick(1)">
                                <view class="middleMenuText">本校</view>
                                <view class="middleMenuTextBottomLineView" v-if="menuType==1"></view>
                            </view>
                        </view>
                        <view class="scroll-view-item" :id="'item' + item.id" v-if="sortList.length>0"
                            v-for="(item, idx) in sortList" :key="idx" @click="sortClick(item.id)">
                            <view class="middleMenuText">{{item.name}}</view>
                            <view class="middleMenuTextBottomLineView" v-if="menuSort==item.id"></view>
                        </view>
                    </view>

                    <!-- <view class="middleMenuTextAllView" @click="typeClick">
                        <view>
                            <view class="middleMenuText" v-if="menuType==0">全部</view>
                            <view class="middleMenuText" v-if="menuType==1">本校</view>
                            <view class="middleMenuText" v-if="menuType==2">我的</view>
                            <view class="middleMenuTextBottomLineView"></view>
                        </view>
                        <uni-icons type="down" color="#000000"></uni-icons>
                    </view>
                    <scroll-view :scroll-x="true" show-scrollbar="false"
                        style="white-space: nowrap;padding-top: 10rpx;width: 74%;padding-left: 20rpx;"
                        :scroll-into-view="sortInto">
                        <view class="scroll-view-item" :id="'item' + item.id" v-if="sortList.length>0"
                            v-for="(item, idx) in sortList" :key="idx" @click="sortClick(item.id)">
                            <view class="middleMenuText">{{item.name}}</view>
                            <view class="middleMenuTextBottomLineView" v-if="menuSort==item.id"></view>
                        </view>
                    </scroll-view>
                    <view class="sortChangeView" @click="openSortClick">
                        <uni-icons type="down" v-if="!isSortOpen"></uni-icons>
                        <uni-icons type="up" v-if="isSortOpen"></uni-icons>
                    </view>
                    <view class="sortChangeLayerView" v-if="isSortOpen">
                        <view class="sortChangeLayerItemView" v-if="sortList.length>0" v-for="(item, idx) in sortList"
                            :key="idx" @click="sortLayerClick(item.id)">
                            <view class="sortChangeLayerItemText"
                                :class="menuSort==item.id?'sortChangeLayerItemCheck':''">{{item.name}}</view>
                        </view>
                    </view> -->
                </view>

                <view class="bottomPlayMateCardView">
                    <playmate-skeleton v-if="isFirstLoading" :count="3" />
                    <template v-else>
                    <view class="bottomPlayMateItemsCardView" v-for="(item, idx) in playmateList" :key="idx"
                        @click="openDetail(item)">
                        <view class="bottomPlayMateItemsLayerCardView" v-if="item.status=='4' || item.status=='5'">
                        </view>
                        <view class="itemsCardInsideView">
                            <view class="itemsCardTopView">
                                <view class="itemsCardTopLeftView">
                                    <image class="itemsCardTopLeftImg"
                                        src="/static/img/playmate/default-playmate-img.png"
                                        v-if="item.pictureList.length==0" mode="aspectFill"></image>
                                    <image class="itemsCardTopLeftImg" :src="item.pictureList[0].pictureUrl" v-else
                                        mode="aspectFill"></image>

                                    <image class="itemsCardTopLeftLabelImg" src="/static/img/playmate/in_progress.png"
                                        v-if="item.status=='1'"></image>
                                    <image class="itemsCardTopLeftLabelImg" src="/static/img/playmate/finish.png"
                                        v-if="item.status=='2'"></image>
                                    <image class="itemsCardTopLeftLabelImg" src="/static/img/playmate/expire.png"
                                        v-if="item.status=='3'"></image>
                                    <image class="itemsCardTopLeftLabelImg" src="/static/img/playmate/disband.png"
                                        v-if="item.status=='4'"></image>
                                    <image class="itemsCardTopLeftLabelImg" src="/static/img/playmate/ban.png"
                                        v-if="item.status=='5'"></image>
                                </view>
                                <view class="itemsCardTopRightView">
                                    <view class="itemsCardTopRightTitleView">
                                        <label class="itemsCardTopRightTitleLabelView"
                                            :style="'background: ' + item.sortBackgroundColor">{{item.sortName}}</label>
                                        <label class="itemsCardTopRightTitleText">{{item.title}}</label>
                                    </view>
                                    <view class="itemsCardTopRightContentView">
                                        <view class="itemsCardTopRightContentText">
                                            <text>{{item.content}}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="itemsCardBottomView"
                                @click.native.stop="toUserDetailClick(item.studentId, item.nikeNameId)">
                                <view class="myInfoAvatarView">
                                    <image class="itemsCardBottomImg" src="/static/img/logo/default-avatar.png"
                                        v-if="item.avatar==''"></image>
                                    <image class="itemsCardBottomImg" :src="item.avatar" v-else></image>
                                    <image class="avatarImgIcon" :src="`/static/img/my/${item.identityIconName}.png`"
                                        v-if="item.identityIconName!=''"></image>
                                </view>
                                <view class="itemsCardBottomName">
                                    <view>{{item.nikeName}}</view>
                                    <image class="userInfoSexImg" src="/static/img/other/male.png" v-if="item.sex=='1'">
                                    </image>
                                    <image class="userInfoSexImg" src="/static/img/other/woman.png"
                                        v-if="item.sex=='2'"></image>
                                    <image class="userInfoAuthImg" src="/static/img/other/auth_student.png"
                                        v-if="item.studentStatus=='2'&&item.studentSort!='3'&&item.studentSort!='4'">
                                    </image>
                                </view>
                                <view class="itemsCardBottomTime">{{formatTime(item.createTime)}}</view>
                            </view>
                        </view>
                    </view>
                    </template>

                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import util from '../../common/util';
    import playmateSkeleton from '../../components/skeleton/playmate-skeleton.vue'
    export default {
        components: {
            playmateSkeleton
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                // 状态栏高度
                statusBarHeight: 0,
                // 导航栏高度
                navBarHeight: 0,

                loginStudentId: '',
                loginSchoolId: '',
                loginStudentSort: '',
                loginSchoolName: '',

                isResetPage: false,

                isFirstLoading: true,

                playmateList: [],

                searchContent: '',
                swiperList: [],
                menuType: '0', // 0:全部，1:本校，2:我的
                sortList: [],
                menuSort: '0', //sortId:分类ID
                isSortOpen: false, // 是否打开类别选择
                sortInto: '',

                isPullDownRefresh: false,
            }
        },
        onLoad() {
            this.getSystemInfo()
            this.getLoginInfo()
            this.getCarouselImageInfo()
            this.getPlaymateSort()
            this.getPlaymateList()
        },
        onPullDownRefresh() {
            console.log('refresh');

            this.isPullDownRefresh = true

            this.isResetPage = true
            this.getPlaymateList()
        },
        methods: {
            formatTime(time) {
                return util.getDateBeforeNow(time)
            },
            // 获取设备信息
            getSystemInfo() {
                const that = this
                uni.getSystemInfo({
                    success: function(res) {
                        that.winWidth = res.windowWidth
                        that.winHeight = res.windowHeight

                        //获取手机状态栏高度
                        that.statusBarHeight = res.statusBarHeight
                        // console.log('状态栏高度:' + that.statusBarHeight);

                        // #ifdef MP-WEIXIN
                        // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
                        const custom = wx.getMenuButtonBoundingClientRect()
                        // console.log('胶囊的位置信息:' + custom)

                        // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
                        that.navBarHeight = custom.height + (custom.top - that.statusBarHeight) * 2
                        // console.log("导航栏高度：" + that.navBarHeight)

                        // #endif
                    }
                });
            },
            // 获取当前登录用户信息
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
                this.loginSchoolId = userInfo.schoolId
                this.loginStudentSort = userInfo.sort
                this.loginSchoolName = userInfo.schoolName
            },
            verifyStatus() {
                let isOperate = false
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

                            }
                        }
                    })
                } else if (status == '3') {
                    // 审核中
                    uni.showModal({
                        title: '院校认证',
                        content: '正在审核中，请稍后！',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {

                            }
                        }
                    })
                } else if (banLevel == '5') {
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
                    let content = '你的账户因[' + banReason + ']，已被禁止发布搭子'
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

                            }
                        }
                    })
                } else {
                    isOperate = true
                }
                return isOperate
            },
            getCarouselImageInfo() {
                const param = 'type=8&schoolId=' + this.loginSchoolId
                this.$api.getCarouselImageInfo(param).then(res => {
                    // console.log('getCarouselImageInfo succes res:' + JSON.stringify(res))

                    this.swiperList = res.data
                }).catch(res => {
                    console.log('getCarouselImageInfo err res:' + res)
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
            typeClick(type) {
                this.menuType = type
                this.isResetPage = true
                this.getPlaymateList()

                // let _this = this
                // uni.showActionSheet({
                //     itemList: ['全部', '本校', '我的'],
                //     success: function(res) {
                //         _this.menuType = res.tapIndex
                //         _this.isResetPage = true
                //         _this.getPlaymateList()
                //     },
                //     fail: function(res) {
                //         console.log(res.errMsg);
                //     }
                // })
            },
            sortClick(sortId) {
                const menuSort = this.menuSort
                if (menuSort == sortId) {
                    this.menuSort = '0'
                } else {
                    this.menuSort = sortId
                }
                this.isResetPage = true
                this.getPlaymateList()
            },
            sortLayerClick(sortId) {
                this.sortClick(sortId)
                this.isSortOpen = false

                this.sortInto = 'item' + sortId
            },
            openSortClick() {
                if (this.isSortOpen) {
                    this.isSortOpen = false
                } else {
                    this.isSortOpen = true
                }
            },
            addClick() {
                if (this.verifyStatus()) {
                    uni.navigateTo({
                        url: '/package-playmate/playmate-add/playmate-add'
                    })
                }
            },
            searchClick() {
                this.isResetPage = true
                this.getPlaymateList()
            },
            getPlaymateList() {
                let menuSort = ''
                let menuType = ''
                if (this.isPullDownRefresh) {
                    menuSort = '0'
                    menuType = '0'
                    this.searchContent = ''
                } else {
                    menuSort = this.menuSort
                    menuType = this.menuType
                }

                const param = 'loginSchoolId=' + this.loginSchoolId + '&loginStudentId=' + this.loginStudentId +
                    '&searchContent=' + this.searchContent + '&menuType=' + menuType + '&menuSort=' + menuSort;
                this.$api.getPlaymateList(param).then(res => {
                    // console.log('getPlaymateList succes res:' + JSON.stringify(res))

                    this.isFirstLoading = false

                    if (this.isResetPage) {
                        this.playmateList = []
                        this.isResetPage = false
                    }

                    if (this.isPullDownRefresh) {
                        this.playmateList = []
                        this.playmateList = res.data
                        this.isPullDownRefresh = false
                        uni.stopPullDownRefresh()
                    } else {
                        this.playmateList = res.data
                    }
                }).catch(res => {
                    // console.log('getPlaymateList err res:' + res)
                    // 失败进行的操作
                    this.isFirstLoading = false
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                })
            },
            openDetail(item) {
                const status = item.status
                if (status == '4' || status == '5') {
                    let title = ''
                    if (item.reason == '') {
                        title = '因为违反社区规定，此局已经被管理员解散'
                    } else {
                        title = item.reason
                    }
                    uni.showToast({
                        title: title,
                        mask: true,
                        icon: 'none'
                    })
                } else {
                    uni.navigateTo({
                        url: '/package-playmate/playmate-detail/playmate-detail?playmateId=' + item.id
                    })
                }
            },
            toUserDetailClick(studentId, nikeNameId) {
                if (studentId == this.loginStudentId) {
                    nikeNameId = ''
                }
                uni.navigateTo({
                    url: '/package-user/my-home/my-home?lookStudentId=' + studentId + '&lookNikeNameId=' +
                        nikeNameId
                })
            },
        }
    }
</script>

<style>
    .content {
        overflow-y: hidden;
        background: linear-gradient(181deg, rgba(44, 171, 166, 1) 0%, rgba(243, 243, 241, 1) 30%, rgba(243, 243, 241, 1) 100%);
    }

    .common-bg {
        width: 280rpx;
        height: 53rpx;
        position: absolute;
    }

    .navBarBox {
        padding-right: 240rpx;
    }

    .navBar {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 40rpx;
    }

    .navText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        letter-spacing: 30px;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .contentInside {
        width: 89%;
        position: absolute;
        z-index: 2;
        padding: 7.7rpx 42rpx 42rpx 40rpx;
    }

    .topSearchView {
        display: flex;
        flex-direction: row;
    }

    .topSearchLeftView {
        width: 100%;
        height: 46rpx;
        background: linear-gradient(90deg, #F3F3F1 0%, rgba(255, 255, 255, 0) 100%);
        border-radius: 40rpx 40rpx 40rpx 40rpx;
        border: 2rpx solid #000000;
        display: flex;
        align-items: center;
        padding: 12rpx 25rpx;
    }

    .topSearchLeftImg {
        width: 36rpx;
        height: 36rpx;
    }

    .topSearchLeftInput {
        width: 90%;
        margin-left: 20rpx;
    }

    .topButtonLeftView {
        width: 51%;
        position: absolute;
    }

    .topButtonRightView {
        width: 51%;
        position: absolute;
        left: 48%;
    }

    .topButtonRightImg {
        width: 100%;
        height: 75rpx;
    }

    .swiperView {
        height: 302rpx;
        margin-top: 20rpx;
    }

    .topButtonView {
        height: 120rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .scrollView {
        height: 140rpx;
        display: flex;
        flex-direction: row;
        align-items: baseline;
        position: relative;
    }

    .middleMenuTextAllView {
        display: flex;
        flex-direction: row;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-right: 40rpx;

        position: relative;
    }

    .middleMenuTextAllItem {
        display: inline-block;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .scroll-view-item {
        display: inline-block;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-right: 40rpx;

        position: relative;
    }

    .middleMenuText {
        z-index: 2;
    }

    .middleMenuTextBottomLineView {
        height: 10rpx;
        background: #CCFA10;
        border-radius: 4rpx;
        margin-top: -13rpx;
        z-index: 1;
    }

    .sortChangeView {
        width: 10%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sortChangeLayerView {
        background-color: #FFFFFF;
        position: absolute;
        z-index: 9;
        right: 0;
        border-radius: 20rpx;
        padding: 20rpx 40rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .sortChangeLayerItemView {
        padding: 10rpx;
        font-size: 31rpx;
        color: #000000;
    }

    .sortChangeLayerItemText {
        padding: 16rpx 50rpx;
        background-color: #E6E5E5;
    }

    .sortChangeLayerItemCheck {
        color: #FFFFFF;
        background-color: #7D7D7D;
    }

    .bottomPlayMateCardView {
        margin-top: 16rpx;
        margin-bottom: 42rpx;
    }

    .bottomPlayMateItemsCardView {
        margin-bottom: 25rpx;
        background: linear-gradient(360deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
        border-radius: 0rpx 0rpx 19rpx 19rpx;
        position: relative;
    }

    .bottomPlayMateItemsLayerCardView {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0rpx 0rpx 19rpx 19rpx;
        background: #858585;
        /* 使用混合模式 */
        /* multiply：正片叠底，常用于加深颜色。 */
        mix-blend-mode: multiply;
    }

    .itemsCardInsideView {
        padding: 20rpx 27rpx 0 27rpx;
        display: flex;
        flex-direction: column;
    }

    .itemsCardTopView {
        display: flex;
        flex-direction: row;
    }

    .itemsCardTopLeftView {
        width: 50%;
        height: 231rpx;
        position: relative;
    }

    .itemsCardTopLeftImg {
        width: 100%;
        height: 100%;
        border-radius: 19rpx;
    }

    .itemsCardTopLeftLabelImg {
        width: 89rpx;
        height: 42rpx;
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
    }

    .itemsCardTopRightView {
        width: 50%;
        margin-left: 27rpx;
    }

    .itemsCardTopRightTitleView {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        /* 限制为2行 */
        overflow: hidden;
        /* 隐藏溢出的文本 */
    }

    .itemsCardTopRightTitleLabelView {
        width: 79rpx;
        height: 37rpx;
        border-radius: 10rpx;
        padding: 5rpx 20rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 21rpx;
        color: #FFFFFF;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .itemsCardTopRightTitleText {
        margin-left: 10rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .itemsCardTopRightContentView {
        margin-top: 10rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        /* 限制为2行 */
        overflow: hidden;
        /* 隐藏溢出的文本 */
    }

    .itemsCardTopRightContentText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #858585;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .itemsCardBottomView {
        height: 70rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10rpx;
        border-top: 2rpx solid #F3F3F1;
    }

    .myInfoAvatarView {
        width: 40rpx;
        height: 40rpx;
        position: relative;
    }

    .itemsCardBottomImg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .avatarImgIcon {
        width: 30rpx;
        height: 30rpx;
        position: absolute;
        bottom: -10rpx;
        left: 20rpx;
    }

    .itemsCardBottomName {
        margin-left: 16rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .userInfoSexImg {
        width: 30rpx;
        height: 30rpx;
        margin-left: 10rpx;
    }

    .userInfoAuthImg {
        width: 77rpx;
        height: 42rpx;
        margin-left: 10rpx;
    }

    .itemsCardBottomTime {
        margin-left: 16rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 23rpx;
        color: #858585;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .itemsCardBottomJoinBtn {
        background: #000000;
        border-radius: 19rpx;
        padding: 4rpx 15rpx;
        font-size: 20rpx;
        color: #8CE8ED;
        margin: auto 0 auto auto;
    }

    .itemsCardBottomAlreadyJoinBtn {
        background: #858585;
        border-radius: 19rpx;
        padding: 4rpx 15rpx;
        font-size: 20rpx;
        color: #FFFFFF;
        margin: auto 0 auto auto;
    }

    .itemsCardBottomAlreadyDisbandBtn {
        background: #858585;
        border-radius: 19rpx;
        padding: 4rpx 15rpx;
        font-size: 20rpx;
        color: #FFFFFF;
        margin: auto 0 auto auto;
    }
</style>