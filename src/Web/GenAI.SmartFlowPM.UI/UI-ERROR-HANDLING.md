# Frontend Global Exception Handling Implementation

## Overview

This document outlines the enhanced error handling implementation in the UI project to support the new RFC 7807 compliant global exception handling from the API.

## Architecture

### 1. Error Processing Pipeline

```
API Error Response → ErrorProcessor → ProcessedError → Toast Display
```

### 2. Key Components

#### ErrorProcessor (`src/lib/error-processor.ts`)
- Processes raw API errors into standardized format
- Extracts correlation IDs for debugging
- Categorizes errors by type
- Handles validation errors and business rules

#### Enhanced Toast System (`src/contexts/ToastContext.tsx`)
- Displays correlation IDs in development mode
- Shows field-specific validation errors
- Supports enhanced error details

#### BaseApiService (`src/lib/base-api.service.ts`)
- Adds correlation ID headers to requests
- Uses ErrorProcessor for consistent error handling
- Maintains backward compatibility

## Error Response Format

### RFC 7807 Enhanced Response
```typescript
interface EnhancedErrorResponse {
  // RFC 7807 Standard
  type: string;              // "https://smartflow.com/problems/validation-error"
  title: string;             // "Validation Failed"
  status: number;            // 400
  detail?: string;           // "One or more validation errors occurred"
  instance?: string;         // "/api/users"
  
  // Enhanced Tracking
  correlationId?: string;    // "req_1694347200000_abc123"
  timestamp?: string;        // "2025-09-10T14:30:00Z"
  code?: string;            // "VALIDATION_FAILED"
  
  // Backward Compatibility
  isSuccess: boolean;        // false
  message?: string;          // "One or more validation errors occurred"
  errors?: string[];         // ["Name is required"]
  
  // Validation Support
  validationErrors?: Record<string, string[]>; // {"Name": ["Name is required"]}
  
  // Additional Context
  extensions?: Record<string, any>;
}
```

### Processed Error Format
```typescript
interface ProcessedError {
  category: ErrorCategory;           // 'validation' | 'authentication' | etc.
  title: string;                     // "Validation Error"
  message: string;                   // User-friendly message
  details?: string;                  // Additional context
  correlationId?: string;            // For debugging
  validationErrors?: ValidationError[]; // Field-specific errors
  isRetryable: boolean;             // Can user retry?
  shouldShowToUser: boolean;        // Should be displayed?
  raw?: EnhancedErrorResponse;      // Original response
}
```

## Usage Examples

### Basic Error Handling
```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // ErrorProcessor automatically used by BaseApiService
  // Enhanced toast displayed with correlation ID
  throw error;
}
```

### Using Enhanced Toast
```typescript
import { useToast } from '../contexts/ToastContext';

const { showProcessedError } = useToast();

try {
  await someApiCall();
} catch (error) {
  const processedError = ErrorProcessor.processError(error);
  showProcessedError(processedError);
}
```

### Handling Validation Errors
```typescript
// Validation errors are automatically extracted and displayed
// as field-specific messages in the toast
const validationErrors = [
  { field: "Email", messages: ["Email is required", "Email format is invalid"] },
  { field: "Password", messages: ["Password must be at least 8 characters"] }
];
```

## Error Categories

### Validation Errors
- **Status**: 400, 422
- **Display**: Field-specific validation messages
- **Retryable**: Yes (after fixing validation issues)

### Authentication Errors  
- **Status**: 401
- **Display**: Login prompt or session expired message
- **Retryable**: Yes (after re-authentication)

### Authorization Errors
- **Status**: 403
- **Display**: Access denied message
- **Retryable**: No

### Business Rule Violations
- **Status**: 409
- **Display**: Business-friendly error message
- **Retryable**: Depends on context

### Infrastructure Errors
- **Status**: 500, 502, 503, 504
- **Display**: Generic service unavailable message
- **Retryable**: Yes (for temporary issues)

### System Errors
- **Status**: Other
- **Display**: Generic error message
- **Retryable**: No

## Debugging Features

### Correlation ID Tracking
- Auto-generated correlation IDs for all requests
- Displayed in development mode
- Logged for debugging purposes
- Helps trace errors across API and UI

### Enhanced Error Information
```typescript
const debugInfo = ErrorProcessor.extractDebugInfo(error);
// Returns: correlationId, timestamp, status, method, url, type, code, etc.
```

### Development Mode Features
- Correlation IDs shown in toasts
- Stack traces in extensions
- Enhanced logging information

