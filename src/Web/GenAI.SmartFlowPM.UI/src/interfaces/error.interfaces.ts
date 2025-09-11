// RFC 7807 Problem Details and Enhanced Error Response Interfaces

/**
 * RFC 7807 Problem Details for HTTP APIs
 * https://tools.ietf.org/html/rfc7807
 */
export interface ProblemDetails {
  /** A URI reference that identifies the problem type */
  type?: string;
  /** A short, human-readable summary of the problem type */
  title?: string;
  /** The HTTP status code */
  status?: number;
  /** A human-readable explanation specific to this occurrence of the problem */
  detail?: string;
  /** A URI reference that identifies the specific occurrence of the problem */
  instance?: string;
  /** Additional problem-specific data */
  [key: string]: any;
}

/**
 * Enhanced error response that combines RFC 7807 with backward compatibility
 */
export interface EnhancedErrorResponse extends ProblemDetails {
  // RFC 7807 Standard Fields
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;

  // Enhanced Tracking Fields
  correlationId?: string;
  timestamp?: string;
  code?: string;

  // Backward Compatibility Fields (existing UI expects these)
  isSuccess: boolean;
  message?: string;
  errors?: string[];

  // Enhanced Validation Support
  validationErrors?: Record<string, string[]>;

  // Additional Context
  extensions?: Record<string, any>;
}

/**
 * Standard API Error Categories
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS_RULE = 'business-rule',
  INFRASTRUCTURE = 'infrastructure',
  SYSTEM = 'system'
}

/**
 * Error context for better error handling
 */
export interface ErrorContext {
  category: ErrorCategory;
  isRetryable: boolean;
  shouldLogout: boolean;
  correlationId?: string;
  timestamp: string;
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  messages: string[];
}

/**
 * Processed error for UI consumption
 */
export interface ProcessedError {
  category: ErrorCategory;
  title: string;
  message: string;
  details?: string;
  correlationId?: string;
  validationErrors?: ValidationError[];
  isRetryable: boolean;
  shouldShowToUser: boolean;
  raw?: EnhancedErrorResponse;
}
