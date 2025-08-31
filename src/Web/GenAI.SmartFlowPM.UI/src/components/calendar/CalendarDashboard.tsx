'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, MapPin, Search } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarView, CalendarEventSummaryDto, CalendarEventDto } from '@/interfaces/calendar.interfaces';
import { EventForm } from './EventForm';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { EventDetailModal } from './EventDetailModal';

export function CalendarDashboard() {
  const {
    events,
    loading,
    currentDate,
    viewMode,
    monthlyView,
    weeklyView,
    dailyView,
    nextPeriod,
    previousPeriod,
    navigateToDate,
    setViewMode,
    refreshCalendarData
  } = useCalendar();

  const [searchQuery, setSearchQuery] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDto | null>(null);
  const [eventFormDate, setEventFormDate] = useState<Date | undefined>();
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEventSummaryDto | null>(null);

  const handleAddEvent = (date?: Date) => {
    setSelectedEvent(null);
    setEventFormDate(date);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: CalendarEventDto) => {
    setSelectedEvent(event);
    setEventFormDate(undefined);
    setShowEventForm(true);
  };

  const handleViewEvent = (event: CalendarEventSummaryDto) => {
    setDetailEvent(event);
    setShowEventDetail(true);
  };

  const handleEditFromDetail = (event: CalendarEventSummaryDto) => {
    setDetailEvent(null);
    setShowEventDetail(false);
    setSelectedEvent(event as CalendarEventDto);
    setEventFormDate(undefined);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    // TODO: Implement delete event API call
    console.log('Delete event:', eventId);
    refreshCalendarData();
    setShowEventDetail(false);
    setDetailEvent(null);
  };

  const handleSaveEvent = (event: CalendarEventDto) => {
    refreshCalendarData();
    setShowEventForm(false);
    setSelectedEvent(null);
    setEventFormDate(undefined);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setEventFormDate(undefined);
  };

  const handleTimeSlotClick = (date: Date) => {
    handleAddEvent(date);
  };

  useEffect(() => {
    refreshCalendarData();
  }, [currentDate, viewMode]);

  const getViewTitle = () => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (viewMode) {
      case 'month':
        options.year = 'numeric';
        options.month = 'long';
        break;
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
      case 'day':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.weekday = 'long';
        break;
    }
    
    return currentDate.toLocaleDateString(undefined, options);
  };

  const getEventsForView = () => {
    switch (viewMode) {
      case 'month':
        return monthlyView?.events || [];
      case 'week':
        return weeklyView?.events || [];
      case 'day':
        return dailyView?.events || [];
      default:
        return events;
    }
  };

  const filteredEvents = getEventsForView().filter((event: CalendarEventSummaryDto) =>
    searchQuery === '' || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCalendarGrid = () => {
    if (viewMode === 'week') {
      return (
        <WeekView
          currentDate={currentDate}
          onDateChange={navigateToDate}
          events={filteredEvents}
          onEventClick={handleViewEvent}
          onTimeSlotClick={handleTimeSlotClick}
          loading={loading}
        />
      );
    }

    if (viewMode === 'day') {
      return (
        <DayView
          currentDate={currentDate}
          onDateChange={navigateToDate}
          events={filteredEvents}
          onEventClick={handleViewEvent}
          onTimeSlotClick={handleTimeSlotClick}
          loading={loading}
        />
      );
    }

    if (viewMode === 'month') {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
      const days = [];
      const today = new Date();
      
      // Empty cells for days before the month starts
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
      }
      
      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = 
          day === today.getDate() && 
          currentDate.getMonth() === today.getMonth() && 
          currentDate.getFullYear() === today.getFullYear();
        
        const dayEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.startDateTime);
          return eventDate.getDate() === day &&
                 eventDate.getMonth() === currentDate.getMonth() &&
                 eventDate.getFullYear() === currentDate.getFullYear();
        });
        
        days.push(
          <div 
            key={day} 
            onClick={() => {
              const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              handleAddEvent(clickedDate);
            }}
            className={`h-24 border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isToday ? 'bg-primary-50 border-2 border-primary-400 ring-1 ring-primary-300' : 'bg-white'
            }`}
          >
            <div className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
              {day}
            </div>
            {dayEvents.slice(0, 2).map((event, index) => (
              <div 
                key={event.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewEvent(event);
                }}
                className="mt-1 text-xs bg-accent-100 text-accent-800 px-1 py-0.5 rounded truncate cursor-pointer hover:bg-accent-200 transition-colors"
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 mt-1">+{dayEvents.length - 2} more</div>
            )}
          </div>
        );
      }
      
      return (
        <div>
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days}
          </div>
        </div>
      );
    }

    // Default fallback for unsupported views
    return (
      <div className="p-8 text-center text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Calendar view is loading...</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-100 rounded-xl shadow-lg">
            <Calendar className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">Manage your schedule and events</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleAddEvent()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={previousPeriod}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 min-w-[250px] text-center">
                {getViewTitle()}
              </h2>
              
              <button
                onClick={nextPeriod}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={() => navigateToDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-primary-50 hover:text-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Today
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            {/* View Mode Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { mode: 'month' as CalendarView, label: 'Month' },
                { mode: 'week' as CalendarView, label: 'Week' },
                { mode: 'day' as CalendarView, label: 'Day' }
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    viewMode === mode
                      ? 'bg-white text-primary-600 shadow-sm font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {renderCalendarGrid()}
      </div>

      {/* Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Additional calendar content can go here */}
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold text-gray-900">{events.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Period</span>
                <span className="font-semibold text-gray-900">{filteredEvents.length}</span>
              </div>
            </div>
          </div>

          {/* Today's Date */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {new Date().getDate()}
              </div>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={showEventForm}
        onClose={handleCloseEventForm}
        onSave={handleSaveEvent}
        event={selectedEvent}
        defaultDate={eventFormDate}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={showEventDetail}
        onClose={() => setShowEventDetail(false)}
        event={detailEvent}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteEvent}
        loading={loading}
      />
    </div>
  );
}
