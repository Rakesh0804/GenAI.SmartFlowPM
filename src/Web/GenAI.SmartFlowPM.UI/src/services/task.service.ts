import { BaseApiService } from '../lib/base-api.service';
import { TaskDto, PaginatedResponse, TaskStatus, TaskPriority } from '../types/api.types';

interface TaskFilterParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedUserId?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export class TaskService extends BaseApiService {
  private static instance: TaskService;

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getTasks(page: number = 1, pageSize: number = 10, filters?: TaskFilterParams): Promise<PaginatedResponse<TaskDto>> {
    const params: Record<string, any> = {
      pageNumber: page,
      pageSize: pageSize,
    };

    // Add filter parameters if provided - using exact property names from TaskFilteredPagedQuery
    if (filters?.searchTerm) {
      params.searchTerm = filters.searchTerm;
    }
    if (filters?.status !== undefined) {
      params.status = filters.status;
    }
    if (filters?.priority !== undefined) {
      params.priority = filters.priority;
    }
    if (filters?.projectId) {
      params.projectId = filters.projectId;
    }
    if (filters?.assignedUserId) {
      params.assignedUserId = filters.assignedUserId;
    }
    if (filters?.sortBy) {
      params.sortBy = filters.sortBy;
    }
    if (filters?.sortDescending !== undefined) {
      params.sortDescending = filters.sortDescending;
    }

    const url = `/tasks${this.buildQueryParams(params)}`;
    return this.get<PaginatedResponse<TaskDto>>(url);
  }

  async getTaskById(id: string): Promise<TaskDto> {
    return this.get<TaskDto>(`/tasks/${id}`);
  }

  async createTask(task: Partial<TaskDto>): Promise<TaskDto> {
    return this.post<TaskDto>('/tasks', task);
  }

  async updateTask(id: string, task: Partial<TaskDto>): Promise<TaskDto> {
    return this.put<TaskDto>(`/tasks/${id}`, task);
  }

  async deleteTask(id: string): Promise<void> {
    return this.delete(`/tasks/${id}`);
  }

  async getUserTasks(userId: string): Promise<TaskDto[]> {
    return this.get<TaskDto[]>(`/users/${userId}/tasks`);
  }

  async updateTaskStatus(id: string, status: string): Promise<TaskDto> {
    return this.patch<TaskDto>(`/tasks/${id}/status`, { status });
  }

  // Additional utility methods
  async searchTasks(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TaskDto>> {
    return this.getTasks(page, pageSize, { searchTerm });
  }

  async getTasksByStatus(status: TaskStatus, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TaskDto>> {
    return this.getTasks(page, pageSize, { status });
  }

  async getTasksByPriority(priority: TaskPriority, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TaskDto>> {
    return this.getTasks(page, pageSize, { priority });
  }

  async getTasksByProject(projectId: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TaskDto>> {
    return this.getTasks(page, pageSize, { projectId });
  }

  async getOverdueTasks(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TaskDto>> {
    const url = `/tasks/overdue${this.buildQueryParams({ page, pageSize })}`;
    return this.get<PaginatedResponse<TaskDto>>(url);
  }

  async assignTask(id: string, userId: string): Promise<TaskDto> {
    return this.patch<TaskDto>(`/tasks/${id}/assign`, { userId });
  }

  async unassignTask(id: string): Promise<TaskDto> {
    return this.patch<TaskDto>(`/tasks/${id}/unassign`, {});
  }

  async updateTaskPriority(id: string, priority: string): Promise<TaskDto> {
    return this.patch<TaskDto>(`/tasks/${id}/priority`, { priority });
  }

  async addTaskComment(id: string, comment: string): Promise<any> {
    return this.post<any>(`/tasks/${id}/comments`, { comment });
  }

  async getTaskComments(id: string): Promise<any[]> {
    return this.get<any[]>(`/tasks/${id}/comments`);
  }

  async updateTaskProgress(id: string, progress: number): Promise<TaskDto> {
    return this.patch<TaskDto>(`/tasks/${id}/progress`, { progress });
  }
}

// Export singleton instance
export const taskService = TaskService.getInstance();
