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
            <view class="topSearchView">
                <view class="topSearchInputView">
                    <image class="topSearchInputImg" src="/static/img/other/search.png"></image>
                    <input class="topSearchInput" type="text" v-model="searchValue" placeholder="请输入..."
                        placeholder-class="topSearchInputPlaceholder" :focus="false" confirm-type="search"
                        inputmode="search" @confirm="searchClick" />
                </view>
            </view>

            <view class="todayHotView">
                <view class="todayHotText">今日热门</view>
                <view class="todayHotContentView">
                    <view class="todayHotContentItemView" v-for="(item, idx) in hotList" :key="idx"
                        v-if="hotList.length>0">
                        <view class="itemNumber">{{idx + 1}}</view>
                        <view class="itemText" @click="toPage(item.cardId)">{{item.content}}</view>
                        <image class="itemHotImg" src="/static/img/other/hot.png" v-if="item.isHot"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import topBackground from '../../components/top-background/top-background.vue'
    export default {
        comments: {
            topBackground
        },
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                searchValue: '',

                hotList: []
            }
        },
        onLoad(opt) {
            let searchContent = opt.searchContent
            if (searchContent == undefined) {
                searchContent = ''
            }
            this.searchValue = searchContent

            this.getSystemInfo()
            this.getHotCardList()
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
            getHotCardList() {
                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                const param = 'studentId=' + studentId
                this.$api.getHotCardList(param).then(res => {
                    // console.log('getHotCardList succes res:' + JSON.stringify(res))

                    this.hotList = res.data

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
            searchClick() {
                console.log('========搜索=========:' + this.searchValue)
                const _this = this
                uni.navigateBack({
                    delta: 1, // 返回层数，2则上上页
                    success() {
                        uni.$emit('backSearchContent', _this.searchValue)
                    }
                })
            },
            toPage(cardId) {
                uni.navigateTo({
                    url: '/pages/carddetail/carddetail?cardId=' + cardId
                })
            },
        }
    }
</script>

<style>
    .content {
        width: 100%;
        background: linear-gradient(179deg, #94D4D2 0%, #FFFFFF 8%, #FFFFFF 100%);
        position: relative;
    }

    .contentInside {
        width: 88%;
        padding: 10rpx 46rpx 50rpx 46rpx;
        position: absolute;
        z-index: 10;
    }

    .topSearchView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .topSearchInputView {
        width: 100%;
        padding: 18rpx 25rpx;
        background: #FFFFFF;
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

    .todayHotView {
        display: flex;
        flex-direction: column;
        margin-top: 56rpx;
    }

    .todayHotText {
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        font-style: normal;
        text-transform: none;
    }

    .todayHotContentView {
        display: flex;
        flex-direction: column;
        margin-top: 38rpx;
    }

    .todayHotContentItemView {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .itemNumber {
        width: 8%;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #2CABA6;
        line-height: 65rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }

    .itemText {
        width: 80%;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #858585;
        line-height: 65rpx;
        font-style: normal;
        text-transform: none;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .itemHotImg {
        width: 19rpx;
        height: 24rpx;
        margin-left: 10rpx;
    }
</style>