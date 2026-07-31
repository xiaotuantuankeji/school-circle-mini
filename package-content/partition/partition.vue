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
    <view class="partitionPopupView">
        <top-background></top-background>

        <view class="partitionPopupInsideView">

            <view class="partitionGroupView" v-for="(items, index) in list" :key="index">
                <view class="titleView">
                    <view>
                        <view class="titleTextView">{{items.name}}</view>
                        <view class="titleLineView"></view>
                    </view>
                </view>
                <view class="partitionContentView">
                    <view class="partitionContentItemView" v-for="(item, idx) in items.children" :key="idx"
                        @click="selectVal(item)">
                        <image class="itemImg" :src="`/static/img/partition/${item.iconName}.png`"></image>
                        <view class="itemText">{{item.name}}</view>
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
                source: '',
                sectionId: '',

                list: []
            }
        },
        onLoad(opt) {
            let source = opt.source
            if (source == undefined) {
                source = ''
            }
            this.source = source

            this.getSectionList()
        },
        methods: {
            getSectionList() {
                uni.showLoading({
                    title: '获取数据中...',
                    mask: true
                })

                const param = '';
                this.$api.getSectionList(param).then(res => {
                    // console.log('getSectionList succes res:' + JSON.stringify(res))
                    this.list = res.data

                    uni.hideLoading()
                }).catch(res => {
                    console.log('saveCardData err res:' + res)
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: res,
                        mask: true
                    })
                    uni.hideLoading()
                })
            },
            selectVal(item) {
                console.log('=====selectVal=====')
                if (this.source == 'home') {
                    uni.navigateTo({
                        url: '/package-content/partition-list/partition-list?sectionId=' + item.id + '&sectionName=' +
                            item.name
                    })
                } else {
                    uni.navigateBack({
                        delta: 1, // 返回层数，2则上上页
                        success() {
                            uni.$emit('backSelectPartition', item)
                        }
                    })
                }
            }
        }
    }
</script>

<style>
    .partitionPopupView {
        width: 100%;
        position: relative;
    }

    .partitionPopupInsideView {
        padding: 50rpx;
        background: linear-gradient(179deg, #94D4D2 0%, #FFFFFF 8%, #FFFFFF 100%);
    }

    .partitionGroupView {
        display: flex;
        flex-direction: column;
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

    .partitionContentView {
        margin-top: 18rpx;
        display: flex;
        flex-wrap: wrap;
    }

    .partitionContentItemView {
        width: 45%;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #F3F3F1;
        border-radius: 38rpx 38rpx 38rpx 38rpx;
        margin-right: 31rpx;
        margin-bottom: 16rpx;
    }

    .itemImg {
        width: 77rpx;
        height: 77rpx;
    }

    .itemText {
        padding-left: 42rpx;
        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 29rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }
</style>