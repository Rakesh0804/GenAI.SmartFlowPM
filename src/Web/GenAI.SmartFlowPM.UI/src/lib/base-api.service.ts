import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/api.types';
import { traceApiCall } from './tracing';

// Token management utility
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TENANT_ID_KEY = 'tenant_id';

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      // First check cookies since that's where tokens are actually stored
      const getCookie = (name: string): string | null => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
          }
        }
        return null;
      };
      
      let token = getCookie('token') || getCookie(this.TOKEN_KEY);
      
      if (!token) {
        // Fallback to localStorage
        token = localStorage.getItem(this.TOKEN_KEY);
        
        // Final fallback: check sessionStorage with different possible keys
        if (!token) {
          token = sessionStorage.getItem('token') || 
                  sessionStorage.getItem(this.TOKEN_KEY) ||
                  localStorage.getItem('token');
        }
      }
      
      return token;
    }
    return null;
  }

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      // First check cookies since that's where tokens are actually stored
      const getCookie = (name: string): string | null => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
          }
        }
        return null;
      };
      
      let refreshToken = getCookie('refreshToken') || getCookie(this.REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        // Fallback to localStorage
        refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
        
        // Final fallback: check sessionStorage with different possible keys
        if (!refreshToken) {
          refreshToken = sessionStorage.getItem('refreshToken') || 
                        sessionStorage.getItem(this.REFRESH_TOKEN_KEY) ||
                        localStorage.getItem('refreshToken');
        }
      }
      
      return refreshToken;
    }
    return null;
  }

  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  static getTenantId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TENANT_ID_KEY);
    }
    return null;
  }

  static setTenantId(tenantId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TENANT_ID_KEY, tenantId);
    }
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TENANT_ID_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Clear sessionStorage 
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.TENANT_ID_KEY);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      
      // Clear cookies
      const removeCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      };
      
      removeCookie('token');
      removeCookie('refreshToken');
      removeCookie(this.TOKEN_KEY);
      removeCookie(this.REFRESH_TOKEN_KEY);
      removeCookie(this.TENANT_ID_KEY);
    }
  }

  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Invalid token format:', error);
      return false;
    }
  }

  static isTokenExpiringSoon(bufferMinutes: number = 5): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferSeconds = bufferMinutes * 60;
      return payload.exp <= (currentTime + bufferSeconds);
    } catch (error) {
      console.error('Invalid token format:', error);
      return true;
    }
  }
}

// Base API Service class
export class BaseApiService {
  protected api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor(baseURL?: string) {
    const apiUrl = baseURL || process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7149/api';
    
    this.api = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  private async refreshAuthToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      console.log('Attempting to refresh token...');
      
      // Create a separate axios instance for refresh to avoid interceptor loop
      const refreshAxios = axios.create({
        baseURL: this.api.defaults.baseURL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await refreshAxios.post('/auth/refresh', {
        refreshToken,
      });


      // Handle the API response format properly
      if (response.data?.isSuccess && response.data?.data) {
        const { token, refreshToken: newRefreshToken } = response.data.data;
        
        if (token) {
          TokenManager.setToken(token);
          
          // Update refresh token if provided
          if (newRefreshToken) {
            TokenManager.setRefreshToken(newRefreshToken);
          }
          
          console.log('Token refreshed successfully');
          return token;
        } else {
          throw new Error('No token received from refresh endpoint');
        }
      } else {
        throw new Error('Invalid refresh response format');
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token, tenant ID, and correlation ID
    this.api.interceptors.request.use(
      async (config) => {
        const token = TokenManager.getToken();
        const tenantId = TokenManager.getTenantId();

        // Add correlation ID for request tracking
        const correlationId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        config.headers['X-Correlation-ID'] = correlationId;

        // Check if token is expiring soon and proactively refresh it
        if (token && TokenManager.isTokenExpiringSoon(5) && !config.url?.includes('/auth/refresh')) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            
            try {
              const newToken = await this.refreshAuthToken();
              config.headers.Authorization = `Bearer ${newToken}`;
              this.processQueue(null, newToken);
            } catch (error) {
              this.processQueue(error, null);
              TokenManager.clearTokens();
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
              return Promise.reject(error);
            } finally {
              this.isRefreshing = false;
            }
          } else {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((newToken) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              return config;
            });
          }
        } else if (token) {
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
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as any;

        if (error.response?.status === 401 && original && !original._retry) {
          original._retry = true;

          // If we're already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ 
                resolve: (token: string) => {
                  original.headers.Authorization = `Bearer ${token}`;
                  resolve(this.api(original));
                },
                reject: (err: any) => {
                  reject(err);
                }
              });
            });
          }

          const refreshToken = TokenManager.getRefreshToken();
          
