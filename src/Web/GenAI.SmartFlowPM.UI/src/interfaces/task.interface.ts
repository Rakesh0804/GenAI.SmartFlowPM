// Task-related types and interfaces
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
  assignedUserId?: string;
  assignedUserName?: string;
  acronym: string; // Task type identifier (DEV, TEST, DOC, BUG, FEAT)
  taskNumber: string; // Auto-generated unique identifier (e.g., DEV-000001)
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
  parentTaskId?: string;
  parentTaskTitle?: string;
  isActive: boolean;
  completedDate?: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  projectId: string;
  assignedUserId?: string;
  acronym: string; // Required for task categorization
  parentTaskId?: string;
  isActive?: boolean;
}

export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  assignedUserId?: string;
  parentTaskId?: string;
  isActive?: boolean;
  completedDate?: Date;
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Done = 'Done',
  Blocked = 'Blocked'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface TaskTypeDto {
  value: string;
  label: string;
  description: string;
  color?: string;
}

export interface UserTaskDashboardDto {
  userId: string;
  userName: string;
  totalTaskCount: number;
  completedTaskCount: number;
  pendingTaskCount: number;
  pendingTasks: TaskDto[];
}

export interface PaginatedTaskResponse {
  items: TaskDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
