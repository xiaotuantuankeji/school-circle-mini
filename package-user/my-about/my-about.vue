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
        <image class="contentImg" :src="showImage" mode="widthFix"></image>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                imageData: [],
                showImage: '',
            }
        },
        onLoad(opt) {
            this.getSystemInfo()
            this.getPageImageData()
        },
        methods: {
            // 获取设备信息
            getSystemInfo() {
                const that = this
                const winInfo = uni.getWindowInfo();
                that.winWidth = winInfo.windowWidth
                that.winHeight = winInfo.windowHeight
            },
            getPageImageData() {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                })

                const param = 'type=2'
                this.$api.getPageImageData(param).then(res => {
                    // console.log('getPageImageData succes res:' + JSON.stringify(res))

                    const data = res.data
                    this.imageData = data

                    for (let i = 0; i < data.length; i++) {
                        const item = data[i]
                        this.showImage = item.imageUrl
                    }

                    uni.hideLoading()
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })

                    uni.hideLoading()

                    uni.navigateBack()
                })
            },
        }
    }
</script>

<style>
    .contentImg {
        width: 100%;
    }
</style>