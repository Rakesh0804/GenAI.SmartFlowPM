// Home Dashboard module interfaces
import type { TaskStatusChartDto, ProjectStatusChartDto, TaskTypeChartDto, BurndownChartDto, PendingTaskDto, LeaveBalanceDto, RecentActivityDto, UpcomingHolidayDto, AnnouncementDto, UserDashboardSummaryDto } from './dashboard-shared.interfaces.js';

export interface HomeDashboardDto {
  totalProjects: number;
  activeTasks: number;
  teamMembers: number;
  completed: number;
  overdueTasks: number;
  taskStatusData: TaskStatusChartDto[];
  projectStatusData: ProjectStatusChartDto[];
  taskTypeData: TaskTypeChartDto[];
  burndownData: BurndownChartDto[];
  userSummary: UserDashboardSummaryDto;
  myPendingTasks: PendingTaskDto[];
  leaveBalance: LeaveBalanceDto;
  recentActivities: RecentActivityDto[];
  upcomingHolidays: UpcomingHolidayDto[];
  latestAnnouncements: AnnouncementDto[];
}
