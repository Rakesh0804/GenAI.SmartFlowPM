'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, FileText, Repeat, Bell, Tag } from 'lucide-react';
import { 
  CreateCalendarEventDto, 
  UpdateCalendarEventDto, 
  CalendarEventDto,
  EventType, 
  EventPriority,
  CreateEventReminderDto,
  ReminderType
} from '@/interfaces/calendar.interfaces';
import { calendarService } from '@/services/calendar.service';
import { projectService } from '@/services/project.service';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEventDto) => void;
  event?: CalendarEventDto | null;
  defaultDate?: Date;
}

interface FormData {
  title: string;
  description: string;
  eventType: EventType;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  location: string;
  priority: EventPriority;
  projectId: string;
  isRecurring: boolean;
  isPrivate: boolean;
  color: string;
  reminderMinutes: number[];
}

const eventTypeOptions = [
  { value: EventType.Meeting, label: 'Meeting' },
  { value: EventType.Task, label: 'Task' },
  { value: EventType.Deadline, label: 'Deadline' },
  { value: EventType.Personal, label: 'Personal' },
  { value: EventType.Holiday, label: 'Holiday' },
  { value: EventType.Company, label: 'Company' }
];

const priorityOptions = [
  { value: EventPriority.Low, label: 'Low', color: 'text-accent-600' },
  { value: EventPriority.Medium, label: 'Medium', color: 'text-primary-600' },
  { value: EventPriority.High, label: 'High', color: 'text-yellow-600' },
  { value: EventPriority.Critical, label: 'Critical', color: 'text-red-600' }
];

const reminderOptions = [
  { value: 0, label: 'No reminder' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 10080, label: '1 week before' }
];

const colorOptions = [
  '#33364d', // Primary - Dark Blue Grey
  '#109e92', // Accent/Secondary - Teal
  '#ef4444', // Red
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f59e0b', // Amber
  '#6b7280'  // Gray
];

