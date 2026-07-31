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
    <swiper class="swiper-box swiperItemsView" indicator-dots="true" indicator-color="#2CABA6"
        indicator-active-color="#8CE8ED" circular="true" autoplay="true" interval="3000">
        <swiper-item v-for="(item, index) in swiperList" :key="index">
            <image :src="item.imageUrl" class="swiperItemImg" @click="jumpClick(item)"></image>
        </swiper-item>
    </swiper>
</template>

<script>
    export default {
        name: "SwiperImage",
        props: {
            'swiperList': {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            return {

            };
        },
        methods: {
            jumpClick(items) {
                const jumpSort = items.jumpSort
                if (jumpSort == '2') {
                    if (items.jumpAddress != undefined && items.jumpAddress != '') {
                        uni.navigateToMiniProgram({
                            appId: items.jumpAddress
                        })
                    }
                }
                if (jumpSort == '3') {
                    uni.navigateTo({
                        url: '/package-agreement/openWeb/openWeb?url=' + items.jumpAddress
                    })
                }
            }
        }
    }
</script>

<style>
    .swiperItemsView {
        width: 100%;
        height: 100%;
    }

    .swiperItemImg {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
    }
</style>