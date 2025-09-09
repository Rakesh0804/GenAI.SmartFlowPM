'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  CirclePlus,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { timeTrackerService } from '../../services/timetracker.service';
import { 
  TimeEntryDto, 
  TimeCategoryDto,
  CreateTimeEntryDto
} from '../../interfaces/timetracker.interfaces';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TimeCalendarProps {
  userId: string;
  onEditEntry?: (entry: TimeEntryDto) => void;
  onCreateEntry?: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  entries: TimeEntryDto[];
  isCurrentMonth: boolean;
  isToday: boolean;
  totalMinutes: number;
}

export const TimeCalendar: React.FC<TimeCalendarProps> = ({
  userId,
  onEditEntry,
  onCreateEntry
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState<TimeEntryDto[]>([]);
  const [timeCategories, setTimeCategories] = useState<TimeCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const { success, error } = useToast();

  useEffect(() => {
    loadTimeData();
  }, [currentDate, userId]);

  useEffect(() => {
    generateCalendarDays();
  }, [timeEntries, currentDate]);

  const loadTimeData = async () => {
    try {
      setLoading(true);
      
      // Get month boundaries
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Extend to include previous and next month days shown in calendar
      const calendarStart = new Date(startOfMonth);
      calendarStart.setDate(calendarStart.getDate() - startOfMonth.getDay());
      
      const calendarEnd = new Date(endOfMonth);
      calendarEnd.setDate(calendarEnd.getDate() + (6 - endOfMonth.getDay()));

      const [entries, categories] = await Promise.all([
        timeTrackerService.getTimeEntriesByUser(userId),
        timeTrackerService.getTimeCategories()
      ]);

      // Filter entries for the calendar month range
      const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= calendarStart && entryDate <= calendarEnd;
      });

      setTimeEntries(filteredEntries);
      setTimeCategories(categories);
    } catch (err) {
      error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate.toDateString() === date.toDateString();
      });

      // Filter by selected categories if any
      const filteredEntries = selectedCategories.length > 0 
        ? dayEntries.filter(entry => selectedCategories.includes(entry.timeCategoryId))
        : dayEntries;

      const totalMinutes = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);

      days.push({
        date,
        entries: filteredEntries,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        totalMinutes
      });
    }

    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = timeCategories.find(cat => cat.id === categoryId);
    return category?.color || '#6B7280';
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const monthYearDisplay = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-secondary-500">
            Time Calendar
          </h2>
          <p className="text-gray-600">
            Visual overview of your time entries
          </p>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                  {monthYearDisplay}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primaryDark"
              >
                Today
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
              {timeCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'bg-orange-100 border-orange-300 text-orange-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategories.includes(category.id) 
                      ? category.color + '20' 
                      : undefined,
                    borderColor: selectedCategories.includes(category.id) 
                      ? category.color 
                      : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg transition-colors ${
                  day.isCurrentMonth 
                    ? 'border-gray-200 bg-white hover:bg-gray-50' 
                    : 'border-gray-100 bg-gray-50 text-gray-400'
                } ${day.isToday ? 'ring-2 ring-brand-primary border-2 border-brand-primary' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    day.isToday ? 'text-brand-primary font-bold' : ''
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {day.isCurrentMonth && (
                    <button
                      onClick={() => onCreateEntry?.(day.date)}
                      className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CirclePlus className="h-3 w-3 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Time Entries */}
                <div className="space-y-1">
                  {day.entries.slice(0, 3).map((entry, entryIndex) => (
                    <div
                      key={entry.id}
                      className="px-2 py-1 text-xs rounded cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: getCategoryColor(entry.timeCategoryId) + '20',
                        borderLeft: `3px solid ${getCategoryColor(entry.timeCategoryId)}`
                      }}
                      onClick={() => onEditEntry?.(entry)}
                      title={`${entry.timeCategoryName}: ${formatDuration(entry.duration)}\n${entry.description || ''}`}
                    >
                      <div className="truncate font-medium">
                        {entry.timeCategoryName}
                      </div>
                      <div className="text-gray-600">
                        {formatDuration(entry.duration)}
                      </div>
                    </div>
                  ))}
                  
                  {day.entries.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{day.entries.length - 3} more
                    </div>
                  )}
                </div>

                {/* Total Time */}
                {day.totalMinutes > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-medium text-gray-700">
                        {formatDuration(day.totalMinutes)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-brand-primary rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Click entries to edit</span>
              </div>
              <div className="flex items-center gap-2">
                <CirclePlus className="h-3 w-3" />
                <span>Click dates to add time</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Total month: {formatDuration(
                calendarDays
                  .filter(day => day.isCurrentMonth)
                  .reduce((sum, day) => sum + day.totalMinutes, 0)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCalendar;
