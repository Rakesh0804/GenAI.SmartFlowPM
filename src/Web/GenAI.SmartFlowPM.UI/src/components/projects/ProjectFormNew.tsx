'use client';

import React, { useState, useEffect } from 'react';
import { ProjectDto, CreateProjectDto, ProjectStatus, ProjectPriority, UserDto } from '@/types/api.types';
import { projectService } from '@/services/project.service';
import { userService } from '@/services/user.service';
import SearchableSelect from '@/components/common/SearchableSelect';
import CustomSelect from '@/components/common/CustomSelect';
import { 
  FolderOpen, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Flag, 
  Save, 
  X, 
  ArrowLeft,
  Edit,
  Building2,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ProjectFormNewProps {
  project?: ProjectDto;
  mode: 'create' | 'edit' | 'view';
  onSave?: (project: ProjectDto) => void;
  onCancel?: () => void;
  onBack?: () => void;
  onEdit?: () => void;
}

export default function ProjectFormNew({ project, mode, onSave, onCancel, onBack, onEdit }: ProjectFormNewProps) {
  const [loading, setLoading] = useState(false);
  const [initialUsers, setInitialUsers] = useState<UserDto[]>([]);
  const [initialClients, setInitialClients] = useState<string[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ProjectStatus.Planning,
    priority: ProjectPriority.Medium,
    budget: '',
    managerId: '',
    clientName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial users data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingInitialData(true);
        console.log('ProjectFormNew: Loading initial data...');
        
        // Load users with fallback handling
        let activeUsers: UserDto[] = [];
        try {
          const userResult = await userService.getActiveUsers(20);
          if (Array.isArray(userResult)) {
            activeUsers = userResult;
          } else if ((userResult as any)?.items && Array.isArray((userResult as any).items)) {
            activeUsers = (userResult as any).items;
          } else if ((userResult as any)?.data && Array.isArray((userResult as any).data)) {
            activeUsers = (userResult as any).data;
          }
        } catch (error) {
          console.warn('Active users endpoint not available, using fallback');
          const fallbackResult = await userService.getUsers(1, 20);
          if (Array.isArray(fallbackResult)) {
            activeUsers = fallbackResult;
          } else if ((fallbackResult as any)?.items) {
            activeUsers = (fallbackResult as any).items;
          }
        }

        // Load existing client names from projects
        let clientNames: string[] = [];
        try {
          const projectResult = await projectService.getProjects(1, 50); // Get first 50 projects for client names
          let projectList: ProjectDto[] = [];
          
          if (Array.isArray(projectResult)) {
            projectList = projectResult;
          } else if ((projectResult as any)?.items && Array.isArray((projectResult as any).items)) {
            projectList = (projectResult as any).items;
          } else if ((projectResult as any)?.data && Array.isArray((projectResult as any).data)) {
            projectList = (projectResult as any).data;
          }
          
          // Extract unique client names
          const uniqueClients = new Set<string>();
          projectList.forEach(project => {
            if (project.clientName && project.clientName.trim()) {
              uniqueClients.add(project.clientName.trim());
            }
          });
          clientNames = Array.from(uniqueClients).sort();
        } catch (error) {
          console.warn('Error loading existing client names:', error);
          clientNames = [];
        }

        console.log('ProjectFormNew: Loaded active users:', activeUsers);
        console.log('ProjectFormNew: Loaded client names:', clientNames);
        setInitialUsers(activeUsers);
        setInitialClients(clientNames);
        setDataError(null);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setDataError('Failed to load form data. Some options may not be available.');
        setInitialUsers([]);
        setInitialClients([]);
      } finally {
        setLoadingInitialData(false);
      }
    };

    loadInitialData();
  }, []);

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      console.log('ProjectFormNew: Loading project data:', project);
      setFormData({
        name: project.name || '',
        description: project.description || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        status: project.status || ProjectStatus.Planning,
        priority: project.priority || ProjectPriority.Medium,
        budget: project.budget?.toString() || '',
        managerId: project.managerId || '',
        clientName: project.clientName || ''
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: ProjectStatus.Planning,
        priority: ProjectPriority.Medium,
        budget: '',
        managerId: '',
        clientName: ''
      });
    }
  }, [project, mode]);

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

  // Search function for clients
  const searchClients = async (query: string) => {
    try {
      if (!query.trim()) return [];
      
      // First, search in existing client names
      const filteredClients = initialClients
        .filter(clientName => 
          clientName.toLowerCase().includes(query.toLowerCase())
        )
        .map(clientName => ({
          id: clientName,
          label: clientName,
          sublabel: ''
        }));

      // If query is not empty and doesn't match any existing client, 
      // allow adding as new client
      if (query.trim() && !initialClients.some(client => 
        client.toLowerCase() === query.toLowerCase()
      )) {
        filteredClients.unshift({
          id: query.trim(),
          label: query.trim(),
          sublabel: 'Add as new client'
        });
      }

      return filteredClients;
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  };

  // Helper function to get user name by ID
  const getUserName = (userId: string): string => {
    if (!userId) return 'No manager assigned';
    if (!Array.isArray(initialUsers)) return project?.managerName || 'Unknown user';
    const user = initialUsers.find((u: UserDto) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : project?.managerName || 'Unknown user';
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

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.managerId.trim()) {
      newErrors.managerId = 'Project manager is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Budget must be positive';
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
      const projectData: Partial<ProjectDto> = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        status: formData.status,
        priority: formData.priority,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        managerId: formData.managerId,
        clientName: formData.clientName || undefined
      };

      let savedProject: ProjectDto;
      
      if (mode === 'edit' && project) {
        savedProject = await projectService.updateProject(project.id, projectData);
        success('Project updated successfully!');
      } else {
        savedProject = await projectService.createProject(projectData);
        success('Project created successfully!');
      }

      onSave?.(savedProject);
    } catch (err: any) {
      console.error('Error saving project:', err);
      const errorMessage = err.message || 'Failed to save project. Please try again.';
      showError('Error', errorMessage);
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
                <FolderOpen className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isCreate ? 'New Project' : isEdit ? 'Edit Project' : 'View Project'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isCreate ? 'Create a new project' : isEdit ? 'Modify project details' : 'Project information'}
                </p>
                {/* Debug info for development */}
                {isReadOnly && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mode: {mode} | Has Project: {project ? 'Yes' : 'No'} | Name: "{formData.name}"
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
                  <Flag className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{dataError}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <form id="project-form" onSubmit={handleSubmit} className="space-y-8 p-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name *
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
                          placeholder="Enter project name"
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Client Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                        Client Name
                      </label>
                      {isReadOnly ? (
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <div className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                            {formData.clientName || 'No client specified'}
                          </div>
                        </div>
                      ) : (
                        <SearchableSelect
                          placeholder="Search or enter client name..."
                          value={formData.clientName}
                          onChange={(value) => setFormData(prev => ({ ...prev, clientName: value }))}
                          onSearch={searchClients}
                          icon={<Users className="w-5 h-5" />}
                          error={errors.clientName}
                          minSearchLength={1}
                          initialOptions={Array.isArray(initialClients) ? initialClients.map(clientName => ({
                            id: clientName,
                            label: clientName,
                            sublabel: ''
                          })) : []}
                          className="w-full"
                        />
                      )}
                      {errors.clientName && !isReadOnly && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <CustomSelect
                        value={formData.status.toString()}
                        onChange={(value) => handleInputChange({ target: { name: 'status', value } } as any)}
                        options={[
                          { value: ProjectStatus.Planning.toString(), label: 'Planning' },
                          { value: ProjectStatus.InProgress.toString(), label: 'In Progress' },
                          { value: ProjectStatus.OnHold.toString(), label: 'On Hold' },
                          { value: ProjectStatus.Completed.toString(), label: 'Completed' },
                          { value: ProjectStatus.Cancelled.toString(), label: 'Cancelled' }
                        ]}
                        disabled={isReadOnly}
                        placeholder="Select status"
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="relative">
                        <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <CustomSelect
                          value={formData.priority.toString()}
                          onChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              priority: value as ProjectPriority
                            }));
                          }}
                          options={[
                            { value: ProjectPriority.Low.toString(), label: 'Low' },
                            { value: ProjectPriority.Medium.toString(), label: 'Medium' },
                            { value: ProjectPriority.High.toString(), label: 'High' },
                            { value: ProjectPriority.Critical.toString(), label: 'Critical' }
                          ]}
                          disabled={isReadOnly}
                          className="pl-11"
                        />
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
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Management & Timeline Section */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Management & Timeline</h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Manager */}
                    <div className="md:col-span-2">
                      <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Manager *
                      </label>
                      {isReadOnly ? (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <div className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                            {getUserName(formData.managerId)}
                          </div>
                        </div>
                      ) : (
                        <SearchableSelect
                          placeholder="Search and select a project manager..."
                          value={formData.managerId}
                          onChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}
                          onSearch={searchUsers}
                          icon={<User className="w-5 h-5" />}
                          error={errors.managerId}
                          minSearchLength={2}
                          initialOptions={Array.isArray(initialUsers) ? initialUsers.map(user => ({
                            id: user.id,
                            label: `${user.firstName} ${user.lastName}`,
                            sublabel: user.email
                          })) : []}
                          className="w-full"
                        />
                      )}
                      {errors.managerId && !isReadOnly && <p className="mt-1 text-sm text-red-600">{errors.managerId}</p>}
                    </div>

                    {/* Start Date */}
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          disabled={isReadOnly}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>
                      {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                    </div>

                    {/* End Date */}
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          disabled={isReadOnly}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>
                      {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                    </div>

                    {/* Budget */}
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          disabled={isReadOnly}
                          min="0"
                          step="0.01"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Statistics (View Mode Only) */}
              {isReadOnly && project && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-primary-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Project Statistics</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{project.teamMemberCount}</p>
                        <p className="text-sm text-gray-500">Team Members</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{project.taskCount}</p>
                        <p className="text-sm text-gray-500">Total Tasks</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="w-6 h-6 text-accent" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{project.completedTaskCount}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
                        <p className="text-sm text-gray-500">Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                form="project-form"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}</span>
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
                <span>Edit Project</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
