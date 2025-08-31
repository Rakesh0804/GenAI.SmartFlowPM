'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Copy,
  ExternalLink,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { CalendarEventSummaryDto, EventType, EventPriority } from '@/interfaces/calendar.interfaces';
import { EVENT_COLORS, PRIORITY_COLORS } from '@/interfaces/calendar.interfaces';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventSummaryDto | null;
  onEdit?: (event: CalendarEventSummaryDto) => void;
  onDelete?: (eventId: string) => void;
  loading?: boolean;
}

export function EventDetailModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  loading = false
}: EventDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !event) return null;

  // Format date and time
  const formatDateTime = (dateTime: Date, isAllDay: boolean) => {
    const date = new Date(dateTime);
    
    if (isAllDay) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate duration
  const getDuration = () => {
    if (event.isAllDay) return 'All day';
    
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) {
      return `${diffMinutes} minutes`;
    } else if (diffMinutes === 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffHours}h ${diffMinutes}m`;
    }
  };

  // Get event type display
  const getEventTypeDisplay = (type: EventType) => {
    switch (type) {
      case EventType.Meeting:
        return 'Meeting';
      case EventType.Task:
        return 'Task';
      case EventType.Deadline:
        return 'Deadline';
      case EventType.Personal:
        return 'Personal';
      default:
        return 'Event';
    }
  };

  // Get priority display
  const getPriorityDisplay = (priority: EventPriority) => {
    switch (priority) {
      case EventPriority.Low:
        return { label: 'Low', icon: CheckCircle, color: 'text-green-600' };
      case EventPriority.Medium:
        return { label: 'Medium', icon: AlertCircle, color: 'text-yellow-600' };
      case EventPriority.High:
        return { label: 'High', icon: XCircle, color: 'text-red-600' };
      default:
        return { label: 'Normal', icon: CheckCircle, color: 'text-gray-600' };
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Handle copy event details
  const copyEventDetails = () => {
    const details = `
Event: ${event.title}
Date: ${formatDateTime(event.startDateTime, event.isAllDay)}
${!event.isAllDay ? `End: ${formatDateTime(event.endDateTime, false)}` : ''}
Duration: ${getDuration()}
${event.location ? `Location: ${event.location}` : ''}
Type: ${getEventTypeDisplay(event.eventType)}
Priority: ${getPriorityDisplay(event.priority).label}
    `.trim();
    
    navigator.clipboard.writeText(details);
  };

  const priority = getPriorityDisplay(event.priority);
  const PriorityIcon = priority.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: event.color || EVENT_COLORS[event.eventType] || '#109e92' }}
              />
              <h1 className="text-xl font-semibold text-gray-900 line-clamp-2">
                {event.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                {getEventTypeDisplay(event.eventType)}
              </span>
              <div className={`flex items-center space-x-1 ${priority.color}`}>
                <PriorityIcon className="w-4 h-4" />
                <span className="text-xs font-medium">{priority.label}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                title="Edit event"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={copyEventDetails}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              title="Copy event details"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Date and Time */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date & Time
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Start:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(event.startDateTime, event.isAllDay)}
                  </span>
                </div>
                {!event.isAllDay && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">End:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(event.endDateTime, false)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {getDuration()}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{event.location}</span>
                    <button
                      onClick={() => event.location && window.open(`https://maps.google.com/?q=${encodeURIComponent(event.location)}`, '_blank')}
                      className="text-secondary-600 hover:text-secondary-700 transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Attendees */}
            {event.attendeeCount && event.attendeeCount > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Attendees ({event.attendeeCount})
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {event.attendeeCount} {event.attendeeCount === 1 ? 'person' : 'people'} invited
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Event Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Event Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Event ID:</span>
                  <span className="text-sm font-mono text-gray-900">#{event.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm text-gray-900">
                    {event.status === 0 ? 'Scheduled' : 
                     event.status === 1 ? 'In Progress' :
                     event.status === 2 ? 'Completed' :
                     event.status === 3 ? 'Cancelled' : 'Postponed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            {!showDeleteConfirm && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Event</span>
              </button>
            )}
            
            {showDeleteConfirm && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Delete this event?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Event</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
