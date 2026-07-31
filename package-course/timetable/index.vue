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
		<view class="toolbar">
			<view class="week-switch">
				<button class="btn" size="mini" @click="changeWeek(-1)">上一周</button>
				<view class="week-text">第 {{ week }} 周</view>
				<button class="btn" size="mini" @click="changeWeek(1)">下一周</button>
				<button class="btn" style="margin-left: 10rpx;" size="mini" @click="backToCurrentWeek">回到本周</button>
			</view>
			<view class="actions">
				<button class="btn primary" size="mini" @click="openEdit()">新增课程</button>
			</view>
		</view>



		<view v-if="filteredList.length === 0" class="empty">本周暂无课程</view>
		<view v-else class="list-wrap">
			<view class="course-list">
				<view class="course-item" v-for="(item, idx) in sortedCourseList" :key="idx" @click="openEdit(item)">
					<view class="course-header">
						<view class="course-name">{{ item.courseName }}</view>
						<view class="course-color" :style="{ background: item.color || '#2caba6' }"></view>
					</view>
					<view class="course-info">
						<view class="info-row">
							<text class="info-label">时间：</text>
							<text class="info-value">周{{ dayText(item.dayOfWeek) }}
								{{ item.startSection }}-{{ item.endSection }}节</text>
						</view>
						<view class="info-row">
							<text class="info-label">老师：</text>
							<text class="info-value">{{ item.teacherName || '未填老师' }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">周次：</text>
							<text class="info-value">第{{ item.weekStart }}-{{ item.weekEnd }}周</text>
						</view>
					</view>
					<view class="course-actions">
						<text class="action-edit" @click.stop="openEdit(item)">编辑</text>
						<text class="action-del" @click.stop="removeItem(item)">删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				semesterId: 0,
				week: 1,
				currentWeek: 1,
				currentDay: 1,
				list: [],
				classrooms: []
			}
		},
		computed: {
			filteredList() {
				return this.list
			},
			sortedCourseList() {
				return [...this.filteredList].sort((a, b) => {
					const dayA = Number(a.dayOfWeek) || 0
					const dayB = Number(b.dayOfWeek) || 0
					if (dayA !== dayB) {
						return dayA - dayB
					}
					const startA = Number(a.startSection) || 0
					const startB = Number(b.startSection) || 0
					return startA - startB
				})
			}
		},
		onShow() {
			this.currentDay = this.getCurrentDay()
			this.initPage()
		},
		methods: {
			async initPage() {
				const userInfo = this.$storage.user.get()
				if (!userInfo || !userInfo.studentId || !userInfo.schoolId) {
					uni.showToast({
						title: '请先完成登录与学校绑定',
						icon: 'none'
					})
					return
				}
				this.userInfo = userInfo
				await this.loadSemester()
				await this.loadClassrooms()
				await this.backToCurrentWeek()
			},
			async loadSemester() {
				const res = await this.$api.getCourseCurrentSemester({
					schoolId: this.userInfo.schoolId
				})
				if (!res || !res.data || !res.data.id) {
					throw new Error('当前学期不存在')
				}
				this.semesterId = res.data.id
				this.currentWeek = this.computeCurrentWeek(res.data)
				if (!this.week || this.week < 1) {
					this.week = this.currentWeek
				}
			},
			async loadClassrooms() {
				const res = await this.$api.getCourseClassroomList({
					schoolId: this.userInfo.schoolId
				})
				this.classrooms = (res && res.data) || []
			},
			async loadSchedule() {
				const res = await this.$api.getCourseScheduleByWeek({
					semesterId: this.semesterId,
					studentId: this.userInfo.studentId,
					week: this.week
				})
				this.list = (res && res.data) || []
			},
			changeWeek(offset) {
				const nextWeek = this.week + offset
				if (nextWeek <= 0) return
				this.week = nextWeek
				this.loadSchedule()
			},
			async backToCurrentWeek() {
				this.week = this.currentWeek || 1
				await this.loadSchedule()
			},
			openEdit(item) {
				const payload = encodeURIComponent(JSON.stringify({
					item: item || null,
					semesterId: this.semesterId,
					week: this.week
				}))
				uni.navigateTo({
					url: `/package-course/timetable/edit?payload=${payload}`
				})
			},
			openImportPage() {
				uni.navigateTo({
					url: `/package-course/timetable/import?semesterId=${this.semesterId}&week=${this.week}`
				})
			},
			async removeItem(item) {
				const id = item && item.id
				if (!id) return
				await this.$api.deleteCourseSchedule({
					id,
					studentId: this.userInfo.studentId
				})
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				})
				await this.loadSchedule()
			},
			dayText(day) {
				const map = ['', '一', '二', '三', '四', '五', '六', '日']
				return map[day] || '-'
			},
			classroomName(classroomId) {
				if (!classroomId) return '未设置教室'
				const room = this.classrooms.find((it) => String(it.id) === String(classroomId))
				return room ? room.name : '未知教室'
			},
			getCurrentDay() {
				const day = new Date().getDay()
				return day === 0 ? 7 : day
			},
			computeCurrentWeek(semester) {
				const totalWeeks = Number(semester.totalWeeks || 20)
				const startDate = semester.startDate ? new Date(semester.startDate) : null
				if (!startDate || Number.isNaN(startDate.getTime())) {
					return 1
				}
				const now = new Date()
				const diff = Math.floor((now.getTime() - startDate.getTime()) / (24 * 3600 * 1000))
				const week = Math.floor(diff / 7) + 1
				if (week < 1) return 1
				if (week > totalWeeks) return totalWeeks
				return week
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

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12rpx;
		flex-wrap: wrap;
	}

	.week-switch {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.week-text {
		font-size: 28rpx;
		color: #222;
		font-weight: 600;
		flex: 1;
		text-align: center;
	}

	.actions {
		width: 100%;
		text-align: end;
	}

	.btn {
		background: #fff;
		color: #333;
		border: 1rpx solid #ddd;
	}

	.btn.primary {
		background: #2caba6;
		color: #fff;
		border-color: #2caba6;
	}

	.empty {
		margin-top: 80rpx;
		text-align: center;
		color: #999;
	}

	.list-wrap {
		background: #fff;
		border-radius: 12rpx;
		padding: 12rpx;
	}

	.course-list {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.course-item {
		background: #f8fffe;
		border-radius: 12rpx;
		padding: 20rpx;
		border-left: 6rpx solid #2caba6;
		position: relative;
	}

	.course-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.course-item .course-name {
		font-size: 28rpx;
		color: #222;
		font-weight: 700;
		line-height: 1.4;
		word-break: break-all;
	}

	.course-color {
		width: 40rpx;
		height: 40rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
	}

	.course-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		margin-bottom: 12rpx;
	}

	.info-row {
		display: flex;
		align-items: center;
		font-size: 24rpx;
	}

	.info-label {
		color: #666;
		margin-right: 8rpx;
	}

	.info-value {
		color: #333;
		font-weight: 500;
	}

	.course-item .course-actions {
		margin-top: 0;
	}

	.action-edit {
		font-size: 24rpx;
		color: #2caba6;
		padding: 8rpx 16rpx;
	}

	.action-del {
		font-size: 24rpx;
		color: #d9534f;
		padding: 8rpx 16rpx;
	}
</style>
