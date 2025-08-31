'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  X, 
  Clock, 
  Mail, 
  Smartphone, 
  Monitor,
  BellRing,
  Calendar,
  AlertTriangle,
  Check
} from 'lucide-react';
import { EventReminderDto, ReminderType } from '@/interfaces/calendar.interfaces';

interface ReminderSystemProps {
  eventId: string;
  reminders: EventReminderDto[];
  onAddReminder?: (reminderType: ReminderType, reminderTime: number) => void;
  onUpdateReminder?: (reminderId: string, reminderType: ReminderType, reminderTime: number, isActive: boolean) => void;
  onRemoveReminder?: (reminderId: string) => void;
  eventStartTime: Date;
  loading?: boolean;
}

interface ReminderPreset {
  label: string;
  minutes: number;
  popular?: boolean;
}

const REMINDER_PRESETS: ReminderPreset[] = [
  { label: 'At event time', minutes: 0, popular: true },
  { label: '5 minutes before', minutes: 5, popular: true },
  { label: '15 minutes before', minutes: 15, popular: true },
  { label: '30 minutes before', minutes: 30, popular: true },
  { label: '1 hour before', minutes: 60, popular: true },
  { label: '2 hours before', minutes: 120 },
  { label: '1 day before', minutes: 1440, popular: true },
  { label: '2 days before', minutes: 2880 },
  { label: '1 week before', minutes: 10080 },
];

