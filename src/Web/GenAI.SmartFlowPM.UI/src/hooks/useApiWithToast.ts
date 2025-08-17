'use client';

import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
    authService, 
    userService, 
    projectService, 
    taskService 
} from '../services';
import {
    LoginRequest,
    CreateUserDto,
    UpdateUserDto,
    CreateProjectDto,
    UpdateProjectDto,
    CreateTaskDto,
    UpdateTaskDto
} from '../types/api.types';

export const useApiWithToast = () => {
    const { success, error: showError, warning, info } = useToast();

    // Helper function to extract error messages from API response
    const extractErrorMessage = useCallback((error: any): string => {
        // Handle API errors converted by BaseApiService
        if (error?.isApiError && error.message) {
            return error.message;
        }

        // Handle errors with message property directly (but not generic axios messages)
        if (error?.message && !error.message.includes('status code') && !error.message.includes('Request failed')) {
            return error.message;
        }
        
        if (error.response?.data) {
            const responseData = error.response.data;
            
            // Handle standard API response format: { isSuccess, data, message, errors }
            if (responseData.message) {
                return responseData.message;
            }
            
            // Handle array of errors in the errors property
            if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                return responseData.errors.join(', ');
            }
            
            // Handle FluentValidation errors format (ModelState)
            if (responseData.errors && typeof responseData.errors === 'object') {
                const validationErrors: string[] = [];
                
                // Check if it's a ModelState errors object
                Object.keys(responseData.errors).forEach(key => {
                    const fieldErrors = responseData.errors[key];
                    if (Array.isArray(fieldErrors)) {
                        fieldErrors.forEach((err: string) => validationErrors.push(err));
                    } else if (typeof fieldErrors === 'string') {
                        validationErrors.push(fieldErrors);
                    }
                });
                
                if (validationErrors.length > 0) {
                    return validationErrors.join(', ');
                }
            }
            
            // Check for other common message properties
            return responseData.title || 
                   responseData.detail ||
                   'An error occurred';
        }
        
        return error.message || 'An unexpected error occurred';
    }, []);

    // Helper function to handle API errors
    const handleApiError = useCallback((error: any, operation: string) => {
        console.error(`${operation} failed:`, error);

        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = extractErrorMessage(error);

            switch (status) {
                case 400:
                    showError('Validation Error', message);
                    break;
                case 401:
                    if (operation.toLowerCase() === 'login') {
                        showError('Login Failed', message || 'Invalid email or password. Please try again.');
                    } else {
                        showError('Unauthorized', 'Please login again to continue', true);
                    }
                    break;
                case 403:
                    showError('Access Denied', `You don't have permission to ${operation.toLowerCase()}`, true);
                    break;
                case 404:
                    showError('Not Found', `The requested resource was not found`);
                    break;
                case 409:
                    warning('Conflict', `${operation} conflict: ${message}`);
                    break;
                case 422:
                    showError('Validation Error', message || `Please check your ${operation.toLowerCase()} data`);
                    break;
                case 500:
                    showError('Server Error', 'An internal server error occurred. Please try again later.', true);
                    break;
                default:
                    showError(`${operation} Failed`, message || 'An unexpected error occurred');
            }
        } else if (error.request) {
            // Network error
            showError('Network Error', 'Unable to connect to server. Please check your connection.', true);
        } else {
            // Other error
            showError(`${operation} Failed`, error.message || 'An unexpected error occurred');
        }

        throw error;
    }, [showError, warning, extractErrorMessage]);

    // Authentication operations
    const loginWithToast = useCallback(async (credentials: LoginRequest) => {
        try {
            info('Signing in...', 'Authenticating your credentials');
            const response = await authService.login(credentials);
            success('Login Successful!', 'Welcome to SmartFlowPM System');
            return response;
        } catch (error) {
            handleApiError(error, 'Login');
        }
    }, [info, success, handleApiError]);

    const logoutWithToast = useCallback(async () => {
        try {
            await authService.logout();
            info('Logged out successfully', 'You have been securely logged out');
        } catch (error) {
            handleApiError(error, 'Logout');
        }
    }, [info, handleApiError]);

    // User operations
    const createUserWithToast = useCallback(async (userData: CreateUserDto) => {
        try {
            info('Creating user...', 'Please wait while we create the user account');
            const response = await userService.createUser(userData);
            success('User Created!', `${userData.firstName} ${userData.lastName} has been added successfully`);
            return response;
        } catch (error) {
            handleApiError(error, 'Create User');
        }
    }, [info, success, handleApiError]);

    const updateUserWithToast = useCallback(async (id: string, userData: UpdateUserDto) => {
        try {
            info('Updating user...', 'Saving changes to user account');
            const response = await userService.updateUser(id, userData);
            success('User Updated!', 'User information has been updated successfully');
            return response;
        } catch (error) {
            handleApiError(error, 'Update User');
        }
    }, [info, success, handleApiError]);

    const deleteUserWithToast = useCallback(async (id: string, userName?: string) => {
        try {
            warning('Deleting user...', 'This action cannot be undone', 10000);
            await userService.deleteUser(id);
            success('User Deleted', userName ? `${userName} has been removed from the system` : 'User has been removed successfully');
        } catch (error) {
            handleApiError(error, 'Delete User');
        }
    }, [warning, success, handleApiError]);

    // Project operations
    const createProjectWithToast = useCallback(async (projectData: CreateProjectDto) => {
        try {
            info('Creating project...', 'Setting up your new project');
            const response = await projectService.createProject(projectData);
            success('Project Created!', `${projectData.name} has been created successfully`);
            return response;
        } catch (error) {
            handleApiError(error, 'Create Project');
        }
    }, [info, success, handleApiError]);

    const updateProjectWithToast = useCallback(async (id: string, projectData: UpdateProjectDto) => {
        try {
            info('Updating project...', 'Saving project changes');
            const response = await projectService.updateProject(id, projectData);
            success('Project Updated!', 'Project has been updated successfully');
            return response;
        } catch (error) {
            handleApiError(error, 'Update Project');
        }
    }, [info, success, handleApiError]);

    const deleteProjectWithToast = useCallback(async (id: string, projectName?: string) => {
        try {
            warning('Deleting project...', 'All associated tasks and data will be removed', 15000);
            await projectService.deleteProject(id);
            success('Project Deleted', projectName ? `${projectName} has been deleted` : 'Project has been deleted successfully');
        } catch (error) {
            handleApiError(error, 'Delete Project');
        }
    }, [warning, success, handleApiError]);

    // Task operations
    const createTaskWithToast = useCallback(async (taskData: CreateTaskDto) => {
        try {
            info('Creating task...', 'Adding new task to the project');
            const response = await taskService.createTask(taskData);
            success('Task Created!', `${taskData.title} has been added successfully`);
            return response;
        } catch (error) {
            handleApiError(error, 'Create Task');
        }
    }, [info, success, handleApiError]);

    const updateTaskWithToast = useCallback(async (id: string, taskData: UpdateTaskDto) => {
        try {
            info('Updating task...', 'Saving task changes');
            const response = await taskService.updateTask(id, taskData);
            success('Task Updated!', 'Task has been updated successfully');
            return response;
        } catch (error) {
            handleApiError(error, 'Update Task');
        }
    }, [info, success, handleApiError]);

    const deleteTaskWithToast = useCallback(async (id: string, taskTitle?: string) => {
        try {
            warning('Deleting task...', 'This action cannot be undone', 10000);
            await taskService.deleteTask(id);
            success('Task Deleted', taskTitle ? `${taskTitle} has been deleted` : 'Task has been deleted successfully');
        } catch (error) {
            handleApiError(error, 'Delete Task');
        }
    }, [warning, success, handleApiError]);

    // Data fetching with toast (for critical errors only)
    const fetchWithToast = useCallback(async <T>(
        operation: () => Promise<T>,
        operationName: string,
        showLoadingToast: boolean = false
    ): Promise<T> => {
        try {
            if (showLoadingToast) {
                info(`Loading ${operationName.toLowerCase()}...`, 'Please wait');
            }
            return await operation();
        } catch (error) {
            // Only show toast for critical fetch errors (like 500, network errors)
            if (error instanceof Error) {
                const shouldShowToast =
                    error.message.includes('Network Error') ||
                    error.message.includes('500') ||
                    error.message.includes('503') ||
                    error.message.includes('timeout');

                if (shouldShowToast) {
                    handleApiError(error, `Fetch ${operationName}`);
                }
            }
            throw error;
        }
    }, [info, handleApiError]);

    return {
        // Authentication
        loginWithToast,
        logoutWithToast,

        // User operations
        createUserWithToast,
        updateUserWithToast,
        deleteUserWithToast,

        // Project operations
        createProjectWithToast,
        updateProjectWithToast,
        deleteProjectWithToast,

        // Task operations
        createTaskWithToast,
        updateTaskWithToast,
        deleteTaskWithToast,

        // General fetch with error handling
        fetchWithToast,

        // Direct access to toast functions
        showSuccess: success,
        showError,
        showWarning: warning,
        showInfo: info
    };
};

export default useApiWithToast;
