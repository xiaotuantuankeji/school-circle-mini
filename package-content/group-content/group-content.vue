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
    <view class="container" :style="pageHeight">
        <view class="box-1">
            <scroll-view scroll-y refresher-background="transparent" style="height: 100%;"
                @refresherrefresh="refresherrefresh" :refresher-enabled="true" :scroll-with-animation="false"
                :refresher-triggered="scrollView.refresherTriggered" :scroll-into-view="scrollView.intoView">
                <view class="talk-list">
                    <view v-for="(item,index) in talkList" :key="item.id" :id="'msg-'+item.id">
                        <view class="item flex-col" :class=" item.studentId == loginStudentId ? 'push':'pull' ">
                            <image :src="item.avatar" mode="aspectFill" class="pic"
                                v-if="sign!='sys' && item.avatar!=''"
                                @click="openMyHomePage(item.studentId, item.nikeNameId)"></image>
                            <image src="/static/img/logo/default-avatar.png" mode="aspectFill" class="pic"
                                @click="openMyHomePage(item.studentId, item.nikeNameId)"
                                v-else-if="sign!='sys' && item.avatar==''">
                            </image>
                            <image src="/static/img/logo/sys-msg.png" mode="aspectFill" class="pic" v-else>
                            </image>
                            <view class="content" @touchstart.prevent="touchstart(index)" @touchend.prevent="touchend">
                                <template v-if="item.contentType === 'image'">
                                    <image :src="item.content" mode="widthFix" style="width: 400rpx;"></image>
                                </template>
                                <template v-else>
                                    <text>{{item.content}}</text>
                                </template>
                            </view>
                        </view>
                    </view>

                </view>
            </scroll-view>
        </view>
        <view class="box-2" v-if="sign!='sys'">
            <view class="flex-col">
                <!-- <view style="margin-right: 20rpx;">
                    <uni-icons type="image" size="24" color="#42b983" @tap="handleImageClick"></uni-icons>
                </view> -->
                <view class="flex-grow">
                    <input type="text" class="content" v-model="content" placeholder="请输入聊天内容"
                        placeholder-style="color:#DDD;" :cursor-spacing="6" :disabled="!isSendPurview">
                </view>
                <button class="send" @tap="handleSendClick" :disabled="!isSendPurview">发送</button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                loginStudentId: '',
                access_token: '',
                groupId: 0,
                isSendPurview: false,
                sendCount: 0,

                sign: 'sys',
                nikeName: '',

                // 滚动容器
                scrollView: {
                    refresherTriggered: false,
                    intoView: "",
                    safeAreaHeight: 0
                },
                // 聊天列表数据
                talkList: [],
                // 请求参数
                ajax: {
                    rows: 20, //每页数量
                    page: 1, //页码
                    flag: true, // 请求开关
                },
                // 发送内容
                content: '',
            }
        },
        computed: {
            // 页面高度
            pageHeight() {
                const safeAreaHeight = this.scrollView.safeAreaHeight;
                if (safeAreaHeight > 0) {
                    return `height: calc(${safeAreaHeight}px - var(--window-top));`
                }
                return "";
            }
        },
        onLoad(opt) {
            // #ifdef H5
            this.scrollView.safeAreaHeight = uni.getSystemInfoSync().safeArea.height;
            // #endif

            if (opt.groupId == undefined) {
                this.groupId = 0
            } else {
                this.groupId = opt.groupId
            }

            if (opt.sign == undefined) {
                this.sign = 'sys'
            } else {
                this.sign = opt.sign
            }

            if (opt.nikeName == undefined) {
                this.nikeName = ''
            } else {
                this.nikeName = opt.nikeName
            }

            this.getLoginInfo()
            this.getAccessToken()
            if (this.sign == 'sys') {
                this.getSystemMsgData();
                uni.setNavigationBarTitle({
                    title: '系统消息',
                });
            } else {
                uni.setNavigationBarTitle({
                    title: this.nikeName,
                });
                this.getMessage();
                this.getGroupSendPurview()
                this.updateGroupContentRead()
            }
        },
        methods: {
            // 获取当前登录用户信息
            getLoginInfo() {
                const userInfo = this.$storage.user.get();
                this.loginStudentId = userInfo.studentId
            },
            getAccessToken() {
                const param = ''
                this.$api.getAccessToken(param).then(res => {
                    // console.log('getAccessToken succes res:' + JSON.stringify(res))
                    this.access_token = res.data

                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            // 下拉刷新
            refresherrefresh(e) {
                console.log('sign:' + this.sign)
                this.scrollView.refresherTriggered = true;
                if (this.sign == 'sys') {
                    this.getSystemMsgData();
                } else {
                    this.getMessage();
                }
            },
            // 获取历史消息
            getMessage() {
                const _this = this
                if (!this.ajax.flag) {
                    uni.showToast({
                        title: '暂无更多消息',
                        icon: 'none',
                        mask: true
                    })
                    setTimeout(() => {
                        _this.scrollView.refresherTriggered = false;
                    }, 1000)
                    return;
                }

                // 此处用到 ES7 的 async/await 知识，为使代码更加优美。不懂的请自行学习。
                const get = async () => {
                    this.ajax.flag = false;
                    const param = 'id=' + this.groupId + '&studentId=' + this.loginStudentId + '&pageNo=' + this
                        .ajax.page + '&pageSize=' + this.ajax.rows;
                    const res = await this.$api.getGroupContent(param);
                    // console.log('getMessage success data:', JSON.stringify(res))
                    const data = res.data

                    this.scrollView.refresherTriggered = false;

                    // 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用。取当前消息数据的第一条信息元素
                    const selector = `msg-${data?.[0]?.id}`;

                    // 将获取到的消息数据合并到消息数组中
                    this.talkList = this.talkList.concat(data);

                    // 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
                    this.$nextTick(() => {
                        // 设置当前滚动的位置
                        this.scrollView.intoView = selector;

                        if (data.length < this.ajax.rows) {
                            // 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
                            // 可在此处编写无更多消息数据时的逻辑
                        } else {
                            this.ajax.flag = true;
                            this.ajax.page++;
                        }

                    })
                }
                get();
            },
            getSystemMsgData() {
                const _this = this
                if (!this.ajax.flag) {
                    uni.showToast({
                        title: '暂无更多消息',
                        icon: 'none',
                        mask: true
                    })
                    setTimeout(() => {
                        _this.scrollView.refresherTriggered = false;
                    }, 1000)
                    return;
                }

                // 此处用到 ES7 的 async/await 知识，为使代码更加优美。不懂的请自行学习。
                const get = async () => {
                    this.ajax.flag = false;
                    const param = 'studentId=' + this.loginStudentId + '&pageNo=' + this
                        .ajax.page + '&pageSize=' + this.ajax.rows;
                    const res = await this.$api.getSystemMsgContent(param);
                    // console.log('getSystemMsgContent success data:', JSON.stringify(res))
                    const data = res.data

                    this.scrollView.refresherTriggered = false;

                    // 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用。取当前消息数据的第一条信息元素
                    const selector = `msg-${data?.[0]?.messageId}`;

                    // 将获取到的消息数据合并到消息数组中
                    this.talkList = this.talkList.concat(data);

                    // 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
                    this.$nextTick(() => {
                        // 设置当前滚动的位置
                        this.scrollView.intoView = selector;

                        if (data.length < this.ajax.rows) {
                            // 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
                            // 可在此处编写无更多消息数据时的逻辑
                        } else {
                            this.ajax.flag = true;
                            this.ajax.page++;
                        }

                    })
                }
                get();
            },
            // 发送信息
            async handleSendClick() {
                if (!this.content) {
                    uni.showToast({
                        title: '请输入有效的内容',
                        icon: 'none'
                    })
                    return;
                }

                uni.showLoading({
                    title: '发布中...',
                    mask: true
                })

                const res_content = await this.checkContent(this.content)
                // console.log("return checkContent res_content:" + JSON.stringify(res_content))
                if (res_content) {
                    uni.hideLoading()

                    uni.showToast({
                        title: '内容包含危险信息，请修改',
                        icon: 'none',
                        mask: true
                    })
                    return
                }

                this.sendMessage(this.content, 'text');

                // 清空内容框中的内容
                this.content = '';
            },
            // 处理图片点击
            handleImageClick() {
                uni.chooseImage({
                    count: 1, //默认9
                    sizeType: ['original'],
                    sourceType: ['album', 'camera'],
                    success: (res) => {
                        const imageUrl = res.tempFilePaths[0];
                        this.sendMessage(imageUrl, 'image');
                    }
                });
            },
            sendMessage(content, contentType = 'text') {
                const param = 'id=' + this.groupId + '&studentId=' + this.loginStudentId + '&content=' + content
                this.$api.sendGroupContent(param).then(res => {
                    const data = res.data

                    // 将当前发送信息 添加到消息列表。
                    // let data = {
                    //     "id": new Date().getTime(),
                    //     content,
                    //     contentType,
                    //     "type": 1,
                    //     "pic": "/static/logo.png"
                    // }
                    this.talkList.unshift(data);

                    this.getGroupSendPurview()

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
            checkContent(content) {
                const _this = this
                return new Promise((resolve, reject) => {
                    const param = {
                        access_token: _this.access_token,
                        content: content
                    }
                    this.$api.msgSecCheck(param).then(res => {
                        // console.log('msgSecCheck succes res:' + JSON.stringify(res))
                        resolve(res.data)
                    }).catch(res => {
                        // 失败进行的操作
                        uni.showToast({
                            icon: 'error',
                            title: res,
                            mask: true
                        })
                    })
                })
            },
            touchstart(index) {
                if (this.sign == 'sys') {
                    return;
                }
                const that = this;
                clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
                this.Loop = setTimeout(function() {
                        uni.showModal({
                            title: '删除',
                            content: '确认删除本条消息吗？',
                            success: async function(res) {
                                if (res.confirm) {
                                    const id = that.talkList[index].id
                                    // console.log('id:' + id)
                                    const param = {
                                        contentId: id,
                                        studentId: that.loginStudentId
                                    }
                                    that.$api.deleteGroupContent(param).then(res => {

                                        that.talkList.splice(index, 1)
                                    }).catch(res => {
                                        // 失败进行的操作
                                        uni.showToast({
                                            icon: 'error',
                                            title: res,
                                            mask: true
                                        })
                                    })
                                } else if (res.cancel) {
                                    // console.log('用户点击取消')
                                }
                            }
                        });
                    }.bind(this),
                    1000);
            },
            touchend() {
                clearInterval(this.Loop);
            },
            getGroupSendPurview() {
                const param = 'id=' + this.groupId + '&studentId=' + this.loginStudentId
                this.$api.getGroupSendPurview(param).then(res => {
                    // console.log('getGroupSendPurview succes res:' + JSON.stringify(res))

                    const data = res.data
                    this.isSendPurview = data.isSendPurview
                    this.sendCount = data.sendCount
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            updateGroupContentRead() {
                const param = {
                    id: this.groupId,
                    studentId: this.loginStudentId
                };
                this.$api.updateGroupContentRead(param).then(res => {
                    // console.log('updateGroupContentRead succes res:' + JSON.stringify(res))
                }).catch(res => {
                    // 失败进行的操作
                    uni.showToast({
                        icon: 'error',
                        title: '出错了...',
                        mask: true
                    })
                })
            },
            openMyHomePage(studentId, nikeNameId) {
                if (this.sign != 'sys') {
                    if (studentId == this.loginStudentId) {
                        uni.navigateTo({
                            url: '/package-user/my-home/my-home?lookStudentId=' + studentId
                        })
                    } else {
                        uni.navigateTo({
                            url: '/package-user/my-home/my-home?lookStudentId=' + studentId +
                                '&lookNikeNameId=' +
                                nikeNameId
                        })
                    }
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "../../common/global.scss";

    .container {
        height: calc(100vh - var(--window-top));
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: space-between;
        align-items: stretch;
    }

    /* 加载数据提示 */
    .tips {
        position: fixed;
        left: 0;
        top: var(--window-top);
        width: 100%;
        z-index: 9;
        background-color: rgba(0, 0, 0, 0.15);
        height: 72rpx;
        line-height: 72rpx;
        transform: translateY(-80rpx);
        transition: transform 0.3s ease-in-out 0s;

        &.show {
            transform: translateY(0);
        }
    }

    .box-1 {
        width: 100%;
        height: 0;
        flex: 1 0 auto;
        box-sizing: content-box;
    }

    .box-2 {
        height: auto;
        z-index: 2;
        border-top: #e5e5e5 solid 1px;
        box-sizing: content-box;
        background-color: #F3F3F3;

        /* 兼容iPhoneX */
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);

        >view {
            padding: 0 20rpx;
            height: 100rpx;
        }

        .content {
            background-color: #fff;
            height: 64rpx;
            padding: 0 20rpx;
            border-radius: 32rpx;
            font-size: 28rpx;
        }

        .send {
            background-color: #42b983;
            color: #fff;
            height: 64rpx;
            margin-left: 20rpx;
            border-radius: 32rpx;
            padding: 0;
            width: 120rpx;
            line-height: 62rpx;

            &:active {
                background-color: #5fc496;
            }
        }
    }

    .talk-list {
        padding-bottom: 20rpx;
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: nowrap;
        align-content: flex-start;
        justify-content: flex-end;
        align-items: stretch;

        // 添加弹性容器，让内容自动在顶部
        &::before {
            content: '.';
            display: inline;
            visibility: hidden;
            line-height: 0;
            font-size: 0;
            flex: 1 0 auto;
            height: 1px;
        }


        /* 消息项，基础类 */
        .item {
            padding: 20rpx 20rpx 0 20rpx;
            align-items: flex-start;
            align-content: flex-start;
            color: #333;

            .pic {
                width: 92rpx;
                height: 92rpx;
                border-radius: 50%;
                border: #fff solid 1px;
            }

            .content {
                padding: 20rpx;
                border-radius: 4px;
                max-width: 500rpx;
                word-break: break-all;
                line-height: 52rpx;
                position: relative;
            }

            /* 收到的消息 */
            &.pull {
                .content {
                    margin-left: 32rpx;
                    background-color: #fff;

                    &::after {
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: 16rpx solid transparent;
                        border-bottom: 16rpx solid transparent;
                        border-right: 20rpx solid #fff;
                        position: absolute;
                        top: 30rpx;
                        left: -18rpx;
                    }
                }
            }

            /* 发出的消息 */
            &.push {
                /* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
                flex-direction: row-reverse;

                .content {
                    margin-right: 32rpx;
                    background-color: #a0e959;

                    &::after {
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: 16rpx solid transparent;
                        border-bottom: 16rpx solid transparent;
                        border-left: 20rpx solid #a0e959;
                        position: absolute;
                        top: 30rpx;
                        right: -18rpx;
                    }
                }
            }
        }
    }
</style>