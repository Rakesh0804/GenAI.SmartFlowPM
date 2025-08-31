import { useState, useEffect, useCallback } from 'react';
import { 
  CalendarEventDto, 
  CalendarEventSummaryDto,
  CreateCalendarEventDto, 
  UpdateCalendarEventDto,
  CalendarView,
  CalendarQueryParams,
  MonthlyCalendarDto,
  WeeklyCalendarDto,
  DailyCalendarDto
} from '@/interfaces/calendar.interfaces';
import { calendarService } from '@/services/calendar.service';
import { PaginatedResponse } from '@/interfaces/paginated.interfaces';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEventSummaryDto[]>([]);
  const [monthlyView, setMonthlyView] = useState<MonthlyCalendarDto | null>(null);
  const [weeklyView, setWeeklyView] = useState<WeeklyCalendarDto | null>(null);
  const [dailyView, setDailyView] = useState<DailyCalendarDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calendar navigation
  const navigateToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const nextPeriod = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, viewMode]);

  const previousPeriod = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, viewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Data fetching
  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (viewMode) {
        case 'month':
          const monthData = await calendarService.getMonthlyView(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1
          );
          setMonthlyView(monthData);
          setEvents(monthData.events);
          break;
          
        case 'week':
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          const weekData = await calendarService.getWeeklyView(startOfWeek);
          setWeeklyView(weekData);
          setEvents(weekData.events);
          break;
          
        case 'day':
          const dayData = await calendarService.getDailyView(currentDate);
          setDailyView(dayData);
          setEvents(dayData.events);
          break;
          
        case 'agenda':
          const startDate = new Date(currentDate);
          startDate.setDate(1); // Start of month
          const endDate = new Date(currentDate);
          endDate.setMonth(endDate.getMonth() + 1, 0); // End of month
          
          const agendaData = await calendarService.getEvents({
            startDate,
            endDate,
            pageSize: 50
          });
          setEvents(agendaData.items);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentDate, viewMode]);

  // Event operations
  const createEvent = useCallback(async (event: CreateCalendarEventDto): Promise<CalendarEventDto> => {
    try {
      const newEvent = await calendarService.createEvent(event);
      // Refresh calendar data after creating event
      await fetchCalendarData();
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchCalendarData]);

  const updateEvent = useCallback(async (id: string, event: UpdateCalendarEventDto): Promise<CalendarEventDto> => {
    try {
      const updatedEvent = await calendarService.updateEvent(id, event);
      // Refresh calendar data after updating event
      await fetchCalendarData();
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchCalendarData]);

  const deleteEvent = useCallback(async (id: string): Promise<void> => {
    try {
      await calendarService.deleteEvent(id);
      // Refresh calendar data after deleting event
      await fetchCalendarData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchCalendarData]);

  const getEventById = useCallback(async (id: string): Promise<CalendarEventDto> => {
    try {
      return await calendarService.getEventById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Search and filter
  const searchEvents = useCallback(async (params: CalendarQueryParams): Promise<PaginatedResponse<CalendarEventSummaryDto>> => {
    try {
      return await calendarService.getEvents(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search events';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Load calendar data when date or view mode changes
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Utility functions
  const getEventsForDate = useCallback((date: Date): CalendarEventSummaryDto[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events]);

  const getEventsForTimeSlot = useCallback((date: Date, hour: number): CalendarEventSummaryDto[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startDateTime);
      const eventEnd = new Date(event.endDateTime);
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      return (eventStart < slotEnd && eventEnd > slotStart);
    });
  }, [events]);

  const formatPeriodTitle = useCallback((): string => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (viewMode) {
      case 'month':
        options.year = 'numeric';
        options.month = 'long';
        return currentDate.toLocaleDateString('en-US', options);
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'day':
        options.weekday = 'long';
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        return currentDate.toLocaleDateString('en-US', options);
      case 'agenda':
        options.year = 'numeric';
        options.month = 'long';
        return `${currentDate.toLocaleDateString('en-US', options)} Agenda`;
      default:
        return '';
    }
  }, [currentDate, viewMode]);

  return {
    // State
    currentDate,
    viewMode,
    events,
    monthlyView,
    weeklyView,
    dailyView,
    loading,
    error,
    
    // Navigation
    navigateToDate,
    nextPeriod,
    previousPeriod,
    goToToday,
    setViewMode,
    
    // Event operations
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    searchEvents,
    
    // Data refresh
    refreshCalendarData: fetchCalendarData,
    
    // Utilities
    getEventsForDate,
    getEventsForTimeSlot,
    formatPeriodTitle,
    
    // Clear error
    clearError: () => setError(null),
  };
};

export default useCalendar;
