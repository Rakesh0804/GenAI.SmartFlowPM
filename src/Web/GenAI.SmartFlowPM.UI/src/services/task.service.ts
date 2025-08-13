import { BaseApiService } from '../lib/base-api.service';
import { TaskDto } from '../types/api.types';

export class TaskService extends BaseApiService {
  private static instance: TaskService;

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getTasks(page: number = 1, pageSize: number = 10): Promise<TaskDto[]> {
    const url = this.buildPaginationUrl('/tasks', page, pageSize);
    return this.get<TaskDto[]>(url);
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
  async searchTasks(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<TaskDto[]> {
    const url = `/tasks/search${this.buildQueryParams({ q: searchTerm, page, pageSize })}`;
    return this.get<TaskDto[]>(url);
  }

  async getTasksByStatus(status: string, page: number = 1, pageSize: number = 10): Promise<TaskDto[]> {
    const url = `/tasks/by-status${this.buildQueryParams({ status, page, pageSize })}`;
    return this.get<TaskDto[]>(url);
  }

  async getTasksByPriority(priority: string, page: number = 1, pageSize: number = 10): Promise<TaskDto[]> {
    const url = `/tasks/by-priority${this.buildQueryParams({ priority, page, pageSize })}`;
    return this.get<TaskDto[]>(url);
  }

  async getOverdueTasks(page: number = 1, pageSize: number = 10): Promise<TaskDto[]> {
    const url = `/tasks/overdue${this.buildQueryParams({ page, pageSize })}`;
    return this.get<TaskDto[]>(url);
  }

  async getTasksByProject(projectId: string, page: number = 1, pageSize: number = 10): Promise<TaskDto[]> {
    const url = `/tasks/by-project/${projectId}${this.buildQueryParams({ page, pageSize })}`;
    return this.get<TaskDto[]>(url);
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
