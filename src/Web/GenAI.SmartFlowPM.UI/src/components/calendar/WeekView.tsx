'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { CalendarEventSummaryDto, EventType, EventPriority } from '@/interfaces/calendar.interfaces';
import { EVENT_COLORS, PRIORITY_COLORS } from '@/interfaces/calendar.interfaces';

interface WeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEventSummaryDto[];
  onEventClick: (event: CalendarEventSummaryDto) => void;
  onTimeSlotClick: (date: Date) => void;
  loading?: boolean;
}

interface TimeSlot {
  hour: number;
  label: string;
}

const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
}));

const HOUR_HEIGHT = 60; // Height of each hour slot in pixels

export function WeekView({ 
  currentDate, 
  onDateChange, 
  events, 
  onEventClick, 
  onTimeSlotClick,
  loading = false 
}: WeekViewProps) {
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // Calculate week start and days
  useEffect(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day; // Sunday as week start
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    setWeekStart(start);

    // Generate the main 7 days (Sunday to Saturday)
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
    
    setWeekDays(days);
    
    // Only log events debug once on week calculation
    if (events.length > 0) {
      console.log('📅 WeekView updated with', events.length, 'events for week', `${days[0].toDateString()} to ${days[6].toDateString()}`);
    }
  }, [currentDate]);

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Get events for a specific day and hour - only returns events that START in this hour
  const getEventsForDayHour = (day: Date, hour: number) => {
    const filteredEvents = events.filter(event => {
      const eventStart = new Date(event.startDateTime);
      const eventEnd = new Date(event.endDateTime);
      
      // More robust date comparison - compare just the date components
      const eventDate = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const dayDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const isSameDay = eventDate.getTime() === dayDate.getTime();
      
      if (!isSameDay) return false;

      // For all-day events, show only in the first hour
      if (event.isAllDay) return hour === 0;

      // Only return events that START in this hour (not span through it)
      const eventStartHour = eventStart.getHours();
      return eventStartHour === hour;
    });
    
    return filteredEvents;
  };

  // Enhanced function to get all events for a specific day (for all-day events section)
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDateTime);
      const eventDate = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const dayDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      return eventDate.getTime() === dayDate.getTime();
    });
  };

  // Calculate event positioning
  const getEventStyle = (event: CalendarEventSummaryDto, day: Date) => {
    const eventStart = new Date(event.startDateTime);
    const eventEnd = new Date(event.endDateTime);

    if (event.isAllDay) {
      return {
        top: '0px',
        height: '20px',
        backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#3B82F6',
        zIndex: 10
      };
    }

    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
    const duration = endMinutes - startMinutes;

    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 20); // Minimum 20px height

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#3B82F6',
      zIndex: 20
    };
  };

  // Handle time slot click
  const handleTimeSlotClick = (day: Date, hour: number) => {
    const clickDate = new Date(day);
    clickDate.setHours(hour, 0, 0, 0);
    onTimeSlotClick(clickDate);
  };

  // Format date ranges
  const formatWeekRange = () => {
    // Guard clause: return early if weekDays array is not populated yet
    if (!weekDays || weekDays.length === 0) {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    const start = weekDays[0];
    const end = weekDays[6];
    
    // Additional safety check for undefined dates
    if (!start || !end) {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {formatWeekRange()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Today
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
            <div className="p-3 text-center text-sm font-medium text-gray-500">
              Time
            </div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`p-3 text-center border-l border-gray-200 ${
                  isToday(day) ? 'bg-primary-50 border-2 border-primary-400' : ''
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${
                  isToday(day) ? 'text-primary-600' : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* All-day Events Row */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-25 min-h-[40px]">
            <div className="p-2 text-xs font-medium text-gray-500 flex items-center justify-center">
              All day
            </div>
            {weekDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="border-l border-gray-200 p-1 relative min-h-[40px]"
              >
                {events
                  .filter(event => {
                    if (!event.isAllDay) return false;
                    
                    const eventStart = new Date(event.startDateTime);
                    const eventDate = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
                    const dayDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
                    return eventDate.getTime() === dayDate.getTime();
                  })
                  .map((event, eventIndex) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="absolute inset-x-1 top-1 rounded text-xs text-white p-1 cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{
                        backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#3B82F6',
                        top: `${eventIndex * 22 + 4}px`,
                        height: '18px'
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="relative">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.hour} className="grid grid-cols-8 border-b border-gray-100">
                {/* Time Label */}
                <div 
                  className="p-2 text-xs text-gray-500 border-r border-gray-200 flex items-start justify-center bg-gray-50"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  {timeSlot.label}
                </div>
                
                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`border-l border-gray-200 relative cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday(day) ? 'border-l-2 border-l-primary-300' : ''
                    }`}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    onClick={() => handleTimeSlotClick(day, timeSlot.hour)}
                  >
                    {/* Half-hour line */}
                    <div 
                      className="absolute inset-x-0 border-t border-gray-100"
                      style={{ top: `${HOUR_HEIGHT / 2}px` }}
                    />
                    
                    {/* Events for this time slot */}
                    {getEventsForDayHour(day, timeSlot.hour)
                      .filter(event => !event.isAllDay)
                      .map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className="absolute inset-x-1 rounded text-xs text-white p-1 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                          style={getEventStyle(event, day)}
                          title={`${event.title}${event.location ? ` - ${event.location}` : ''}`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          {event.location && (
                            <div className="text-xs opacity-90 truncate flex items-center">
                              <MapPin className="w-2 h-2 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Time Indicator */}
      <CurrentTimeIndicator weekDays={weekDays} />
    </div>
  );
}

// Current time indicator component
function CurrentTimeIndicator({ weekDays }: { weekDays: Date[] }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const todayColumn = weekDays.findIndex(day => 
    day.toDateString() === today.toDateString()
  );

  if (todayColumn === -1) return null;

  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const topPosition = (currentMinutes / 60) * HOUR_HEIGHT + 80; // +80 for headers

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-30"
      style={{ top: `${topPosition}px` }}
    >
      <div className="flex">
        <div className="w-1/8"></div> {/* Time column */}
        {weekDays.map((_, index) => (
          <div key={index} className="flex-1 relative">
            {index === todayColumn && (
              <>
                <div className="absolute inset-x-0 h-0.5 bg-red-500"></div>
                <div className="absolute left-0 w-2 h-2 bg-red-500 rounded-full -mt-1"></div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
