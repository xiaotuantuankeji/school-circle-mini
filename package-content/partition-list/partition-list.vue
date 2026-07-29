<template>
    <view class="content" :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <top-background></top-background>

        <view class="contentInside">
            <view class="bottomSendCrad">
                <card-item :cardList="cardList" v-if="cardList.length>0"></card-item>
                <view class="noContentText" v-else>暂无相关帖子，快去发表吧...</view>
            </view>
        </view>
    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    import cardItem from '../../components/card-item/card-item.vue'
    export default {
        comments: {
            topBackground,
            cardItem
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                pageNo: 1,
                pageSize: this.$configData.pageSize,

                sectionId: '',

                cardList: []
            }
        },
        onLoad(opt) {
            let sectionId = opt.sectionId
            if (sectionId == undefined) {
                sectionId = ''
            }
            this.sectionId = sectionId

            let sectionName = opt.sectionName
            if (sectionName == undefined) {
                sectionName = ''
            }
            uni.setNavigationBarTitle({
                title: sectionName
            })

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
                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                uni.showLoading({
                    title: '获取中...',
                    mask: true
                })

                const param = 'schoolId=' + '&searchContent=' + '&searchSectionId=' + this
                    .sectionId + '&studentId=' + studentId + '&lookStudentId=&pageNo=' + this.pageNo + '&pageSize=' +
                    this.pageSize + '&menuSort=1'
                this.$api.getSendCardList(param).then(res => {
                    // console.log('getSendCardList succes res:' + JSON.stringify(res))

                    this.cardList = res.data

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
        }
    }
</script>

<style>
    .content {
        width: 100%;
        background: linear-gradient(180deg, #94D4D2 0%, rgba(243, 243, 241, 1) 16%, rgba(243, 243, 241, 1) 100%);
        position: relative;
    }

    .contentInside {
        width: 89%;
        position: absolute;
        z-index: 2;
        padding: 7.7rpx 42rpx 42rpx 40rpx;
    }

    .bottomSendCrad {
        margin-top: 16rpx;
        margin-bottom: 42rpx;
    }

    .noContentText {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }
</style>