'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { TokenManager } from '../lib/base-api.service';
import { enhancedTokenManager } from '../lib/cookieManager';
import { UserDto, LoginRequest, LoginResponse } from '../types/api.types';
import { useToast } from '../contexts/ToastContext';
import { AxiosError } from 'axios';

// This ensures the component is only rendered on the client side
const isClient = typeof window !== 'undefined';

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkTokenExpiration: () => boolean;
  getTimeUntilExpiry: () => number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = isClient ? useRouter() : null;
  const { error: showErrorToast } = useToast();

  const isAuthenticated = !!user && !!enhancedTokenManager.getToken();

  // Check token expiration
  const checkTokenExpiration = (): boolean => {
    return enhancedTokenManager.isTokenValid();
  };

  // Get time until token expiry (in milliseconds)
  const getTimeUntilExpiry = (): number | null => {
    const expiration = enhancedTokenManager.getTokenExpiration();
    if (!expiration) return null;
    return expiration.getTime() - Date.now();
  };

  // Initialize user from token on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Starting auth initialization...');
      
      // Helper function to get cookie value
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
      
      // Debug storage contents
      const token = enhancedTokenManager.getToken();
      const refreshToken = enhancedTokenManager.getRefreshToken();
      
      // Check token expiration
      if (token) {
        // Check token expiration first
        let isTokenExpired = false;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const expirationTime = payload.exp;
          const timeUntilExpiry = expirationTime - currentTime;
          
          isTokenExpired = timeUntilExpiry <= 0;
        } catch (error) {
          isTokenExpired = true; // Treat invalid tokens as expired
        }

        if (isTokenExpired && refreshToken && refreshToken !== 'null') {
          // Token is expired, skip /auth/me and go directly to refresh
          try {
            const refreshResponse = await authService.refreshToken();
            
            // Update both token managers
            enhancedTokenManager.setToken(refreshResponse.token, enhancedTokenManager.getRememberMe());
            TokenManager.setToken(refreshResponse.token);
            
            // Now try to get user with new token
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (refreshError: any) {
            enhancedTokenManager.clearTokens();
            TokenManager.clearTokens();
          }
        } else if (!isTokenExpired) {
          // Token is valid, try to get user
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error: any) {
            // If /auth/me fails and we have a refresh token, try to refresh
            if (error?.response?.status === 401 && refreshToken && refreshToken !== 'null') {
              try {
                const refreshResponse = await authService.refreshToken();
                
                // Update both token managers
                enhancedTokenManager.setToken(refreshResponse.token, enhancedTokenManager.getRememberMe());
                TokenManager.setToken(refreshResponse.token);
                
                // Now try to get user again with new token
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
              } catch (refreshError: any) {
                enhancedTokenManager.clearTokens();
                TokenManager.clearTokens();
              }
            } else {
              // No refresh token or different error, clear everything
              enhancedTokenManager.clearTokens();
              TokenManager.clearTokens();
            }
          }
        } else {
          // Token expired but no refresh token or refresh token is null
          enhancedTokenManager.clearTokens();
          TokenManager.clearTokens();
        }
      }
      
      setIsLoading(false);
    };

    if (isClient) {
      initializeAuth();
    }
  }, []);

  // Auto-refresh token before expiry (90% of token lifetime)
  // DISABLED: Rely on BaseApiService interceptor for token refresh to prevent conflicts
  /*
  useEffect(() => {
    if (!isClient || !isAuthenticated) return;

    const checkAndRefreshToken = async () => {
      const expiration = enhancedTokenManager.getTokenExpiration();
      
      if (expiration) {
        const timeUntilExpiry = expiration.getTime() - Date.now();
        
        if (timeUntilExpiry > 0) {
          // Refresh when 90% of token lifetime has passed
          const refreshThreshold = 0.9;
          const tokenLifetime = 60 * 60 * 1000; // 1 hour in milliseconds
          const timeToRefresh = tokenLifetime * (1 - refreshThreshold);
          
          if (timeUntilExpiry <= timeToRefresh) {
            try {
              const refreshToken = enhancedTokenManager.getRefreshToken();
              if (refreshToken) {
                const refreshResponse = await authService.refreshToken();
                enhancedTokenManager.setToken(refreshResponse.token, enhancedTokenManager.getRememberMe());
                
                // Also update in the legacy token manager for compatibility
                TokenManager.setToken(refreshResponse.token);
              }
            } catch (error) {
              console.error('Token refresh failed:', error);
              await logout();
            }
          }
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    
    // Also check immediately
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, [isAuthenticated]);
  */

  const login = async (credentials: LoginRequest, rememberMe: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response: LoginResponse = await authService.login(credentials);
      
      // Store tokens based on rememberMe preference
      if (rememberMe) {
        // Use cookie storage for persistent login
        enhancedTokenManager.setToken(response.token, true);
        enhancedTokenManager.setRefreshToken(response.refreshToken, true);
      } else {
        // Use session storage for current session only
        enhancedTokenManager.setToken(response.token, false);
        enhancedTokenManager.setRefreshToken(response.refreshToken, false);
      }
      
      // Also set in legacy token manager for backward compatibility
      TokenManager.setToken(response.token);
      TokenManager.setRefreshToken(response.refreshToken);
      
      // Validate that we have a valid user in the response
      if (!response.user || !response.user.id) {
        throw new Error('Invalid user data received from server');
      }
      
      // Use user data from login response - no need to call /auth/me
      setUser(response.user);
      
      if (router) {
        router.push('/dashboard');
      }
    } catch (error: any) {
      // Don't wrap the error - preserve the original error structure
      // so that the LoginForm can properly extract the error message
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear both storage methods
      enhancedTokenManager.clearTokens();
      TokenManager.clearTokens();
      setIsLoading(false);
      if (router) {
        router.push('/login');
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      // Call /auth/me to get fresh user data (e.g., after profile updates)
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      
      // Handle different error types gracefully
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // Handle 401 Unauthorized with toast notification
          showErrorToast('Your session has expired. Please log in again.');
        } else if (error.response?.status) {
          // Handle other HTTP errors
          showErrorToast(`Unable to connect to server (${error.response.status}). Please try again.`);
        } else {
          // Network error
          showErrorToast('Connection error. Please check your internet and try again.');
        }
      } else {
        // Other error types
        showErrorToast('An unexpected error occurred. Please try again.');
      }
      
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    checkTokenExpiration,
    getTimeUntilExpiry,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for advanced usage
export { AuthContext };
