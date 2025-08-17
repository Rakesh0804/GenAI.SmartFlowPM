// Shared dashboard interfaces

export interface UserDashboardSummaryDto {
  userId: string;
  userName: string;
  myTotalTasks: number;
  myPendingTasksCount: number;
  myCompletedTasks: number;
  myOverdueTasks: number;
}

export interface PendingTaskDto {
  id: string;
  title: string;
  projectName: string;
  priority: string;
  priorityColor: string;
  dueDate?: Date;
  isOverdue: boolean;
}

export interface LeaveBalanceDto {
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  pendingRequests: number;
}

export interface RecentActivityDto {
  userName: string;
  userInitials: string;
  action: string;
  timestamp: Date;
  timeAgo: string;
  avatarColor: string;
}

export interface UpcomingHolidayDto {
  name: string;
  date: Date;
  description: string;
  dayOfWeek: string;
  formattedDate: string;
}

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  timeAgo: string;
}

export interface TaskStatusChartDto {
  name: string;
  value: number;
  color: string;
}

export interface ProjectStatusChartDto {
  name: string;
  open: number;
  inProgress: number;
  completed: number;
  total: number;
}

export interface TaskTypeChartDto {
  name: string;
  value: number;
  color: string;
}

export interface BurndownChartDto {
  day: string;
  planned: number;
  actual: number;
}
