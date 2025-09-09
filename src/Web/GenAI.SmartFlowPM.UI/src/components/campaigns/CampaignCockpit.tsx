'use client';

import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaign.service';
import { userService } from '../../services/user.service';
import { CampaignDto, UserDto, CampaignStatus, CampaignType } from '@/types/api.types';
import { 
  Target, 
  Calendar, 
  User, 
  Clock, 
  Search, 
  Filter, 
  CirclePlus, 
  MoreVertical, 
  Edit, 
  Eye, 
  X, 
  Crown, 
  Users, 
  Building2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Star,
  Play,
  Pause,
  StopCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';

interface CampaignCockpitProps {
  onNewCampaign: () => void;
  onEditCampaign: (campaign: CampaignDto) => void;
  onViewCampaign: (campaign: CampaignDto) => void;
  onBackClick: () => void;
}

// Campaign Card Component
interface CampaignCardProps {
  campaign: CampaignDto;
  onEdit: (campaign: CampaignDto) => void;
  onView: (campaign: CampaignDto) => void;
  onStart: (campaign: CampaignDto) => void;
  onComplete: (campaign: CampaignDto) => void;
  onCancel: (campaign: CampaignDto) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onEdit, 
  onView, 
  onStart, 
  onComplete, 
  onCancel 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.Active:
        return {
          text: 'Active',
          className: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="w-3 h-3" />
        };
      case CampaignStatus.Completed:
        return {
          text: 'Completed',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <CheckCircle className="w-3 h-3" />
        };
      case CampaignStatus.Draft:
        return {
          text: 'Draft',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <AlertCircle className="w-3 h-3" />
        };
      case CampaignStatus.Paused:
        return {
          text: 'Paused',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Pause className="w-3 h-3" />
        };
      case CampaignStatus.Cancelled:
        return {
          text: 'Cancelled',
          className: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="w-3 h-3" />
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  const getTypeBadge = (type: CampaignType) => {
    switch (type) {
      case CampaignType.Performance:
        return {
          text: 'Performance',
          className: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case CampaignType.Training:
        return {
          text: 'Training',
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case CampaignType.Evaluation:
        return {
          text: 'Evaluation',
          className: 'bg-orange-50 text-orange-700 border-orange-200'
        };
      case CampaignType.Development:
        return {
          text: 'Development',
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-50 text-gray-700 border-gray-200'
        };
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    // This would be calculated based on evaluation progress
    // For now, return a mock progress
    return Math.floor(Math.random() * 100);
  };

  const getDaysRemaining = () => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusActions = () => {
    switch (campaign.status) {
      case CampaignStatus.Draft:
        return [
          {
            label: 'Start Campaign',
            action: () => onStart(campaign),
            icon: <Play className="w-4 h-4" />,
            className: 'text-green-600 hover:bg-green-50'
          }
        ];
      case CampaignStatus.Active:
        return [
          {
            label: 'Complete Campaign',
            action: () => onComplete(campaign),
            icon: <CheckCircle className="w-4 h-4" />,
            className: 'text-blue-600 hover:bg-blue-50'
          },
          {
            label: 'Cancel Campaign',
            action: () => onCancel(campaign),
            icon: <StopCircle className="w-4 h-4" />,
            className: 'text-red-600 hover:bg-red-50'
          }
        ];
      default:
        return [];
    }
  };

  const statusBadge = getStatusBadge(campaign.status);
  const typeBadge = getTypeBadge(campaign.type);
  const progress = calculateProgress();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Campaign Type Badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${typeBadge.className}`}>
              {typeBadge.text}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 ml-auto">
          <button
            onClick={() => onView(campaign)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(campaign)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit Campaign"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {getStatusActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${action.className}`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
                
                {getStatusActions().length > 0 && (
                  <div className="border-t border-gray-100"></div>
                )}
                
                <button
                  onClick={() => {
                    // Handle additional actions
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1">
        {/* Campaign Name */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 leading-tight">{campaign.title}</h4>
          </div>
        </div>

        {/* Campaign Description */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 break-words">
            {campaign.description || 'No description provided'}
          </p>
        </div>

        {/* Campaign Status */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusBadge.className}`}>
            {statusBadge.icon}
            <span className="ml-1">{statusBadge.text}</span>
          </span>
        </div>

        {/* Campaign Dates */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span className="truncate">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </span>
          </div>
          {daysRemaining > 0 && campaign.status === CampaignStatus.Active && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 flex-shrink-0 text-orange-500" />
              <span>{daysRemaining} days remaining</span>
            </div>
          )}
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Crown className="w-4 h-4 flex-shrink-0 text-yellow-500" />
            <span>{campaign.assignedManagers?.length || 0} manager{(campaign.assignedManagers?.length || 0) !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0 text-green-500" />
            <span>{campaign.targetUserGroups?.length || 0} group{(campaign.targetUserGroups?.length || 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {campaign.status === CampaignStatus.Active && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Evaluation Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
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
            <span>Created {formatDate(campaign.createdAt)}</span>
          </div>
          {campaign.updatedAt && (
            <span>Updated {formatDate(campaign.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main CampaignCockpit Component
export const CampaignCockpit: React.FC<CampaignCockpitProps> = ({
  onNewCampaign,
  onEditCampaign,
  onViewCampaign,
  onBackClick
}) => {
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterManager, setFilterManager] = useState<string>('');
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 12; // Optimal for card grid display

  // Load initial users on component mount
  useEffect(() => {
    loadInitialUsers();
  }, []);

  // Load campaigns data
  useEffect(() => {
    loadCampaigns();
  }, [currentPage, searchTerm, filterStatus, filterType, filterManager]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterStatus, filterType, filterManager]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      
      const filters = {
        searchTerm: searchTerm || undefined,
        status: filterStatus ? parseInt(filterStatus) : undefined,
        type: filterType ? parseInt(filterType) : undefined,
        pageNumber: currentPage,
        pageSize: pageSize
      };

      const result = await campaignService.getCampaigns(filters);
      const campaignList = Array.isArray(result) ? result : [];
      
      // Apply client-side manager filter if needed
      let filteredCampaigns = campaignList;
      if (filterManager) {
        filteredCampaigns = campaignList.filter(campaign =>
          campaign.assignedManagers?.some(manager => manager.id === filterManager) || false
        );
      }
      
      setCampaigns(filteredCampaigns);
      setTotalCount(filteredCampaigns.length);
      setTotalPages(Math.ceil(filteredCampaigns.length / pageSize));
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setCampaigns([]);
      setTotalCount(0);
      setTotalPages(0);
      showError('Failed to load campaigns. Please try again.');
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

  const searchUsers = async (query: string) => {
    try {
      if (!query.trim()) return [];
      const results = await userService.searchUsersQuick(query);
      
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

  const handleStartCampaign = async (campaign: CampaignDto) => {
    showConfirmation({
      title: 'Start Campaign',
      message: `Are you sure you want to start "${campaign.title}"? This will make the campaign active and begin the evaluation process.`,
      confirmText: 'Start Campaign',
      onConfirm: async () => {
        try {
          await campaignService.startCampaign(campaign.id);
          success('Campaign started successfully');
          loadCampaigns();
        } catch (error) {
          console.error('Error starting campaign:', error);
          showError('Failed to start campaign. Please try again.');
        }
      }
    });
  };

  const handleCompleteCampaign = async (campaign: CampaignDto) => {
    showConfirmation({
      title: 'Complete Campaign',
      message: `Are you sure you want to complete "${campaign.title}"? This will finalize all evaluations and mark the campaign as completed.`,
      confirmText: 'Complete Campaign',
      onConfirm: async () => {
        try {
          await campaignService.completeCampaign(campaign.id);
          success('Campaign completed successfully');
          loadCampaigns();
        } catch (error) {
          console.error('Error completing campaign:', error);
          showError('Failed to complete campaign. Please try again.');
        }
      }
    });
  };

  const handleCancelCampaign = async (campaign: CampaignDto) => {
    showConfirmation({
      title: 'Cancel Campaign',
      message: `Are you sure you want to cancel "${campaign.title}"? This action cannot be undone and will stop all evaluation activities.`,
      confirmText: 'Cancel Campaign',
      onConfirm: async () => {
        try {
          await campaignService.cancelCampaign(campaign.id);
          success('Campaign cancelled successfully');
          loadCampaigns();
        } catch (error) {
          console.error('Error cancelling campaign:', error);
          showError('Failed to cancel campaign. Please try again.');
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
    setFilterManager('');
    setCurrentPage(1);
  };

  const getFilteredResultsText = () => {
    const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
    if (totalCount === 0) {
      return searchTerm ? `No campaigns match "${searchTerm}"` : 'No campaigns found';
    }
    
    let text = `Showing ${campaignsArray.length} of ${totalCount} campaign${totalCount !== 1 ? 's' : ''}`;
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
                <Target className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campaign Cockpit</h1>
                <p className="text-sm text-gray-600">Manage campaigns and evaluations</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewCampaign}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <CirclePlus className="w-4 h-4" />
              <span>New Campaign</span>
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

        {/* Filters and Search Section */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Box */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Filter className="text-gray-400 w-4 h-4" />
                  {(searchTerm || filterStatus || filterType || filterManager) && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border border-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">Filters</span>
                {(searchTerm || filterStatus || filterType || filterManager) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-1">
                    {[searchTerm, filterStatus, filterType, filterManager].filter(Boolean).length}
                  </span>
                )}
              </div>
              
              {/* Status Filter */}
              <CustomSelect
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: CampaignStatus.Draft.toString(), label: 'Draft' },
                  { value: CampaignStatus.Active.toString(), label: 'Active' },
                  { value: CampaignStatus.Completed.toString(), label: 'Completed' },
                  { value: CampaignStatus.Paused.toString(), label: 'Paused' },
                  { value: CampaignStatus.Cancelled.toString(), label: 'Cancelled' }
                ]}
                className="w-32"
                placeholder="All Status"
              />

              {/* Type Filter */}
              <CustomSelect
                value={filterType}
                onChange={(value) => setFilterType(value)}
                options={[
                  { value: '', label: 'All Types' },
                  { value: CampaignType.Performance.toString(), label: 'Performance' },
                  { value: CampaignType.Training.toString(), label: 'Training' },
                  { value: CampaignType.Evaluation.toString(), label: 'Evaluation' },
                  { value: CampaignType.Development.toString(), label: 'Development' }
                ]}
                className="w-32"
                placeholder="All Types"
              />

              {/* Manager Filter */}
              <div className="w-48">
                <SearchableSelect
                  placeholder="All Managers"
                  value={filterManager}
                  onChange={setFilterManager}
                  onSearch={searchUsers}
                  icon={<Crown className="w-4 h-4" />}
                  minSearchLength={2}
                  initialOptions={Array.isArray(initialUsers) ? initialUsers.map(user => ({
                    id: user.id,
                    label: `${user.firstName} ${user.lastName}`,
                    sublabel: user.email
                  })) : []}
                  className="text-sm"
                  showClearButton={true}
                />
              </div>

              {(searchTerm || filterStatus || filterType || filterManager) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
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
        ) : (Array.isArray(campaigns) && campaigns.length === 0) ? (
          // Empty State
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md mx-auto px-4">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No campaigns match "${searchTerm}"` : 'Get started by creating your first campaign'}
              </p>
              <button
                onClick={onNewCampaign}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <CirclePlus className="w-4 h-4" />
                <span>Create First Campaign</span>
              </button>
            </div>
          </div>
        ) : (
          // Campaign Grid
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {Array.isArray(campaigns) ? campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={onEditCampaign}
                  onView={onViewCampaign}
                  onStart={handleStartCampaign}
                  onComplete={handleCompleteCampaign}
                  onCancel={handleCancelCampaign}
                />
              )) : null}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="campaigns"
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

export default CampaignCockpit;