          if (refreshToken && !original.url?.includes('/auth/refresh')) {
            this.isRefreshing = true;
            
            try {
              const newToken = await this.refreshAuthToken();
              
              // Update the failed request with new token
              original.headers.Authorization = `Bearer ${newToken}`;
              
              // Process any queued requests
              this.processQueue(null, newToken);
              
              // Retry the original request
              return this.api(original);
            } catch (refreshError: any) {
              console.error('Token refresh failed:', refreshError);
              
              // Process queue with error
              this.processQueue(refreshError, null);
              
              // Clear tokens and redirect to login
              TokenManager.clearTokens();
              if (typeof window !== 'undefined' && 
                  !window.location.pathname.includes('/login') &&
                  !original.url?.includes('/auth/me')) {
                console.log('Redirecting to login due to refresh failure');
                window.location.href = '/login';
              }
              
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          } else {
            // No refresh token available or refresh endpoint call failed
            console.log('No refresh token available, clearing tokens');
            TokenManager.clearTokens();
            if (typeof window !== 'undefined' && 
                !window.location.pathname.includes('/login') && 
                !original.url?.includes('/auth/me')) {
              console.log('Redirecting to login due to missing refresh token');
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic API response handler
  protected handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    // Handle cases where response.data might be null or undefined
    if (!response.data) {
      console.error('API response data is null or undefined:', response);
      throw new Error('Invalid API response: no data received');
    }

    // Check for success status
    const isSuccess = response.data.isSuccess ?? (response.status >= 200 && response.status < 300);
    
    if (isSuccess) {
      // For responses where data might be null/undefined (like logout), return null as T
      return response.data.data ?? null as T;
    } else {
      // Enhanced error handling with better debugging info
      const errorMessage = response.data.message || 
                          (response.data as any)?.title || 
                          `HTTP ${response.status}: An error occurred`;
      
      const error = new Error(errorMessage) as any;
      error.errors = response.data.errors || [];
      error.isApiError = true;
      error.status = response.status;
      error.correlationId = response.data.correlationId;
      
      // Log error details for debugging
      console.error('API Error Details:', {
        message: errorMessage,
        errors: error.errors,
        status: response.status,
        correlationId: error.correlationId,
        response: response.data
      });
      
      throw error;
    }
  }

  // Enhanced helper method to extract error messages from API error (RFC 7807 + backward compatible)
  public static extractErrorMessage(error: any): string {
    if (error?.isApiError) {
      // If it's an API error with validation errors, format them
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        return error.errors.join(', ');
      }
      // Otherwise use the main message
      return error.message || 'An error occurred';
    }
    
    // Handle Axios errors
    if (error?.response?.data) {
      const responseData = error.response.data;
      
      // RFC 7807 fields (priority order)
      if (responseData.detail) return responseData.detail;
      if (responseData.title && responseData.title !== 'An error occurred') return responseData.title;
      
      // Check for API response format
      if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        return responseData.errors.join(', ');
      }
      
      if (responseData.message) {
        return responseData.message;
      }
      
      // Handle validation errors (both old ModelState and new RFC 7807 format)
      if (responseData.validationErrors) {
        const validationErrors: string[] = [];
        Object.entries(responseData.validationErrors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => validationErrors.push(`${field}: ${msg}`));
          } else if (typeof messages === 'string') {
            validationErrors.push(`${field}: ${messages}`);
          }
        });
        if (validationErrors.length > 0) {
          return validationErrors.join(', ');
        }
      }
      
      // Handle FluentValidation errors format (legacy)
      if (responseData.title && responseData.title.includes('validation') && responseData.errors) {
        const validationErrors: string[] = [];
        
        if (typeof responseData.errors === 'object' && !Array.isArray(responseData.errors)) {
          // Extract validation errors from ModelState format
          Object.keys(responseData.errors).forEach(key => {
            const fieldErrors = responseData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err: string) => validationErrors.push(err));
            }
          });
        }
        
        if (validationErrors.length > 0) {
          return validationErrors.join(', ');
        }
        
        return responseData.title || 'Validation error occurred';
      }
    }
    
    // Default error message
    return error?.message || 'An unexpected error occurred';
  }

  // Generic CRUD operations
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return traceApiCall(`GET ${url}`, async () => {
      const response = await this.api.get<ApiResponse<T>>(url, config);
      return this.handleResponse(response);
    });
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return traceApiCall(`POST ${url}`, async () => {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response);
    });
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return this.handleResponse(response);
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<ApiResponse<T>>(url, data, config);
    return this.handleResponse(response);
  }

  protected async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
    await this.api.delete(url, config);
  }

  // Utility methods for common operations
  protected buildQueryParams(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  }

  protected buildPaginationUrl(baseUrl: string, page: number = 1, pageSize: number = 10): string {
    return `${baseUrl}${this.buildQueryParams({ page, pageSize })}`;
  }
}

// Export singleton instance for shared usage
export const baseApiService = new BaseApiService();