export function EventForm({ isOpen, onClose, onSave, event, defaultDate }: EventFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    eventType: EventType.Meeting,
    startDateTime: '',
    endDateTime: '',
    isAllDay: false,
    location: '',
    priority: EventPriority.Medium,
    projectId: '',
    isRecurring: false,
    isPrivate: false,
    color: '#33364d',
    reminderMinutes: [15]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  // Initialize form data
  useEffect(() => {
    if (event) {
      // Edit mode
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);
      
      setFormData({
        title: event.title,
        description: event.description || '',
        eventType: event.eventType,
        startDateTime: startDate.toISOString().slice(0, 16),
        endDateTime: endDate.toISOString().slice(0, 16),
        isAllDay: event.isAllDay,
        location: event.location || '',
        priority: event.priority,
        projectId: event.projectId || '',
        isRecurring: event.isRecurring,
        isPrivate: event.isPrivate,
        color: event.color || '#33364d',
        reminderMinutes: event.reminders?.map(r => r.reminderTime) || [15]
      });
    } else if (defaultDate) {
      // Create mode with default date
      const start = new Date(defaultDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later
      
      setFormData(prev => ({
        ...prev,
        startDateTime: start.toISOString().slice(0, 16),
        endDateTime: end.toISOString().slice(0, 16)
      }));
    }
  }, [event, defaultDate]);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await projectService.getRecentProjects(50);
        console.log('Projects data received:', projectsData);
        
        // Handle different response formats
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
        } else if (projectsData && typeof projectsData === 'object') {
          // Check for paginated response format
          const data = projectsData as any;
          if (Array.isArray(data.items)) {
            setProjects(data.items);
          } else if (Array.isArray(data.data)) {
            setProjects(data.data);
          } else {
            console.warn('Projects data is not in expected format:', projectsData);
            setProjects([]);
          }
        } else {
          console.warn('Projects data is not in expected format:', projectsData);
          setProjects([]);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects([]);
      }
    };

    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  // Handle form field changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-adjust end time when start time changes
    if (field === 'startDateTime' && value) {
      const startDate = new Date(value);
      const currentEndDate = formData.endDateTime ? new Date(formData.endDateTime) : null;
      
      if (!currentEndDate || currentEndDate <= startDate) {
        const newEndDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          endDateTime: newEndDate.toISOString().slice(0, 16)
        }));
        return;
      }
    }
  };

  // Handle reminder management
  const addReminder = (minutes: number) => {
    if (!formData.reminderMinutes.includes(minutes)) {
      setFormData(prev => ({
        ...prev,
        reminderMinutes: [...prev.reminderMinutes, minutes].sort((a, b) => a - b)
      }));
    }
  };

  const removeReminder = (minutes: number) => {
    setFormData(prev => ({
      ...prev,
      reminderMinutes: prev.reminderMinutes.filter(m => m !== minutes)
    }));
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.startDateTime) return 'Start date and time is required';
    if (!formData.endDateTime) return 'End date and time is required';
    
    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);
    
    if (endDate <= startDate) return 'End time must be after start time';
    
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);

      if (event) {
        // Update existing event
        const updateData: UpdateCalendarEventDto = {
          id: event.id,
          title: formData.title,
          description: formData.description || undefined,
          eventType: formData.eventType,
          startDateTime: startDate,
          endDateTime: endDate,
          isAllDay: formData.isAllDay,
          location: formData.location || undefined,
          priority: formData.priority,
          projectId: formData.projectId || undefined,
          isRecurring: formData.isRecurring,
          isPrivate: formData.isPrivate,
          color: formData.color
        };

        const updatedEvent = await calendarService.updateEvent(event.id, updateData);
        onSave(updatedEvent);
      } else {
        // Create new event
        const createData: CreateCalendarEventDto = {
          title: formData.title,
          description: formData.description || undefined,
          eventType: formData.eventType,
          startDateTime: startDate,
          endDateTime: endDate,
          isAllDay: formData.isAllDay,
          location: formData.location || undefined,
          priority: formData.priority,
          projectId: formData.projectId || undefined,
          isRecurring: formData.isRecurring,
          isPrivate: formData.isPrivate,
          color: formData.color,
          reminders: formData.reminderMinutes.filter(m => m > 0).map(minutes => ({
            reminderType: ReminderType.Email,
            reminderTime: minutes
          } as CreateEventReminderDto))
        };

        const newEvent = await calendarService.createEvent(createData);
        onSave(newEvent);
      }

      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => handleChange('eventType', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {eventTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Date & Time
            </h3>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isAllDay}
                onChange={(e) => handleChange('isAllDay', e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2"
              />
              <label className="text-sm text-gray-700">All day event</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type={formData.isAllDay ? 'date' : 'datetime-local'}
                  value={formData.isAllDay ? formData.startDateTime.split('T')[0] : formData.startDateTime}
                  onChange={(e) => handleChange('startDateTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type={formData.isAllDay ? 'date' : 'datetime-local'}
                  value={formData.isAllDay ? formData.endDateTime.split('T')[0] : formData.endDateTime}
                  onChange={(e) => handleChange('endDateTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location and Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No project</option>
                {Array.isArray(projects) && projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Color
            </label>
            <div className="flex space-x-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    formData.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => handleChange('isPrivate', e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2"
              />
              <label className="text-sm text-gray-700">Private event</label>
            </div>
            
            {!event && (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => handleChange('isRecurring', e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2"
                />
                <label className="text-sm text-gray-700">Recurring event</label>
              </div>
            )}
          </div>

          {/* Reminders (only for new events) */}
          {!event && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bell className="w-4 h-4 inline mr-1" />
                Reminders
              </label>
              <div className="space-y-2">
                <select
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value);
                    if (minutes >= 0) addReminder(minutes);
                    e.target.value = '';
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  defaultValue=""
                >
                  <option value="" disabled>Add a reminder</option>
                  {reminderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formData.reminderMinutes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.reminderMinutes.map(minutes => (
                      <span
                        key={minutes}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                      >
                        {reminderOptions.find(r => r.value === minutes)?.label || `${minutes} minutes`}
                        <button
                          type="button"
                          onClick={() => removeReminder(minutes)}
                          className="ml-2 text-primary-400 hover:text-primary-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center font-medium"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
