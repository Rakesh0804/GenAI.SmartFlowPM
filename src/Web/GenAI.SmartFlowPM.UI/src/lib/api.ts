import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  ApiResponse,
  UserDto,
  ProjectDto,
  TaskDto,
  DashboardStatsDto
} from '../types/api.types';

// Get API URL from dynamic config or fallback to environment variables
const getApiUrl = (): string => {
  // Try to get from dynamically generated config first
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    return (window as any).APP_CONFIG.API_URL;
  }
  
  // Fallback to environment variables or Aspire service discovery
  return process.env.NEXT_PUBLIC_API_URL || 
         process.env.services__api__https__0 || 
         process.env.services__api__http__0 || 
         'https://localhost:7149/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TENANT_ID_KEY = 'tenant_id';

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },
  
  getTenantId: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TENANT_ID_KEY);
    }
    return null;
  },
  
  setTenantId: (tenantId: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TENANT_ID_KEY, tenantId);
    }
  },
  
  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TENANT_ID_KEY);
    }
  },

  isTokenValid: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      // Simple JWT validation - check if it's not expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Invalid token format:', error);
      return false;
    }
  },
};

// Request interceptor to add auth token and tenant ID
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    const tenantId = tokenManager.getTenantId();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any;
    
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh', {
            refreshToken,
          });
          
          const { token } = response.data;
          tokenManager.setToken(token);
          
          return api(original);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          tokenManager.clearTokens();
          // Only redirect if we're not already on the login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        console.log('No refresh token available, clearing tokens');
        tokenManager.clearTokens();
        // Only redirect if this is not the initial /auth/me call
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/login') && 
            !original.url?.includes('/auth/me')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API response handler
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'An error occurred');
  }
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const result = handleApiResponse(response);
    
    // Store tokens
    tokenManager.setToken(result.token);
    if (result.refreshToken) {
      tokenManager.setRefreshToken(result.refreshToken);
    }
    if (result.user.tenantId) {
      tokenManager.setTenantId(result.user.tenantId);
    }
    
    return result;
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      tokenManager.clearTokens();
    }
  },
  
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await api.get<ApiResponse<UserDto>>('/auth/me');
    return handleApiResponse(response);
  },
  
  refreshToken: async (): Promise<string> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh', {
      refreshToken,
    });
    
    const result = handleApiResponse(response);
    tokenManager.setToken(result.token);
    
    return result.token;
  },
};

// Users API
export const usersApi = {
  getUsers: async (page: number = 1, pageSize: number = 10): Promise<UserDto[]> => {
    const response = await api.get<ApiResponse<UserDto[]>>(`/users?page=${page}&pageSize=${pageSize}`);
    return handleApiResponse(response);
  },
  
  getUserById: async (id: string): Promise<UserDto> => {
    const response = await api.get<ApiResponse<UserDto>>(`/users/${id}`);
    return handleApiResponse(response);
  },
  
  createUser: async (user: Partial<UserDto>): Promise<UserDto> => {
    const response = await api.post<ApiResponse<UserDto>>('/users', user);
    return handleApiResponse(response);
  },
  
  updateUser: async (id: string, user: Partial<UserDto>): Promise<UserDto> => {
    const response = await api.put<ApiResponse<UserDto>>(`/users/${id}`, user);
    return handleApiResponse(response);
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  
  getUserReportees: async (userId: string): Promise<UserDto[]> => {
    const response = await api.get<ApiResponse<UserDto[]>>(`/users/${userId}/reportees`);
    return handleApiResponse(response);
  },
};

// Projects API
export const projectsApi = {
  getProjects: async (page: number = 1, pageSize: number = 10): Promise<ProjectDto[]> => {
    const response = await api.get<ApiResponse<ProjectDto[]>>(`/projects?page=${page}&pageSize=${pageSize}`);
    return handleApiResponse(response);
  },
  
  getProjectById: async (id: string): Promise<ProjectDto> => {
    const response = await api.get<ApiResponse<ProjectDto>>(`/projects/${id}`);
    return handleApiResponse(response);
  },
  
  createProject: async (project: Partial<ProjectDto>): Promise<ProjectDto> => {
    const response = await api.post<ApiResponse<ProjectDto>>('/projects', project);
    return handleApiResponse(response);
  },
  
  updateProject: async (id: string, project: Partial<ProjectDto>): Promise<ProjectDto> => {
    const response = await api.put<ApiResponse<ProjectDto>>(`/projects/${id}`, project);
    return handleApiResponse(response);
  },
  
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
  
  getProjectTasks: async (projectId: string): Promise<TaskDto[]> => {
    const response = await api.get<ApiResponse<TaskDto[]>>(`/projects/${projectId}/tasks`);
    return handleApiResponse(response);
  },
};

// Tasks API
export const tasksApi = {
  getTasks: async (page: number = 1, pageSize: number = 10): Promise<TaskDto[]> => {
    const response = await api.get<ApiResponse<TaskDto[]>>(`/tasks?page=${page}&pageSize=${pageSize}`);
    return handleApiResponse(response);
  },
  
  getTaskById: async (id: string): Promise<TaskDto> => {
    const response = await api.get<ApiResponse<TaskDto>>(`/tasks/${id}`);
    return handleApiResponse(response);
  },
  
  createTask: async (task: Partial<TaskDto>): Promise<TaskDto> => {
    const response = await api.post<ApiResponse<TaskDto>>('/tasks', task);
    return handleApiResponse(response);
  },
  
  updateTask: async (id: string, task: Partial<TaskDto>): Promise<TaskDto> => {
    const response = await api.put<ApiResponse<TaskDto>>(`/tasks/${id}`, task);
    return handleApiResponse(response);
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  
  getUserTasks: async (userId: string): Promise<TaskDto[]> => {
    const response = await api.get<ApiResponse<TaskDto[]>>(`/users/${userId}/tasks`);
    return handleApiResponse(response);
  },
  
  updateTaskStatus: async (id: string, status: string): Promise<TaskDto> => {
    const response = await api.patch<ApiResponse<TaskDto>>(`/tasks/${id}/status`, { status });
    return handleApiResponse(response);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStatsDto> => {
    const response = await api.get<ApiResponse<DashboardStatsDto>>('/dashboard/stats');
    return handleApiResponse(response);
  },
  
  getRecentTasks: async (limit: number = 5): Promise<TaskDto[]> => {
    const response = await api.get<ApiResponse<TaskDto[]>>(`/dashboard/recent-tasks?limit=${limit}`);
    return handleApiResponse(response);
  },
  
  getRecentProjects: async (limit: number = 5): Promise<ProjectDto[]> => {
    const response = await api.get<ApiResponse<ProjectDto[]>>(`/dashboard/recent-projects?limit=${limit}`);
    return handleApiResponse(response);
  },
  
  getTeamMembers: async (): Promise<UserDto[]> => {
    const response = await api.get<ApiResponse<UserDto[]>>('/dashboard/team-members');
    return handleApiResponse(response);
  },
};

// Export the configured axios instance for custom requests
export default api;
