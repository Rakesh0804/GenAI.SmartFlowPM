import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { DEFAULT_HTTP_CONFIG, HEALTH_CHECK_CONFIG, HttpClientConfig, ResilienceConfig, DEFAULT_RESILIENCE_CONFIG } from './http-client-config';

export type HttpClientName = 'default' | 'healthCheck' | 'externalAPI';

interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

interface RetryState {
  attempts: number;
  lastError?: Error;
}

export class SmartFlowHttpClient {
  private clients: Map<HttpClientName, AxiosInstance> = new Map();
  private retryStates: Map<string, RetryState> = new Map();
  
  constructor() {
    this.initializeClients();
  }

  private initializeClients(): void {
    // Default client for API calls
    this.clients.set('default', this.createClient('default', DEFAULT_HTTP_CONFIG));
    
    // Health check client
    this.clients.set('healthCheck', this.createClient('healthCheck', HEALTH_CHECK_CONFIG));
    
    // External API client (for future use)
    this.clients.set('externalAPI', this.createClient('externalAPI', {
      ...DEFAULT_HTTP_CONFIG,
      timeout: 60000,
      headers: {
        ...DEFAULT_HTTP_CONFIG.headers,
        'X-Client-Name': 'SmartFlowPM.External'
      }
    }));
  }

  private createClient(name: HttpClientName, config: HttpClientConfig): AxiosInstance {
    const client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers
    });

    // Request interceptor
    client.interceptors.request.use(
      (requestConfig: InternalAxiosRequestConfig) => {
        // Add trace context if tracing is enabled
        if (config.enableTracing) {
          const traceContext = this.generateTraceContext();
          requestConfig.headers['X-Trace-Id'] = traceContext.traceId;
          requestConfig.headers['X-Span-Id'] = traceContext.spanId;
          if (traceContext.parentSpanId) {
            requestConfig.headers['X-Parent-Span-Id'] = traceContext.parentSpanId;
          }
        }

        // Add timestamp
        requestConfig.headers['X-Request-Timestamp'] = new Date().toISOString();
        
        // Add request ID for correlation
        requestConfig.headers['X-Request-Id'] = this.generateRequestId();

        // Add JWT token if available
        const token = this.getAuthToken();
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Add tenant ID if available
        const tenantId = this.getTenantId();
        if (tenantId) {
          requestConfig.headers['X-Tenant-Id'] = tenantId;
        }

        console.log(`[${name}] Outgoing request:`, {
          method: requestConfig.method?.toUpperCase(),
          url: requestConfig.url,
          traceId: requestConfig.headers['X-Trace-Id'],
          requestId: requestConfig.headers['X-Request-Id']
        });

        return requestConfig;
      },
      (error: any) => {
        console.error(`[${name}] Request interceptor error:`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[${name}] Response received:`, {
          status: response.status,
          statusText: response.statusText,
          traceId: response.config.headers['X-Trace-Id'],
          requestId: response.config.headers['X-Request-Id'],
          duration: this.calculateDuration(response.config.headers['X-Request-Timestamp'])
        });

        return response;
      },
      async (error: AxiosError) => {
        const requestConfig = error.config;
        if (!requestConfig) return Promise.reject(error);

        console.error(`[${name}] Response error:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          traceId: requestConfig.headers?.['X-Trace-Id'],
          requestId: requestConfig.headers?.['X-Request-Id']
        });

        // Implement retry logic
        if (this.shouldRetry(error, name)) {
          return this.retryRequest(requestConfig, error, name);
        }

        return Promise.reject(error);
      }
    );

    return client;
  }

  private shouldRetry(error: AxiosError, clientName: HttpClientName): boolean {
    const requestId = error.config?.headers?.['X-Request-Id'] as string;
    if (!requestId) return false;

    const retryState = this.retryStates.get(requestId) || { attempts: 0 };
    
    // Don't retry if max attempts reached
    if (retryState.attempts >= DEFAULT_RESILIENCE_CONFIG.retry.maxAttempts) {
      return false;
    }

    // Don't retry for certain status codes
    const nonRetryableStatuses: number[] = [400, 401, 403, 404, 422];
    if (error.response && nonRetryableStatuses.includes(error.response.status)) {
      return false;
    }

    // Retry for network errors, timeouts, and 5xx errors
    return !error.response || 
           error.code === 'ECONNABORTED' || 
           error.code === 'ENOTFOUND' ||
           (error.response.status >= 500);
  }

  private async retryRequest(
    config: AxiosRequestConfig,
    error: AxiosError,
    clientName: HttpClientName
  ): Promise<AxiosResponse> {
    const requestId = config.headers?.['X-Request-Id'] as string;
    const retryState = this.retryStates.get(requestId) || { attempts: 0 };
    
    retryState.attempts++;
    retryState.lastError = error;
    this.retryStates.set(requestId, retryState);

    // Calculate delay
    const delay = this.calculateRetryDelay(retryState.attempts);
    
    console.log(`[${clientName}] Retrying request (attempt ${retryState.attempts}/${DEFAULT_RESILIENCE_CONFIG.retry.maxAttempts}) after ${delay}ms`);
    
    await this.sleep(delay);

    const client = this.clients.get(clientName);
    if (!client) throw new Error(`Client ${clientName} not found`);

    return client.request(config);
  }

  private calculateRetryDelay(attempt: number): number {
    const { baseDelay, maxDelay, jitter } = DEFAULT_RESILIENCE_CONFIG.retry;
    
    let delay: number;
    
    switch (DEFAULT_RESILIENCE_CONFIG.retry.backoffType) {
      case 'exponential':
        delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
        break;
      case 'linear':
        delay = Math.min(baseDelay * attempt, maxDelay);
        break;
      case 'constant':
      default:
        delay = baseDelay;
        break;
    }

    // Add jitter if enabled
    if (jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  private generateTraceContext(): TraceContext {
    return {
      traceId: this.generateId(32),
      spanId: this.generateId(16),
      parentSpanId: this.getParentSpanId()
    };
  }

  private generateRequestId(): string {
    return this.generateId(16);
  }

  private generateId(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  private getParentSpanId(): string | undefined {
    // Get from context or previous span
    return undefined;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 
             sessionStorage.getItem('token');
    }
    return null;
  }

  private getTenantId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tenantId') || 
             sessionStorage.getItem('tenantId');
    }
    return null;
  }

  private calculateDuration(startTime: string | undefined): number {
    if (!startTime) return 0;
    return Date.now() - new Date(startTime).getTime();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods
  public getClient(name: HttpClientName = 'default'): AxiosInstance {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`HTTP client '${name}' not found`);
    }
    return client;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient('healthCheck');
      const response = await client.get('/health/ready');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  public clearRetryState(requestId?: string): void {
    if (requestId) {
      this.retryStates.delete(requestId);
    } else {
      this.retryStates.clear();
    }
  }

  public getRetryStats(): { activeRetries: number; totalRequests: number } {
    return {
      activeRetries: this.retryStates.size,
      totalRequests: Array.from(this.retryStates.values())
        .reduce((sum, state) => sum + state.attempts, 0)
    };
  }
}

// Singleton instance
export const httpClient = new SmartFlowHttpClient();

// Named exports for convenience
export const defaultHttpClient = httpClient.getClient('default');
export const healthCheckClient = httpClient.getClient('healthCheck');
export const externalApiClient = httpClient.getClient('externalAPI');
