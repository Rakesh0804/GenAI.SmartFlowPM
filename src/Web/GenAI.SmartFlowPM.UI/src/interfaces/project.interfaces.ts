// Project module interfaces
import { ProjectStatus, ProjectPriority } from './enums.interfaces';

export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget?: number;
  managerId: string;
  managerName: string;
  clientName?: string;
  teamMemberCount: number;
  taskCount: number;
  completedTaskCount: number;
  progress: number;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget?: number;
  managerId: string;
  clientName?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  budget?: number;
  managerId?: string;
  clientName?: string;
}
