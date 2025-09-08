'use client';

import React, { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaign.service';
import { userService } from '@/services/user.service';
import { CampaignGroupDto, UserDto } from '@/types/api.types';
import { CreateCampaignGroupRequest, UpdateCampaignGroupRequest } from '@/services/campaign.service';
import { 
  Save, 
  X, 
  Users, 
  FileText, 
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Search
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import SearchableSelect from '@/components/common/SearchableSelect';

interface CampaignGroupFormProps {
  mode: 'create' | 'edit';
  groupId?: string;
  onSave: (group: CampaignGroupDto) => void;
  onCancel: () => void;
}

const CampaignGroupForm: React.FC<CampaignGroupFormProps> = ({
  mode,
  groupId,
  onSave,
  onCancel
}) => {
  const { success, error: showError } = useToast();
  
  // Form state
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    userIds: [] as string[]
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Data state
  const [availableUsers, setAvailableUsers] = useState<UserDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load group data for edit mode
  useEffect(() => {
    if (mode === 'edit' && groupId) {
      loadGroupData();
    }
    loadAvailableUsers();
  }, [mode, groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const group = await campaignService.getCampaignGroupById(groupId!);
      
      // Handle both users array and targetUserIds array
      const userIds = group.users?.map(u => u.id) || group.targetUserIds || [];
      
      setFormData({
        name: group.name,
        description: group.description || '',
        userIds: userIds
      });
      
      // Convert user data to UserDto format for selected users
      if (group.users && group.users.length > 0) {
        // If we have full user objects
        const groupUsers: UserDto[] = group.users.map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          isActive: true,
          hasReportee: user.hasReportees || false,
          tenantId: '',
          createdAt: new Date(),
          createdBy: '',
          roles: []
        }));
        setSelectedUsers(groupUsers);
      } else if (group.targetUserIds && group.targetUserIds.length > 0) {
        // If we only have user IDs, fetch the user details
        await loadUsersFromIds(group.targetUserIds);
      } else {
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Error loading group:', error);
      showError('Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsersFromIds = async (userIds: string[]) => {
    try {
      const userPromises = userIds.map(async (userId) => {
        try {
          return await userService.getUserById(userId);
        } catch (error) {
          console.error(`Error loading user ${userId}:`, error);
          return null;
        }
      });
      
      const users = await Promise.all(userPromises);
      const validUsers = users.filter((user): user is UserDto => user !== null);
      setSelectedUsers(validUsers);
    } catch (error) {
      console.error('Error loading users from IDs:', error);
      showError('Failed to load user details');
    }
  };

  const loadAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      const result = await userService.getUsers(1, 50);
      
      let userList: UserDto[] = [];
      if (Array.isArray(result)) {
        userList = result;
      } else if ((result as any).items && Array.isArray((result as any).items)) {
        userList = (result as any).items;
      }
      
      setAvailableUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      if (!query.trim()) return [];
      const results = await userService.searchUsersQuick(query);
      
      let userList: UserDto[] = [];
      if (Array.isArray(results)) {
        userList = results;
      } else if ((results as any)?.items && Array.isArray((results as any).items)) {
        userList = (results as any).items;
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Group description is required';
    }

    if (formData.userIds.length === 0) {
      newErrors.users = 'At least one user must be added to the group';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (mode === 'create') {
        const createDto: CreateCampaignGroupRequest = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          userIds: formData.userIds
        };

        const newGroup = await campaignService.createCampaignGroup(createDto);
        success('Campaign group created successfully');
        onSave(newGroup);
      } else {
        const updateDto: UpdateCampaignGroupRequest = {
          id: groupId!,
          name: formData.name.trim(),
          description: formData.description.trim(),
          userIds: formData.userIds
        };

        const updatedGroup = await campaignService.updateCampaignGroup(updateDto);
        success('Campaign group updated successfully');
        onSave(updatedGroup);
      }
    } catch (error) {
      console.error('Error saving group:', error);
      showError(`Failed to ${mode === 'create' ? 'create' : 'update'} group`);
    } finally {
      setSaving(false);
    }
  };

  const handleUserAdd = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user && !formData.userIds.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        userIds: [...prev.userIds, userId]
      }));
      setSelectedUsers(prev => [...prev, user]);
      // Clear validation error
      if (errors.users) {
        setErrors(prev => ({ ...prev, users: '' }));
      }
    }
  };

  const handleUserRemove = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.filter(id => id !== userId)
    }));
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading group data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Create New Group' : 'Edit Group'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'create' 
                  ? 'Create a user group for campaign targeting'
                  : 'Update group details and members'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>

            {/* Group Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter group name"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Group Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose of this group"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Group Members */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
            </div>

            {/* User Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Users *
              </label>
              <SearchableSelect
                placeholder="Search and select users..."
                value=""
                onChange={handleUserAdd}
                onSearch={searchUsers}
                icon={<Search className="w-4 h-4" />}
                minSearchLength={2}
                initialOptions={availableUsers
                  .filter(user => !formData.userIds.includes(user.id))
                  .map(user => ({
                    id: user.id,
                    label: `${user.firstName} ${user.lastName}`,
                    sublabel: user.email
                  }))
                }
                className="text-sm"
                showClearButton={false}
              />
              {errors.users && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.users}</span>
                </div>
              )}
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Users ({selectedUsers.length})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUserRemove(user.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                        title="Remove user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px]"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Group' : 'Update Group'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignGroupForm;
