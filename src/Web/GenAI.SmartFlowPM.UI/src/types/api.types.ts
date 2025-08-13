// API Response types matching backend structure
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// User types matching backend UserDto structure
export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  managerId?: string;
  hasReportee: boolean; // NEW: Organizational hierarchy tracking
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  password: string;
  managerId?: string;
  hasReportee: boolean; // NEW: Manager status
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  managerId?: string;
  hasReportee?: boolean; // NEW: Update manager status
  isActive?: boolean;
}

export interface UserSummaryDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  hasReportee: boolean; // NEW: For organizational displays
}

// Authentication types
export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserDto;
  expiresAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expires: Date;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Project types
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
}

// Task types
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

// Dashboard types
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

// Enums matching backend
export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum ProjectPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
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

// Organization types (Admin only)
export interface OrganizationDto {
  id: string;
  name: string;
  description?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Role and Claims types
export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ClaimDto {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

// Multi-tenant types
export interface TenantDto {
  id: string;
  name: string;
  subdomain: string;
  connectionString?: string;
  subscriptionPlan: string;
  maxUsers: number;
  maxProjects: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}
