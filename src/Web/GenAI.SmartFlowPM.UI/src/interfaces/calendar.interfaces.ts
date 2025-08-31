// Calendar TypeScript Interface Definitions
export interface CalendarEventDto {
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  location?: string;
  priority: EventPriority;
  status: EventStatus;
  createdBy: string;
  projectId?: string;
  taskId?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePatternDto;
  isPrivate: boolean;
  color?: string;
  attendees?: EventAttendeeDto[];
  reminders?: EventReminderDto[];
}

export interface CalendarEventSummaryDto {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  eventType: EventType;
  priority: EventPriority;
  status: EventStatus;
  isAllDay: boolean;
  location?: string;
  color?: string;
  attendeeCount?: number;
}

export interface EventAttendeeDto {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  response: AttendeeResponse;
  isRequired: boolean;
  isOrganizer: boolean;
  invitedAt: Date;
  responseAt?: Date;
  notes?: string;
}

export interface EventReminderDto {
  id: string;
  eventId: string;
  userId: string;
  reminderType: ReminderType;
  reminderTime: number; // minutes before event
  isSent: boolean;
  sentAt?: Date;
  isActive: boolean;
}

export interface RecurrencePatternDto {
  id: string;
  eventId: string;
  recurrenceType: RecurrenceType;
  interval: number;
  daysOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: Date;
  maxOccurrences?: number;
}

// Calendar View DTOs
export interface MonthlyCalendarDto {
  year: number;
  month: number;
  events: CalendarEventSummaryDto[];
}

export interface WeeklyCalendarDto {
  startDate: Date;
  endDate: Date;
  events: CalendarEventSummaryDto[];
}

export interface DailyCalendarDto {
  date: Date;
  events: CalendarEventSummaryDto[];
}

// Create/Update DTOs
export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  eventType: EventType;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  location?: string;
  priority: EventPriority;
  projectId?: string;
  taskId?: string;
  isRecurring: boolean;
  recurrencePattern?: CreateRecurrencePatternDto;
  isPrivate: boolean;
  color?: string;
  attendees?: CreateEventAttendeeDto[];
  reminders?: CreateEventReminderDto[];
}

export interface UpdateCalendarEventDto {
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  location?: string;
  priority: EventPriority;
  projectId?: string;
  taskId?: string;
  isRecurring: boolean;
  recurrencePattern?: UpdateRecurrencePatternDto;
  isPrivate: boolean;
  color?: string;
}

export interface CreateEventAttendeeDto {
  userId: string;
  isRequired: boolean;
  isOrganizer: boolean;
  notes?: string;
}

export interface UpdateEventAttendeeDto {
  id: string;
  response: AttendeeResponse;
  notes?: string;
}

export interface CreateEventReminderDto {
  reminderType: ReminderType;
  reminderTime: number;
}

export interface UpdateEventReminderDto {
  id: string;
  reminderType: ReminderType;
  reminderTime: number;
  isActive: boolean;
}

export interface CreateRecurrencePatternDto {
  recurrenceType: RecurrenceType;
  interval: number;
  daysOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: Date;
  maxOccurrences?: number;
}

export interface UpdateRecurrencePatternDto {
  id: string;
  recurrenceType: RecurrenceType;
  interval: number;
  daysOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: Date;
  maxOccurrences?: number;
}

// Enums
export enum EventType {
  Meeting = 0,
  Deadline = 1,
  Task = 2,
  Holiday = 3,
  Personal = 4,
  Company = 5
}

export enum EventStatus {
  Scheduled = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
  Postponed = 4
}

export enum EventPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export enum AttendeeResponse {
  Pending = 0,
  Accepted = 1,
  Declined = 2,
  Tentative = 3
}

export enum ReminderType {
  Email = 0,
  SMS = 1,
  Push = 2,
  InApp = 3
}

export enum RecurrenceType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3
}

// Query Parameters
export interface CalendarQueryParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
  eventType?: EventType;
  eventStatus?: EventStatus;
  searchTerm?: string;
  projectId?: string;
  userId?: string;
}

// Calendar View Types
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// Calendar Event Colors
export const EVENT_COLORS = {
  [EventType.Meeting]: '#3B82F6', // Blue
  [EventType.Deadline]: '#EF4444', // Red
  [EventType.Task]: '#10B981', // Green
  [EventType.Holiday]: '#F59E0B', // Yellow
  [EventType.Personal]: '#8B5CF6', // Purple
  [EventType.Company]: '#06B6D4', // Cyan
};

// Priority Colors
export const PRIORITY_COLORS = {
  [EventPriority.Low]: '#6B7280', // Gray
  [EventPriority.Medium]: '#3B82F6', // Blue
  [EventPriority.High]: '#F59E0B', // Yellow
  [EventPriority.Critical]: '#EF4444', // Red
};

// Status Colors
export const STATUS_COLORS = {
  [EventStatus.Scheduled]: '#3B82F6', // Blue
  [EventStatus.InProgress]: '#F59E0B', // Yellow
  [EventStatus.Completed]: '#10B981', // Green
  [EventStatus.Cancelled]: '#6B7280', // Gray
  [EventStatus.Postponed]: '#8B5CF6', // Purple
};
