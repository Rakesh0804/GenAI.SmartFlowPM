'use client';

import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/project.service';
import { userService } from '../../services/user.service';
import { ProjectDto, ProjectStatus, ProjectPriority, PaginatedResponse, UserDto } from '@/types/api.types';
import { FolderOpen, Calendar, User, Clock, Search, Filter, CirclePlus, MoreVertical, Edit, Eye, X, Flag, Building2, CheckCircle, XCircle, AlertCircle, PlayCircle, PauseCircle, DollarSign, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ProjectCockpitProps {
  onNewProject: () => void;
  onEditProject: (project: ProjectDto) => void;
  onViewProject: (project: ProjectDto) => void;
  onBackClick: () => void;
}

// Project Card Component
interface ProjectCardProps {
  project: ProjectDto;
  onEdit: (project: ProjectDto) => void;
  onView: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onView, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Planning:
        return {
          text: 'Planning',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <AlertCircle className="w-3 h-3" />
        };
      case ProjectStatus.InProgress:
        return {
          text: 'In Progress',
          className: 'bg-primary-100 text-primary-700 border-primary-200',
          icon: <PlayCircle className="w-3 h-3" />
        };
      case ProjectStatus.OnHold:
        return {
          text: 'On Hold',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <PauseCircle className="w-3 h-3" />
        };
      case ProjectStatus.Completed:
        return {
          text: 'Completed',
          className: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="w-3 h-3" />
        };
      case ProjectStatus.Cancelled:
        return {
          text: 'Cancelled',
          className: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="w-3 h-3" />
        };
      default:
        return {
          text: 'Planning',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  const getPriorityBadge = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.Low:
        return {
          text: 'Low',
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case ProjectPriority.Medium:
        return {
          text: 'Medium',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
      case ProjectPriority.High:
        return {
          text: 'High',
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      case ProjectPriority.Critical:
        return {
          text: 'Critical',
          className: 'bg-red-100 text-red-700 border-red-200'
        };
      default:
        return {
          text: 'Medium',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
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

  const isOverdue = (endDate?: Date) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date() && project.status !== ProjectStatus.Completed;
  };

  const calculateProgress = () => {
    if (project.taskCount === 0) return 0;
    return Math.round((project.completedTaskCount / project.taskCount) * 100);
  };

  const handleToggleStatus = () => {
    // TODO: Implement toggle status functionality
    console.log('Toggle status for project:', project.id);
  };

  const handleDelete = () => {
    onDelete(project);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Project Priority Badge */}
            {(() => {
              const priorityBadge = getPriorityBadge(project.priority);
              return (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityBadge.className}`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {priorityBadge.text}
                </span>
              );
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {project.name}
            </h3>
            <p className="text-xs text-gray-500">#{project.id.substring(0, 8)}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 ml-auto">
          <button
            onClick={() => onView(project)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit Project"
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
                <button
                  onClick={() => {
                    handleToggleStatus();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <PauseCircle className="w-4 h-4" />
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
                    <span>Delete Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1">
        {/* Description */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-900 break-words">
              {project.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Manager */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4 flex-shrink-0 text-primary-500" />
          <span className="truncate">Manager: {project.managerName}</span>
        </div>

        {/* Client Name */}
        {project.clientName && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 flex-shrink-0 text-purple-500" />
            <span className="truncate">Client: <span className="font-bold text-gray-900">{project.clientName}</span></span>
          </div>
        )}

        {/* Team & Tasks Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span>{project.teamMemberCount} member{project.teamMemberCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Building2 className="w-4 h-4 flex-shrink-0 text-green-500" />
            <span>{project.taskCount} task{project.taskCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Status:</span>
          {(() => {
            const statusBadge = getStatusBadge(project.status);
            return (
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusBadge.className}`}>
                {statusBadge.icon}
                <span className="ml-1">{statusBadge.text}</span>
              </span>
            );
          })()}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {project.completedTaskCount} of {project.taskCount} tasks completed
          </p>
        </div>

        {/* Budget & Dates */}
        <div className="space-y-2">
          {project.budget && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Budget: ${project.budget.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className={`${isOverdue(project.endDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {project.endDate ? `Due ${formatDate(project.endDate)}` : 'No due date'}
              {isOverdue(project.endDate) && ' (Overdue)'}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Card Footer - Always at bottom */}
      <div className="px-4 py-3 bg-gray-50 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          {project.updatedAt && (
            <span>Updated {formatDate(project.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main ProjectCockpit Component
export const ProjectCockpit: React.FC<ProjectCockpitProps> = ({
  onNewProject,
  onEditProject,
  onViewProject,
  onBackClick
}) => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<ProjectPriority | ''>('');
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

  // Load projects data
  useEffect(() => {
    loadProjects();
  }, [currentPage, searchTerm, filterStatus, filterPriority, filterManager]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterStatus, filterPriority, filterManager]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // For now, use simple getProjects call since filters would need API support
      let result: any;
      
      if (searchTerm) {
        result = await projectService.searchProjects(searchTerm, currentPage, pageSize);
      } else {
        result = await projectService.getProjects(currentPage, pageSize);
      }
      
      // Handle different response structures
      let projectList: ProjectDto[] = [];
      let total = 0;
      
      if (Array.isArray(result)) {
        projectList = result;
        total = result.length;
      } else if ((result as any).items && Array.isArray((result as any).items)) {
        projectList = (result as any).items;
        total = (result as any).totalCount || projectList.length;
      } else if ((result as any).data && Array.isArray((result as any).data)) {
        projectList = (result as any).data;
        total = (result as any).totalCount || projectList.length;
      }
      
      // Apply client-side filters if needed
      if (filterStatus || filterPriority || filterManager) {
        projectList = projectList.filter(project => {
          if (filterStatus && project.status !== filterStatus) return false;
          if (filterPriority && project.priority !== filterPriority) return false;
          if (filterManager && project.managerId !== filterManager) return false;
          return true;
        });
      }
      
      setProjects(projectList);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
      setTotalCount(0);
      setTotalPages(0);
      showError('Failed to load projects. Please try again.');
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

  const handleDeleteProject = async (project: ProjectDto) => {
    showConfirmation({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.name}"? This action cannot be undone and will also delete all associated tasks.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await projectService.deleteProject(project.id);
          success('Project deleted successfully');
          // Refresh the project list
          loadProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          showError('Failed to delete project. Please try again.');
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterPriority('');
    setFilterManager('');
    setCurrentPage(1);
  };

  const getFilteredResultsText = () => {
    const projectsArray = Array.isArray(projects) ? projects : [];
    if (totalCount === 0) {
      return searchTerm ? `No projects match "${searchTerm}"` : 'No projects found';
    }
    
    let text = `Showing ${projectsArray.length} of ${totalCount} project${totalCount !== 1 ? 's' : ''}`;
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
                <FolderOpen className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Project Cockpit</h1>
                <p className="text-sm text-gray-600">Manage projects and track progress</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewProject}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <CirclePlus className="w-4 h-4" />
              <span>New Project</span>
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
                  placeholder="Search projects..."
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
                  {(searchTerm || filterStatus || filterPriority || filterManager) && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border border-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">Filters</span>
                {/* Filter Count Badge */}
                {(searchTerm || filterStatus || filterPriority || filterManager) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-1">
                    {[searchTerm, filterStatus, filterPriority, filterManager].filter(Boolean).length}
                  </span>
                )}
              </div>
              
              <CustomSelect
                value={filterStatus.toString()}
                onChange={(value) => setFilterStatus(value as ProjectStatus | '')}
                options={[
                  { value: '', label: 'All Status' },
                  { value: ProjectStatus.Planning.toString(), label: 'Planning' },
                  { value: ProjectStatus.InProgress.toString(), label: 'In Progress' },
                  { value: ProjectStatus.OnHold.toString(), label: 'On Hold' },
                  { value: ProjectStatus.Completed.toString(), label: 'Completed' },
                  { value: ProjectStatus.Cancelled.toString(), label: 'Cancelled' }
                ]}
                className="w-32"
                placeholder="All Status"
              />

              <CustomSelect
                value={filterPriority.toString()}
                onChange={(value) => setFilterPriority(value as ProjectPriority | '')}
                options={[
                  { value: '', label: 'All Priority' },
                  { value: ProjectPriority.Low.toString(), label: 'Low' },
                  { value: ProjectPriority.Medium.toString(), label: 'Medium' },
                  { value: ProjectPriority.High.toString(), label: 'High' },
                  { value: ProjectPriority.Critical.toString(), label: 'Critical' }
                ]}
                className="w-32"
                placeholder="All Priority"
              />

              {/* Manager Filter */}
              <div className="w-48">
                <SearchableSelect
                  placeholder="All Managers"
                  value={filterManager}
                  onChange={setFilterManager}
                  onSearch={searchUsers}
                  icon={<User className="w-4 h-4" />}
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

              {(searchTerm || filterStatus || filterPriority || filterManager) && (
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
        ) : (Array.isArray(projects) && projects.length === 0) ? (
          // Empty State
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md mx-auto px-4">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No projects match "${searchTerm}"` : 'Get started by creating your first project'}
              </p>
              <button
                onClick={onNewProject}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <CirclePlus className="w-4 h-4" />
                <span>Create First Project</span>
              </button>
            </div>
          </div>
        ) : (
          // Project Grid
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {Array.isArray(projects) ? projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={onEditProject}
                  onView={onViewProject}
                  onDelete={handleDeleteProject}
                />
              )) : null}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="projects"
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

export default ProjectCockpit;
