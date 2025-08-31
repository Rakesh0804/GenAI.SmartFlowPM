'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  Check, 
  Clock, 
  UserCheck, 
  UserX, 
  UserMinus,
  Mail,
  Search,
  Crown
} from 'lucide-react';
import { EventAttendeeDto, AttendeeResponse } from '@/interfaces/calendar.interfaces';

interface AttendeeManagementProps {
  eventId: string;
  attendees: EventAttendeeDto[];
  onAddAttendee?: (userId: string, isRequired: boolean) => void;
  onUpdateAttendee?: (attendeeId: string, response: AttendeeResponse, notes?: string) => void;
  onRemoveAttendee?: (attendeeId: string) => void;
  canManageAttendees?: boolean;
  currentUserId?: string;
  loading?: boolean;
}

interface UserSuggestion {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function AttendeeManagement({
  eventId,
  attendees,
  onAddAttendee,
  onUpdateAttendee,
  onRemoveAttendee,
  canManageAttendees = false,
  currentUserId,
  loading = false
}: AttendeeManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isRequired, setIsRequired] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Mock user search - in real app, this would fetch from API
  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setUserSuggestions([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUsers: UserSuggestion[] = [
        { id: '1', name: 'John Doe', email: 'john.doe@company.com' },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com' },
        { id: '5', name: 'David Brown', email: 'david.brown@company.com' },
      ].filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      ).filter(user => 
        !attendees.some(attendee => attendee.userId === user.id)
      );
      
      setUserSuggestions(mockUsers);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    searchUsers(searchTerm);
  }, [searchTerm]);

  // Get response icon and color
  const getResponseDisplay = (response: AttendeeResponse) => {
    switch (response) {
      case AttendeeResponse.Accepted:
        return { icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', label: 'Accepted' };
      case AttendeeResponse.Declined:
        return { icon: UserX, color: 'text-red-600', bg: 'bg-red-100', label: 'Declined' };
      case AttendeeResponse.Tentative:
        return { icon: UserMinus, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Tentative' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending' };
    }
  };

  // Handle add attendees
  const handleAddAttendees = () => {
    if (!onAddAttendee) return;
    
    selectedUsers.forEach(userId => {
      onAddAttendee(userId, isRequired);
    });
    
    setSelectedUsers([]);
    setSearchTerm('');
    setShowAddForm(false);
  };

  // Handle response change
  const handleResponseChange = (attendee: EventAttendeeDto, newResponse: AttendeeResponse) => {
    if (!onUpdateAttendee) return;
    onUpdateAttendee(attendee.id, newResponse, attendee.notes);
  };

  // Get attendee stats
  const getAttendeeStats = () => {
    const accepted = attendees.filter(a => a.response === AttendeeResponse.Accepted).length;
    const declined = attendees.filter(a => a.response === AttendeeResponse.Declined).length;
    const tentative = attendees.filter(a => a.response === AttendeeResponse.Tentative).length;
    const pending = attendees.filter(a => a.response === AttendeeResponse.Pending).length;
    
    return { accepted, declined, tentative, pending, total: attendees.length };
  };

  const stats = getAttendeeStats();

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
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Attendees ({stats.total})
          </h3>
        </div>
        
        {canManageAttendees && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attendees</span>
          </button>
        )}
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-green-700">{stats.accepted}</div>
            <div className="text-xs text-green-600">Accepted</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-yellow-700">{stats.tentative}</div>
            <div className="text-xs text-yellow-600">Tentative</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-red-700">{stats.declined}</div>
            <div className="text-xs text-red-600">Declined</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>
      )}

      {/* Add Attendees Form */}
      {showAddForm && canManageAttendees && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Add Attendees</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>
          
          {/* User Suggestions */}
          {searchTerm && (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {isSearching ? (
                <div className="p-3 text-center text-gray-500">Searching...</div>
              ) : userSuggestions.length === 0 ? (
                <div className="p-3 text-center text-gray-500">No users found</div>
              ) : (
                userSuggestions.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      selectedUsers.includes(user.id) ? 'bg-secondary-50' : ''
                    }`}
                    onClick={() => {
                      if (selectedUsers.includes(user.id)) {
                        setSelectedUsers(prev => prev.filter(id => id !== user.id));
                      } else {
                        setSelectedUsers(prev => [...prev, user.id]);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <Check className="w-4 h-4 text-secondary-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Options */}
          {selectedUsers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="w-4 h-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
                />
                <label htmlFor="isRequired" className="text-sm text-gray-700">
                  Required attendees
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUsers([]);
                      setSearchTerm('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAttendees}
                    className="px-3 py-1 text-sm bg-secondary-600 text-white rounded hover:bg-secondary-700"
                  >
                    Add Attendees
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attendees List */}
      <div className="space-y-2">
        {attendees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No attendees added yet</p>
            {canManageAttendees && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-secondary-600 hover:text-secondary-700 text-sm font-medium"
              >
                Add the first attendee
              </button>
            )}
          </div>
        ) : (
          attendees.map((attendee) => {
            const display = getResponseDisplay(attendee.response);
            const ResponseIcon = display.icon;
            const isCurrentUser = attendee.userId === currentUserId;
            
            return (
              <div
                key={attendee.id}
                className={`p-4 border border-gray-200 rounded-lg ${display.bg} ${display.bg.replace('100', '25')}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {attendee.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {attendee.userName}
                        </span>
                        {attendee.isOrganizer && (
                          <div title="Organizer">
                            <Crown className="w-4 h-4 text-yellow-500" />
                          </div>
                        )}
                        {isCurrentUser && (
                          <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{attendee.userEmail}</span>
                        <span className={`flex items-center space-x-1 ${display.color}`}>
                          <ResponseIcon className="w-3 h-3" />
                          <span>{display.label}</span>
                        </span>
                        {!attendee.isRequired && (
                          <span className="text-xs text-gray-500">Optional</span>
                        )}
                      </div>
                      {attendee.notes && (
                        <div className="mt-1 text-xs text-gray-600 italic">
                          "{attendee.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Response Actions for Current User */}
                    {isCurrentUser && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleResponseChange(attendee, AttendeeResponse.Accepted)}
                          className={`p-2 rounded-lg transition-colors ${
                            attendee.response === AttendeeResponse.Accepted
                              ? 'bg-green-200 text-green-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                          }`}
                          title="Accept"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResponseChange(attendee, AttendeeResponse.Tentative)}
                          className={`p-2 rounded-lg transition-colors ${
                            attendee.response === AttendeeResponse.Tentative
                              ? 'bg-yellow-200 text-yellow-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700'
                          }`}
                          title="Tentative"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResponseChange(attendee, AttendeeResponse.Declined)}
                          className={`p-2 rounded-lg transition-colors ${
                            attendee.response === AttendeeResponse.Declined
                              ? 'bg-red-200 text-red-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                          }`}
                          title="Decline"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Management Actions */}
                    {canManageAttendees && !attendee.isOrganizer && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => window.open(`mailto:${attendee.userEmail}`, '_blank')}
                          className="p-2 text-gray-500 hover:text-secondary-600 hover:bg-white rounded-lg transition-colors"
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {onRemoveAttendee && (
                          <button
                            onClick={() => onRemoveAttendee(attendee.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                            title="Remove attendee"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
