<template>
	<view class="page">
		<view class="form-item">
			<view class="label">课程名</view>
			<template v-if="templateOptions.length > 0">
				<picker mode="selector" :range="templateOptions" range-key="courseName" @change="onCourseNameChange"
					:value="selectedCourseIndex">
					<view class="picker">{{ form.courseName || '请选择课程' }}</view>
				</picker>
			</template>
			<template v-else>
				<span class="input" placeholder="请选择课程" @click="onCourseNameClick"></span>
				<!-- <input class="input" v-model="form.courseName" placeholder="请选择课程" readonly @click="onCourseNameClick" /> -->
			</template>
		</view>
		<view class="form-item">
			<view class="label">老师</view>
			<input class="input" v-model="form.teacherName" placeholder="请选择课程后自动填充" disabled />
		</view>
		<view class="form-item">
			<view class="label">星期</view>
			<picker mode="selector" :range="dayOptions" range-key="label" @change="onDayChange">
				<view class="picker">{{ dayLabel(form.dayOfWeek) }}</view>
			</picker>
		</view>
		<view class="form-row">
			<view class="form-item half">
				<view class="label">开始节</view>
				<input class="input" type="number" v-model.number="form.startSection" />
			</view>
			<view class="form-item half">
				<view class="label">结束节</view>
				<input class="input" type="number" v-model.number="form.endSection" />
			</view>
		</view>
		<view class="form-row">
			<view class="form-item half">
				<view class="label">起始周</view>
				<input class="input" type="number" v-model.number="form.weekStart" />
			</view>
			<view class="form-item half">
				<view class="label">结束周</view>
				<input class="input" type="number" v-model.number="form.weekEnd" />
			</view>
		</view>
		<view class="form-item">
			<view class="label">颜色</view>
			<view class="color-picker-wrapper">
				<view class="color-preview" :style="{ background: form.color || '#2caba6' }" @click="openColorPicker"></view>
				<input class="input color-input" v-model="form.color" placeholder="#2caba6" />
			</view>
		</view>

		<!-- 颜色选择器弹窗 -->
		<view class="color-modal" v-if="showColorPicker" @click="closeColorPicker">
			<view class="color-picker-panel" @click.stop>
				<view class="color-area" @touchmove="onColorMove" @touchend="onColorEnd" @click="onColorAreaClick">
					<view class="color-bg" :style="{ background: `hsl(${hue}, 100%, 50%)` }"></view>
					<view class="color-overlay white"></view>
					<view class="color-overlay black"></view>
					<view class="color-cursor" :style="{ left: cursorX + '%', top: cursorY + '%', background: currentColor }"></view>
				</view>
				<view class="hue-slider">
					<view class="hue-track" @touchmove="onHueMove" @touchend="onHueEnd" @click="onHueClick">
						<view class="hue-gradient"></view>
						<view class="hue-thumb" :style="{ left: huePercent + '%' }"></view>
					</view>
				</view>
				<view class="color-value-row">
					<input class="color-value-input" v-model="hexValue" placeholder="#RRGGBB" maxlength="7" />
					<text class="color-clear" @click="clearColor">清空</text>
					<text class="color-confirm" @click="confirmColor">确定</text>
				</view>
			</view>
		</view>
		<view class="conflict-box" v-if="conflictList.length > 0">
			<view class="conflict-title">检测到时间冲突，请调整后再保存：</view>
			<view class="conflict-item" v-for="(item, idx) in conflictList" :key="idx">
				<text>{{ item.courseName }}（周{{ dayLabel(item.dayOfWeek).replace('周', '') }}
					第{{ item.startSection }}-{{ item.endSection }}节）</text>
			</view>
		</view>
		<view class="actions">
			<button class="save" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				form: {
					id: undefined,
					schoolId: '',
					semesterId: 0,
					studentId: '',
					courseName: '',
					teacherName: '',
					dayOfWeek: 1,
					startSection: 1,
					endSection: 2,
					weekStart: 1,
					weekEnd: 16,
					color: '#2caba6'
				},
				dayOptions: [{
						value: 1,
						label: '周一'
					}, {
						value: 2,
						label: '周二'
					}, {
						value: 3,
						label: '周三'
					},
					{
						value: 4,
						label: '周四'
					}, {
						value: 5,
						label: '周五'
					}, {
						value: 6,
						label: '周六'
					}, {
						value: 7,
						label: '周日'
					}
				],
				allScheduleList: [],
				templateOptions: [],
				selectedCourseIndex: -1,
				showColorPicker: false,
				hue: 170,
				cursorX: 50,
				cursorY: 50,
				isDragging: false,
			}
		},
		computed: {
			currentColor() {
				const s = this.cursorX
				const l = 100 - this.cursorY
				return `hsl(${this.hue}, ${s}%, ${l}%)`
			},
			hexValue() {
				return this.hslToHex(this.hue, this.cursorX, 100 - this.cursorY)
			},
			huePercent() {
				return (this.hue / 360) * 100
			},
			conflictList() {
				const currentId = this.form.id ? String(this.form.id) : ''
				return this.allScheduleList.filter((item) => {
					if (currentId && String(item.id) === currentId) return false
					return this.isConflict(item, this.form)
				})
			}
		},
		onLoad(opt) {
			this.userInfo = this.$storage.user.get()
			const payload = opt && opt.payload ? JSON.parse(decodeURIComponent(opt.payload)) : {}
			const item = payload.item || {}
			this.form = {
				...this.form,
				...item,
				schoolId: (this.userInfo && this.userInfo.schoolId) || '',
				semesterId: payload.semesterId || item.semesterId || 0,
				studentId: (this.userInfo && this.userInfo.studentId) || ''
			}
			if (payload.week && !item.id) {
				this.form.weekStart = payload.week
				this.form.weekEnd = payload.week
			}
			this.loadScheduleList()
			this.loadTemplates().then(() => {
				this.syncSelectedCourseIndex()
			})
		},
		methods: {
			async loadScheduleList() {
				if (!this.form.semesterId || !this.form.studentId) return
				const res = await this.$api.getCourseScheduleList({
					semesterId: this.form.semesterId,
					studentId: this.form.studentId
				})
				this.allScheduleList = (res && res.data) || []
			},
			async loadTemplates() {
				if (!this.userInfo || !this.userInfo.schoolId) return
				const res = await this.$api.getCourseTemplateList({
					schoolId: this.userInfo.schoolId
				})
				this.templateOptions = (res && res.data) || []
			},
			onCourseNameClick() {
				if (this.templateOptions.length === 0) {
					uni.showToast({
						title: '暂无课程模板，请联系管理员',
						icon: 'none',
						duration: 3000
					})
				}
			},
			syncSelectedCourseIndex() {
				if (!this.form.courseName || this.templateOptions.length === 0) return
				const idx = this.templateOptions.findIndex((t) => t.courseName === this.form.courseName)
				this.selectedCourseIndex = idx >= 0 ? idx : -1
			},
			onCourseNameChange(e) {
				const idx = Number(e.detail.value || 0)
				this.selectedCourseIndex = idx
				const template = this.templateOptions[idx]
				if (template) {
					this.form.courseName = template.courseName || ''
					this.form.teacherName = template.teacherName || ''
					this.form.color = template.color || '#2caba6'
				}
			},
			onDayChange(e) {
				const idx = Number(e.detail.value || 0)
				this.form.dayOfWeek = this.dayOptions[idx].value
			},

			openColorPicker() {
				if (this.form.color) {
					const hsl = this.hexToHsl(this.form.color)
					this.hue = hsl.h
					this.cursorX = hsl.s
					this.cursorY = 100 - hsl.l
				}
				this.showColorPicker = true
			},
			closeColorPicker() {
				this.showColorPicker = false
			},
			onColorMove(e) {
				const rect = uni.createSelectorQuery().in(this).select('.color-area').boundingClientRect()
				rect.exec((res) => {
					if (res && res[0]) {
						const touch = e.touches[0]
						let x = ((touch.clientX - res[0].left) / res[0].width) * 100
						let y = ((touch.clientY - res[0].top) / res[0].height) * 100
						this.cursorX = Math.max(0, Math.min(100, x))
						this.cursorY = Math.max(0, Math.min(100, y))
					}
				})
			},
			onColorEnd() {
			},
			onColorAreaClick(e) {
				const rect = uni.createSelectorQuery().in(this).select('.color-area').boundingClientRect()
				rect.exec((res) => {
					if (res && res[0]) {
						let x = ((e.detail.x - res[0].left) / res[0].width) * 100
						let y = ((e.detail.y - res[0].top) / res[0].height) * 100
						this.cursorX = Math.max(0, Math.min(100, x))
						this.cursorY = Math.max(0, Math.min(100, y))
					}
				})
			},
			onHueMove(e) {
				const rect = uni.createSelectorQuery().in(this).select('.hue-track').boundingClientRect()
				rect.exec((res) => {
					if (res && res[0]) {
						const touch = e.touches[0]
						let x = ((touch.clientX - res[0].left) / res[0].width) * 360
						this.hue = Math.max(0, Math.min(360, x))
					}
				})
			},
			onHueEnd() {
			},
			onHueClick(e) {
				const rect = uni.createSelectorQuery().in(this).select('.hue-track').boundingClientRect()
				rect.exec((res) => {
					if (res && res[0]) {
						let x = ((e.detail.x - res[0].left) / res[0].width) * 360
						this.hue = Math.max(0, Math.min(360, x))
					}
				})
			},
			hslToHex(h, s, l) {
				s /= 100
				l /= 100
				const a = s * Math.min(l, 1 - l)
				const f = n => {
					const k = (n + h / 30) % 12
					const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
					return Math.round(255 * color).toString(16).padStart(2, '0')
				}
				return `#${f(0)}${f(8)}${f(4)}`
			},
			hexToHsl(hex) {
				let r = 0, g = 0, b = 0
				if (hex.length === 4) {
					r = parseInt(hex[1] + hex[1], 16) / 255
					g = parseInt(hex[2] + hex[2], 16) / 255
					b = parseInt(hex[3] + hex[3], 16) / 255
				} else if (hex.length === 7) {
					r = parseInt(hex.substring(1, 3), 16) / 255
					g = parseInt(hex.substring(3, 5), 16) / 255
					b = parseInt(hex.substring(5, 7), 16) / 255
				}
				const max = Math.max(r, g, b)
				const min = Math.min(r, g, b)
				const l = (max + min) / 2
				let h = 0, s = 0
				if (max !== min) {
					const d = max - min
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
					switch (max) {
						case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
						case g: h = ((b - r) / d + 2) / 6; break
						case b: h = ((r - g) / d + 4) / 6; break
					}
				}
				return { h: h * 360, s: s * 100, l: l * 100 }
			},
			clearColor() {
				this.form.color = ''
				this.closeColorPicker()
			},
			confirmColor() {
				this.form.color = this.hexValue.toUpperCase()
				this.closeColorPicker()
			},
			dayLabel(day) {
				const map = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
				return map[day] || '请选择'
			},
			validate() {
				if (!this.form.courseName) return '请填写课程名'
				if (!this.form.semesterId || !this.form.studentId) return '缺少学期或学生信息'
				if (this.form.dayOfWeek < 1 || this.form.dayOfWeek > 7) return '星期范围应为1-7'
				if (this.form.startSection <= 0 || this.form.endSection <= 0) return '节次必须大于0'
				if (this.form.startSection > this.form.endSection) return '开始节不能大于结束节'
				if (this.form.weekStart <= 0 || this.form.weekEnd <= 0) return '周次必须大于0'
				if (this.form.weekStart > this.form.weekEnd) return '起始周不能大于结束周'
				return ''
			},
			isConflict(a, b) {
				const sameDay = Number(a.dayOfWeek) === Number(b.dayOfWeek)
				const weekOverlap = Number(a.weekStart) <= Number(b.weekEnd) && Number(a.weekEnd) >= Number(b.weekStart)
				const sectionOverlap = Number(a.startSection) <= Number(b.endSection) && Number(a.endSection) >= Number(b
					.startSection)
				return sameDay && weekOverlap && sectionOverlap
			},
			async save() {
				const error = this.validate()
				if (error) {
					uni.showToast({
						title: error,
						icon: 'none'
					})
					return
				}
				if (this.conflictList.length > 0) {
					uni.showToast({
						title: '与已有课程冲突，请调整',
						icon: 'none'
					})
					return
				}
				try {
					const saveData = {
						...this.form,
						schoolId: this.userInfo.schoolId || ''
					}
					if (this.form.id) {
						await this.$api.updateCourseSchedule(saveData)
					} else {
						await this.$api.createCourseSchedule(saveData)
					}
					uni.showToast({
						title: '保存成功',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 300)
				} catch (e) {
					const msg = (e && e.msg) || ''
					if (msg.includes('课程时间冲突')) {
						uni.showToast({
							title: '保存失败：课程时间冲突',
							icon: 'none'
						})
						return
					}
					uni.showToast({
						title: '保存失败，请稍后重试',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.page {
		padding: 24rpx;
		background: #f7f8fa;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.form-item {
		margin-bottom: 18rpx;
	}

	.label {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.input,
	.picker {
		background: #fff;
		height: 72rpx;
		border-radius: 12rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
	}

	.form-row {
		display: flex;
		gap: 16rpx;
	}

	.half {
		flex: 1;
	}

	.conflict-box {
		background: #fff5f5;
		border: 1rpx solid #ffd6d6;
		border-radius: 12rpx;
		padding: 14rpx;
		margin-bottom: 16rpx;
	}

	.conflict-title {
		color: #d9534f;
		font-size: 24rpx;
		margin-bottom: 8rpx;
	}

	.conflict-item {
		color: #a94442;
		font-size: 22rpx;
		line-height: 1.6;
	}

	.actions {
		margin-top: 36rpx;
	}

	.save {
		background: #2caba6;
		color: #fff;
	}

	.input:disabled {
		background: #f5f5f5;
		color: #999;
	}
	.color-picker-wrapper {
		display: flex;
		gap: 12rpx;
		align-items: center;
	}
	.color-preview {
		width: 72rpx;
		height: 72rpx;
		border-radius: 12rpx;
		border: 2rpx solid #e0e0e0;
		flex-shrink: 0;
	}
	.color-input {
		flex: 1;
	}
	.color-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
	.color-picker-panel {
		background: #fff;
		border-radius: 24rpx;
		padding: 32rpx;
		width: 600rpx;
	}
	.color-area {
		width: 100%;
		height: 360rpx;
		position: relative;
		border-radius: 16rpx;
		overflow: hidden;
	}
	.color-bg {
		width: 100%;
		height: 100%;
	}
	.color-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.color-overlay.white {
		background: linear-gradient(to right, #fff, transparent);
	}
	.color-overlay.black {
		background: linear-gradient(to top, #000, transparent);
	}
	.color-cursor {
		position: absolute;
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		border: 4rpx solid #fff;
		box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.2);
		transform: translate(-50%, -50%);
	}
	.hue-slider {
		margin-top: 24rpx;
	}
	.hue-track {
		width: 100%;
		height: 48rpx;
		border-radius: 24rpx;
		position: relative;
	}
	.hue-gradient {
		width: 100%;
		height: 100%;
		border-radius: 24rpx;
		background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
	}
	.hue-thumb {
		position: absolute;
		top: 50%;
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		background: #fff;
		border: 4rpx solid #fff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
		transform: translate(-50%, -50%);
	}
	.color-value-row {
		display: flex;
		gap: 16rpx;
		align-items: center;
		margin-top: 24rpx;
	}
	.color-value-input {
		flex: 1;
		background: #f5f5f5;
		border: 1rpx solid #e0e0e0;
		border-radius: 12rpx;
		height: 72rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}
	.color-clear,
	.color-confirm {
		padding: 16rpx 32rpx;
		border-radius: 12rpx;
		font-size: 28rpx;
	}
	.color-clear {
		background: #f5f5f5;
		color: #666;
	}
	.color-confirm {
		background: #2caba6;
		color: #fff;
	}
</style>
