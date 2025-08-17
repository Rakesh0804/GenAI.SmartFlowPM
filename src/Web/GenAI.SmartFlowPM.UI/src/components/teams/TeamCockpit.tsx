'use client';

import React, { useState, useEffect } from 'react';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';
import { TeamDto, UserDto, PaginatedResponse, TeamMemberRole } from '@/types/api.types';
import { Users, Calendar, User, Clock, Search, Filter, Plus, MoreVertical, Edit, Eye, X, Crown, UserCheck, Building2, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TeamCockpitProps {
  onNewTeam: () => void;
  onEditTeam: (team: TeamDto) => void;
  onViewTeam: (team: TeamDto) => void;
  onBackClick: () => void;
}

// Team Card Component
interface TeamCardProps {
  team: TeamDto;
  onEdit: (team: TeamDto) => void;
  onView: (team: TeamDto) => void;
  onDelete: (team: TeamDto) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onEdit, onView, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? {
      text: 'Active',
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle className="w-3 h-3" />
    } : {
      text: 'Inactive',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: <XCircle className="w-3 h-3" />
    };
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    if (team.taskCount === 0) return 0;
    return Math.round((team.completedTaskCount / team.taskCount) * 100);
  };

  const handleToggleStatus = () => {
    // TODO: Implement toggle status functionality
    console.log('Toggle status for team:', team.id);
  };

  const handleDelete = () => {
    onDelete(team);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Team Status Badge */}
            {(() => {
              const statusBadge = getStatusBadge(team.isActive);
              return (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusBadge.className}`}>
                  {statusBadge.icon}
                  <span className="ml-1">{statusBadge.text}</span>
                </span>
              );
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {team.name}
            </h3>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(team)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onEdit(team)}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit Team"
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
                    handleToggleStatus();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Change Status</span>
                </button>
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Delete Team</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1">
        {/* Team Name and Description */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 mb-1">{team.name}</h4>
            <p className="text-sm text-gray-600 break-words">
              {team.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Team Leader */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Crown className="w-4 h-4 flex-shrink-0 text-yellow-500" />
          <span className="truncate">Leader: {team.leaderName}</span>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span>{team.memberCount} member{team.memberCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Building2 className="w-4 h-4 flex-shrink-0 text-green-500" />
            <span>{team.projectCount} project{team.projectCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Task Progress</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {team.completedTaskCount} of {team.taskCount} tasks completed
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Card Footer - Always at bottom */}
      <div className="px-4 py-3 bg-gray-50 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Created {formatDate(team.createdAt)}</span>
          </div>
          {team.updatedAt && (
            <span>Updated {formatDate(team.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main TeamCockpit Component
export const TeamCockpit: React.FC<TeamCockpitProps> = ({
  onNewTeam,
  onEditTeam,
  onViewTeam,
  onBackClick
}) => {
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterLeader, setFilterLeader] = useState<string>('');
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 12; // Optimal for card grid display

  // Load initial users on component mount
  useEffect(() => {
    loadInitialUsers();
  }, []);

  // Load teams data
  useEffect(() => {
    loadTeams();
  }, [currentPage, searchTerm, filterStatus, filterLeader]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterStatus, filterLeader]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      
      let result: any;
      
      if (searchTerm) {
        result = await teamService.searchTeams(searchTerm, currentPage, pageSize);
      } else {
        result = await teamService.getTeams(currentPage, pageSize);
      }
      
      // Handle different response structures
      let teamList: TeamDto[] = [];
      let total = 0;
      
      if (Array.isArray(result)) {
        teamList = result;
        total = result.length;
      } else if ((result as any).items && Array.isArray((result as any).items)) {
        teamList = (result as any).items;
        total = (result as any).totalCount || teamList.length;
      } else if ((result as any).data && Array.isArray((result as any).data)) {
        teamList = (result as any).data;
        total = (result as any).totalCount || teamList.length;
      }
      
      // Apply client-side filters if needed
      if (filterStatus || filterLeader) {
        teamList = teamList.filter(team => {
          if (filterStatus === 'active' && !team.isActive) return false;
          if (filterStatus === 'inactive' && team.isActive) return false;
          if (filterLeader && team.leaderId !== filterLeader) return false;
          return true;
        });
      }
      
      setTeams(teamList);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      console.error('Error loading teams:', error);
      setTeams([]);
      setTotalCount(0);
      setTotalPages(0);
      showError('Failed to load teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadInitialUsers = async () => {
    try {
      setLoadingUsers(true);
      const result = await userService.getUsers(1, 50); // Get first 50 users for filter
      
      // Handle different response structures
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

  // Search functions for SearchableSelect
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

  const handleDeleteTeam = async (team: TeamDto) => {
    showConfirmation({
      title: 'Delete Team',
      message: `Are you sure you want to delete "${team.name}"? This action cannot be undone and will remove all team associations.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await teamService.deleteTeam(team.id);
          success('Team deleted successfully');
          // Refresh the team list
          loadTeams();
        } catch (error) {
          console.error('Error deleting team:', error);
          showError('Failed to delete team. Please try again.');
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterLeader('');
    setCurrentPage(1);
  };

  const getFilteredResultsText = () => {
    const teamsArray = Array.isArray(teams) ? teams : [];
    if (totalCount === 0) {
      return searchTerm ? `No teams match "${searchTerm}"` : 'No teams found';
    }
    
    let text = `Showing ${teamsArray.length} of ${totalCount} team${totalCount !== 1 ? 's' : ''}`;
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
                <h1 className="text-2xl font-bold text-gray-900">Team Cockpit</h1>
                <p className="text-sm text-gray-600">Manage teams and collaboration</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewTeam}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Team</span>
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
                  placeholder="Search teams..."
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
                  {/* Filter Badge */}
                  {(searchTerm || filterStatus || filterLeader) && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border border-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">Filters</span>
                {/* Filter Count Badge */}
                {(searchTerm || filterStatus || filterLeader) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-1">
                    {[searchTerm, filterStatus, filterLeader].filter(Boolean).length}
                  </span>
                )}
              </div>
              
              <CustomSelect
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
                className="w-32"
                placeholder="All Status"
              />

              {/* Leader Filter */}
              <div className="w-48">
                <SearchableSelect
                  placeholder="All Leaders"
                  value={filterLeader}
                  onChange={setFilterLeader}
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

              {(searchTerm || filterStatus || filterLeader) && (
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
        ) : (Array.isArray(teams) && teams.length === 0) ? (
          // Empty State
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md mx-auto px-4">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No teams match "${searchTerm}"` : 'Get started by creating your first team'}
              </p>
              <button
                onClick={onNewTeam}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Team</span>
              </button>
            </div>
          </div>
        ) : (
          // Team Grid
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {Array.isArray(teams) ? teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={onEditTeam}
                  onView={onViewTeam}
                  onDelete={handleDeleteTeam}
                />
              )) : null}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="teams"
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

export default TeamCockpit;
