// API response and pagination interfaces

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message?: string;
  errors?: string[];
  correlationId?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Request configuration with correlation tracking
 */
export interface ApiRequestConfig {
  correlationId?: string;
  skipAuth?: boolean;
  timeout?: number;
  retryable?: boolean;
}
