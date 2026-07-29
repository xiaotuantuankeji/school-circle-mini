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
                    <view class="topSearchLeftView" @click="openSearchClick">
                        <image class="topSearchLeftImg" src="/static/img/other/search.png"></image>
                        <view class="topSearchLeftText" v-if="searchContent!=''">{{searchContent}}</view>
                        <view class="topSearchLeftText" v-else>请输入...</view>
                    </view>
                    <view class="topSearchRightView">
                        <image class="topSearchRightImg" src="/static/img/other/more_list.png" @click="selectPartition">
                        </image>
                    </view>
                </view>

                <view class="swiperView">
                    <swiper-image :swiperList="swiperList"></swiper-image>
                </view>

                <view class="middleMenuView">
                    <view class="middleMenuTextView">
                        <view class="middleMenuText" @click="schoolMenuClick('1')">全部</view>
                        <view class="middleMenuTextBottomLineView" v-if="menuSort=='1'"></view>
                    </view>
                    <view class="middleMenuTextView">
                        <view class="middleMenuText" @click="schoolMenuClick('2')">本校</view>
                        <view class="middleMenuTextBottomLineView" v-if="menuSort=='2'"></view>
                    </view>
                    <view class="middleMenuTextView">
                        <!-- <picker mode="selector" :range="otherSchoolList" range-key="name" @change="changePicker"> -->
                        <view class="middleMenuText" v-if="menuSort=='3'" @click="openSchoolBtn">{{otherSchoolName}}
                        </view>
                        <view class="middleMenuText" v-else @click="openSchoolBtn">其他院校</view>
                        <!-- </picker> -->

                        <view class="middleMenuTextBottomLineView" v-if="menuSort=='3'"></view>
                    </view>
                </view>

                <view class="bottomSendCrad">
                    <card-skeleton v-if="isFirstLoading" :count="3" />
                    <card-item v-else :cardList="cardList" :loginStudentSort="loginStudentSort" @callBackCard="callBackCard"
                        @shareCallBack="shareCallBack"></card-item>
                </view>

                <uni-load-more v-if="!isFirstLoading" :status="loadStatus" :content-text="loadContentText"
                    @clickLoadMore="loadMoreClick"></uni-load-more>
            </view>
        </view>

        <uni-popup ref="openSchoolRef" :safe-area="false">
            <view class="popupView">
                <view class="popupTitleView">
                    <!-- <view class="popupTitleText">个性签名</view> -->
                    <input class="popupTitleInput" v-model="searchSchoolContent" type="text" placeholder="请输入学校名称" />
                    <button class="popupTitleBtn" size="mini" :plain="true" @click="searchSchoolBtn">查询</button>
                </view>
                <picker-view class="popupPickerView" @change="changePicker">
                    <picker-view-column>
                        <view class="popupPickerItemView" v-for="(item, idx) in otherSchoolList" :key="idx">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
                <view class="popupButtonView">
                    <button class="popupButton" @click="closeSchoolBtn">关闭</button>
                    <button class="popupButton" @click="confirmSchoolBtn">确定</button>
                </view>
            </view>
        </uni-popup>

        <ad-popup ref="openAdRef" @closeAd="closeAd"></ad-popup>

    </view>
</template>

