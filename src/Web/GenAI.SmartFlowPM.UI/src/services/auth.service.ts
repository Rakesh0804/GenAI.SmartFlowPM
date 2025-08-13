import axios from 'axios';
import { BaseApiService, TokenManager } from '../lib/base-api.service';
import { enhancedTokenManager } from '../lib/cookieManager';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserDto 
} from '../types/api.types';

export class AuthService extends BaseApiService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = await this.post<LoginResponse>('/auth/login', credentials);
    
    // Store tokens in both legacy and enhanced managers
    TokenManager.setToken(result.token);
    enhancedTokenManager.setToken(result.token, true); // Remember me = true for development
    
    if (result.refreshToken && result.refreshToken !== null) {
      TokenManager.setRefreshToken(result.refreshToken);
      enhancedTokenManager.setRefreshToken(result.refreshToken, true);
    }
    
    if (result.user.tenantId) {
      TokenManager.setTenantId(result.user.tenantId);
      enhancedTokenManager.setTenantId(result.user.tenantId);
    }
    
    return result;
  }

  async logout(): Promise<void> {
    try {
      await this.post<void>('/auth/logout');
    } finally {
      // Clear tokens from both managers
      TokenManager.clearTokens();
      enhancedTokenManager.clearTokens();
    }
  }

  async getCurrentUser(): Promise<UserDto> {
    return this.get<UserDto>('/auth/me');
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken || refreshToken === 'null') {
      throw new Error('No refresh token available - backend authentication issue');
    }

    // Check refresh token expiration
    try {
      // Only check expiration if the refresh token looks like a JWT (has 3 parts)
      const tokenParts = refreshToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = payload.exp;
        
        if (expirationTime) {
          const timeUntilExpiry = expirationTime - currentTime;
          
          if (timeUntilExpiry <= 0) {
            throw new Error('Refresh token is expired');
          }
        }
      }
    } catch (error) {
      // Continue anyway, let the server validate it
    }

    // Create a separate axios instance to avoid interceptor conflicts
    const refreshAxios = axios.create({
      baseURL: this.api.defaults.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔄 Making refresh request to:', `${this.api.defaults.baseURL}/auth/refresh`);
    console.log('🔄 Request payload:', { refreshToken: refreshToken.substring(0, 20) + '...' });

    try {
      const response = await refreshAxios.post('/auth/refresh', {
        refreshToken,
      });

      // Handle the API response format properly
      const result = response.data?.data || response.data;
      
      if (result.token) {
        // Store new token in both managers
        TokenManager.setToken(result.token);
        enhancedTokenManager.setToken(result.token, enhancedTokenManager.getRememberMe());
        
        // If new refresh token is provided, store it too
        if (result.refreshToken) {
          TokenManager.setRefreshToken(result.refreshToken);
          enhancedTokenManager.setRefreshToken(result.refreshToken, enhancedTokenManager.getRememberMe());
        }
        
        return result;
      } else {
        throw new Error('No token received from refresh endpoint');
      }
    } catch (error: any) {
      throw error;
    }
  }

  // Helper methods
  isAuthenticated(): boolean {
    return TokenManager.isTokenValid();
  }

  getToken(): string | null {
    return TokenManager.getToken();
  }

  getTenantId(): string | null {
    return TokenManager.getTenantId();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
