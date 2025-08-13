'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tokenManager } from '../lib/api';
import { UserDto, LoginRequest, LoginResponse } from '../types/api.types';

// This ensures the component is only rendered on the client side
const isClient = typeof window !== 'undefined';

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

  const isAuthenticated = !!user && !!tokenManager.getToken();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getToken();

      if (token && tokenManager.isTokenValid()) {
        try {
          // Call /auth/me only during app initialization to validate stored token
          // and get current user data. We don't call this after login since
          // login response already includes complete user data.
          console.log('Valid token found, fetching current user...');
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          console.log('Current user fetched successfully:', currentUser.firstName);
        } catch (error: any) {
          console.error('Failed to get current user:', error);
          // If we get a 401 or any auth error, clear the invalid tokens
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Token appears to be invalid or expired, clearing tokens');
            tokenManager.clearTokens();
          }
          // Don't redirect to login here, let the user navigate naturally
        }
      } else if (token && !tokenManager.isTokenValid()) {
        // Token exists but is expired
        console.log('Expired token found, clearing tokens');
        tokenManager.clearTokens();
      } else {
        // No token found, user needs to login
        console.log('No token found, user needs to authenticate');
      }

      setIsLoading(false);
    };

    // Only run this on client side
    if (isClient) {
      initializeAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await authApi.login(credentials);
      
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
