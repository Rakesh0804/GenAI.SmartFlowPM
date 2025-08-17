// Dashboard module interfaces
import { TaskDto } from './task.interfaces';

export interface DashboardStatsDto {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  userTaskCount: number;
  userPendingTasks: TaskDto[];
}
