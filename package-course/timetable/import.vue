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
	<view class="page">
		<view class="block">
			<view class="title">模板导入</view>
			<view class="form-item">
				<view class="label">模板</view>
				<view class="checkbox-wrap">
					<checkbox-group @change="onTemplateMultiChange">
						<label class="checkbox-item" v-for="item in templateOptions" :key="item.id">
							<checkbox :value="String(item.id)" :checked="selectedTemplateIds.includes(item.id)" />
							<text>{{ item.courseName }}<text v-if="item.teacherName">（{{ item.teacherName }}）</text></text>
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="form-row">
				<view class="form-item half"><view class="label">星期</view><input class="input" type="number" v-model.number="dayOfWeek" /></view>
				<view class="form-item half"><view class="label">开始节</view><input class="input" type="number" v-model.number="startSection" /></view>
			</view>
			<view class="form-row">
				<view class="form-item half"><view class="label">结束节</view><input class="input" type="number" v-model.number="endSection" /></view>
				<view class="form-item half"><view class="label">起始周</view><input class="input" type="number" v-model.number="weekStart" /></view>
			</view>
			<view class="form-item"><view class="label">结束周</view><input class="input" type="number" v-model.number="weekEnd" /></view>
			<button class="btn primary" @click="importByTemplate">从模板导入</button>
		</view>

		<view class="block">
			<view class="title">分享码</view>
			<button class="btn" @click="generateShareCode">生成我的分享码</button>
			<view v-if="shareCode" class="share-code">{{ shareCode }}</view>
			<input class="input" v-model="inputShareCode" placeholder="输入分享码后导入" />
			<button class="btn primary" @click="importByShareCode">通过分享码导入</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			semesterId: 0,
			templateOptions: [],
			selectedTemplateIds: [],
			dayOfWeek: 1,
			startSection: 1,
			endSection: 2,
			weekStart: 1,
			weekEnd: 1,
			shareCode: '',
			inputShareCode: ''
		}
	},
	onLoad(opt) {
		const userInfo = this.$storage.user.get()
		this.userInfo = userInfo
		this.semesterId = Number(opt.semesterId || 0)
		const week = Number(opt.week || 1)
		this.weekStart = week
		this.weekEnd = week
		this.loadTemplates()
	},
	methods: {
		async loadTemplates() {
			const res = await this.$api.getCourseTemplateList({ schoolId: this.userInfo.schoolId })
			this.templateOptions = (res && res.data) || []
		},
		onTemplateMultiChange(e) {
			const values = (e.detail && e.detail.value) || []
			this.selectedTemplateIds = values.map((v) => Number(v))
		},
		async importByTemplate() {
			if (!this.selectedTemplateIds.length) {
				uni.showToast({ title: '请先选择模板', icon: 'none' })
				return
			}
			const res = await this.$api.importCourseFromTemplates({
				semesterId: this.semesterId,
				studentId: this.userInfo.studentId,
				templateIds: this.selectedTemplateIds,
				dayOfWeek: this.dayOfWeek,
				startSection: this.startSection,
				endSection: this.endSection,
				weekStart: this.weekStart,
				weekEnd: this.weekEnd
			})
			uni.showToast({ title: `导入成功 ${res.data || 0} 条`, icon: 'none' })
			setTimeout(() => {
				uni.navigateBack()
			}, 350)
		},
		async generateShareCode() {
			const res = await this.$api.generateCourseShareCode({
				semesterId: this.semesterId,
				studentId: this.userInfo.studentId
			})
			this.shareCode = (res && res.data) || ''
		},
		async importByShareCode() {
			if (!this.inputShareCode) {
				uni.showToast({ title: '请输入分享码', icon: 'none' })
				return
			}
			const res = await this.$api.importCourseByShareCode({
				shareCode: this.inputShareCode,
				semesterId: this.semesterId,
				studentId: this.userInfo.studentId
			})
			uni.showToast({ title: `导入成功 ${res.data || 0} 条`, icon: 'none' })
			setTimeout(() => {
				uni.navigateBack()
			}, 350)
		}
	}
}
</script>

<style>
.page { padding: 24rpx; background: #f7f8fa; min-height: 100vh; box-sizing: border-box; }
.block { background: #fff; border-radius: 12rpx; padding: 20rpx; margin-bottom: 20rpx; }
.title { font-size: 30rpx; font-weight: 700; margin-bottom: 16rpx; }
.form-item { margin-bottom: 14rpx; }
.label { color: #666; font-size: 24rpx; margin-bottom: 8rpx; }
.checkbox-wrap { background: #f5f5f5; border-radius: 10rpx; padding: 12rpx 16rpx; }
.checkbox-item { display: flex; align-items: center; gap: 10rpx; padding: 10rpx 0; font-size: 24rpx; color: #333; }
.input, .picker { background: #f5f5f5; border-radius: 10rpx; height: 70rpx; display: flex; align-items: center; padding: 0 16rpx; }
.form-row { display: flex; gap: 14rpx; }
.half { flex: 1; }
.btn { margin-top: 12rpx; background: #fff; border: 1rpx solid #ddd; color: #333; }
.btn.primary { background: #2caba6; color: #fff; border-color: #2caba6; }
.share-code { margin: 10rpx 0; color: #2caba6; font-size: 24rpx; word-break: break-all; }
</style>
