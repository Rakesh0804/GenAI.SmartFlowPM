// TimeTracker module interfaces
import { TimesheetStatus, TimeEntryType, BillableStatus, TrackingStatus } from './enums.interfaces';

// Time Category interfaces
export interface TimeCategoryDto {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTimeCategoryDto {
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateTimeCategoryDto {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

// Time Entry interfaces
export interface TimeEntryDto {
  id: string;
  userId: string;
  userName: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  timeCategoryId: string;
  timeCategoryName: string;
  timeCategoryColor?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // Duration in minutes
  description?: string;
  entryType: TimeEntryType;
  billableStatus: BillableStatus;
  hourlyRate?: number;
  isManualEntry: boolean;
  timesheetId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTimeEntryDto {
  projectId?: string;
  taskId?: string;
  timeCategoryId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  description?: string;
  entryType?: TimeEntryType;
  billableStatus?: BillableStatus;
  hourlyRate?: number;
  isManualEntry?: boolean;
}

export interface UpdateTimeEntryDto {
  projectId?: string;
  taskId?: string;
  timeCategoryId?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  description?: string;
  entryType?: TimeEntryType;
  billableStatus?: BillableStatus;
  hourlyRate?: number;
}

// Timesheet interfaces
export interface TimesheetDto {
  id: string;
  userId: string;
  userName: string;
  startDate: Date;
  endDate: Date;
  status: TimesheetStatus;
  totalHours: number;
  billableHours: number;
  submittedAt?: Date;
  submittedBy?: string;
  submittedByName?: string;
  approvedAt?: Date;
  approvedBy?: string;
  approvedByName?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectedByName?: string;
  approvalNotes?: string;
  timeEntries: TimeEntryDto[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTimesheetDto {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateTimesheetDto {
  startDate?: Date;
  endDate?: Date;
}

export interface SubmitTimesheetDto {
  // No additional properties needed for submission
}

export interface ApproveTimesheetDto {
  approvalNotes?: string;
}

export interface RejectTimesheetDto {
  approvalNotes?: string;
}

// Active Tracking interfaces
export interface ActiveTrackingSessionDto {
  id: string;
  userId: string;
  userName: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  timeCategoryId: string;
  timeCategoryName: string;
  timeCategoryColor?: string;
  startTime: Date;
  pausedTime: number; // Total paused minutes
  lastActivityTime: Date;
  description?: string;
  status: TrackingStatus;
  isActive: boolean;
  elapsedMinutes: number; // Calculated field
  createdAt: Date;
  updatedAt?: Date;
}

export interface StartTrackingDto {
  projectId?: string;
  taskId?: string;
  timeCategoryId: string;
  description?: string;
}

export interface UpdateTrackingDto {
  projectId?: string;
  taskId?: string;
  timeCategoryId?: string;
  description?: string;
}

export interface StopTrackingDto {
  description?: string;
  createTimeEntry?: boolean;
}

export interface PauseTrackingDto {
  // No additional properties needed for pausing
}

export interface ResumeTrackingDto {
  // No additional properties needed for resuming
}

// Time Report interfaces
export interface TimeReportDto {
  userId?: string;
  userName?: string;
  projectId?: string;
  projectName?: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  entries: TimeEntryDto[];
  categorySummary: TimeCategorySummaryDto[];
  dailySummary: DailySummaryDto[];
}

export interface TeamTimeReportDto {
  startDate: Date;
  endDate: Date;
  totalTeamHours: number;
  totalBillableHours: number;
  totalNonBillableHours: number;
  teamMembers: UserTimeReportDto[];
  projectSummary: ProjectTimeSummaryDto[];
}

export interface TimeCategorySummaryDto {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  totalHours: number;
  billableHours: number;
  entryCount: number;
}

export interface DailySummaryDto {
  date: Date;
  totalHours: number;
  billableHours: number;
  entryCount: number;
}

export interface UserTimeReportDto {
  userId: string;
  userName: string;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  entryCount: number;
}

export interface ProjectTimeSummaryDto {
  projectId: string;
  projectName: string;
  totalHours: number;
  billableHours: number;
  teamMemberCount: number;
  entryCount: number;
}
