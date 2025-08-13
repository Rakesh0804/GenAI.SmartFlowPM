import { BaseApiService } from '../lib/base-api.service';
import { 
  DashboardStatsDto, 
  HomeDashboardDto, 
  TaskDto, 
  ProjectDto, 
  UserDto 
} from '../types/api.types';

export class DashboardService extends BaseApiService {
  private static instance: DashboardService;

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getStats(): Promise<DashboardStatsDto> {
    return this.get<DashboardStatsDto>('/dashboard/stats');
  }

  async getHomeDashboard(): Promise<HomeDashboardDto> {
    return this.get<HomeDashboardDto>('/dashboards/home');
  }

  async getRecentTasks(limit: number = 5): Promise<TaskDto[]> {
    const url = `/dashboard/recent-tasks${this.buildQueryParams({ limit })}`;
    return this.get<TaskDto[]>(url);
  }

  async getRecentProjects(limit: number = 5): Promise<ProjectDto[]> {
    const url = `/dashboard/recent-projects${this.buildQueryParams({ limit })}`;
    return this.get<ProjectDto[]>(url);
  }

  async getTeamMembers(): Promise<UserDto[]> {
    return this.get<UserDto[]>('/dashboard/team-members');
  }

  // Additional dashboard-specific methods
  async getUserDashboard(userId: string): Promise<any> {
    return this.get<any>(`/dashboard/user/${userId}`);
  }

  async getProjectDashboard(projectId: string): Promise<any> {
    return this.get<any>(`/dashboard/project/${projectId}`);
  }

  async getTeamDashboard(teamId: string): Promise<any> {
    return this.get<any>(`/dashboard/team/${teamId}`);
  }

  async getAnalytics(period: string = 'week'): Promise<any> {
    const url = `/dashboard/analytics${this.buildQueryParams({ period })}`;
    return this.get<any>(url);
  }

  async getProductivityMetrics(userId?: string, period: string = 'month'): Promise<any> {
    const params: any = { period };
    if (userId) params.userId = userId;
    
    const url = `/dashboard/productivity${this.buildQueryParams(params)}`;
    return this.get<any>(url);
  }

  async getTaskDistribution(): Promise<any> {
    return this.get<any>('/dashboard/task-distribution');
  }

  async getProjectProgress(): Promise<any> {
    return this.get<any>('/dashboard/project-progress');
  }

  async getBurndownData(projectId?: string, sprintId?: string): Promise<any> {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (sprintId) params.sprintId = sprintId;
    
    const url = `/dashboard/burndown${this.buildQueryParams(params)}`;
    return this.get<any>(url);
  }

  async getWorkloadDistribution(): Promise<any> {
    return this.get<any>('/dashboard/workload-distribution');
  }

  async getUpcomingDeadlines(days: number = 7): Promise<any> {
    const url = `/dashboard/upcoming-deadlines${this.buildQueryParams({ days })}`;
    return this.get<any>(url);
  }
}

// Export singleton instance
export const dashboardService = DashboardService.getInstance();
