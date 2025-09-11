import { 
  EnhancedErrorResponse, 
  ErrorCategory, 
  ErrorContext, 
  ProcessedError, 
  ValidationError 
} from '../interfaces/error.interfaces';

/**
 * Enhanced error processing utility for RFC 7807 compliance and backward compatibility
 */
export class ErrorProcessor {
  
  /**
   * Generate a correlation ID for request tracking
   */
  static generateCorrelationId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract correlation ID from various sources
   */
  static extractCorrelationId(error: any, response?: any): string | undefined {
    // Try to get from enhanced error response
    if (error?.correlationId) return error.correlationId;
    
    // Try to get from response data
    if (response?.data?.correlationId) return response.data.correlationId;
    
    // Try to get from response headers
    if (response?.headers?.['x-correlation-id']) return response.headers['x-correlation-id'];
    
    // Try to get from error response
    if (error?.response?.data?.correlationId) return error.response.data.correlationId;
    if (error?.response?.headers?.['x-correlation-id']) return error.response.headers['x-correlation-id'];
    
    return undefined;
  }

  /**
   * Determine error category based on error properties
   */
  static categorizeError(error: any, response?: any): ErrorCategory {
    const status = error?.status || error?.response?.status;
    const errorData = error?.response?.data || error;
    
    // Check error type URI for RFC 7807 compliance
    if (errorData?.type) {
      if (errorData.type.includes('validation')) return ErrorCategory.VALIDATION;
      if (errorData.type.includes('authentication')) return ErrorCategory.AUTHENTICATION;
      if (errorData.type.includes('authorization')) return ErrorCategory.AUTHORIZATION;
      if (errorData.type.includes('business')) return ErrorCategory.BUSINESS_RULE;
      if (errorData.type.includes('infrastructure')) return ErrorCategory.INFRASTRUCTURE;
    }

    // Check error code
    if (errorData?.code) {
      if (errorData.code.includes('VALIDATION')) return ErrorCategory.VALIDATION;
      if (errorData.code.includes('AUTH')) return ErrorCategory.AUTHENTICATION;
      if (errorData.code.includes('PERMISSION')) return ErrorCategory.AUTHORIZATION;
      if (errorData.code.includes('BUSINESS')) return ErrorCategory.BUSINESS_RULE;
    }

    // Fallback to HTTP status codes
    switch (status) {
      case 400: return ErrorCategory.VALIDATION;
      case 401: return ErrorCategory.AUTHENTICATION;
      case 403: return ErrorCategory.AUTHORIZATION;
      case 409: return ErrorCategory.BUSINESS_RULE;
      case 422: return ErrorCategory.VALIDATION;
      case 500:
      case 502:
      case 503:
      case 504: return ErrorCategory.INFRASTRUCTURE;
      default: return ErrorCategory.SYSTEM;
    }
  }

