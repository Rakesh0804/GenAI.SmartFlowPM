import { BaseApiService } from '../lib/base-api.service';
import { PaginatedResponse } from '../types/api.types';
import { 
  CalendarEventDto, 
  CalendarEventSummaryDto,
  CreateCalendarEventDto, 
  UpdateCalendarEventDto,
  EventAttendeeDto,
  CreateEventAttendeeDto,
  UpdateEventAttendeeDto,
  EventReminderDto,
  CreateEventReminderDto,
  UpdateEventReminderDto,
  MonthlyCalendarDto,
  WeeklyCalendarDto,
  DailyCalendarDto,
  CalendarQueryParams,
  AttendeeResponse
} from '@/interfaces/calendar.interfaces';

interface CalendarFilterParams {
  page?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
  eventType?: number;
  eventStatus?: number;
  searchTerm?: string;
  projectId?: string;
  userId?: string;
}

export class CalendarService extends BaseApiService {
  private static instance: CalendarService;

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  // Event Management
  async getEvents(params: CalendarQueryParams = {}): Promise<PaginatedResponse<CalendarEventSummaryDto>> {
    const queryParams: Record<string, any> = {};
    
    if (params.pageNumber) queryParams.pageNumber = params.pageNumber;
    if (params.pageSize) queryParams.pageSize = params.pageSize;
    if (params.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params.endDate) queryParams.endDate = params.endDate.toISOString();
    if (params.eventType !== undefined) queryParams.eventType = params.eventType;
    if (params.eventStatus !== undefined) queryParams.eventStatus = params.eventStatus;
    if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
    if (params.projectId) queryParams.projectId = params.projectId;
    if (params.userId) queryParams.userId = params.userId;

    const url = `/calendar/events${this.buildQueryParams(queryParams)}`;
    return this.get<PaginatedResponse<CalendarEventSummaryDto>>(url);
  }

  async getEventById(id: string): Promise<CalendarEventDto> {
    return this.get<CalendarEventDto>(`/calendar/events/${id}`);
  }

  async createEvent(event: CreateCalendarEventDto): Promise<CalendarEventDto> {
    return this.post<CalendarEventDto>('/calendar/events', event);
  }

  async updateEvent(id: string, event: UpdateCalendarEventDto): Promise<CalendarEventDto> {
    return this.put<CalendarEventDto>(`/calendar/events/${id}`, event);
  }

  async deleteEvent(id: string): Promise<void> {
    return this.delete(`/calendar/events/${id}`);
  }

  // Calendar Views
  async getMonthlyView(year: number, month: number, userId?: string): Promise<MonthlyCalendarDto> {
    const queryParams: Record<string, any> = {
      year: year,
      month: month
    };
    if (userId) queryParams.userId = userId;

    const url = `/calendar/views/monthly${this.buildQueryParams(queryParams)}`;
    return this.get<MonthlyCalendarDto>(url);
  }

  async getWeeklyView(startDate: Date, userId?: string): Promise<WeeklyCalendarDto> {
    const queryParams: Record<string, any> = {
      startDate: startDate.toISOString()
    };
    if (userId) queryParams.userId = userId;

    const url = `/calendar/views/weekly${this.buildQueryParams(queryParams)}`;
    return this.get<WeeklyCalendarDto>(url);
  }

  async getDailyView(date: Date, userId?: string): Promise<DailyCalendarDto> {
    const queryParams: Record<string, any> = {
      date: date.toISOString()
    };
    if (userId) queryParams.userId = userId;

    const url = `/calendar/views/daily${this.buildQueryParams(queryParams)}`;
    return this.get<DailyCalendarDto>(url);
  }

  // Attendee Management
  async getEventAttendees(eventId: string): Promise<EventAttendeeDto[]> {
    return this.get<EventAttendeeDto[]>(`/eventattendees/event/${eventId}`);
  }

