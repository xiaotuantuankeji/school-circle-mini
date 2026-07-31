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
    <view class="container">
        <view class="header">
            <text class="title">文字转图片</text>
            <text class="subtitle">轻松将文字转换为图片格式</text>
        </view>

        <view class="content">
            <!-- 文字输入区域 -->
            <view class="input-section">
                <text class="section-title">输入文字</text>
                <textarea v-model="textContent" class="text-input" placeholder="请输入要转换的文字..."
                    @input="debounceUpdatePreview"></textarea>
            </view>

            <!-- 样式设置区域 -->
            <view class="style-section">
                <text class="section-title">样式设置</text>

                <view class="style-item">
                    <text class="style-label">文字颜色</text>
                    <view class="color-picker">
                        <view class="color-option" :style="{ backgroundColor: color }" v-for="color in textColors"
                            :key="color" @click="setTextColor(color)">
                            <view v-if="selectedTextColor === color" class="color-selected"></view>
                        </view>
                        <view class="custom-color">
                            <button class="custom-color-btn" :style="{ backgroundColor: selectedTextColor }"
                                @click="openTextColorPicker"></button>
                        </view>
                    </view>
                </view>

                <view class="style-item">
                    <text class="style-label">背景颜色</text>
                    <view class="color-picker">
                        <view class="color-option" :style="{ backgroundColor: color }" v-for="color in bgColors"
                            :key="color" @click="setBgColor(color)">
                            <view v-if="selectedBgColor === color" class="color-selected"></view>
                        </view>
                        <view class="custom-color">
                            <button class="custom-color-btn" :style="{ backgroundColor: selectedBgColor }"
                                @click="openBgColorPicker"></button>
                        </view>
                    </view>
                </view>

                <view class="style-item">
                    <text class="style-label">字体大小</text>
                    <view class="font-size-control">
                        <button class="size-btn" @click="decreaseFontSize">-</button>
                        <text class="font-size-value">{{ fontSize }}px</text>
                        <button class="size-btn" @click="increaseFontSize">+</button>
                    </view>
                </view>

                <view class="style-item">
                    <text class="style-label">对齐方式</text>
                    <view class="alignment-options">
                        <button class="align-btn" :class="{ 'align-btn-active': textAlign === 'left' }"
                            @click="setTextAlign('left')">
                            <uni-icons type="align-left" size="20"></uni-icons>
                        </button>
                        <button class="align-btn" :class="{ 'align-btn-active': textAlign === 'center' }"
                            @click="setTextAlign('center')">
                            <uni-icons type="align-center" size="20"></uni-icons>
                        </button>
                        <button class="align-btn" :class="{ 'align-btn-active': textAlign === 'right' }"
                            @click="setTextAlign('right')">
                            <uni-icons type="align-right" size="20"></uni-icons>
                        </button>
                    </view>
                </view>
            </view>

            <!-- 预览区域 -->
            <view class="preview-section">
                <text class="section-title">预览</text>
                <view class="preview-container">
                    <canvas canvas-id="textCanvas" class="preview-canvas"
                        :style="{ backgroundColor: selectedBgColor }"></canvas>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="button-section">
                <button class="generate-btn" @click="generateImage">
                    生成图片
                </button>
                <button class="save-btn" @click="saveImage" :disabled="!imagePath">
                    保存图片
                </button>
            </view>
        </view>

        <!-- 生成成功提示 -->
        <uni-popup v-model="showSuccessPopup" type="center">
            <view class="popup-content">
                <uni-icons type="success" size="60" color="#00aa00"></uni-icons>
                <text class="popup-text">图片生成成功！</text>
                <button class="popup-btn" @click="showSuccessPopup = false">确定</button>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                textContent: "请输入文字...",
                selectedTextColor: "#000000",
                selectedBgColor: "#ffffff",
                fontSize: 24,
                textAlign: "center",
                imagePath: "",
                showSuccessPopup: false,
                textColors: ["#000000", "#ffffff", "#ff0000", "#0000ff", "#00aa00", "#ffaa00"],
                bgColors: ["#ffffff", "#000000", "#f5f5f5", "#eeeeee", "#ffeeee", "#eeffee"],
                debounceTimer: null
            };
        },
        onReady() {
            // 页面准备就绪后初始化预览
            this.updatePreview();
        },
        methods: {
            // 防抖更新预览，避免输入时频繁刷新
            debounceUpdatePreview() {
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }
                this.debounceTimer = setTimeout(() => {
                    this.updatePreview();
                }, 300);
            },

            // 更新预览画布
            updatePreview() {
                const ctx = uni.createCanvasContext('textCanvas', this);
                const canvasWidth = 300;
                const canvasHeight = 300;

                // 清空画布
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                // 设置背景
                ctx.setFillStyle(this.selectedBgColor);
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // 设置文字样式
                ctx.setFillStyle(this.selectedTextColor);
                ctx.setFontSize(this.fontSize);

                // 处理文本换行
                const text = this.textContent || "请输入文字...";
                const lineHeight = this.fontSize * 1.5;
                const maxWidth = canvasWidth - 40; // 左右边距
                let x = 20; // 左边距
                const y = lineHeight; // 上边距

                // 根据对齐方式调整x坐标
                if (this.textAlign === 'center') {
                    x = canvasWidth / 2;
                } else if (this.textAlign === 'right') {
                    x = canvasWidth - 20;
                }

                // 绘制文本
                this.drawText(ctx, text, x, y, maxWidth, lineHeight);

                ctx.draw();
            },

            // 绘制多行文本（处理换行）
            drawText(ctx, text, x, y, maxWidth, lineHeight) {
                let line = '';

                for (let i = 0; i < text.length; i++) {
                    const testLine = line + text[i];
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && i > 0) {
                        // 根据对齐方式绘制
                        if (this.textAlign === 'left') {
                            ctx.fillText(line, x, y);
                        } else if (this.textAlign === 'center') {
                            ctx.fillText(line, x, y, maxWidth);
                        } else if (this.textAlign === 'right') {
                            ctx.fillText(line, x, y, maxWidth);
                        }

                        line = text[i];
                        y += lineHeight;

                        // 超出画布高度则停止绘制
                        if (y > 300) break;
                    } else {
                        line = testLine;
                    }
                }

                // 绘制最后一行
                if (this.textAlign === 'left') {
                    ctx.fillText(line, x, y);
                } else if (this.textAlign === 'center') {
                    ctx.fillText(line, x, y, maxWidth);
                } else if (this.textAlign === 'right') {
                    ctx.fillText(line, x, y, maxWidth);
                }
            },

            // 设置文字颜色
            setTextColor(color) {
                this.selectedTextColor = color;
                this.updatePreview();
            },

            // 设置背景颜色
            setBgColor(color) {
                this.selectedBgColor = color;
                this.updatePreview();
            },

            // 打开文字颜色选择器
            openTextColorPicker() {
                uni.showModal({
                    title: '选择颜色',
                    content: '请输入颜色值（如：#ff0000）',
                    editable: true,
                    placeholderText: '#000000',
                    success: (res) => {
                        if (res.confirm) {
                            const color = res.content.trim();
                            if (this.isValidColor(color)) {
                                this.selectedTextColor = color;
                                this.updatePreview();
                            } else {
                                uni.showToast({
                                    title: '无效的颜色值',
                                    icon: 'none'
                                });
                            }
                        }
                    }
                });
            },

            // 打开背景颜色选择器
            openBgColorPicker() {
                uni.showModal({
                    title: '选择颜色',
                    content: '请输入颜色值（如：#ffffff）',
                    editable: true,
                    placeholderText: '#ffffff',
                    success: (res) => {
                        if (res.confirm) {
                            const color = res.content.trim();
                            if (this.isValidColor(color)) {
                                this.selectedBgColor = color;
                                this.updatePreview();
                            } else {
                                uni.showToast({
                                    title: '无效的颜色值',
                                    icon: 'none'
                                });
                            }
                        }
                    }
                });
            },

            // 验证颜色值是否有效
            isValidColor(color) {
                const reg = /^#([0-9a-fA-F]{3}){1,2}$/;
                return reg.test(color);
            },

            // 减小字体大小
            decreaseFontSize() {
                if (this.fontSize > 12) {
                    this.fontSize--;
                    this.updatePreview();
                }
            },

            // 增大字体大小
            increaseFontSize() {
                if (this.fontSize < 48) {
                    this.fontSize++;
                    this.updatePreview();
                }
            },

            // 设置文字对齐方式
            setTextAlign(align) {
                this.textAlign = align;
                this.updatePreview();
            },

            // 生成图片
            generateImage() {
                uni.canvasToTempFilePath({
                    canvasId: 'textCanvas',
                    success: (res) => {
                        this.imagePath = res.tempFilePath;
                        this.showSuccessPopup = true;
                    },
                    fail: (err) => {
                        console.error('生成图片失败:', err);
                        uni.showToast({
                            title: '生成图片失败',
                            icon: 'none'
                        });
                    }
                }, this);
            },

            // 保存图片到相册
            saveImage() {
                if (!this.imagePath) return;

                // 先请求授权
                uni.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: () => {
                        // 授权成功，保存图片
                        uni.saveImageToPhotosAlbum({
                            filePath: this.imagePath,
                            success: () => {
                                uni.showToast({
                                    title: '图片保存成功',
                                    icon: 'success'
                                });
                            },
                            fail: (err) => {
                                console.error('保存图片失败:', err);
                                uni.showToast({
                                    title: '保存图片失败',
                                    icon: 'none'
                                });
                            }
                        });
                    },
                    fail: () => {
                        // 授权失败，提示用户打开设置
                        uni.showModal({
                            title: '授权失败',
                            content: '需要授权访问相册才能保存图片，请在设置中开启授权',
                            confirmText: '去设置',
                            success: (res) => {
                                if (res.confirm) {
                                    uni.openSetting();
                                }
                            }
                        });
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f5f7fa;
    }

    .header {
        padding: 30rpx 20rpx;
        text-align: center;
        background-color: #ffffff;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    }

    .title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333333;
    }

    .subtitle {
        font-size: 24rpx;
        color: #666666;
        margin-top: 10rpx;
        display: inline-block;
    }

    .content {
        flex: 1;
        padding: 20rpx;
        box-sizing: border-box;
    }

    .section-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 20rpx;
        display: block;
    }

    .input-section,
    .style-section,
    .preview-section {
        background-color: #ffffff;
        border-radius: 16rpx;
        padding: 25rpx;
        margin-bottom: 25rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .input-section:active,
    .style-section:active,
    .preview-section:active {
        transform: translateY(2rpx);
        box-shadow: 0 1rpx 5rpx rgba(0, 0, 0, 0.03);
    }

    .text-input {
        width: 100%;
        height: 200rpx;
        border: 2rpx solid #eeeeee;
        border-radius: 10rpx;
        padding: 20rpx;
        font-size: 26rpx;
        box-sizing: border-box;
        resize: none;
        transition: border-color 0.3s;
    }

    .text-input:focus {
        border-color: #007aff;
        outline: none;
    }

    .style-item {
        margin-bottom: 30rpx;
    }

    .style-item:last-child {
        margin-bottom: 0;
    }

    .style-label {
        font-size: 26rpx;
        color: #666666;
        display: block;
        margin-bottom: 15rpx;
    }

    .color-picker {
        display: flex;
        flex-wrap: wrap;
        gap: 15rpx;
    }

    .color-option {
        width: 50rpx;
        height: 50rpx;
        border-radius: 8rpx;
        border: 2rpx solid #eeeeee;
        position: relative;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .color-option:active {
        transform: scale(0.9);
    }

    .color-option:hover {
        box-shadow: 0 0 0 2rpx rgba(0, 122, 255, 0.5);
    }

    .color-selected {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20rpx;
        height: 20rpx;
        background-color: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.2);
    }

    .custom-color-btn {
        width: 50rpx;
        height: 50rpx;
        padding: 0;
        border-radius: 8rpx;
        border: 2rpx dashed #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .font-size-control {
        display: flex;
        align-items: center;
        gap: 20rpx;
    }

    .size-btn {
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        padding: 0;
        border-radius: 8rpx;
        background-color: #f5f7fa;
        color: #333333;
        font-size: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    .size-btn:active {
        background-color: #e5e7eb;
    }

    .font-size-value {
        font-size: 28rpx;
        color: #333333;
        min-width: 80rpx;
        text-align: center;
    }

    .alignment-options {
        display: flex;
        gap: 15rpx;
    }

    .align-btn {
        flex: 1;
        padding: 15rpx 0;
        border-radius: 8rpx;
        background-color: #f5f7fa;
        color: #666666;
        transition: all 0.2s;
    }

    .align-btn-active {
        background-color: #007aff;
        color: #ffffff;
    }

    .align-btn:active:not(.align-btn-active) {
        background-color: #e5e7eb;
    }

    .preview-container {
        display: flex;
        justify-content: center;
        padding: 20rpx 0;
    }

    .preview-canvas {
        width: 300px;
        height: 300px;
        border-radius: 10rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s;
    }

    .preview-canvas:hover {
        box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.15);
    }

    .button-section {
        display: flex;
        gap: 20rpx;
        margin-top: 10rpx;
    }

    .generate-btn,
    .save-btn {
        flex: 1;
        padding: 25rpx 0;
        font-size: 28rpx;
        border-radius: 10rpx;
        transition: transform 0.1s, opacity 0.1s;
    }

    .generate-btn {
        background-color: #007aff;
        color: #ffffff;
    }

    .save-btn {
        background-color: #34c759;
        color: #ffffff;
    }

    .save-btn:disabled {
        background-color: #cccccc;
        color: #999999;
    }

    .generate-btn:active,
    .save-btn:active:not(:disabled) {
        transform: scale(0.98);
        opacity: 0.9;
    }

    .popup-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50rpx 30rpx;
        background-color: #ffffff;
        border-radius: 16rpx;
        width: 60%;
        animation: popupIn 0.3s;
    }

    @keyframes popupIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }

        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    .popup-text {
        font-size: 30rpx;
        color: #333333;
        margin: 30rpx 0;
    }

    .popup-btn {
        margin-top: 20rpx;
        padding: 15rpx 40rpx;
        background-color: #007aff;
        color: #ffffff;
        border-radius: 8rpx;
        font-size: 26rpx;
    }
</style>