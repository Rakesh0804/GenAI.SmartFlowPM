'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tokenManager } from '../lib/api';
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
      const token = enhancedTokenManager.getToken();
      
      if (token && enhancedTokenManager.isTokenValid()) {
        try {
          // Verify token is still valid by calling /auth/me
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Token verification failed:', error);
          enhancedTokenManager.clearTokens();
          tokenManager.clearTokens();
        }
      }
      
      setIsLoading(false);
    };

    if (isClient) {
      initializeAuth();
    }
  }, []);

  // Auto-refresh token before expiry (90% of token lifetime)
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
                const refreshResponse = await authApi.refreshToken();
                enhancedTokenManager.setToken(refreshResponse.token, enhancedTokenManager.getRememberMe());
                
                // Also update in the legacy token manager for compatibility
                tokenManager.setToken(refreshResponse.token);
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

  const login = async (credentials: LoginRequest, rememberMe: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response: LoginResponse = await authApi.login(credentials);
      
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
      tokenManager.setToken(response.token);
      tokenManager.setRefreshToken(response.refreshToken);
      
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
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear both storage methods
      enhancedTokenManager.clearTokens();
      tokenManager.clearTokens();
      setIsLoading(false);
      if (router) {
        router.push('/login');
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      // Call /auth/me to get fresh user data (e.g., after profile updates)
      const currentUser = await authApi.getCurrentUser();
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
