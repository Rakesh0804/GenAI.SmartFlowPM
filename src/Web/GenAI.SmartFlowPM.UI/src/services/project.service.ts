import { BaseApiService } from '../lib/base-api.service';
import { ProjectDto, TaskDto } from '../types/api.types';

export class ProjectService extends BaseApiService {
  private static instance: ProjectService;

  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  async getProjects(page: number = 1, pageSize: number = 10): Promise<ProjectDto[]> {
    const url = `/projects${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    return this.get<ProjectDto[]>(url);
  }

  async getProjectById(id: string): Promise<ProjectDto> {
    return this.get<ProjectDto>(`/projects/${id}`);
  }

  async createProject(project: Partial<ProjectDto>): Promise<ProjectDto> {
    return this.post<ProjectDto>('/projects', project);
  }

  async updateProject(id: string, project: Partial<ProjectDto>): Promise<ProjectDto> {
    return this.put<ProjectDto>(`/projects/${id}`, project);
  }

  async deleteProject(id: string): Promise<void> {
    return this.delete(`/projects/${id}`);
  }

  async getProjectTasks(projectId: string): Promise<TaskDto[]> {
    return this.get<TaskDto[]>(`/projects/${projectId}/tasks`);
  }

  // Additional utility methods
  async searchProjects(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<ProjectDto[]> {
    const url = `/projects${this.buildQueryParams({ 
      pageNumber: page, 
      pageSize, 
      searchTerm 
    })}`;
    return this.get<ProjectDto[]>(url);
  }

  // Quick search for autocomplete (returns limited results)
  async searchProjectsQuick(searchTerm: string, limit: number = 20): Promise<ProjectDto[]> {
    try {
      const url = `/projects${this.buildQueryParams({ 
        pageNumber: 1, 
        pageSize: limit, 
        searchTerm 
      })}`;
      return this.get<ProjectDto[]>(url);
    } catch (error) {
      console.warn('Quick search failed, returning empty results');
      return [];
    }
  }

  // Get recent/active projects for initial dropdown load
  async getRecentProjects(limit: number = 10): Promise<ProjectDto[]> {
    try {
      return this.getProjects(1, limit);
    } catch (error) {
      console.warn('Could not load projects');
      return [];
    }
  }

  async getProjectsByStatus(status: string, page: number = 1, pageSize: number = 10): Promise<ProjectDto[]> {
    const url = `/projects${this.buildQueryParams({ 
      pageNumber: page, 
      pageSize, 
      searchTerm: status // You might need to adjust this based on how the backend handles status filtering
    })}`;
    return this.get<ProjectDto[]>(url);
  }

  async getProjectsByPriority(priority: string, page: number = 1, pageSize: number = 10): Promise<ProjectDto[]> {
    const url = `/projects${this.buildQueryParams({ 
      pageNumber: page, 
      pageSize, 
      searchTerm: priority // You might need to adjust this based on how the backend handles priority filtering
    })}`;
    return this.get<ProjectDto[]>(url);
  }

  async getActiveProjects(page: number = 1, pageSize: number = 10): Promise<ProjectDto[]> {
    return this.getProjects(page, pageSize);
  }

  async getProjectMembers(projectId: string): Promise<any[]> {
    return this.get<any[]>(`/projects/${projectId}/members`);
  }

  async addProjectMember(projectId: string, userId: string, role?: string): Promise<void> {
    return this.post<void>(`/projects/${projectId}/members`, { userId, role });
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    return this.delete(`/projects/${projectId}/members/${userId}`);
  }

  async updateProjectStatus(id: string, status: string): Promise<ProjectDto> {
    return this.patch<ProjectDto>(`/projects/${id}/status`, { status });
  }
}

// Export singleton instance
export const projectService = ProjectService.getInstance();
