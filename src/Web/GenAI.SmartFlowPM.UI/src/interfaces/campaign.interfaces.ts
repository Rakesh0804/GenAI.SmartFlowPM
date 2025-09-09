// Campaign Enums
export enum CampaignType {
  Performance = 0,
  Training = 1,
  Evaluation = 2,
  Development = 3
}

export enum CampaignStatus {
  Draft = 0,
  Active = 1,
  Paused = 2,
  Completed = 3,
  Cancelled = 4
}

// Base Campaign Interface
export interface CampaignDto {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: CampaignType;
  status: CampaignStatus;
  instructions?: string;
  assignedManagers: CampaignManagerDto[];
  targetUserGroups: CampaignGroupDto[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  organizationId: string;
  tenantId: string;
}

// Campaign Manager
export interface CampaignManagerDto {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userEmail: string;
  assignedAt: string;
}

// Campaign Group
export interface CampaignGroupDto {
  id: string;
  name: string;
  description?: string;
  users?: CampaignTargetUserDto[];
  // Additional fields from API response
  campaignId?: string;
  managerId?: string;
  managerName?: string;
  targetUserIds?: string[];
  targetUserNames?: string[];
  totalTargets?: number;
  completedEvaluations?: number;
  pendingEvaluations?: number;
  progressPercentage?: number;
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
  tenantId?: string;
}

// Campaign Target User
export interface CampaignTargetUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
  hasReportees: boolean;
}

// Campaign Statistics
export interface CampaignStatisticsDto {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  draftCampaigns: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  totalTargetUsers: number;
  averageCompletionRate: number;
}

// Campaign Progress
export interface CampaignProgressDto {
  campaignId: string;
  campaignName: string;
  totalTargets: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  completionPercentage: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
}

// Campaign Evaluation
export interface CampaignEvaluationDto {
  id: string;
  campaignId: string;
  evaluatedUserId: string;
  evaluatedUserName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationNotes?: string;
  roleEvaluations: RoleEvaluationDto[];
  claimEvaluations: ClaimEvaluationDto[];
  isApproved: boolean;
  isCompleted: boolean;
  recommendedActions?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Role Evaluation
export interface RoleEvaluationDto {
  id: string;
  roleId: string;
  roleName: string;
  score: number;
  maxScore: number;
  comments?: string;
}

// Claim Evaluation
export interface ClaimEvaluationDto {
  id: string;
  claimId: string;
  claimName: string;
  claimValue: string;
  score: number;
  maxScore: number;
  comments?: string;
}

// Campaign Activity
export interface CampaignActivityDto {
  id: string;
  campaignId: string;
  campaignName: string;
  activityType: string;
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
}

// Create/Update DTOs
export interface CreateCampaignDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: CampaignType;
  assignedManagerIds: string[];
  targetUserGroupIds: string[];
  instructions?: string;
}

export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  type?: CampaignType;
  status?: CampaignStatus;
  assignedManagerIds?: string[];
  targetUserGroupIds?: string[];
  instructions?: string;
}

export interface CreateCampaignGroupDto {
  name: string;
  description?: string;
  userIds: string[];
}

export interface UpdateCampaignGroupDto {
  name?: string;
  description?: string;
  userIds?: string[];
}

export interface SubmitCampaignEvaluationDto {
  campaignId: string;
  evaluatedUserId: string;
  evaluationNotes?: string;
  roleEvaluations: SubmitRoleEvaluationDto[];
  claimEvaluations: SubmitClaimEvaluationDto[];
  isApproved: boolean;
  recommendedActions?: string;
}

export interface SubmitRoleEvaluationDto {
  roleId: string;
  score: number;
  comments?: string;
}

export interface SubmitClaimEvaluationDto {
  claimId: string;
  score: number;
  comments?: string;
}

// Dashboard DTOs
export interface CampaignDashboardOverviewDto {
  statistics: CampaignStatisticsDto;
  activeCampaigns: CampaignDto[];
  pendingEvaluations: {
    pendingEvaluations: number;
    campaigns: number;
  };
  recentActivities: CampaignActivityDto[];
  progressAnalytics: CampaignProgressAnalyticsDto;
}

export interface CampaignProgressAnalyticsDto {
  campaignProgressData: CampaignProgressChartDto[];
  evaluationTrends: EvaluationTrendDto[];
  completionRates: CompletionRateDto[];
  monthlyActivity: MonthlyActivityDto[];
}

export interface CampaignProgressChartDto {
  campaignName: string;
  completed: number;
  pending: number;
  total: number;
}

export interface EvaluationTrendDto {
  date: string;
  completed: number;
  pending: number;
}

export interface CompletionRateDto {
  campaignName: string;
  completionRate: number;
  targetCount: number;
  completedCount: number;
}

export interface MonthlyActivityDto {
  month: string;
  campaignsCreated: number;
  campaignsCompleted: number;
  evaluationsSubmitted: number;
}
