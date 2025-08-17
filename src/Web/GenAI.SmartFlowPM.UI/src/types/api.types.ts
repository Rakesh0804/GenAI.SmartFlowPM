// API Response types matching backend structure
export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];  // Changed from 'data' to 'items' to match actual API
  totalCount: number;
  currentPage: number;  // Changed from 'pageNumber' to 'currentPage'
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
  roles: string[]; // NEW: User roles array
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
  roleIds?: string[]; // NEW: Role IDs to assign to user
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
  roleIds?: string[]; // NEW: Role IDs to assign to user
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
  refreshToken?: string;
  expires: Date;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Role types matching backend RoleDto structure
export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateRoleDto {
  name: string;
  description?: string;
  isActive: boolean;
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
  assignedToUserId?: string;  // Updated to match API response
  assignedToUserName?: string; // Updated to match API response
  // Keep the old properties for backward compatibility
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
  assignedToUserId?: string; // Updated to match API
  assignedUserId?: string; // Keep for backward compatibility
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

// Enhanced Home Dashboard types matching backend
export interface HomeDashboardDto {
  // Basic Statistics
  totalProjects: number;
  activeTasks: number;
  teamMembers: number;
  completed: number;
  overdueTasks: number;
  
  // Chart Data
  taskStatusData: TaskStatusChartDto[];
  projectStatusData: ProjectStatusChartDto[];
  taskTypeData: TaskTypeChartDto[];
  burndownData: BurndownChartDto[];
  
  // User-specific Data
  userSummary: UserDashboardSummaryDto;
  myPendingTasks: PendingTaskDto[];
  leaveBalance: LeaveBalanceDto;
  
  // Activity & Announcements
  recentActivities: RecentActivityDto[];
  upcomingHolidays: UpcomingHolidayDto[];
  latestAnnouncements: AnnouncementDto[];
}

export interface UserDashboardSummaryDto {
  userId: string;
  userName: string;
  myTotalTasks: number;
  myPendingTasksCount: number;
  myCompletedTasks: number;
  myOverdueTasks: number;
}

export interface PendingTaskDto {
  id: string;
  title: string;
  projectName: string;
  priority: string;
  priorityColor: string;
  dueDate?: Date;
  isOverdue: boolean;
}

export interface LeaveBalanceDto {
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  pendingRequests: number;
}

export interface RecentActivityDto {
  userName: string;
  userInitials: string;
  action: string;
  timestamp: Date;
  timeAgo: string;
  avatarColor: string;
}

export interface UpcomingHolidayDto {
  name: string;
  date: Date;
  description: string;
  dayOfWeek: string;
  formattedDate: string;
}

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  timeAgo: string;
}

export interface TaskStatusChartDto {
  name: string;
  value: number;
  color: string;
}

export interface ProjectStatusChartDto {
  name: string;
  open: number;
  inProgress: number;
  completed: number;
  total: number;
}

export interface TaskTypeChartDto {
  name: string;
  value: number;
  color: string;
}

export interface BurndownChartDto {
  day: string;
  planned: number;
  actual: number;
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
  Todo = 1,
  InProgress = 2,
  Review = 3,
  Testing = 4,
  Done = 5,
  Blocked = 6
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

// Organization types (Admin only)
export interface OrganizationDto {
  id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  logoUrl?: string;
  establishedDate?: string;
  industry?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  establishedDate?: string;
  employeeCount: number;
}

export interface UpdateOrganizationDto {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  establishedDate?: string;
  employeeCount: number;
}

export enum BranchType {
  Headquarters = 1,
  Regional = 2,
  Satellite = 3,
  Remote = 4
}

export interface BranchDto {
  id: string;
  organizationId: string;
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchWithManagerDto extends BranchDto {
  manager?: UserSummaryDto;
}

export interface OrganizationWithBranchesDto extends OrganizationDto {
  branches: BranchWithManagerDto[];
}

export interface CreateBranchDto {
  organizationId: string;
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
}

export interface UpdateBranchDto {
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
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
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

// Multi-tenant types
export interface TenantDto {
  id: string;
  name: string;
  subDomain?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isActive: boolean;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionPlan?: string;
  maxUsers: number;
  maxProjects: number;
  timeZone?: string;
  currency?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTenantDto {
  name: string;
  subDomain?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionPlan?: string;
  maxUsers?: number;
  maxProjects?: number;
  timeZone?: string;
  currency?: string;
  logoUrl?: string;
}

export interface UpdateTenantDto extends CreateTenantDto {
  id: string;
  isActive?: boolean;
}

export interface TenantSummaryDto {
  id: string;
  name: string;
  subDomain?: string;
  contactEmail: string;
  isActive: boolean;
  subscriptionPlan?: string;
  maxUsers: number;
  maxProjects: number;
  createdAt: Date;
}

// Team types
export interface TeamDto {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  projectCount: number;
  taskCount: number;
  completedTaskCount: number;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  leaderId: string;
  isActive?: boolean;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  leaderId?: string;
  isActive?: boolean;
}

export interface TeamMemberDto {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamMemberRole;
  joinedDate: Date;
  isActive: boolean;
}

export interface AddTeamMemberDto {
  teamId: string;
  userId: string;
  role: TeamMemberRole;
}

export interface UpdateTeamMemberDto {
  role?: TeamMemberRole;
  isActive?: boolean;
}

export enum TeamMemberRole {
  Member = 0,
  Lead = 1,
  Admin = 2
}
