// Named HTTP client configuration for SmartFlowPM UI
export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  enableTracing: boolean;
  headers: Record<string, string>;
}

export interface ApiEndpoints {
  health: string;
  healthReady: string;
  healthLive: string;
  healthUI: string;
  auth: string;
  users: string;
  projects: string;
  tasks: string;
  organizations: string;
}

export const DEFAULT_HTTP_CONFIG: HttpClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7149/api',
  timeout: 30000,
  retryAttempts: 3,
  enableTracing: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Name': 'SmartFlowPM.UI',
    'X-Client-Version': '1.0.0'
  }
};

export const API_ENDPOINTS: ApiEndpoints = {
  health: '/health',
  healthReady: '/health/ready',
  healthLive: '/health/live',
  healthUI: '/health-ui',
  auth: '/auth',
  users: '/users',
  projects: '/projects',
  tasks: '/tasks',
  organizations: '/organizations'
};

// Health check specific configuration
export const HEALTH_CHECK_CONFIG: HttpClientConfig = {
  ...DEFAULT_HTTP_CONFIG,
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://localhost:7149',
  timeout: 10000,
  retryAttempts: 2,
  enableTracing: false,
  headers: {
    'Accept': 'application/json',
    'X-Client-Name': 'SmartFlowPM.HealthCheck'
  }
};

// Resilience configuration matching backend policies
export interface ResilienceConfig {
  retry: {
    maxAttempts: number;
    backoffType: 'exponential' | 'linear' | 'constant';
    baseDelay: number;
    maxDelay: number;
    jitter: boolean;
  };
  circuitBreaker: {
    failureThreshold: number;
    breakDuration: number;
    minimumThroughput: number;
  };
  timeout: {
    attempt: number;
    total: number;
  };
}

export const DEFAULT_RESILIENCE_CONFIG: ResilienceConfig = {
  retry: {
    maxAttempts: 3,
    backoffType: 'exponential',
    baseDelay: 1000,
    maxDelay: 30000,
    jitter: true
  },
  circuitBreaker: {
    failureThreshold: 0.5,
    breakDuration: 30000,
    minimumThroughput: 3
  },
  timeout: {
    attempt: 30000,
    total: 120000
  }
};
