export interface CourseItem {
	id?: number
	schoolId?: string
	semesterId: number
	studentId: string
	courseName: string
	teacherName?: string
	classroomId?: number
	dayOfWeek: number
	startSection: number
	endSection: number
	weekStart: number
	weekEnd: number
	color?: string
}

export interface TermInfo {
	id: number
	name: string
	startDate?: string
	endDate?: string
	totalWeeks?: number
	currentFlag?: boolean
	status?: number
}

export interface WeekSchedule {
	week: number
	list: CourseItem[]
}
