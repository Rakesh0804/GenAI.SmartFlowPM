import { BaseApiService } from '../lib/base-api.service';
import { PaginatedResponse } from '../interfaces/paginated.interfaces';
import { 
  TimeEntryDto, 
  TimesheetDto, 
  TimeCategoryDto, 
  ActiveTrackingSessionDto,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
  CreateTimesheetDto,
  UpdateTimesheetDto,
  CreateTimeCategoryDto,
  UpdateTimeCategoryDto,
  StartTrackingDto,
  UpdateTrackingDto,
  StopTrackingDto,
  PauseTrackingDto,
  ResumeTrackingDto,
  SubmitTimesheetDto,
  ApproveTimesheetDto,
  RejectTimesheetDto,
  TimeReportDto,
  TeamTimeReportDto
} from '../types/api.types';

export class TimeTrackerService extends BaseApiService {
  private static instance: TimeTrackerService;

  static getInstance(): TimeTrackerService {
    if (!TimeTrackerService.instance) {
      TimeTrackerService.instance = new TimeTrackerService();
    }
    return TimeTrackerService.instance;
  }

  // Helper method to handle both paginated and non-paginated array responses
  private extractArrayFromResponse<T>(response: any): T[] {
    if (response && response.items && Array.isArray(response.items)) {
      // Paginated response format
      return response.items;
    } else if (Array.isArray(response)) {
      // Direct array response format
      return response;
    } else {
      // Fallback to empty array
      return [];
    }
  }

