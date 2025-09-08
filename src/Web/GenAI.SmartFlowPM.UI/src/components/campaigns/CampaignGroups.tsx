'use client';

import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaign.service';
import { userService } from '../../services/user.service';
import { CampaignGroupDto, UserDto } from '@/types/api.types';
import { 
  Users, 
  User, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Eye, 
  X, 
  Trash2,
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserPlus,
  UserMinus,
  Building2
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import SearchableSelect from '@/components/common/SearchableSelect';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';

interface CampaignGroupsProps {
  onNewGroup: () => void;
  onEditGroup: (group: CampaignGroupDto) => void;
  onViewGroup: (group: CampaignGroupDto) => void;
  onBackClick: () => void;
}

// Campaign Group Card Component
interface CampaignGroupCardProps {
  group: CampaignGroupDto;
  onEdit: (group: CampaignGroupDto) => void;
  onView: (group: CampaignGroupDto) => void;
  onDelete: (group: CampaignGroupDto) => void;
  onManageUsers: (group: CampaignGroupDto) => void;
}

const CampaignGroupCard: React.FC<CampaignGroupCardProps> = ({ 
  group, 
  onEdit, 
  onView, 
  onDelete,
  onManageUsers 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserCount = () => {
    return group.users ? group.users.length : 0;
  };

  const getActiveUserCount = () => {
    // Since CampaignTargetUserDto might not have isActive, assume all are active
    return group.users ? group.users.length : 0;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Group Status Indicator */}
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-blue-100 text-blue-700 border-blue-200">
              <Users className="w-3 h-3 mr-1" />
              Active
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {group.name}
            </h3>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(group)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onEdit(group)}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit Group"
          >
            <Edit className="w-5 h-5" />
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              title="More Actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    onManageUsers(group);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Manage Users</span>
                </button>
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      onDelete(group);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Group</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1">
        {/* Group Name and Description */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 mb-1">{group.name}</h4>
            <p className="text-sm text-gray-600 break-words">
              {group.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span>{getUserCount()} total user{getUserCount() !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
            <span>{getActiveUserCount()} active</span>
          </div>
        </div>

        {/* User Preview */}
        {group.users && group.users.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent Users
            </div>
            <div className="space-y-1">
              {group.users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-2 text-sm">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-700 truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                </div>
              ))}
              {group.users.length > 3 && (
                <div className="text-xs text-gray-500 pl-8">
                  +{group.users.length - 3} more users
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Created {formatDate(group.createdAt)}</span>
          </div>
          {group.updatedAt && (
            <span>Updated {formatDate(group.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main CampaignGroups Component
export const CampaignGroups: React.FC<CampaignGroupsProps> = ({
  onNewGroup,
  onEditGroup,
  onViewGroup,
  onBackClick
}) => {
  const [groups, setGroups] = useState<CampaignGroupDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 12; // Optimal for card grid display

  // Load initial users on component mount
  useEffect(() => {
    loadInitialUsers();
  }, []);

  // Load groups data
  useEffect(() => {
    loadGroups();
  }, [currentPage, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      
      const result = await campaignService.getCampaignGroups(searchTerm);
      const groupList = Array.isArray(result) ? result : [];
      
      setGroups(groupList);
      setTotalCount(groupList.length);
      setTotalPages(Math.ceil(groupList.length / pageSize));
    } catch (error) {
      console.error('Error loading campaign groups:', error);
      setGroups([]);
      setTotalCount(0);
      setTotalPages(0);
      showError('Failed to load campaign groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadInitialUsers = async () => {
    try {
      setLoadingUsers(true);
      const result = await userService.getUsers(1, 50);
      
      let userList: UserDto[] = [];
      if (Array.isArray(result)) {
        userList = result;
      } else if ((result as any).items && Array.isArray((result as any).items)) {
        userList = (result as any).items;
      } else if ((result as any).data && Array.isArray((result as any).data)) {
        userList = (result as any).data;
      }
      
      setInitialUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      setInitialUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteGroup = async (group: CampaignGroupDto) => {
    showConfirmation({
      title: 'Delete Campaign Group',
      message: `Are you sure you want to delete "${group.name}"? This action cannot be undone and will remove the group from all associated campaigns.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await campaignService.deleteCampaignGroup(group.id);
          success('Campaign group deleted successfully');
          loadGroups();
        } catch (error) {
          console.error('Error deleting campaign group:', error);
          showError('Failed to delete campaign group. Please try again.');
        }
      }
    });
  };

  const handleManageUsers = (group: CampaignGroupDto) => {
    // This would open a modal or navigate to user management
    console.log('Manage users for group:', group.id);
    // TODO: Implement user management functionality
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getFilteredResultsText = () => {
    const groupsArray = Array.isArray(groups) ? groups : [];
    if (totalCount === 0) {
      return searchTerm ? `No groups match "${searchTerm}"` : 'No campaign groups found';
    }
    
    // Calculate items shown on current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCount);
    const itemsOnCurrentPage = Math.min(pageSize, totalCount - startIndex);
    
    let text = `Showing ${itemsOnCurrentPage} of ${totalCount} group${totalCount !== 1 ? 's' : ''}`;
    if (searchTerm) {
      text += ` matching "${searchTerm}"`;
    }
    return text;
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Campaign Groups</h1>
                <p className="text-sm text-gray-600">Manage target user groups for campaigns</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewGroup}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>

            <button
              onClick={onBackClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Box */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Clear Search */}
            {searchTerm && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {getFilteredResultsText()}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          // Loading State
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (Array.isArray(groups) && groups.length === 0) ? (
          // Empty State
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md mx-auto px-4">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaign Groups Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No groups match "${searchTerm}"` : 'Get started by creating your first campaign group'}
              </p>
              <button
                onClick={onNewGroup}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Group</span>
              </button>
            </div>
          </div>
        ) : (
          // Groups Grid
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {Array.isArray(groups) ? groups
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((group) => (
                <CampaignGroupCard
                  key={group.id}
                  group={group}
                  onEdit={onEditGroup}
                  onView={onViewGroup}
                  onDelete={handleDeleteGroup}
                  onManageUsers={handleManageUsers}
                />
              )) : null}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="groups"
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      {confirmationModal}
    </div>
  );
};

export default CampaignGroups;
