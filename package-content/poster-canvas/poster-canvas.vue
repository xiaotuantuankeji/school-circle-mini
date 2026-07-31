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

        <view class="contentInsideView">

            <canvas class="canvasStyle" canvas-id="myCanvas" :disable-scroll="true"
                :style="{width: canvasWidth + 'px',height: canvasHeight + 'px' }"></canvas>

            <view class="posterButtonView">
                <button class="posterButton" @click="savePosterBtn">保存海报</button>
            </view>

        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,

                canvasWidth: 0,
                canvasHeight: 300,

                contentMaxWidth: 0,

                bgImg: '/static/img/poster/poster-layer.png',

                cardId: 0,
                cardItem: {
                    schoolName: '',
                    numId: '',
                    avatar: '',
                    nikeName: '',
                    sex: '',
                    content: '',
                    qrCode: '/static/img/logo/mini-qecode.jpg'
                },

                imgs: '', // 生成的海报路径
                isNetworkImg: true,
            }
        },
        onLoad(opt) {
            let cardId = opt.cardId
            if (cardId == undefined) {
                cardId = 0
            }
            this.cardId = cardId

            this.getSystemInfo()

            this.getSendCardDetail()
        },
        methods: {
            // 获取设备信息
            getSystemInfo() {
                const that = this
                uni.getSystemInfo({
                    success: function(res) {
                        that.winWidth = res.windowWidth
                        that.winHeight = res.windowHeight

                        that.canvasWidth = that.winWidth * 0.88
                        that.contentMaxWidth = that.canvasWidth * 0.66
                    }
                });
            },
            getSendCardDetail() {
                const _this = this
                uni.showLoading({
                    title: '获取中...',
                    mask: true
                })

                const userInfo = this.$storage.user.get();
                const studentId = userInfo.studentId

                const param = 'cardId=' + this.cardId + '&studentId=' + studentId
                this.$api.getSendCardDetail(param).then(res => {
                    // console.log('getSendCardDetail succes res:' + JSON.stringify(res))

                    const item = res.data

                    let avatar = item.avatar
                    let isNetworkImg = true
                    if (avatar == '') {
                        avatar = '/static/img/logo/default-avatar.png'
                        isNetworkImg = false
                    }
                    this.isNetworkImg = isNetworkImg

                    const sex = item.sex
                    let sexUrl = ''
                    if (sex == 1) {
                        sexUrl = '/static/img/other/male.png'
                    }
                    if (sex == 2) {
                        sexUrl = '/static/img/other/woman.png'
                    }

                    this.cardItem.schoolName = item.schoolName
                    this.cardItem.numId = item.numId
                    this.cardItem.avatar = avatar
                    this.cardItem.nikeName = item.nikeName
                    this.cardItem.sex = sexUrl
                    this.cardItem.content = item.content
                    // this.cardItem.content =
                    //     '发送健康减肥减肥\n就流口水的放假\n开始就是看减肥\n咖啡镂空设计\n大方放假冯绍峰就是风\n景放假时间发就发\n了开始减肥了放假是老骥伏枥开始放假'

                    if (isNetworkImg) {
                        uni.downloadFile({
                            url: avatar, //仅为示例，并非真实的资源
                            success: (res) => {
                                if (res.statusCode === 200) {
                                    const tempFilePath = res.tempFilePath
                                    this.drawPageImg(tempFilePath)
                                }
                            }
                        })
                    } else {
                        this.drawPageImg()
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
                })
            },
            savePosterBtn() {
                console.log('savePosterBtn')
                this.saveImage()
            },
            drawPageImg(avatarImg) {
                uni.showLoading({
                    title: '绘制中...'
                })

                const _this = this
                // 生成画布
                const ctx = uni.createCanvasContext('myCanvas')
                // 背景图
                ctx.drawImage(_this.bgImg, //图像资源
                    0, //图像的左上角在目标canvas上 X 轴的位置
                    0, //图像的左上角在目标canvas上 Y 轴的位置
                    _this.canvasWidth, //在目标画布上绘制图像的宽度
                    _this.canvasHeight //在目标画布上绘制图像的高度
                )

                // 绘制头像
                if (_this.isNetworkImg) {
                    _this.drawRoundedImage(ctx, avatarImg, 25, 30, 70, 70, 35);
                } else {
                    _this.drawRoundedImage(ctx, this.cardItem.avatar, 25, 30, 70, 70, 35);
                }

                // 绘制文字
                // text:此参数指定要在画布上写入的文本。
                // x:此参数指定从何处开始文本的x坐标。
                // y:此参数指定从何处结束文本的y坐标。
                // maxWidth:此参数指定文本允许的最大宽度。它是可选的。

                // 昵称
                ctx.setFontSize(17);
                ctx.setFillStyle("#000000");
                ctx.fillText(_this.cardItem.nikeName, 108, 70);
                const metrics = ctx.measureText(_this.cardItem.nikeName)
                const leftWidth = 108 + parseInt(metrics.width) + 5

                if (_this.cardItem.sex != '') {
                    //性别图标
                    ctx.drawImage(_this.cardItem.sex, leftWidth, 57, 17, 17);
                }

                //学校名称
                ctx.setFontSize(12);
                ctx.setFillStyle("#717170");
                ctx.fillText(_this.cardItem.schoolName, 108, 90);

                //内容
                _this.ctxTextWrap(ctx, _this.cardItem.content, 25, 120, _this.contentMaxWidth)

                //数字ID
                ctx.setFontSize(19);
                ctx.setFillStyle("#2CABA6");
                ctx.fillText(_this.cardItem.numId, 25, 250);

                const qrLeftWidth = _this.canvasWidth - 87 - 20
                //小程序码
                ctx.drawImage(_this.cardItem.qrCode, qrLeftWidth, 200, 87, 87);

                // 渲染画布
                ctx.draw(false, (() => {
                    setTimeout(() => {
                        uni.canvasToTempFilePath({
                            canvasId: 'myCanvas',
                            destWidth: _this.canvasWidth * 2, //展示图片尺寸=画布尺寸1*像素比2
                            destHeight: _this.canvasHeight * 2,
                            quality: 1,
                            fileType: 'png',
                            success: (res) => {
                                uni.hideLoading()
                                // console.log('通过画布绘制出的图片--保存的就是这个图', res.tempFilePath)
                                _this.imgs = res.tempFilePath
                            },
                            fail: function(error) {
                                uni.hideLoading()
                            }
                        }, _this)

                    }, 100)
                })())
            },
            drawRoundedImage(ctx, image, x, y, width, height, cornerRadius) {
                ctx.save();
                ctx.beginPath();

                // 上左角
                ctx.moveTo(x + cornerRadius, y);
                ctx.lineTo(x + width - cornerRadius, y);
                // 上右角
                ctx.arc(
                    x + width - cornerRadius,
                    y + cornerRadius,
                    cornerRadius,
                    -Math.PI / 2,
                    0
                );
                // 下右角
                ctx.lineTo(x + width, y + height - cornerRadius);
                ctx.arc(
                    x + width - cornerRadius,
                    y + height - cornerRadius,
                    cornerRadius,
                    0,
                    Math.PI / 2
                );
                // 下左角
                ctx.lineTo(x + cornerRadius, y + height);
                ctx.arc(
                    x + cornerRadius,
                    y + height - cornerRadius,
                    cornerRadius,
                    Math.PI / 2,
                    Math.PI
                );
                // 左侧边
                ctx.lineTo(x, y + cornerRadius);
                ctx.arc(
                    x + cornerRadius,
                    y + cornerRadius,
                    cornerRadius,
                    Math.PI,
                    -Math.PI / 2
                );

                ctx.closePath();
                ctx.clip();
                ctx.drawImage(image, x, y, width, height);

                ctx.restore();
            },
            ctxTextWrap(ctx, text, x, y, w) {
                //自动换行介绍
                let temp = ""
                const row = []
                let gxqm = ''
                if (text) {
                    gxqm = text
                } else {
                    gxqm = ''
                }
                const gexingqianming = gxqm.split("")
                for (let a = 0; a < gexingqianming.length; a++) {
                    if (ctx.measureText(temp).width < w) {} else {
                        if (row.length < 2) {
                            row.push(temp)
                        }
                        temp = ""
                    }
                    temp += gexingqianming[a]
                }
                row.push(temp)
                ctx.setFontSize(15);
                ctx.setFillStyle("#6f7374");
                for (let b = 0; b < row.length; b++) {
                    if (b == 0) {
                        ctx.fillText(row[b], x, y + (b + 1) * 20)
                    }
                    if (b == 1) {
                        if (row.length > 2) {
                            const con = row[b] + '...'
                            ctx.fillText(con, x, y + (b + 1) * 20)
                            return
                        } else {
                            ctx.fillText(row[b], x, y + (b + 1) * 20)
                        }
                    }
                }
            },
            saveImage() {
                const _this = this
                uni.saveImageToPhotosAlbum({
                    filePath: _this.imgs,
                    success: function() {
                        uni.showToast({
                            icon: 'none',
                            position: 'bottom',
                            title: "已保存到系统相册",
                        })
                    },
                    fail: function(error) {
                        uni.showModal({
                            title: '提示',
                            content: '若点击不授权，将无法使用保存图片功能',
                            cancelText: '不授权',
                            cancelColor: '#999',
                            confirmText: '授权',
                            confirmColor: '#f94218',
                            success(res) {
                                if (res.confirm) {
                                    // 选择弹框内授权
                                    uni.openSetting({
                                        success(res) {
                                            if (res.authSetting.scope.writePhotosAlbum ==
                                                true) {
                                                _this.saveImage()
                                            }
                                        }
                                    })
                                } else if (res.cancel) {
                                    // 选择弹框内 不授权
                                    console.log('用户点击不授权')
                                }
                            }
                        })
                    }
                })
            },
        }
    }
</script>

<style>
    .content {
        background: linear-gradient(180deg, #94D4D2 0%, #F3F3F1 92%, #F3F3F1 100%);
    }

    .contentInsideView {
        padding: 10rpx 46rpx 50rpx 46rpx;
    }

    .canvasStyle {
        /* width: 100%; */
        /* height: 520rpx; */
        margin-top: 79rpx;
    }

    .posterButtonView {
        width: 88%;
        position: fixed;
        bottom: 40rpx;
    }

    .posterButton {
        background: #000000;
        border-radius: 40rpx;

        font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 31rpx;
        color: #8CE8ED;
        font-style: normal;
        text-transform: none;
    }
</style>