  // Time Entries
  async getTimeEntries(page: number = 1, pageSize: number = 10): Promise<TimeEntryDto[]> {
    const url = `/timeentries${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    const paginatedResult = await this.get<PaginatedResponse<TimeEntryDto>>(url);
    // Extract just the items array from the paginated response
    return paginatedResult.items || [];
  }

  async getTimeEntriesPaginated(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TimeEntryDto>> {
    const url = `/timeentries${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    return this.get<PaginatedResponse<TimeEntryDto>>(url);
  }

  async getTimeEntryById(id: string): Promise<TimeEntryDto> {
    return this.get<TimeEntryDto>(`/timeentries/${id}`);
  }

  async getTimeEntriesByUser(userId: string): Promise<TimeEntryDto[]> {
    const response = await this.get<any>(`/timeentries/user/${userId}`);
    return this.extractArrayFromResponse<TimeEntryDto>(response);
  }

  async getTimeEntriesByProject(projectId: string): Promise<TimeEntryDto[]> {
    const response = await this.get<any>(`/timeentries/project/${projectId}`);
    return this.extractArrayFromResponse<TimeEntryDto>(response);
  }

  async getTimeEntriesByDateRange(userId: string, startDate: string, endDate: string): Promise<TimeEntryDto[]> {
    const url = `/timeentries/user/${userId}/date-range${this.buildQueryParams({ startDate, endDate })}`;
    const response = await this.get<any>(url);
    return this.extractArrayFromResponse<TimeEntryDto>(response);
  }

  async getTimeEntriesByTimesheetId(timesheetId: string): Promise<TimeEntryDto[]> {
    const response = await this.get<any>(`/timeentries/timesheet/${timesheetId}`);
    return this.extractArrayFromResponse<TimeEntryDto>(response);
  }

  async createTimeEntry(timeEntry: CreateTimeEntryDto): Promise<TimeEntryDto> {
    return this.post<TimeEntryDto>('/timeentries', timeEntry);
  }

  async updateTimeEntry(id: string, timeEntry: UpdateTimeEntryDto): Promise<TimeEntryDto> {
    return this.put<TimeEntryDto>(`/timeentries/${id}`, timeEntry);
  }

  async deleteTimeEntry(id: string): Promise<void> {
    return this.delete(`/timeentries/${id}`);
  }

  // Timesheets
  async getTimesheets(page: number = 1, pageSize: number = 10): Promise<TimesheetDto[]> {
    const url = `/timesheets${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    const paginatedResult = await this.get<PaginatedResponse<TimesheetDto>>(url);
    // Extract just the items array from the paginated response
    return paginatedResult.items || [];
  }

  async getTimesheetsPaginated(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TimesheetDto>> {
    const url = `/timesheets${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    return this.get<PaginatedResponse<TimesheetDto>>(url);
  }

  async getTimesheetById(id: string): Promise<TimesheetDto> {
    return this.get<TimesheetDto>(`/timesheets/${id}`);
  }

  async getTimesheetsByUser(userId: string): Promise<TimesheetDto[]> {
    const response = await this.get<any>(`/timesheets/user/${userId}`);
    return this.extractArrayFromResponse<TimesheetDto>(response);
  }

  async getPendingTimesheetApprovals(): Promise<TimesheetDto[]> {
    const response = await this.get<any>('/timesheets/pending-approvals');
    return this.extractArrayFromResponse<TimesheetDto>(response);
  }

  async createTimesheet(timesheet: CreateTimesheetDto): Promise<TimesheetDto> {
    return this.post<TimesheetDto>('/timesheets', timesheet);
  }

  async updateTimesheet(id: string, timesheet: UpdateTimesheetDto): Promise<TimesheetDto> {
    return this.put<TimesheetDto>(`/timesheets/${id}`, timesheet);
  }

  async submitTimesheet(id: string, data: SubmitTimesheetDto): Promise<TimesheetDto> {
    return this.post<TimesheetDto>(`/timesheets/${id}/submit`, data);
  }

  async approveTimesheet(id: string, data: ApproveTimesheetDto): Promise<TimesheetDto> {
    return this.post<TimesheetDto>(`/timesheets/${id}/approve`, data);
  }

  async rejectTimesheet(id: string, data: RejectTimesheetDto): Promise<TimesheetDto> {
    return this.post<TimesheetDto>(`/timesheets/${id}/reject`, data);
  }

  async deleteTimesheet(id: string): Promise<void> {
    return this.delete(`/timesheets/${id}`);
  }

  // Time Categories
  async getTimeCategories(page: number = 1, pageSize: number = 10): Promise<TimeCategoryDto[]> {
    const url = `/timecategories${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    const paginatedResult = await this.get<PaginatedResponse<TimeCategoryDto>>(url);
    // Extract just the items array from the paginated response
    return paginatedResult.items || [];
  }

  async getTimeCategoriesPaginated(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<TimeCategoryDto>> {
    const url = `/timecategories${this.buildQueryParams({ pageNumber: page, pageSize })}`;
    return this.get<PaginatedResponse<TimeCategoryDto>>(url);
  }

  async getActiveTimeCategories(): Promise<TimeCategoryDto[]> {
    const response = await this.get<any>('/timecategories/active');
    return this.extractArrayFromResponse<TimeCategoryDto>(response);
  }

  async getTimeCategoryById(id: string): Promise<TimeCategoryDto> {
    return this.get<TimeCategoryDto>(`/timecategories/${id}`);
  }

  async createTimeCategory(category: CreateTimeCategoryDto): Promise<TimeCategoryDto> {
    return this.post<TimeCategoryDto>('/timecategories', category);
  }

  async updateTimeCategory(id: string, category: UpdateTimeCategoryDto): Promise<TimeCategoryDto> {
    return this.put<TimeCategoryDto>(`/timecategories/${id}`, category);
  }

  async deleteTimeCategory(id: string): Promise<void> {
    return this.delete(`/timecategories/${id}`);
  }

  // Time Tracking
  async getActiveTrackingSession(userId: string): Promise<ActiveTrackingSessionDto | null> {
    try {
      const response = await this.get<ActiveTrackingSessionDto>(`/timetracking/user/${userId}/active`);
      // The backend now returns success with null data when no active session
      return response || null;
    } catch (error: any) {
      // Handle both 404 status and API error messages for no active session (fallback)
      if (error?.response?.status === 404 || 
          error?.message?.includes('No active tracking session found') ||
          error?.response?.data?.message?.includes('No active tracking session found')) {
        return null;
      }
      
      // Re-throw other errors for proper handling
      console.error('Error fetching active tracking session:', error);
      throw error;
    }
  }

  async getTrackingSessionById(id: string): Promise<ActiveTrackingSessionDto> {
    return this.get<ActiveTrackingSessionDto>(`/timetracking/${id}`);
  }

  async startTracking(data: StartTrackingDto): Promise<ActiveTrackingSessionDto> {
    return this.post<ActiveTrackingSessionDto>('/timetracking/start', data);
  }

  async updateTracking(id: string, data: UpdateTrackingDto): Promise<ActiveTrackingSessionDto> {
    return this.put<ActiveTrackingSessionDto>(`/timetracking/${id}`, data);
  }

  async stopTracking(id: string, data: StopTrackingDto): Promise<TimeEntryDto | null> {
    return this.post<TimeEntryDto | null>(`/timetracking/${id}/stop`, data);
  }

  async pauseTracking(id: string, data: PauseTrackingDto): Promise<ActiveTrackingSessionDto> {
    return this.post<ActiveTrackingSessionDto>(`/timetracking/${id}/pause`, data);
  }

  async resumeTracking(id: string, data: ResumeTrackingDto): Promise<ActiveTrackingSessionDto> {
    return this.post<ActiveTrackingSessionDto>(`/timetracking/${id}/resume`, data);
  }

  // Time Reports
  async getUserTimeReport(userId: string, startDate: string, endDate: string): Promise<TimeReportDto> {
    const url = `/timereports/user/${userId}${this.buildQueryParams({ startDate, endDate })}`;
    return this.get<TimeReportDto>(url);
  }

  async getTeamTimeReport(startDate: string, endDate: string): Promise<TeamTimeReportDto> {
    const url = `/timereports/team${this.buildQueryParams({ startDate, endDate })}`;
    return this.get<TeamTimeReportDto>(url);
  }

  async getProjectTimeReport(projectId: string, startDate: string, endDate: string): Promise<TimeReportDto> {
    const url = `/timereports/project/${projectId}${this.buildQueryParams({ startDate, endDate })}`;
    return this.get<TimeReportDto>(url);
  }
}

export const timeTrackerService = TimeTrackerService.getInstance();
