<template>
    <view>
        <uni-popup ref="adPopupRef" type="center" :is-mask-click="false">
            <view :style="{width: winWidth + 'px',height: winHeight + 'px'}">
                <view class="ad-popup-top" v-if="imgUrl!=''">
                    <image class="ad-popup-top-img" :src="imgUrl" @click="jumpClick()"></image>
                </view>
                <view class="ad-popup-bottom">
                    <uni-icons type="close" color="#A6A6A6" size="48" @click="closeClick"></uni-icons>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    let timer;
    export default {
        name: "AdPopup",
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                id: 0,
                imgUrl: '',
                jumpSort: '1',
                jumpAddress: '',
                showTime: '0',

                countDown: 1,
            };
        },
        methods: {
            show(data) {
                this.getSystemInfo()
                // this.getAdContent()

                this.id = data.id
                this.imgUrl = data.imageUrl
                this.jumpSort = data.jumpSort
                this.jumpAddress = data.jumpAddress
                this.showTime = data.showTime

                this.countDown = parseInt(this.showTime)
                this.$refs.adPopupRef.open()
                this.startCountDown(); // 开始倒计时
            },
            // 获取设备信息
            getSystemInfo() {
                const that = this
                const winInfo = uni.getWindowInfo()
                // console.log('winInfo:' + JSON.stringify(winInfo))
                // 图片的比例3:4，0.9是图片所占页面高度的百分比，得到页面总体高度
                that.winWidth = winInfo.windowWidth
                that.winHeight = that.winWidth / 3 * 4 / 0.9
            },

            closeClick() {
                clearInterval(timer)
                this.$refs.adPopupRef.close()
                this.$emit('closeAd')
            },
            startCountDown() {
                const that = this
                timer = setInterval(() => {
                    if (that.countDown > 0) {
                        that.countDown--;
                    } else {
                        that.closeClick();
                    }
                }, 1000);
            },
            jumpClick() {
                const jumpSort = this.jumpSort
                if (jumpSort == '2') {
                    if (this.jumpAddress != undefined && this.jumpAddress != '') {
                        this.saveClickNum()
                        uni.navigateToMiniProgram({
                            appId: this.jumpAddress
                        })
                        this.closeClick();
                    }
                }
                if (jumpSort == '3') {
                    this.saveClickNum()
                    uni.navigateTo({
                        url: '/package-agreement/openWeb/openWeb?url=' + this.jumpAddress
                    })
                    this.closeClick();
                }
            },
            saveClickNum() {
                const param = {
                    id: this.id
                }
                this.$api.saveClickNum(param).then(res => {
                    // console.log('saveClickNum succes res:' + JSON.stringify(res))
                }).catch(res => {
                    // console.log('saveClickNum err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
        }
    }
</script>

<style>
    .ad-popup-top {
        width: 100%;
        height: 90%;
    }

    .ad-popup-top-img {
        width: 100%;
        height: 100%;
    }

    .ad-popup-bottom {
        width: 100%;
        height: 10%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>