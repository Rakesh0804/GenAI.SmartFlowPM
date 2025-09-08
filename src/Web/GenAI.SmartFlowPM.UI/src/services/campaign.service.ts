import { BaseApiService } from '../lib/base-api.service';
import { 
  CampaignDto, 
  CampaignGroupDto, 
  CampaignEvaluationDto,
  CampaignStatisticsDto,
  CampaignProgressDto,
  CampaignTargetUserDto,
  CampaignActivityDto,
  PaginatedResponse 
} from '@/types/api.types';

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: number;
  status: number;
  assignedManagerIds: string[];
  targetUserGroupIds: string[];
  instructions?: string;
}

export interface UpdateCampaignRequest extends CreateCampaignRequest {
  id: string;
}

export interface CreateCampaignGroupRequest {
  name: string;
  description?: string;
  userIds: string[];
}

export interface UpdateCampaignGroupRequest extends CreateCampaignGroupRequest {
  id: string;
}

export interface SubmitEvaluationRequest {
  campaignId: string;
  evaluatedUserId: string;
  evaluationNotes: string;
  roleEvaluations: any[];
  claimEvaluations: any[];
  isApproved: boolean;
  recommendedActions?: string;
}

export interface CampaignFilters {
  status?: number;
  type?: number;
  startDateFrom?: string;
  startDateTo?: string;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export class CampaignService extends BaseApiService {
  private static instance: CampaignService;

  static getInstance(): CampaignService {
    if (!CampaignService.instance) {
      CampaignService.instance = new CampaignService();
    }
    return CampaignService.instance;
  }

  // Dashboard endpoints
  async getDashboardOverview(fromDate?: string, toDate?: string): Promise<CampaignStatisticsDto> {
    const params = this.buildQueryParams({ fromDate, toDate });
    return this.get<CampaignStatisticsDto>(`/campaigns/dashboard/overview${params}`);
  }

  async getActiveCampaigns(): Promise<CampaignDto[]> {
    return this.get<CampaignDto[]>('/campaigns/dashboard/active-campaigns');
  }

  async getPendingEvaluations(): Promise<{ pendingEvaluations: number; campaigns: number }> {
    return this.get<{ pendingEvaluations: number; campaigns: number }>('/campaigns/dashboard/pending-evaluations');
  }

  async getRecentActivities(limit: number = 10): Promise<{ activities: CampaignActivityDto[] }> {
    return this.get<{ activities: CampaignActivityDto[] }>(`/campaigns/dashboard/recent-activities?limit=${limit}`);
  }

  async getProgressAnalytics(fromDate?: string, toDate?: string): Promise<any> {
    const params = this.buildQueryParams({ fromDate, toDate });
    return this.get<any>(`/campaigns/dashboard/progress-analytics${params}`);
  }

  // Campaign CRUD operations
  async getCampaigns(filters?: CampaignFilters): Promise<CampaignDto[]> {
    const params = this.buildQueryParams(filters || {});
    return this.get<CampaignDto[]>(`/campaigns${params}`);
  }

  async getCampaignById(id: string): Promise<CampaignDto> {
    return this.get<CampaignDto>(`/campaigns/${id}`);
  }

  async createCampaign(request: CreateCampaignRequest): Promise<CampaignDto> {
    return this.post<CampaignDto>('/campaigns', request);
  }

  async updateCampaign(request: UpdateCampaignRequest): Promise<CampaignDto> {
    return this.put<CampaignDto>(`/campaigns/${request.id}`, request);
  }

  async deleteCampaign(id: string): Promise<void> {
    return this.delete(`/campaigns/${id}`);
  }

  // Campaign lifecycle operations
  async startCampaign(id: string): Promise<CampaignDto> {
    return this.post<CampaignDto>(`/campaigns/${id}/start`, {});
  }

  async completeCampaign(id: string, completionNotes?: string): Promise<CampaignDto> {
    return this.post<CampaignDto>(`/campaigns/${id}/complete`, { campaignId: id, completionNotes });
  }

  async cancelCampaign(id: string, cancellationReason?: string): Promise<void> {
    return this.post<void>(`/campaigns/${id}/cancel`, { campaignId: id, cancellationReason });
  }

  // Campaign Groups
  async getCampaignGroups(searchTerm?: string): Promise<CampaignGroupDto[]> {
    const params = this.buildQueryParams({ searchTerm });
    return this.get<CampaignGroupDto[]>(`/campaigns/groups${params}`);
  }

  async getCampaignGroupById(id: string): Promise<CampaignGroupDto> {
    return this.get<CampaignGroupDto>(`/campaigns/groups/${id}`);
  }

  async createCampaignGroup(request: CreateCampaignGroupRequest): Promise<CampaignGroupDto> {
    return this.post<CampaignGroupDto>('/campaigns/groups', request);
  }

  async updateCampaignGroup(request: UpdateCampaignGroupRequest): Promise<CampaignGroupDto> {
    return this.put<CampaignGroupDto>(`/campaigns/groups/${request.id}`, request);
  }

  async deleteCampaignGroup(id: string): Promise<void> {
    return this.delete(`/campaigns/groups/${id}`);
  }

  // Campaign Evaluations
  async getCampaignEvaluations(
    campaignId: string,
    evaluatedUserId?: string,
    isCompleted?: boolean
  ): Promise<CampaignEvaluationDto[]> {
    const params = this.buildQueryParams({ campaignId, evaluatedUserId, isCompleted });
    return this.get<CampaignEvaluationDto[]>(`/campaigns/${campaignId}/evaluations${params}`);
  }

  async getCampaignEvaluationById(id: string): Promise<CampaignEvaluationDto> {
    return this.get<CampaignEvaluationDto>(`/campaigns/evaluations/${id}`);
  }

  async submitEvaluation(request: SubmitEvaluationRequest): Promise<CampaignEvaluationDto> {
    return this.post<CampaignEvaluationDto>('/campaigns/evaluations', request);
  }

  // Utility endpoints
  async getEligibleUsers(searchTerm?: string, hasReportees: boolean = true): Promise<CampaignTargetUserDto[]> {
    const params = this.buildQueryParams({ searchTerm, hasReportees });
    return this.get<CampaignTargetUserDto[]>(`/campaigns/eligible-users${params}`);
  }

  async getCampaignProgress(campaignId: string): Promise<CampaignProgressDto> {
    return this.get<CampaignProgressDto>(`/campaigns/${campaignId}/progress`);
  }

  async getCampaignStatistics(fromDate?: string, toDate?: string): Promise<CampaignStatisticsDto> {
    const params = this.buildQueryParams({ fromDate, toDate });
    return this.get<CampaignStatisticsDto>(`/campaigns/statistics${params}`);
  }

  // My Campaigns (for current user)
  async getMyCampaigns(status?: number): Promise<CampaignDto[]> {
    const params = this.buildQueryParams({ status });
    return this.get<CampaignDto[]>(`/campaigns/my-campaigns${params}`);
  }

  async getMyCampaignTargets(status?: number): Promise<CampaignDto[]> {
    const params = this.buildQueryParams({ status });
    return this.get<CampaignDto[]>(`/campaigns/my-targets${params}`);
  }
}

export const campaignService = CampaignService.getInstance();
