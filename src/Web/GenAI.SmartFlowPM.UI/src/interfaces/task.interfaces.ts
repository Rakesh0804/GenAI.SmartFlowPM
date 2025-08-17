// Task module interfaces
import { TaskStatus, TaskPriority } from './enums.interfaces';

export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  projectId: string;
  projectName: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  acronym: string;
  taskNumber: string;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  projectId: string;
  assignedToUserId?: string;
  assignedUserId?: string;
  acronym: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  assignedUserId?: string;
}