  /**
   * Extract validation errors from various formats
   */
  static extractValidationErrors(error: any): ValidationError[] {
    const validationErrors: ValidationError[] = [];
    const errorData = error?.response?.data || error;

    // RFC 7807 enhanced validation errors
    if (errorData?.validationErrors) {
      Object.entries(errorData.validationErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          validationErrors.push({ field, messages });
        }
      });
    }

    // ModelState validation errors (legacy ASP.NET format)
    if (errorData?.errors && typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
      Object.entries(errorData.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          validationErrors.push({ field, messages });
        } else if (typeof messages === 'string') {
          validationErrors.push({ field, messages: [messages] });
        }
      });
    }

    return validationErrors;
  }

  /**
   * Extract user-friendly error message
   */
  static extractErrorMessage(error: any): string {
    const errorData = error?.response?.data || error;

    // RFC 7807 fields (priority order: detail -> title -> message)
    if (errorData?.detail) return errorData.detail;
    if (errorData?.title && errorData.title !== 'An error occurred') return errorData.title;
    
    // Backward compatibility fields
    if (errorData?.message) return errorData.message;
    
    // Handle array of errors
    if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
      return errorData.errors.join(', ');
    }

    // Handle validation errors
    const validationErrors = this.extractValidationErrors(error);
    if (validationErrors.length > 0) {
      return validationErrors
        .flatMap(ve => ve.messages)
        .join(', ');
    }

    // Fallback messages
    const status = error?.status || error?.response?.status;
    switch (status) {
      case 400: return 'The request was invalid. Please check your input.';
      case 401: return 'Authentication required. Please log in again.';
      case 403: return 'Access denied. You don\'t have permission for this action.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'A conflict occurred. The resource may have been modified.';
      case 422: return 'The provided data is invalid.';
      case 500: return 'A server error occurred. Please try again later.';
      case 502: return 'Service temporarily unavailable. Please try again.';
      case 503: return 'Service unavailable. Please try again later.';
      default: return error?.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: any): boolean {
    const status = error?.status || error?.response?.status;
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(status);
  }

  /**
   * Check if error should cause logout
   */
  static shouldLogout(error: any): boolean {
    const status = error?.status || error?.response?.status;
    const errorData = error?.response?.data || error;
    
    // 401 errors typically require re-authentication
    if (status === 401) return true;
    
    // Check for specific auth-related error codes
    if (errorData?.code?.includes('TOKEN_EXPIRED') || 
        errorData?.code?.includes('INVALID_TOKEN') ||
        errorData?.code?.includes('AUTH_REQUIRED')) {
      return true;
    }

    return false;
  }

  /**
   * Process error into a standardized format for UI consumption
   */
  static processError(error: any): ProcessedError {
    const category = this.categorizeError(error);
    const correlationId = this.extractCorrelationId(error);
    const validationErrors = this.extractValidationErrors(error);
    const message = this.extractErrorMessage(error);
    const isRetryable = this.isRetryable(error);
    
    const errorData = error?.response?.data || error;
    
    return {
      category,
      title: errorData?.title || this.getCategoryTitle(category),
      message,
      details: errorData?.detail,
      correlationId,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      isRetryable,
      shouldShowToUser: this.shouldShowToUser(category),
      raw: errorData as EnhancedErrorResponse
    };
  }

  /**
   * Get user-friendly title for error category
   */
  private static getCategoryTitle(category: ErrorCategory): string {
    switch (category) {
      case ErrorCategory.VALIDATION: return 'Validation Error';
      case ErrorCategory.AUTHENTICATION: return 'Authentication Required';
      case ErrorCategory.AUTHORIZATION: return 'Access Denied';
      case ErrorCategory.BUSINESS_RULE: return 'Business Rule Violation';
      case ErrorCategory.INFRASTRUCTURE: return 'Service Unavailable';
      case ErrorCategory.SYSTEM: return 'System Error';
      default: return 'Error';
    }
  }

  /**
   * Determine if error should be shown to user
   */
  private static shouldShowToUser(category: ErrorCategory): boolean {
    switch (category) {
      case ErrorCategory.VALIDATION:
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.AUTHORIZATION:
      case ErrorCategory.BUSINESS_RULE:
        return true;
      case ErrorCategory.INFRASTRUCTURE:
      case ErrorCategory.SYSTEM:
      default:
        return true; // Show generic message, hide technical details
    }
  }

  /**
   * Create error context for logging and debugging
   */
  static createErrorContext(error: any): ErrorContext {
    const category = this.categorizeError(error);
    
    return {
      category,
      isRetryable: this.isRetryable(error),
      shouldLogout: this.shouldLogout(error),
      correlationId: this.extractCorrelationId(error),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(validationErrors: ValidationError[]): string {
    if (validationErrors.length === 0) return '';
    
    return validationErrors
      .map(ve => `${ve.field}: ${ve.messages.join(', ')}`)
      .join('\n');
  }

  /**
   * Extract debug information for developers
   */
  static extractDebugInfo(error: any): Record<string, any> {
    const errorData = error?.response?.data || error;
    
    return {
      correlationId: this.extractCorrelationId(error),
      timestamp: errorData?.timestamp || new Date().toISOString(),
      status: error?.status || error?.response?.status,
      method: error?.config?.method?.toUpperCase(),
      url: error?.config?.url,
      type: errorData?.type,
      code: errorData?.code,
      instance: errorData?.instance,
      extensions: errorData?.extensions,
      stack: error?.stack
    };
  }
}