<script>
    import swiperImage from '../../components/swiper-image/swiper-image.vue'
    import cardItem from '../../components/card-item/card-item.vue'
    import cardSkeleton from '../../components/skeleton/card-skeleton.vue'
    import verifySchool from '../../libs/verify_school'
    import adPopup from '../../components/ad-popup/ad-popup.vue'
    export default {
        components: {
            swiperImage,
            cardItem,
            cardSkeleton,
            adPopup
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                // 状态栏高度
                statusBarHeight: 0,
                // 导航栏高度
                navBarHeight: 0,

                loadStatus: 'more',
                loadContentText: {
                    contentdown: '点击加载更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了'
                },

                pageNo: 1,
                pageSize: this.$configData.pageSize,
                // pageSize: 2,

                loginStudentSort: '',
                loginSchoolName: '',

                otherSchoolList: [],

                menuSort: '1', // 1:全部，2:本校，3:其他院校
                sectionId: '', // 选择分区id
                otherSchoolId: '',
                otherSchoolName: '',
                searchSchoolContent: '',
                searchContent: '',
                otherSchoolCheckItem: {},

                swiperList: [],

                cardList: [],

                shareCardId: 0,
                shareImgUrl: '',

                isPullDownRefresh: false,

                isFirstLoading: true,

                adContent: [],
                adTotalSize: 0,
                adShowSize: 0,
            }
        },
        onLoad(opt) {
            const id = opt.id
            if (id == undefined) {
                this.getData()
            } else {
                this.getStudentInfo(id)
            }
        },
        onShow() {
            const sectionData = uni.getStorageSync('section')
            if (sectionData != undefined && sectionData != '') {
                const sectionId = sectionData.sectionId
                const sectionName = sectionData.sectionName
                uni.removeStorageSync('section')
                uni.navigateTo({
                    url: '/package-content/partition-list/partition-list?sectionId=' + sectionId +
                        '&sectionName=' +
                        sectionName
                })
            }
        },
        mounted() {
            const _this = this
            uni.$on('backSearchContent', function(data) {
                //触发更新后
                _this.searchContent = data
                _this.cardList = []
                _this.getList()
            })
        },
        onUnload() {
            // 移除监听事件
            uni.$off('backSearchContent');
        },
        onPullDownRefresh() {
            console.log('refresh');

            this.isPullDownRefresh = true

            this.getList()
            // setTimeout(function() {
            //     uni.stopPullDownRefresh();
            // }, 1000);
        },
        methods: {
            async getStudentInfo(id) {
                const _this = this
                new Promise(function(resolve, reject) {
                    _this.$wechatAuth.getUserDetail(id,
                        resolve)
                }).then(function(msg) {
                    if (msg == 'ok') {
                        _this.getData()
                    }
                })
            },
            async getData() {
                const res = await verifySchool.verifySchoolIsClose();
                if (!res) {
                    this.getSystemInfo()
                    this.getLoginInfo()
                    this.getAdContent()
                    this.getCarouselImageInfo()
                    this.cardList = []
                    this.getList()
                    this.getOtherSchool()
                }
            },
            // 获取设备信息
            getSystemInfo() {
                const that = this
                const winInfo = uni.getWindowInfo()
                // console.log('winInfo:' + JSON.stringify(winInfo))
                that.winWidth = winInfo.windowWidth
                that.winHeight = winInfo.windowHeight

                //获取手机状态栏高度
                that.statusBarHeight = winInfo.statusBarHeight
                // console.log('状态栏高度:' + that.statusBarHeight);

                // #ifdef MP-WEIXIN
                // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
                const custom = wx.getMenuButtonBoundingClientRect()
                // console.log('胶囊的位置信息:' + custom)

                // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
                that.navBarHeight = custom.height + (custom.top - that.statusBarHeight) * 2
                // console.log("导航栏高度：" + that.navBarHeight)

                // #endif
            },
            // 获取当前登录用户信息
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginSchoolName = userInfo ? userInfo.schoolName : ''
            },
            getCarouselImageInfo() {
                const userInfo = this.$storage.user.get();
                const schoolId = userInfo ? userInfo.schoolId : ''
                const param = 'type=7&schoolId=' + schoolId
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
            getAdContent() {
                const userInfo = this.$storage.user.get();
                const schoolId = userInfo ? userInfo.schoolId : ''
                const param = 'schoolId=' + schoolId
                this.$api.getAdContent(param).then(res => {
                    // console.log('getAdContent succes res:' + JSON.stringify(res))

                    if (res.data.length > 0) {
                        this.adContent = res.data
                        this.adTotalSize = this.adContent.length
                        this.$refs.openAdRef.show(this.adContent[this.adShowSize])
                        this.adShowSize = this.adShowSize + 1
                    }
                }).catch(res => {
                    // console.log('getAdContent err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            closeAd() {
                if (this.adTotalSize > this.adShowSize) {
                    // 添加延迟，确保弹窗完全关闭后再打开下一个
                    setTimeout(() => {
                        this.$refs.openAdRef.show(this.adContent[this.adShowSize])
                        this.adShowSize = this.adShowSize + 1
                    }, 300)
                    console.log('显示下一条广告')
                } else {
                    this.adContent = []
                    this.adTotalSize = 0
                    this.adShowSize = 0
                    console.log('已显示全部广告')
                }
            },
            getOtherSchool() {
                const userInfo = this.$storage.user.get();
                const schoolId = userInfo ? userInfo.schoolId : ''
                const param = 'loginSchoolId=' + schoolId + '&searchContent=' + this.searchSchoolContent
                this.$api.getOtherSchool(param).then(res => {
                    // console.log('getOtherSchool succes res:' + JSON.stringify(res))

                    this.otherSchoolList = res.data
                    const item = this.otherSchoolList[0]
                    this.otherSchoolCheckItem = item
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            openSearchClick() {
                uni.navigateTo({
                    url: '/package-content/search/search?searchContent=' + this.searchContent
                })
            },
            changePicker(e) {
                const idx = e.detail.value
                const item = this.otherSchoolList[idx]
                this.otherSchoolCheckItem = item
            },
            openSchoolBtn() {
                const item = this.otherSchoolList[0]
                this.otherSchoolCheckItem = item
                this.$refs.openSchoolRef.open('bottom')
            },
            searchSchoolBtn() {
                this.otherSchoolList = []
                this.getOtherSchool()
            },
            closeSchoolBtn() {
                this.$refs.openSchoolRef.close()
            },
            confirmSchoolBtn() {
                const item = this.otherSchoolCheckItem
                const status = item.status
                if (status == '4') {
                    uni.showModal({
                        title: '关闭',
                        content: '[' + item.name + ']已被关闭，不能选择该校园',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {

                            } else if (res.cancel) {
                                // 用户点击取消
                            }
                        }
                    });
                    return;
                }
                this.otherSchoolId = item.id
                this.otherSchoolName = item.name

                this.menuSort = '3'
                this.cardList = []
                this.getList(this.menuSort)
                this.closeSchoolBtn()
            },
            schoolMenuClick(menuSort) {
                this.menuSort = menuSort
                this.cardList = []
                this.getList()
            },
            loadMoreClick(e) {
                const status = e.detail.status
                // console.log('status:' + status)
                if (status == 'more') {
                    this.loadStatus = 'loading'
                    this.pageNo = this.pageNo + 1
                    this.getList()
                }
            },
            getList() {
                let menuSort = ''
                if (this.isPullDownRefresh) {
                    menuSort = '1'
                    this.searchContent = ''
                    this.pageNo = 1
                    this.loadStatus = 'more'
                } else {
                    this.loadStatus = 'loading'
                    menuSort = this.menuSort
                }
                let schoolId = ''

                const userInfo = this.$storage.user.get();
                const studentId = userInfo ? userInfo.studentId : ''
                if (menuSort == '2') {
                    schoolId = userInfo.schoolId
                }
                if (menuSort == '3') {
                    schoolId = this.otherSchoolId
                }
                this.loginStudentSort = userInfo.sort

                // uni.showLoading({
                //     title: '获取中...',
                //     mask: true
                // })

                const param = 'schoolId=' + schoolId + '&searchContent=' + this.searchContent + '&searchSectionId=' + this
                    .sectionId + '&studentId=' + studentId + '&lookStudentId=&pageNo=' + this.pageNo + '&pageSize=' +
                    this.pageSize + '&menuSort=' + menuSort
                this.$api.getSendCardList(param).then(res => {
                    // console.log('getSendCardList succes res:' + JSON.stringify(res))

                    this.isFirstLoading = false

                    if (this.loadStatus == 'more' || this.loadStatus == 'loading') {
                        if (res.data.length > 0 && res.data.length == this.pageSize) {
                            this.loadStatus = 'more'
                        } else {
                            this.loadStatus = 'no-more'
                        }
                    }

                    if (this.isPullDownRefresh) {
                        this.cardList = []
                        this.cardList = res.data
                        this.isPullDownRefresh = false
                        uni.stopPullDownRefresh()
                    } else {
                        if (this.cardList.length == 0) {
                            this.cardList = res.data
                        } else {
                            const data = res.data
                            for (let i = 0; i < data.length; i++) {
                                const item = data[i]
                                this.cardList.push(item)
                            }
                        }
                    }

                    // uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    this.isFirstLoading = false
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                    // uni.hideLoading()
                })
            },
            selectPartition() {
                uni.navigateTo({
                    url: '/package-content/partition/partition?source=home'
                })
            },
            callBackCard() {
                this.cardList = []
                this.getList()
            },
            shareCallBack(shareCardId, shareImgUrl) {
                this.shareCardId = shareCardId
                this.shareImgUrl = shareImgUrl
            },
            onShareAppMessage(res) {
                if (res.from === 'button') { // 来自页面内分享按钮
                    // 来自页面内转发按钮
                    // this.$refs.sharePopup.close()
                }

                // 最大14个字
                const title = "学长学姐强推！新生必备！"
                let imageUrl = '/static/img/other/share_image.jpg'
                if (this.shareImgUrl != '') {
                    imageUrl = this.shareImgUrl
                }

                return {
                    title: title,
                    path: '/pages/carddetail/carddetail?cardId=' + this.shareCardId,
                    imageUrl: imageUrl,
                    success: function(res) {
                        // 转发成功
                        // console.log("转发成功:" + JSON.stringify(res));
                    },
                    fail: function(res) {
                        // 转发失败
                        // console.log("转发失败:" + JSON.stringify(res));
                    }
                }
            },
            // onShareTimeLine() {
            //     // 最大14个字
            //     var title = "学长学姐强推！新生必备！"
            //     return {
            //         title: title,
            //         query: 'cardId=' + this.cardId,
            //         imageUrl: '/static/img/other/share_image.jpg',
            //         success: function(res) {
            //             // 转发成功
            //             // console.log("转发成功:" + JSON.stringify(res));
            //         },
            //         fail: function(res) {
            //             // 转发失败
            //             // console.log("转发失败:" + JSON.stringify(res));
            //         }
            //     }
            // }
        }
    }
</script>

<style>
    /* content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    } */

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
        height: 80rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .topSearchLeftView {
        width: 526rpx;
        height: 36rpx;
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

    .topSearchLeftText {
        width: 379rpx;
        height: 40rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-left: 24rpx;
    }

    .topSearchRightView {
        width: 39rpx;
        height: 37rpx;
    }

    .topSearchRightImg {
        width: 100%;
        height: 100%;
    }

    .swiperView {
        height: 302rpx;
        margin-top: 20rpx;
    }

    .middleMenuView {
        display: flex;
        flex-direction: row;
        margin-top: 31rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #000000;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .middleMenuTextView {
        margin-right: 62rpx;
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

    .bottomSendCrad {
        margin-top: 16rpx;
        margin-bottom: 42rpx;
    }

    .schoolPopupView {
        width: 400rpx;
        background-color: #FFFFFF;
        border-radius: 40rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .bottomButtommView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .popupView {
        background: linear-gradient(180deg, #2CABA6 0%, #FFFFFF 20%, #FFFFFF 100%);
        border-radius: 65rpx;
        display: flex;
        flex-direction: column;
        padding: 80rpx 30rpx 20rpx 30rpx;
    }

    .popupTitleView {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .popupTitleInput {
        font-size: 28rpx;
        color: #858585;
        border-bottom: 1rpx solid #858585;
    }

    .popupTitleBtn {
        margin: 0 0 0 20rpx;
    }

    .popupPickerView {
        height: 400rpx;
        margin: 20rpx 0;
    }

    .popupPickerItemView {
        text-align: center;
    }

    .popupButtonView {
        margin-top: 40rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .popupButton {
        width: 200rpx;
        background: #000000;
        border-radius: 40rpx;
        margin: 0;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }
</style>