## Migration Guide

### Existing Code Compatibility
All existing error handling continues to work without changes:

```typescript
// This still works
try {
  const result = await apiCall();
  return HandleResult(result);
} catch (error) {
  showError('Error', 'Something went wrong');
}
```

### Enhanced Usage
Upgrade to enhanced error handling for better UX:

```typescript
// Enhanced version
try {
  const result = await apiCall();
  return HandleResult(result);
} catch (error) {
  const processedError = ErrorProcessor.processError(error);
  showProcessedError(processedError);
}
```

## Configuration

### Environment Variables
- `NODE_ENV=development`: Shows correlation IDs and debug info
- `NODE_ENV=production`: Hides sensitive debugging information

### Toast Configuration
```typescript
// Enhanced error toast with validation details
const toast = {
  type: 'error',
  title: 'Validation Failed',
  message: 'Please correct the highlighted fields',
  correlationId: 'req_123_abc',
  validationErrors: [
    { field: 'Email', messages: ['Required', 'Invalid format'] }
  ],
  persistent: false // Auto-dismiss after 6 seconds
};
```

## Best Practices

### 1. Always Use Enhanced Processing
```typescript
// ✅ Good
const processedError = ErrorProcessor.processError(error);
showProcessedError(processedError);

// ❌ Avoid
showError('Error', error.message);
```

### 2. Preserve Correlation IDs
```typescript
// ✅ Good - correlation ID preserved for debugging
const correlationId = ErrorProcessor.extractCorrelationId(error);
console.log('Error occurred:', { correlationId, error });

// ❌ Missing context for debugging
console.log('Error occurred:', error.message);
```

### 3. Handle Validation Errors Appropriately
```typescript
// ✅ Good - shows field-specific errors
if (processedError.validationErrors) {
  // Display field-level validation feedback
  processedError.validationErrors.forEach(ve => {
    highlightField(ve.field, ve.messages);
  });
}
```

### 4. Use Appropriate Error Categories
```typescript
// ✅ Good - different handling based on category
switch (processedError.category) {
  case 'authentication':
    redirectToLogin();
    break;
  case 'validation':
    focusFirstErrorField();
    break;
  case 'infrastructure':
    showRetryOption();
    break;
}
```

## Testing

### Error Simulation
```typescript
// Test different error categories
const testErrors = {
  validation: { status: 400, data: { validationErrors: {...} }},
  auth: { status: 401, data: { message: 'Token expired' }},
  business: { status: 409, data: { type: 'business-rule-violation' }}
};

// Test correlation ID generation
const correlationId = ErrorProcessor.generateCorrelationId();
expect(correlationId).toMatch(/^req_\d+_[a-z0-9]+$/);
```

### Toast Testing
```typescript
// Test enhanced toast display
const processedError = ErrorProcessor.processError(mockError);
const toastId = showProcessedError(processedError);
expect(screen.getByText(processedError.correlationId)).toBeInTheDocument();
```

## Performance Considerations

### Lazy Loading
ErrorProcessor is loaded on-demand to reduce initial bundle size:
```typescript
const { ErrorProcessor } = require('./error-processor');
```

### Memory Management
- Correlation IDs are short-lived (request scope)
- Toast messages auto-dismiss to prevent memory leaks
- Error objects are not retained after processing

## Security

### Information Disclosure
- Correlation IDs are safe to display (no sensitive data)
- Stack traces only shown in development mode
- Sensitive error details filtered out in production

### Correlation ID Format
- Non-sequential to prevent enumeration
- Includes timestamp and random component
- Short enough for user display (8 characters shown)

## Support and Troubleshooting

### Common Issues

1. **Correlation ID Not Displayed**
   - Check `NODE_ENV=development`
   - Verify ErrorProcessor integration

2. **Validation Errors Not Showing**
   - Ensure API returns `validationErrors` object
   - Check ErrorProcessor.extractValidationErrors()

3. **Toasts Not Dismissing**
   - Check `persistent` flag
   - Verify `isRetryable` logic

### Debugging Steps

1. Check browser console for error details
2. Look for correlation ID in network requests
3. Verify ErrorProcessor.extractDebugInfo() output
4. Check toast configuration and display logic

## Future Enhancements

### Planned Features
- Error analytics and reporting
- Retry mechanisms for retryable errors
- Enhanced field-level validation display
- Error pattern detection and suggestions

### Integration Points
- Logging services (correlation ID tracking)
- Analytics platforms (error categorization)
- Support systems (enhanced error context)
