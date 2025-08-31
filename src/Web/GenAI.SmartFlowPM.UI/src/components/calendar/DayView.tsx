'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { CalendarEventSummaryDto, EventType, EventPriority } from '@/interfaces/calendar.interfaces';
import { EVENT_COLORS, PRIORITY_COLORS } from '@/interfaces/calendar.interfaces';

interface DayViewProps {
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

const HOUR_HEIGHT = 80; // Increased height for better visibility in day view

export function DayView({ 
  currentDate, 
  onDateChange, 
  events, 
  onEventClick, 
  onTimeSlotClick,
  loading = false 
}: DayViewProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  // Update selected day when currentDate changes
  useEffect(() => {
    setSelectedDay(new Date(currentDate));
  }, [currentDate]);

  // Navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Get events for the current day
  const dayEvents = events.filter(event => {
    const eventStart = new Date(event.startDateTime);
    const eventDateStr = eventStart.toDateString();
    const selectedDateStr = selectedDay.toDateString();
    
    return eventDateStr === selectedDateStr;
  });

  // Get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      const eventStart = new Date(event.startDateTime);
      const eventEnd = new Date(event.endDateTime);
      
      // For all-day events, show only in the first hour
      if (event.isAllDay) return hour === 0;

      // Check if event overlaps with this hour
      const eventStartHour = eventStart.getHours();
      const eventEndHour = eventEnd.getHours();
      
      return eventStartHour <= hour && (eventEndHour > hour || (eventEndHour === hour && eventEnd.getMinutes() > 0));
    });
  };

  // Calculate event positioning
  const getEventStyle = (event: CalendarEventSummaryDto) => {
    const eventStart = new Date(event.startDateTime);
    const eventEnd = new Date(event.endDateTime);

    if (event.isAllDay) {
      return {
        top: '0px',
        height: '30px',
        backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#109e92',
        zIndex: 10
      };
    }

    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
    const duration = endMinutes - startMinutes;

    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 30); // Minimum 30px height

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#109e92',
      zIndex: 20
    };
  };

  // Handle time slot click
  const handleTimeSlotClick = (hour: number) => {
    const clickDate = new Date(selectedDay);
    clickDate.setHours(hour, 0, 0, 0);
    onTimeSlotClick(clickDate);
  };

  // Format event time
  const formatEventTime = (event: CalendarEventSummaryDto) => {
    if (event.isAllDay) return 'All day';
    
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    
    return `${start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })} - ${end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  };

  // Check if date is today
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
    <div className="flex h-full bg-white">
      {/* Left Sidebar - Day Summary */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-lg font-semibold ${
              isToday(selectedDay) 
                ? 'text-primary-600 border-2 border-primary-400 bg-primary-50 px-3 py-2 rounded-lg' 
                : 'text-gray-900'
            }`}>
              {selectedDay.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              {isToday(selectedDay) ? 'Today' : selectedDay.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Events Summary */}
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Events ({dayEvents.length})
            </h3>
            
            {dayEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No events scheduled</p>
                <button
                  onClick={() => handleTimeSlotClick(9)} // 9 AM default
                  className="mt-2 text-primary-600 hover:text-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm font-medium"
                >
                  Add an event
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {dayEvents
                  .sort((a, b) => {
                    if (a.isAllDay && !b.isAllDay) return -1;
                    if (!a.isAllDay && b.isAllDay) return 1;
                    return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="p-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#109e92' }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatEventTime(event)}
                          </div>
                          {event.location && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                          {event.attendeeCount && event.attendeeCount > 0 && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Users className="w-3 h-3 mr-1" />
                              {event.attendeeCount} attendees
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* All-day Events Row */}
        {dayEvents.some(e => e.isAllDay) && (
          <div className="border-b border-gray-200 bg-gray-25 p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">All day</div>
            <div className="space-y-1">
              {dayEvents
                .filter(event => event.isAllDay)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="rounded text-sm text-white p-2 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#109e92'
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.location && (
                      <div className="text-xs opacity-90 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Time Grid */}
        <div className="flex-1 overflow-auto">
          <div className="relative">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.hour} className="flex border-b border-gray-100">
                {/* Time Label */}
                <div 
                  className="w-20 p-3 text-xs text-gray-500 border-r border-gray-200 flex items-start justify-end bg-gray-50"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  {timeSlot.label}
                </div>
                
                {/* Time Slot */}
                <div
                  className="flex-1 relative cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  onClick={() => handleTimeSlotClick(timeSlot.hour)}
                >
                  {/* Half-hour line */}
                  <div 
                    className="absolute inset-x-0 border-t border-gray-100"
                    style={{ top: `${HOUR_HEIGHT / 2}px` }}
                  />
                  
                  {/* Events for this time slot */}
                  {getEventsForHour(timeSlot.hour)
                    .filter(event => !event.isAllDay)
                    .map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="absolute inset-x-2 rounded text-sm text-white p-2 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden shadow-sm"
                        style={getEventStyle(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-90 mt-1">
                          {formatEventTime(event)}
                        </div>
                        {event.location && (
                          <div className="text-xs opacity-90 truncate flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Time Indicator */}
        <CurrentTimeIndicator selectedDay={selectedDay} />
      </div>
    </div>
  );
}

// Current time indicator component
function CurrentTimeIndicator({ selectedDay }: { selectedDay: Date }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  
  // Only show indicator if viewing today
  if (selectedDay.toDateString() !== today.toDateString()) return null;

  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const topPosition = (currentMinutes / 60) * HOUR_HEIGHT + 80; // +80 for all-day events area

  return (
    <div
      className="absolute right-20 pointer-events-none z-30"
      style={{ top: `${topPosition}px` }}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <div className="h-0.5 bg-red-500 w-full"></div>
      </div>
    </div>
  );
}
