'use client';

import React, { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaign.service';
import { userService } from '@/services/user.service';
import { CampaignGroupDto, UserDto } from '@/types/api.types';
import { 
  Users, 
  User, 
  Calendar, 
  Clock, 
  Edit, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building2,
  Activity,
  TrendingUp,
  BarChart3,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';
import { Pagination } from '@/components/common/Pagination';

interface CampaignGroupDetailsProps {
  groupId: string;
  onEdit: () => void;
  onBack: () => void;
}

const CampaignGroupDetails: React.FC<CampaignGroupDetailsProps> = ({
  groupId,
  onEdit,
  onBack
}) => {
  const [group, setGroup] = useState<CampaignGroupDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [managerName, setManagerName] = useState<string>('');
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 9;

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  useEffect(() => {
    if (group?.targetUserIds?.length || group?.users?.length) {
      loadUserDetails();
    }
  }, [group, currentPage]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const groupData = await campaignService.getCampaignGroupById(groupId);
      setGroup(groupData);
      
      // Load manager details if managerId exists
      if (groupData.managerId) {
        loadManagerDetails(groupData.managerId);
      }
    } catch (error) {
      console.error('Error loading group details:', error);
      showError('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const loadManagerDetails = async (managerId: string) => {
    try {
      const manager = await userService.getUserById(managerId);
      setManagerName(`${manager.firstName} ${manager.lastName}`);
    } catch (error) {
      console.error('Error loading manager details:', error);
      setManagerName('Unknown Manager');
    }
  };

  const loadUserDetails = async () => {
    const userIds = group?.targetUserIds || group?.users?.map((u: any) => u.id || u.userId) || [];
    if (!userIds.length) return;
    
    try {
      setLoadingUsers(true);
      // Calculate pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const currentUserIds = userIds.slice(startIndex, endIndex);
      
      // Fetch user details for current page
      const userPromises = currentUserIds.map(async (userId: string) => {
        try {
          return await userService.getUserById(userId);
        } catch (error) {
          console.error(`Error loading user ${userId}:`, error);
          return null;
        }
      });
      
      const usersData = await Promise.all(userPromises);
      setUsers(usersData.filter((user: UserDto | null) => user !== null) as UserDto[]);
      setTotalPages(Math.ceil(userIds.length / pageSize));
    } catch (error) {
      console.error('Error loading user details:', error);
      showError('Failed to load user details');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!group) return;

    showConfirmation({
      title: 'Delete Campaign Group',
      message: `Are you sure you want to delete "${group.name}"? This will remove the group and all its associations with campaigns.`,
      confirmText: 'Delete Group',
      onConfirm: async () => {
        try {
          await campaignService.deleteCampaignGroup(groupId);
          success('Campaign group deleted successfully');
          onBack(); // Navigate back to groups list
        } catch (error) {
          console.error('Error deleting group:', error);
          showError('Failed to delete group');
        }
      }
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-8 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
                <p className="text-lg text-gray-700 mb-4 max-w-2xl">
                  {group.description || 'No description provided'}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{group.targetUserIds?.length || group.users?.length || 0} member{((group.targetUserIds?.length || group.users?.length || 0) !== 1) ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(group.createdAt)}</span>
                  </div>
                  {group.updatedAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {formatDate(group.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              <button
                onClick={handleSoftDelete}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Group Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{group.targetUserIds?.length || group.users?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Evaluations</p>
              <p className="text-2xl font-bold text-gray-900">{group.completedEvaluations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Evaluations</p>
              <p className="text-2xl font-bold text-gray-900">{group.pendingEvaluations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{group.progressPercentage || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Group Status</p>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Members */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Group Members</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {group.targetUserIds?.length || group.users?.length || 0}
              </span>
            </div>
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Manage Members
            </button>
          </div>
        </div>
        <div className="p-6">
          {((group.targetUserIds?.length || 0) > 0 || (group.users?.length || 0) > 0) ? (
            <>
              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Loading users...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName || ''} {user.lastName || ''}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{user.email || 'No email'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {user.hasReportee && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Manager
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {user.roles && user.roles.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {user.roles[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={group.targetUserIds?.length || group.users?.length || 0}
                pageSize={pageSize}
                itemName="members"
                onPageChange={setCurrentPage}
                loading={loadingUsers}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Members</h3>
              <p className="mt-1 text-sm text-gray-500">This group doesn't have any members yet.</p>
              <button
                onClick={onEdit}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Members
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Group Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Group Information</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Created</h4>
              <p className="text-sm text-gray-900">{formatDate(group.createdAt)}</p>
            </div>
            {group.updatedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h4>
                <p className="text-sm text-gray-900">{formatDate(group.updatedAt)}</p>
              </div>
            )}
            {group.campaignId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Campaign ID</h4>
                <p className="text-sm text-gray-900 font-mono">{group.campaignId}</p>
              </div>
            )}
            {group.managerId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Manager</h4>
                <p className="text-sm text-gray-900">{managerName || 'Loading...'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal}
    </div>
  );
};

export default CampaignGroupDetails;
