'use client';

import React, { useState, useEffect } from 'react';
import { TeamDto, CreateTeamDto, UpdateTeamDto, UserDto, TeamMemberRole } from '@/types/api.types';
import { teamService } from '@/services/team.service';
import { userService } from '@/services/user.service';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';
import { 
  Users, 
  FileText, 
  User, 
  Crown, 
  Save, 
  X, 
  ArrowLeft,
  Edit,
  Building2,
  UserCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TeamFormNewProps {
  team?: TeamDto;
  mode: 'create' | 'edit' | 'view';
  onSave?: (team: TeamDto) => void;
  onCancel?: () => void;
  onBack?: () => void;
  onEdit?: () => void;
}

export default function TeamFormNew({ team, mode, onSave, onCancel, onBack, onEdit }: TeamFormNewProps) {
  const [loading, setLoading] = useState(false);
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leaderId: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial users data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingInitialData(true);
        console.log('TeamFormNew: Loading initial data...');
        
        // Load users with fallback handling
        let activeUsers: UserDto[] = [];
        try {
          const userResult = await userService.getActiveUsers(50);
          if (Array.isArray(userResult)) {
            activeUsers = userResult;
          } else if ((userResult as any)?.items && Array.isArray((userResult as any).items)) {
            activeUsers = (userResult as any).items;
          } else if ((userResult as any)?.data && Array.isArray((userResult as any).data)) {
            activeUsers = (userResult as any).data;
          }
        } catch (error) {
          console.warn('Active users endpoint not available, using fallback');
          const fallbackResult = await userService.getUsers(1, 50);
          if (Array.isArray(fallbackResult)) {
            activeUsers = fallbackResult;
          } else if ((fallbackResult as any)?.items) {
            activeUsers = (fallbackResult as any).items;
          }
        }

        console.log('TeamFormNew: Loaded active users:', activeUsers);
        setInitialUsers(activeUsers);
        setDataError(null);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setDataError('Failed to load form data. Some options may not be available.');
        setInitialUsers([]);
      } finally {
        setLoadingInitialData(false);
      }
    };

    loadInitialData();
  }, []);

  // Initialize form data when team changes
  useEffect(() => {
    if (team) {
      console.log('TeamFormNew: Loading team data:', team);
      setFormData({
        name: team.name || '',
        description: team.description || '',
        leaderId: team.leaderId || '',
        isActive: team.isActive !== undefined ? team.isActive : true
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        leaderId: '',
        isActive: true
      });
    }
  }, [team, mode]);

  // Search functions for SearchableSelect components
  const searchUsers = async (query: string) => {
    try {
      if (!query.trim()) return [];
      const results = await userService.searchUsersQuick(query);
      
      // Handle different response formats
      let userList: UserDto[] = [];
      if (Array.isArray(results)) {
        userList = results;
      } else if ((results as any)?.items && Array.isArray((results as any).items)) {
        userList = (results as any).items;
      } else if ((results as any)?.data && Array.isArray((results as any).data)) {
        userList = (results as any).data;
      }
      
      return userList.map(user => ({
        id: user.id,
        label: `${user.firstName} ${user.lastName}`,
        sublabel: user.email
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  // Helper function to get user name by ID
  const getUserName = (userId: string): string => {
    if (!userId) return 'No leader assigned';
    if (!Array.isArray(initialUsers)) return team?.leaderName || 'Unknown user';
    const user = initialUsers.find((u: UserDto) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : team?.leaderName || 'Unknown user';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }

    if (!formData.leaderId.trim()) {
      newErrors.leaderId = 'Team leader is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      let savedTeam: TeamDto;
      
      if (mode === 'edit' && team) {
        const updateData: UpdateTeamDto = {
          name: formData.name,
          description: formData.description,
          leaderId: formData.leaderId,
          isActive: formData.isActive
        };
        savedTeam = await teamService.updateTeam(team.id, updateData);
        success('Team updated successfully!');
      } else {
        const createData: CreateTeamDto = {
          name: formData.name,
          description: formData.description,
          leaderId: formData.leaderId,
          isActive: formData.isActive
        };
        savedTeam = await teamService.createTeam(createData);
        success('Team created successfully!');
      }

      if (onSave) {
        onSave(savedTeam);
      }
    } catch (error: any) {
      console.error('Error saving team:', error);
      showError(error.message || 'Failed to save team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-xl shadow-lg">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isCreate ? 'New Team' : isEdit ? 'Edit Team' : 'View Team'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isCreate ? 'Create a new team' : isEdit ? 'Modify team details' : 'Team information'}
                </p>
                {/* Debug info for development */}
                {isReadOnly && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mode: {mode} | Has Team: {team ? 'Yes' : 'No'} | Name: "{formData.name}"
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      {loadingInitialData ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading form data..." />
          </div>
        </div>
      ) : (
        <>
          {dataError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{dataError}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <form id="team-form" onSubmit={handleSubmit} className="space-y-8 p-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isReadOnly}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                          placeholder="Enter team name"
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Team Leader */}
                    <div className="md:col-span-2">
                      <label htmlFor="leaderId" className="block text-sm font-medium text-gray-700 mb-2">
                        Team Leader *
                      </label>
                      {isReadOnly ? (
                        <div className="relative">
                          <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <div className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                            {getUserName(formData.leaderId)}
                          </div>
                        </div>
                      ) : (
                        <SearchableSelect
                          placeholder="Search and select a team leader..."
                          value={formData.leaderId}
                          onChange={(value) => setFormData(prev => ({ ...prev, leaderId: value }))}
                          onSearch={searchUsers}
                          icon={<Crown className="w-5 h-5" />}
                          error={errors.leaderId}
                          minSearchLength={2}
                          initialOptions={Array.isArray(initialUsers) ? initialUsers.map(user => ({
                            id: user.id,
                            label: `${user.firstName} ${user.lastName}`,
                            sublabel: user.email
                          })) : []}
                          className="w-full"
                        />
                      )}
                      {errors.leaderId && !isReadOnly && <p className="mt-1 text-sm text-red-600">{errors.leaderId}</p>}
                    </div>

                    {/* Is Active */}
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          disabled={isReadOnly}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:bg-gray-50"
                        />
                        <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-700">
                          Team is Active
                        </label>
                      </div>
                      <p className="ml-7 text-sm text-gray-500">When checked, the team will be active and visible to all users</p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleInputChange}
                          disabled={isReadOnly}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 resize-none"
                          placeholder="Enter team description (optional)"
                        />
                      </div>
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                )}
                
                {isReadOnly ? (
                  onEdit && (
                    <button
                      type="button"
                      onClick={onEdit}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Team
                    </button>
                  )
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Saving...' : (isCreate ? 'Create Team' : 'Update Team')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
