'use client';

import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/task.service';
import { projectService } from '../../services/project.service';
import { userService } from '../../services/user.service';
import { TaskDto, TaskStatus, TaskPriority, PaginatedResponse, ProjectDto, UserDto } from '@/types/api.types';
import { CheckSquare, Calendar, User, Clock, Search, Filter, Plus, MoreVertical, Edit, Eye, X, Flag, Building2, CheckCircle, XCircle, AlertCircle, PlayCircle, PauseCircle, FileText } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/common/Pagination';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';
import { useConfirmationModal } from '@/components/common/ConfirmationModal';
import { TASK_TYPE_ACRONYMS, getTaskTypeLabel } from '@/constants/taskTypes';

interface TaskCockpitProps {
  onNewTask: () => void;
  onEditTask: (task: TaskDto) => void;
  onViewTask: (task: TaskDto) => void;
  onBackClick: () => void;
}

// Task Card Component
interface TaskCardProps {
  task: TaskDto;
  onEdit: (task: TaskDto) => void;
  onView: (task: TaskDto) => void;
  onDelete: (task: TaskDto) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onView, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Todo:
        return {
          text: 'To Do',
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
      case TaskStatus.InProgress:
        return {
          text: 'In Progress',
          className: 'bg-primary-100 text-primary-700 border-primary-200'
        };
      case TaskStatus.Review:
        return {
          text: 'Review',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
      case TaskStatus.Testing:
        return {
          text: 'Testing',
          className: 'bg-orange-100 text-purple-700 border-purple-200'
        };
      case TaskStatus.Done:
        return {
          text: 'Done',
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case TaskStatus.Blocked:
        return {
          text: 'Blocked',
          className: 'bg-red-100 text-red-700 border-red-200'
        };
      default:
        return {
          text: 'To Do',
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const getTaskTypeBadge = (acronym: string) => {
    const normalizedAcronym = acronym?.toUpperCase();
    
    switch (normalizedAcronym) {
      case TASK_TYPE_ACRONYMS.BUG:
        return {
          text: getTaskTypeLabel(TASK_TYPE_ACRONYMS.BUG),
          className: 'bg-red-100 text-red-700 border-red-200',
          icon: <XCircle className="w-3 h-3" />
        };
      case TASK_TYPE_ACRONYMS.TASK:
        return {
          text: getTaskTypeLabel(TASK_TYPE_ACRONYMS.TASK),
          className: 'bg-orange-100 text-accent border-primary-200',
          icon: <CheckSquare className="w-3 h-3" />
        };
      case TASK_TYPE_ACRONYMS.SPIKE:
        return {
          text: getTaskTypeLabel(TASK_TYPE_ACRONYMS.SPIKE),
          className: 'bg-orange-100 text-orange-700 border-orange-200',
          icon: <Flag className="w-3 h-3" />
        };
      case TASK_TYPE_ACRONYMS.STORY:
        return {
          text: getTaskTypeLabel(TASK_TYPE_ACRONYMS.STORY),
          className: 'bg-green-100 text-green-700 border-green-200',
          icon: <FileText className="w-3 h-3" />
        };
      default:
        return {
          text: getTaskTypeLabel(TASK_TYPE_ACRONYMS.TASK),
          className: 'bg-orange-100 text-accent border-primary-200',
          icon: <CheckSquare className="w-3 h-3" />
        };
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Low:
        return {
          text: 'Low',
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case TaskPriority.Medium:
        return {
          text: 'Medium',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
      case TaskPriority.High:
        return {
          text: 'High',
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      case TaskPriority.Critical:
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

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== TaskStatus.Done;
  };

  const handleToggleStatus = () => {
    // TODO: Implement toggle status functionality
    console.log('Toggle status for task:', task.id);
  };

  const handleDelete = () => {
    onDelete(task);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Task Type Badge */}
            {(() => {
              const taskTypeBadge = getTaskTypeBadge(task.acronym);
              return (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${taskTypeBadge.className}`}>
                  {taskTypeBadge.icon}
                  <span className="ml-1">{taskTypeBadge.text}</span>
                </span>
              );
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {task.title}
            </h3>
            <p className="text-xs text-gray-500">{task.taskNumber}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(task)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all duration-200"
            title="Edit Task"
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
                    <span>Delete Task</span>
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
              {task.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Project & Assignment */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 flex-shrink-0 text-primary-500" />
            <span className="truncate">{task.projectName}</span>
          </div>
        </div>

        {/* Assigned User Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Assigned to:</span>
          {task.assignedToUserName ? (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
              <User className="w-3 h-3 mr-1" />
              {task.assignedToUserName}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
              <User className="w-3 h-3 mr-1" />
              Unassigned
            </span>
          )}
        </div>

        {/* Status & Priority Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            {(() => {
              const statusBadge = getStatusBadge(task.status);
              return (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusBadge.className}`}>
                  {statusBadge.text}
                </span>
              );
            })()}
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="w-3 h-3 text-orange-500" />
            {(() => {
              const priorityBadge = getPriorityBadge(task.priority);
              return (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityBadge.className}`}>
                  {priorityBadge.text}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Due Date & Hours */}
        {(task.dueDate || task.estimatedHours) && (
          <div className="space-y-2">
            {task.dueDate && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  Due {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate) && ' (Overdue)'}
                </span>
              </div>
            )}
            {task.estimatedHours && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>
                  {task.actualHours || 0}h / {task.estimatedHours}h
                  {task.estimatedHours > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({Math.round(((task.actualHours || 0) / task.estimatedHours) * 100)}%)
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Card Footer - Always at bottom */}
      <div className="px-4 py-3 bg-gray-50 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
          {task.updatedAt && (
            <span>Updated {formatDate(task.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main TaskCockpit Component
export const TaskCockpit: React.FC<TaskCockpitProps> = ({
  onNewTask,
  onEditTask,
  onViewTask,
  onBackClick
}) => {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterAssignedUser, setFilterAssignedUser] = useState<string>('');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { success, error: showError } = useToast();
  const { showConfirmation, confirmationModal } = useConfirmationModal();

  const pageSize = 12; // Optimal for card grid display

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
    loadInitialUsers();
  }, []);

  // Load tasks data
  useEffect(() => {
    loadTasks();
  }, [currentPage, searchTerm, filterStatus, filterPriority, filterProject, filterAssignedUser]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterStatus, filterPriority, filterProject, filterAssignedUser]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // Build filter parameters
      const filters: any = {};
      
      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }
      if (filterStatus !== '' && filterStatus !== undefined) {
        filters.status = filterStatus;
      }
      if (filterPriority !== '' && filterPriority !== undefined) {
        filters.priority = filterPriority;
      }
      if (filterProject) {
        filters.projectId = filterProject;
      }
      if (filterAssignedUser) {
        filters.assignedUserId = filterAssignedUser;
      }
      
      // Use the unified getTasks endpoint with filters
      const result: PaginatedResponse<TaskDto> = await taskService.getTasks(
        currentPage,
        pageSize,
        Object.keys(filters).length > 0 ? filters : undefined
      );
      
      // Debug log to see the API response structure
      console.log('Tasks API Response:', result);
      
      // Extract tasks from paginated response - handle different possible structures
      let filteredTasks: TaskDto[] = [];
      
      if (result.items && Array.isArray(result.items)) {
        // Standard paginated response
        filteredTasks = result.items;
      } else if (Array.isArray(result)) {
        // Fallback: direct array response
        filteredTasks = result as any;
      } else if ((result as any).data && Array.isArray((result as any).data)) {
        // Alternative structure
        filteredTasks = (result as any).data;
      }
      
      // Debug log to see the extracted tasks
      console.log('Extracted tasks:', filteredTasks);
      
      // No need for client-side filtering anymore since it's all handled server-side
      setTasks(filteredTasks);
      
      // Use pagination metadata from API response
      setTotalCount(result.totalCount || filteredTasks.length);
      setTotalPages(result.totalPages || Math.ceil((result.totalCount || filteredTasks.length) / pageSize));
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Set empty array on error to prevent map function error
      setTasks([]);
      setTotalCount(0);
      setTotalPages(0);
      showError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const result = await projectService.getProjects(1, 50); // Get first 50 projects for filter
      
      // Handle different response structures
      let projectList: ProjectDto[] = [];
      if (Array.isArray(result)) {
        projectList = result;
      } else if ((result as any).items && Array.isArray((result as any).items)) {
        projectList = (result as any).items;
      } else if ((result as any).data && Array.isArray((result as any).data)) {
        projectList = (result as any).data;
      }
      
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
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

  const handleDeleteTask = async (task: TaskDto) => {
    showConfirmation({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await taskService.deleteTask(task.id);
          success('Task deleted successfully');
          // Refresh the task list
          loadTasks();
        } catch (error) {
          console.error('Error deleting task:', error);
          showError('Failed to delete task. Please try again.');
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterPriority('');
    setFilterProject('');
    setFilterAssignedUser('');
    setCurrentPage(1);
  };

  const getFilteredResultsText = () => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    if (totalCount === 0) {
      return searchTerm ? `No tasks match "${searchTerm}"` : 'No tasks found';
    }
    
    let text = `Showing ${tasksArray.length} of ${totalCount} task${totalCount !== 1 ? 's' : ''}`;
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
                <CheckSquare className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Cockpit</h1>
                <p className="text-sm text-gray-600">Manage tasks and track progress</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewTask}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
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
                  placeholder="Search tasks..."
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
                  {(searchTerm || filterStatus || filterPriority || filterProject || filterAssignedUser) && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border border-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">Filters</span>
                {/* Filter Count Badge */}
                {(searchTerm || filterStatus || filterPriority || filterProject || filterAssignedUser) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-1">
                    {[searchTerm, filterStatus, filterPriority, filterProject, filterAssignedUser].filter(Boolean).length}
                  </span>
                )}
              </div>
              
              <CustomSelect
                value={filterStatus.toString()}
                onChange={(value) => setFilterStatus(value as TaskStatus | '')}
                options={[
                  { value: '', label: 'All Status' },
                  { value: TaskStatus.Todo.toString(), label: 'To Do' },
                  { value: TaskStatus.InProgress.toString(), label: 'In Progress' },
                  { value: TaskStatus.Review.toString(), label: 'Review' },
                  { value: TaskStatus.Testing.toString(), label: 'Testing' },
                  { value: TaskStatus.Done.toString(), label: 'Done' },
                  { value: TaskStatus.Blocked.toString(), label: 'Blocked' }
                ]}
                className="w-32"
                placeholder="All Status"
              />

              <CustomSelect
                value={filterPriority.toString()}
                onChange={(value) => setFilterPriority(value as TaskPriority | '')}
                options={[
                  { value: '', label: 'All Priority' },
                  { value: TaskPriority.Low.toString(), label: 'Low' },
                  { value: TaskPriority.Medium.toString(), label: 'Medium' },
                  { value: TaskPriority.High.toString(), label: 'High' },
                  { value: TaskPriority.Critical.toString(), label: 'Critical' }
                ]}
                className="w-32"
                placeholder="All Priority"
              />

              <CustomSelect
                value={filterProject}
                onChange={setFilterProject}
                options={[
                  { value: '', label: 'All Projects' },
                  ...projects.map((project) => ({
                    value: project.id,
                    label: project.name
                  }))
                ]}
                className="w-40"
                placeholder="All Projects"
                disabled={loadingProjects}
              />

              {/* Assigned To Filter */}
              <div className="w-48">
                <SearchableSelect
                  placeholder="All Assigned"
                  value={filterAssignedUser}
                  onChange={setFilterAssignedUser}
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

              {(searchTerm || filterStatus || filterPriority || filterProject || filterAssignedUser) && (
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
        ) : (Array.isArray(tasks) && tasks.length === 0) ? (
          // Empty State
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md mx-auto px-4">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No tasks match "${searchTerm}"` : 'Get started by creating your first task'}
              </p>
              <button
                onClick={onNewTask}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Task</span>
              </button>
            </div>
          </div>
        ) : (
          // Task Grid
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {Array.isArray(tasks) ? tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onView={onViewTask}
                  onDelete={handleDeleteTask}
                />
              )) : null}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              itemName="tasks"
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

export default TaskCockpit;
