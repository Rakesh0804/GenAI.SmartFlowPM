'use client';

import React, { useState, useEffect } from 'react';
import { TaskDto, CreateTaskDto, TaskStatus, TaskPriority, ProjectDto, UserDto } from '@/types/api.types';
import { TASK_TYPES, DEFAULT_TASK_ACRONYM } from '@/constants/taskTypes';
import { projectService } from '@/services/project.service';
import { userService } from '@/services/user.service';
import SearchableSelect from '@/components/common/SearchableSelect';
import { 
  CheckSquare, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Flag, 
  Save, 
  X, 
  Loader2,
  ArrowLeft,
  Edit,
  Building2,
  Hash
} from 'lucide-react';

interface TaskFormNewProps {
  task?: TaskDto;
  mode: 'create' | 'edit' | 'view';
  onSave?: (task: TaskDto) => void;
  onCancel?: () => void;
  onBack?: () => void;
  onEdit?: () => void;
}

export default function TaskFormNew({ task, mode, onSave, onCancel, onBack, onEdit }: TaskFormNewProps) {
  const [loading, setLoading] = useState(false);
  const [initialProjects, setInitialProjects] = useState<ProjectDto[]>([]);
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.Todo,
    priority: TaskPriority.Medium,
    dueDate: '',
    estimatedHours: '',
    projectId: '',
    assignedUserId: '',
    acronym: DEFAULT_TASK_ACRONYM as string
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial projects and users data (small set for quick loading)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingInitialData(true);
        console.log('TaskFormNew: Loading initial projects and users data...');
        
        // Load projects with fallback handling
        let recentProjects: ProjectDto[] = [];
        try {
          const projectResult = await projectService.getRecentProjects(10);
          if (Array.isArray(projectResult)) {
            recentProjects = projectResult;
          } else if ((projectResult as any)?.items && Array.isArray((projectResult as any).items)) {
            recentProjects = (projectResult as any).items;
          } else if ((projectResult as any)?.data && Array.isArray((projectResult as any).data)) {
            recentProjects = (projectResult as any).data;
          }
        } catch (error) {
          console.warn('Recent projects endpoint not available, using fallback');
          const fallbackResult = await projectService.getProjects(1, 10);
          if (Array.isArray(fallbackResult)) {
            recentProjects = fallbackResult;
          } else if ((fallbackResult as any)?.items) {
            recentProjects = (fallbackResult as any).items;
          }
        }

        // Load users with fallback handling
        let activeUsers: UserDto[] = [];
        try {
          const userResult = await userService.getActiveUsers(10);
          if (Array.isArray(userResult)) {
            activeUsers = userResult;
          } else if ((userResult as any)?.items && Array.isArray((userResult as any).items)) {
            activeUsers = (userResult as any).items;
          } else if ((userResult as any)?.data && Array.isArray((userResult as any).data)) {
            activeUsers = (userResult as any).data;
          }
        } catch (error) {
          console.warn('Active users endpoint not available, using fallback');
          const fallbackResult = await userService.getUsers(1, 10);
          if (Array.isArray(fallbackResult)) {
            activeUsers = fallbackResult;
          } else if ((fallbackResult as any)?.items) {
            activeUsers = (fallbackResult as any).items;
          }
        }

        console.log('TaskFormNew: Loaded recent projects:', recentProjects);
        console.log('TaskFormNew: Loaded active users:', activeUsers);
        setInitialProjects(recentProjects);
        setInitialUsers(activeUsers);
        setDataError(null);
      } catch (error) {
        console.error('Error loading initial projects and users:', error);
        setDataError('Failed to load form data. Some options may not be available.');
        // Set empty arrays as fallback
        setInitialProjects([]);
        setInitialUsers([]);
      } finally {
        setLoadingInitialData(false);
      }
    };

    loadInitialData();
  }, []);

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      console.log('TaskFormNew: Loading task data:', task); // Debug log
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TaskStatus.Todo,
        priority: task.priority || TaskPriority.Medium,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours?.toString() || '',
        projectId: task.projectId || '',
        assignedUserId: task.assignedToUserId || task.assignedUserId || '',
        acronym: task.acronym || DEFAULT_TASK_ACRONYM
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        dueDate: '',
        estimatedHours: '',
        projectId: '',
        assignedUserId: '',
        acronym: DEFAULT_TASK_ACRONYM as string
      });
    }
  }, [task, mode]);

  // Search functions for SearchableSelect components
  const searchProjects = async (query: string) => {
    try {
      if (!query.trim()) return [];
      const results = await projectService.searchProjectsQuick(query);
      
      // Handle different response formats
      let projectList: ProjectDto[] = [];
      if (Array.isArray(results)) {
        projectList = results;
      } else if ((results as any)?.items && Array.isArray((results as any).items)) {
        projectList = (results as any).items;
      } else if ((results as any)?.data && Array.isArray((results as any).data)) {
        projectList = (results as any).data;
      }
      
      return projectList.map(project => ({
        id: project.id,
        label: project.name,
        sublabel: project.description ? project.description.substring(0, 50) + '...' : undefined
      }));
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  };

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

  // Helper function to get project name by ID
  const getProjectName = (projectId: string): string => {
    if (!projectId) return 'No project assigned';
    if (!Array.isArray(initialProjects)) return task?.projectName || 'Unknown project';
    const project = initialProjects.find((p: ProjectDto) => p.id === projectId);
    return project ? project.name : task?.projectName || 'Unknown project';
  };

  // Helper function to get user name by ID
  const getUserName = (userId: string): string => {
    if (!userId) return 'Unassigned';
    if (!Array.isArray(initialUsers)) return task?.assignedToUserName || task?.assignedUserName || 'Unknown user';
    const user = initialUsers.find((u: UserDto) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : task?.assignedToUserName || task?.assignedUserName || 'Unknown user';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.projectId.trim()) {
      newErrors.projectId = 'Project is required';
    }

    if (!formData.acronym.trim()) {
      newErrors.acronym = 'Task type is required';
    }

    if (formData.estimatedHours && parseFloat(formData.estimatedHours) < 0) {
      newErrors.estimatedHours = 'Estimated hours must be positive';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const taskData: TaskDto = {
        id: task?.id || `task-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        projectId: formData.projectId,
        projectName: 'Sample Project', // This would come from project lookup
        assignedUserId: formData.assignedUserId || undefined,
        assignedUserName: formData.assignedUserId ? 'Sample User' : undefined,
        acronym: formData.acronym,
        taskNumber: task?.taskNumber || `${formData.acronym}-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')}`,
        tenantId: 'tenant-1',
        createdAt: task?.createdAt || new Date(),
        updatedAt: new Date()
      };

      onSave?.(taskData);
    } catch (err) {
      console.error('Error saving task:', err);
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
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <CheckSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isCreate ? 'New Task' : isEdit ? 'Edit Task' : 'View Task'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isCreate ? 'Create a new task' : isEdit ? 'Modify task details' : 'Task information'}
                </p>
                {/* Debug info for development */}
                {isReadOnly && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mode: {mode} | Has Task: {task ? 'Yes' : 'No'} | Title: "{formData.title}"
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
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              <span className="text-gray-600">Loading form data...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {dataError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Flag className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{dataError}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <form id="task-form" onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Type */}
                <div>
                  <label htmlFor="acronym" className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="acronym"
                      name="acronym"
                      value={formData.acronym}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    >
                      {TASK_TYPES.map((taskType) => (
                        <option key={taskType.value} value={taskType.value}>
                          {taskType.label} - {taskType.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.acronym && <p className="mt-1 text-sm text-red-600">{errors.acronym}</p>}
                </div>

                {/* Project */}
                <div>
                  {/* Project */}
                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  {isReadOnly ? (
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <div className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        {getProjectName(formData.projectId)}
                      </div>
                    </div>
                  ) : (
                    <SearchableSelect
                      placeholder="Search and select a project..."
                      value={formData.projectId}
                      onChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
                      onSearch={searchProjects}
                      icon={<Building2 className="w-5 h-5" />}
                      error={errors.projectId}
                      minSearchLength={2}
                      initialOptions={Array.isArray(initialProjects) ? initialProjects.map(project => ({
                        id: project.id,
                        label: project.name,
                        sublabel: project.description ? project.description.substring(0, 50) + '...' : undefined
                      })) : []}
                      className="w-full"
                    />
                  )}
                  {errors.projectId && !isReadOnly && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
                </div>
                </div>

                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="Enter task title"
                    />
                  </div>
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  >
                    <option value={TaskStatus.Todo}>To Do</option>
                    <option value={TaskStatus.InProgress}>In Progress</option>
                    <option value={TaskStatus.Review}>Review</option>
                    <option value={TaskStatus.Testing}>Testing</option>
                    <option value={TaskStatus.Done}>Done</option>
                    <option value={TaskStatus.Blocked}>Blocked</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    >
                      <option value={TaskPriority.Low}>Low</option>
                      <option value={TaskPriority.Medium}>Medium</option>
                      <option value={TaskPriority.High}>High</option>
                      <option value={TaskPriority.Critical}>Critical</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    placeholder="Enter task description"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assignment & Timing Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Assignment & Timing</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned User */}
                <div>
                  <label htmlFor="assignedUserId" className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  {isReadOnly ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <div className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        {getUserName(formData.assignedUserId)}
                      </div>
                    </div>
                  ) : (
                    <SearchableSelect
                      placeholder="Search and select a user..."
                      value={formData.assignedUserId}
                      onChange={(value) => setFormData(prev => ({ ...prev, assignedUserId: value }))}
                      onSearch={searchUsers}
                      icon={<User className="w-5 h-5" />}
                      minSearchLength={2}
                      initialOptions={Array.isArray(initialUsers) ? initialUsers.map(user => ({
                        id: user.id,
                        label: `${user.firstName} ${user.lastName}`,
                        sublabel: user.email
                      })) : []}
                      className="w-full"
                      showClearButton={true}
                    />
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Estimated Hours */}
                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      id="estimatedHours"
                      name="estimatedHours"
                      value={formData.estimatedHours}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                      min="0"
                      step="0.5"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                  {errors.estimatedHours && <p className="mt-1 text-sm text-red-600">{errors.estimatedHours}</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
          </>
      )}

      {/* Form Actions - Bottom Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            {/* Show Cancel button only for Create/Edit modes, not View mode */}
            {!isReadOnly && onCancel && (
              <button
                onClick={onCancel}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}

            {/* Show Save/Update button only for Create/Edit modes */}
            {!isReadOnly && (
              <button
                type="submit"
                form="task-form"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}</span>
              </button>
            )}

            {/* Show Edit button only for View mode */}
            {isReadOnly && (
              <button
                onClick={() => {
                  if (onEdit) {
                    onEdit();
                  } else {
                    console.log('Edit button clicked but no onEdit handler provided');
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all duration-200 space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Task</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}