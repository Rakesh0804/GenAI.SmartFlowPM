import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/api.types';

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
}

// Base API Service class
export class BaseApiService {
  protected api: AxiosInstance;

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

  private setupInterceptors(): void {
    // Request interceptor to add auth token and tenant ID
    this.api.interceptors.request.use(
      (config) => {
        const token = TokenManager.getToken();
        const tenantId = TokenManager.getTenantId();

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
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as any;

        if (error.response?.status === 401 && original && !original._retry) {
          original._retry = true;

          const refreshToken = TokenManager.getRefreshToken();
          
          if (refreshToken && !original.url?.includes('/auth/refresh')) {
            try {
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
              const newToken = response.data?.data?.token || response.data?.token;
              if (newToken) {
                TokenManager.setToken(newToken);
                return this.api(original);
              } else {
                throw new Error('No token received from refresh endpoint');
              }
            } catch (refreshError: any) {
              TokenManager.clearTokens();
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          } else {
            TokenManager.clearTokens();
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
  }

  // Generic API response handler
  protected handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'An error occurred');
    }
  }

  // Generic CRUD operations
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return this.handleResponse(response);
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return this.handleResponse(response);
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
