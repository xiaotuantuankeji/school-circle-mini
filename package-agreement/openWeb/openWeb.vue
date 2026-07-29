<template>
    <view :style="{width: winWidth + 'px',height: winHeight + 'px'}">
        <image :src="webUrl" v-if="webUrl!=''" mode="aspectFit" style="width: 100%;height: 100%;"></image>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                webUrl: ''
            }
        },
        onLoad(options) {
            this.webUrl = options.url;
            this.getSystemInfo()
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
        }
    }
</script>

<style>

</style>