export function ReminderSystem({
  eventId,
  reminders,
  onAddReminder,
  onUpdateReminder,
  onRemoveReminder,
  eventStartTime,
  loading = false
}: ReminderSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ReminderType>(ReminderType.InApp);
  const [selectedTime, setSelectedTime] = useState<number>(15);
  const [customTime, setCustomTime] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');
  const [isCustomTime, setIsCustomTime] = useState(false);

  // Get reminder type display
  const getReminderTypeDisplay = (type: ReminderType) => {
    switch (type) {
      case ReminderType.Email:
        return { icon: Mail, label: 'Email', color: 'text-blue-600', bg: 'bg-blue-100' };
      case ReminderType.SMS:
        return { icon: Smartphone, label: 'SMS', color: 'text-green-600', bg: 'bg-green-100' };
      case ReminderType.Push:
        return { icon: BellRing, label: 'Push', color: 'text-purple-600', bg: 'bg-purple-100' };
      default:
        return { icon: Monitor, label: 'In-App', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  // Format reminder time
  const formatReminderTime = (minutes: number) => {
    if (minutes === 0) return 'At event time';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} before`;
    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} before`;
    }
    const days = Math.floor(minutes / 1440);
    return `${days} day${days !== 1 ? 's' : ''} before`;
  };

  // Calculate reminder time
  const getReminderDateTime = (minutes: number) => {
    const reminderTime = new Date(eventStartTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - minutes);
    return reminderTime;
  };

  // Get custom time in minutes
  const getCustomTimeInMinutes = () => {
    const value = parseInt(customTime);
    if (isNaN(value)) return 0;
    
    switch (customUnit) {
      case 'hours':
        return value * 60;
      case 'days':
        return value * 1440;
      default:
        return value;
    }
  };

  // Handle add reminder
  const handleAddReminder = () => {
    if (!onAddReminder) return;
    
    const reminderTime = isCustomTime ? getCustomTimeInMinutes() : selectedTime;
    onAddReminder(selectedType, reminderTime);
    
    // Reset form
    setShowAddForm(false);
    setIsCustomTime(false);
    setCustomTime('');
    setSelectedTime(15);
    setSelectedType(ReminderType.InApp);
  };

  // Check if reminder already exists
  const reminderExists = (type: ReminderType, time: number) => {
    return reminders.some(r => r.reminderType === type && r.reminderTime === time);
  };

  // Sort reminders by time
  const sortedReminders = [...reminders].sort((a, b) => a.reminderTime - b.reminderTime);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Reminders ({reminders.length})
          </h3>
        </div>
        
        {onAddReminder && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        )}
      </div>

      {/* Add Reminder Form */}
      {showAddForm && onAddReminder && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Add Reminder</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Reminder Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ReminderType).filter(type => typeof type === 'number').map((type) => {
                const display = getReminderTypeDisplay(type as ReminderType);
                const TypeIcon = display.icon;
                
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as ReminderType)}
                    className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 ${
                      selectedType === type
                        ? 'border-secondary-500 bg-secondary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <TypeIcon className={`w-4 h-4 ${display.color}`} />
                    <span className="text-sm font-medium">{display.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Time
            </label>
            
            {/* Preset Times */}
            <div className="space-y-2 mb-3">
              <div className="text-xs text-gray-500 mb-1">Popular times:</div>
              <div className="flex flex-wrap gap-2">
                {REMINDER_PRESETS.filter(p => p.popular).map((preset) => (
                  <button
                    key={preset.minutes}
                    onClick={() => {
                      setSelectedTime(preset.minutes);
                      setIsCustomTime(false);
                    }}
                    disabled={reminderExists(selectedType, preset.minutes)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      !isCustomTime && selectedTime === preset.minutes
                        ? 'bg-secondary-600 text-white'
                        : reminderExists(selectedType, preset.minutes)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* All Preset Times */}
            <div className="space-y-2 mb-3">
              <div className="text-xs text-gray-500 mb-1">More options:</div>
              <div className="flex flex-wrap gap-2">
                {REMINDER_PRESETS.filter(p => !p.popular).map((preset) => (
                  <button
                    key={preset.minutes}
                    onClick={() => {
                      setSelectedTime(preset.minutes);
                      setIsCustomTime(false);
                    }}
                    disabled={reminderExists(selectedType, preset.minutes)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      !isCustomTime && selectedTime === preset.minutes
                        ? 'bg-secondary-600 text-white'
                        : reminderExists(selectedType, preset.minutes)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Time */}
            <div className="space-y-2">
              <button
                onClick={() => setIsCustomTime(!isCustomTime)}
                className={`text-sm transition-colors ${
                  isCustomTime ? 'text-secondary-600' : 'text-gray-600 hover:text-secondary-600'
                }`}
              >
                {isCustomTime ? '◉' : '○'} Custom time
              </button>
              
              {isCustomTime && (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  />
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as 'minutes' | 'hours' | 'days')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    <option value="minutes">minute(s)</option>
                    <option value="hours">hour(s)</option>
                    <option value="days">day(s)</option>
                  </select>
                  <span className="text-sm text-gray-600">before event</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600">
              Reminder will be sent at: {' '}
              <span className="font-medium">
                {getReminderDateTime(isCustomTime ? getCustomTimeInMinutes() : selectedTime)
                  .toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                disabled={isCustomTime && (!customTime || parseInt(customTime) <= 0)}
                className="px-3 py-1 text-sm bg-secondary-600 text-white rounded hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-2">
        {sortedReminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No reminders set</p>
            {onAddReminder && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-secondary-600 hover:text-secondary-700 text-sm font-medium"
              >
                Add your first reminder
              </button>
            )}
          </div>
        ) : (
          sortedReminders.map((reminder) => {
            const display = getReminderTypeDisplay(reminder.reminderType);
            const TypeIcon = display.icon;
            const reminderDateTime = getReminderDateTime(reminder.reminderTime);
            const isPast = reminderDateTime < new Date();
            
            return (
              <div
                key={reminder.id}
                className={`p-4 border border-gray-200 rounded-lg ${
                  reminder.isActive ? display.bg : 'bg-gray-50'
                } ${isPast && reminder.isSent ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${display.bg}`}>
                      <TypeIcon className={`w-4 h-4 ${display.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {display.label} reminder
                        </span>
                        {reminder.isSent && (
                          <span className="flex items-center space-x-1 text-xs text-green-600">
                            <Check className="w-3 h-3" />
                            <span>Sent</span>
                          </span>
                        )}
                        {!reminder.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            Disabled
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatReminderTime(reminder.reminderTime)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {reminderDateTime.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </span>
                      </div>
                      
                      {reminder.sentAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Sent on {new Date(reminder.sentAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {onUpdateReminder && !reminder.isSent && (
                      <button
                        onClick={() => onUpdateReminder(
                          reminder.id, 
                          reminder.reminderType, 
                          reminder.reminderTime, 
                          !reminder.isActive
                        )}
                        className={`p-2 rounded-lg transition-colors ${
                          reminder.isActive
                            ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={reminder.isActive ? 'Disable reminder' : 'Enable reminder'}
                      >
                        {reminder.isActive ? (
                          <BellRing className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    
                    {onRemoveReminder && (
                      <button
                        onClick={() => onRemoveReminder(reminder.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove reminder"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Warning for past events */}
      {eventStartTime < new Date() && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            This event has already started. New reminders may not be sent.
          </span>
        </div>
      )}
    </div>
  );
}