  async addAttendee(eventId: string, attendee: CreateEventAttendeeDto): Promise<EventAttendeeDto> {
    return this.post<EventAttendeeDto>('/eventattendees', { eventId, ...attendee });
  }

  async updateAttendeeResponse(eventId: string, userId: string, response: AttendeeResponse): Promise<void> {
    return this.put<void>(`/eventattendees/${eventId}/${userId}/response`, { response });
  }

  async removeAttendee(eventId: string, userId: string): Promise<void> {
    return this.delete(`/eventattendees/${eventId}/${userId}`);
  }

  // Reminder Management
  async getEventReminders(eventId: string): Promise<EventReminderDto[]> {
    return this.get<EventReminderDto[]>(`/eventreminders/event/${eventId}`);
  }

  async createReminder(reminder: CreateEventReminderDto): Promise<EventReminderDto> {
    return this.post<EventReminderDto>('/eventreminders', reminder);
  }

  async updateReminder(id: string, reminder: UpdateEventReminderDto): Promise<EventReminderDto> {
    return this.put<EventReminderDto>(`/eventreminders/${id}`, reminder);
  }

  async deleteReminder(id: string): Promise<void> {
    return this.delete(`/eventreminders/${id}`);
  }

  // User-specific queries
  async getUserEvents(userId: string, params: CalendarQueryParams = {}): Promise<PaginatedResponse<CalendarEventSummaryDto>> {
    const queryParams: Record<string, any> = {
      userId: userId
    };
    
    if (params.pageNumber) queryParams.pageNumber = params.pageNumber;
    if (params.pageSize) queryParams.pageSize = params.pageSize;
    if (params.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params.endDate) queryParams.endDate = params.endDate.toISOString();
    if (params.eventStatus !== undefined) queryParams.eventStatus = params.eventStatus;

    const url = `/calendar/events/user${this.buildQueryParams(queryParams)}`;
    return this.get<PaginatedResponse<CalendarEventSummaryDto>>(url);
  }

  async getUpcomingEvents(userId: string, startDate: Date, endDate: Date, limit: number = 10): Promise<CalendarEventSummaryDto[]> {
    const queryParams: Record<string, any> = {
      userId: userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: limit
    };

    const url = `/calendar/events/upcoming${this.buildQueryParams(queryParams)}`;
    return this.get<CalendarEventSummaryDto[]>(url);
  }

  async getPendingResponses(userId: string): Promise<EventAttendeeDto[]> {
    return this.get<EventAttendeeDto[]>(`/eventattendees/pending/${userId}`);
  }

  // Additional utility methods following the established pattern
  async searchEvents(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<CalendarEventSummaryDto>> {
    const params: CalendarQueryParams = {
      pageNumber: page,
      pageSize: pageSize,
      searchTerm: searchTerm
    };
    return this.getEvents(params);
  }

  async getEventsByDateRange(startDate: Date, endDate: Date, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<CalendarEventSummaryDto>> {
    const params: CalendarQueryParams = {
      startDate,
      endDate,
      pageNumber: page,
      pageSize: pageSize
    };
    return this.getEvents(params);
  }

  async getEventsByType(eventType: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<CalendarEventSummaryDto>> {
    const params: CalendarQueryParams = {
      eventType,
      pageNumber: page,
      pageSize: pageSize
    };
    return this.getEvents(params);
  }

  async getRecentEvents(limit: number = 10): Promise<CalendarEventSummaryDto[]> {
    try {
      const result = await this.getEvents({ pageNumber: 1, pageSize: limit });
      return result.items;
    } catch (error) {
      console.warn('Could not load recent events');
      return [];
    }
  }

  async updateEventStatus(id: string, status: string): Promise<CalendarEventDto> {
    return this.patch<CalendarEventDto>(`/calendar/events/${id}/status`, { status });
  }
}

// Export singleton instance
export const calendarService = CalendarService.getInstance();
