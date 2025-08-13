/**
 * Cookie Management Utility
 * Handles authentication token storage in cookies with security features
 */

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const defaultCookieOptions: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const cookieManager = {
  // Set cookie with security options
  setCookie: (name: string, value: string, options: CookieOptions = {}): void => {
    if (typeof window === 'undefined') return;

    const opts = { ...defaultCookieOptions, ...options };
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (opts.expires) {
      cookieString += `; expires=${opts.expires.toUTCString()}`;
    }

    if (opts.maxAge) {
      cookieString += `; max-age=${opts.maxAge}`;
    }

    if (opts.domain) {
      cookieString += `; domain=${opts.domain}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    }

    if (opts.secure) {
      cookieString += `; secure`;
    }

    if (opts.httpOnly) {
      cookieString += `; httponly`;
    }

    if (opts.sameSite) {
      cookieString += `; samesite=${opts.sameSite}`;
    }

    document.cookie = cookieString;
  },

  // Get cookie value
  getCookie: (name: string): string | null => {
    if (typeof window === 'undefined') return null;

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
  },

  // Remove cookie
  removeCookie: (name: string, options: CookieOptions = {}): void => {
    if (typeof window === 'undefined') return;

    const opts = { ...defaultCookieOptions, ...options };
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (opts.domain) {
      cookieString += `; domain=${opts.domain}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    }

    document.cookie = cookieString;
  },

  // Get all cookies as object
  getAllCookies: (): Record<string, string> => {
    if (typeof window === 'undefined') return {};

    const cookies: Record<string, string> = {};
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      const eqPos = c.indexOf('=');
      if (eqPos > 0) {
        const name = c.substring(0, eqPos);
        const value = decodeURIComponent(c.substring(eqPos + 1));
        cookies[name] = value;
      }
    }
    return cookies;
  },

  // Check if cookie exists
  hasCookie: (name: string): boolean => {
    return cookieManager.getCookie(name) !== null;
  },
};

// Auth-specific cookie keys
export const AUTH_COOKIES = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  TENANT_ID: 'tenant_id',
  USER_PREFERENCES: 'user_preferences',
  REMEMBER_ME: 'remember_me',
} as const;

// Enhanced token manager that uses both localStorage and cookies
export const enhancedTokenManager = {
  // Use cookies for production, localStorage for development
  getStorageMethod: (): 'cookie' | 'localStorage' => {
    return process.env.NODE_ENV === 'production' ? 'cookie' : 'localStorage';
  },

  // Get token from preferred storage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;

    const method = enhancedTokenManager.getStorageMethod();
    if (method === 'cookie') {
      return cookieManager.getCookie(AUTH_COOKIES.TOKEN);
    } else {
      return localStorage.getItem(AUTH_COOKIES.TOKEN);
    }
  },

  // Set token in preferred storage
  setToken: (token: string, rememberMe: boolean = false): void => {
    if (typeof window === 'undefined') return;

    const method = enhancedTokenManager.getStorageMethod();
    const expires = rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined; // 30 days if remember me

    if (method === 'cookie') {
      cookieManager.setCookie(AUTH_COOKIES.TOKEN, token, {
        expires,
        secure: true,
        sameSite: 'strict',
      });
      cookieManager.setCookie(AUTH_COOKIES.REMEMBER_ME, rememberMe.toString());
    } else {
      localStorage.setItem(AUTH_COOKIES.TOKEN, token);
      localStorage.setItem(AUTH_COOKIES.REMEMBER_ME, rememberMe.toString());
    }
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;

    const method = enhancedTokenManager.getStorageMethod();
    if (method === 'cookie') {
      return cookieManager.getCookie(AUTH_COOKIES.REFRESH_TOKEN);
    } else {
      return localStorage.getItem(AUTH_COOKIES.REFRESH_TOKEN);
    }
  },

  // Set refresh token
  setRefreshToken: (token: string, rememberMe: boolean = false): void => {
    if (typeof window === 'undefined') return;

    const method = enhancedTokenManager.getStorageMethod();
    const expires = rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined;

    if (method === 'cookie') {
      cookieManager.setCookie(AUTH_COOKIES.REFRESH_TOKEN, token, {
        expires,
        secure: true,
        sameSite: 'strict',
        httpOnly: false, // Need to access via JS for token refresh
      });
    } else {
      localStorage.setItem(AUTH_COOKIES.REFRESH_TOKEN, token);
    }
  },

  // Get tenant ID
  getTenantId: (): string | null => {
    if (typeof window === 'undefined') return null;

    const method = enhancedTokenManager.getStorageMethod();
    if (method === 'cookie') {
      return cookieManager.getCookie(AUTH_COOKIES.TENANT_ID);
    } else {
      return localStorage.getItem(AUTH_COOKIES.TENANT_ID);
    }
  },

  // Set tenant ID
  setTenantId: (tenantId: string): void => {
    if (typeof window === 'undefined') return;

    const method = enhancedTokenManager.getStorageMethod();
    if (method === 'cookie') {
      cookieManager.setCookie(AUTH_COOKIES.TENANT_ID, tenantId);
    } else {
      localStorage.setItem(AUTH_COOKIES.TENANT_ID, tenantId);
    }
  },

  // Check if user wants to be remembered
  getRememberMe: (): boolean => {
    if (typeof window === 'undefined') return false;

    const method = enhancedTokenManager.getStorageMethod();
    const value = method === 'cookie' 
      ? cookieManager.getCookie(AUTH_COOKIES.REMEMBER_ME)
      : localStorage.getItem(AUTH_COOKIES.REMEMBER_ME);
    
    return value === 'true';
  },

  // Clear all auth data
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;

    const method = enhancedTokenManager.getStorageMethod();
    
    if (method === 'cookie') {
      Object.values(AUTH_COOKIES).forEach(key => {
        cookieManager.removeCookie(key);
      });
    } else {
      Object.values(AUTH_COOKIES).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  },

  // Token validation with enhanced error handling
  isTokenValid: (): boolean => {
    const token = enhancedTokenManager.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = 60; // 1 minute buffer before expiration

      return payload.exp > (currentTime + bufferTime);
    } catch (error) {
      console.error('Invalid token format:', error);
      return false;
    }
  },

  // Get token expiration time
  getTokenExpiration: (): Date | null => {
    const token = enhancedTokenManager.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Get user data from token
  getUserFromToken: (): Partial<{ id: string; email: string; userName: string; roles: string[] }> | null => {
    const token = enhancedTokenManager.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.UserId || payload.sub,
        email: payload.email,
        userName: payload.userName,
        roles: payload.roles || [],
      };
    } catch (error) {
      console.error('Error parsing token user data:', error);
      return null;
    }
  },
};
