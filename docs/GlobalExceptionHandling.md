# Global Exception Handling Implementation

## 📋 Overview

This document describes the comprehensive global exception handling system implemented for the GenAI Smart Flow PM API. The system provides consistent, secure, and RFC 7807 compliant error responses while maintaining backward compatibility with existing frontend code.

## 🏗️ Architecture

### Components

1. **Custom Exception Types** - Domain, Application, and Infrastructure specific exceptions
2. **Global Exception Middleware** - Centralized exception handling with RFC 7807 Problem Details
3. **Exception Filter** - Additional MVC-level exception handling
4. **Enhanced BaseController** - Improved result handling with correlation IDs
5. **Error Response Models** - Standardized error response format

## 🔧 Features

- ✅ **RFC 7807 Problem Details** compliance
- ✅ **Correlation ID** tracking for debugging
- ✅ **Structured logging** with contextual information
- ✅ **Backward compatibility** with existing frontend
- ✅ **Security** - No sensitive information exposure
- ✅ **Environment-specific** error details
- ✅ **Multiple exception handling layers**

## 📁 File Structure

```text
src/
├── Core/
│   ├── Domain/
│   │   └── Exceptions/
│   │       └── DomainException.cs           # Domain-specific exceptions
│   └── Application/
│       └── Exceptions/
│           └── ApplicationException.cs      # Application-layer exceptions
├── Infrastructure/
│   └── Exceptions/
│       └── InfrastructureException.cs       # Infrastructure-layer exceptions
└── Web/
    └── WebAPI/
        ├── Models/
        │   └── ErrorResponse.cs             # Error response model
        ├── Middleware/
        │   └── GlobalExceptionHandlingMiddleware.cs  # Main middleware
        ├── Filters/
        │   └── GlobalExceptionFilter.cs     # MVC exception filter
        ├── Helpers/
        │   └── ResultHelper.cs              # Result to exception converter
        ├── Extensions/
        │   └── ExceptionHandlingExtensions.cs  # Registration extensions
        └── Controllers/Base/
            └── BaseController.cs            # Enhanced base controller
```

## 🚀 Usage Examples

### 1. Using Traditional Result Pattern (Recommended for existing code)

```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetUser(Guid id)
{
    var query = new GetUserByIdQuery { Id = id };
    var result = await _mediator.Send(query);
    
    // Automatically handles success/error responses with correlation IDs
    return HandleResult(result);
}
```

### 2. Using Exception-Based Approach (New code)

```csharp
[HttpPost]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    var command = new CreateUserCommand { CreateUserDto = dto };
    var result = await _mediator.Send(command);
    
    // Throws appropriate exception if result indicates failure
    // Global middleware will catch and convert to proper error response
    var user = ResultHelper.GetValueOrThrow(result);
    return Success(user, "User created successfully");
}
```

### 3. Throwing Domain Exceptions Directly

```csharp
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(Guid id)
{
    // Check if user exists
    var user = await _userRepository.GetByIdAsync(id);
    if (user == null)
    {
        throw new EntityNotFoundException("User", id);
    }
    
    // Check business rules
    if (user.HasActiveProjects)
    {
        throw new BusinessRuleValidationException(
            "DeleteUserWithActiveProjects", 
            "Cannot delete user with active projects");
    }
    
    await _userRepository.DeleteAsync(id);
    return Success("User deleted successfully");
}
```

### 4. Validation Exceptions

```csharp
public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
{
    var validationErrors = new Dictionary<string, string[]>();
    
    if (string.IsNullOrEmpty(dto.Email))
    {
        validationErrors["email"] = new[] { "Email is required" };
    }
    
    if (dto.Age < 18)
    {
        validationErrors["age"] = new[] { "Age must be 18 or older" };
    }
    
    if (validationErrors.Any())
    {
        throw new ValidationException(validationErrors);
    }
    
    // Process update...
    return Success("User updated successfully");
}
```

## 📤 Response Examples

### Success Response

```json
{
  "isSuccess": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User retrieved successfully",
  "correlationId": "abc12345",
  "timestamp": "2025-09-10T10:30:00Z"
}
```

### Error Response (RFC 7807 + Backward Compatibility)

```json
{
  "type": "https://smartflow.com/problems/entity-not-found",
  "title": "Entity Not Found",
  "status": 404,
  "detail": "User with ID '123e4567-e89b-12d3-a456-426614174000' was not found.",
  "instance": "GET /api/users/123e4567-e89b-12d3-a456-426614174000",
  "correlationId": "abc12345",
  "timestamp": "2025-09-10T10:30:00Z",
  "isSuccess": false,
  "message": "User with ID '123e4567-e89b-12d3-a456-426614174000' was not found.",
  "errors": ["User with ID '123e4567-e89b-12d3-a456-426614174000' was not found."],
  "code": "ENTITY_NOT_FOUND"
}
```

### Validation Error Response

```json
{
  "type": "https://smartflow.com/problems/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "instance": "POST /api/users",
  "correlationId": "def67890",
  "timestamp": "2025-09-10T10:30:00Z",
  "isSuccess": false,
  "message": "One or more validation errors occurred.",
  "errors": ["Email is required", "Age must be 18 or older"],
  "validationErrors": {
    "email": ["Email is required"],
    "age": ["Age must be 18 or older"]
  },
  "code": "VALIDATION_FAILED"
}
```

## 🔍 Debugging and Monitoring

### Correlation IDs

Every request/response includes a correlation ID for tracking:

- Generated automatically for each request
- Included in all log entries
- Returned in response headers (`X-Correlation-ID`)
- Helps trace issues across distributed systems

### Structured Logging

```csharp
// Example log output
[2025-09-10 10:30:00] [ERROR] [CorrelationId: abc12345] [RequestPath: /api/users/123] [UserId: john@example.com]
Unhandled exception occurred: User with ID '123' was not found
   at GenAI.SmartFlowPM.Application.Features.Users.Handlers.GetUserByIdQueryHandler.Handle()
   ...
```

### Log Levels by Exception Type

- **Information**: Expected business exceptions (not found, validation errors)
- **Warning**: Infrastructure issues that might recover (external service errors)
- **Error**: Unexpected exceptions requiring investigation

## 🔒 Security Considerations

### Production Environment

- Stack traces are not exposed
- Internal error messages are sanitized
- Only safe error information is returned
- Detailed logging for debugging internally

### Development Environment

- Full stack traces included in responses
- Additional debugging information
- Inner exception details
- Action and controller context

## 🔄 Migration Guide

### For Existing Controllers

1. **No changes required** - Existing `HandleResult()` calls continue to work
2. **Optional enhancement** - Add correlation ID support by using enhanced BaseController methods
3. **Gradual migration** - Convert to exception-based approach over time

### For New Controllers

1. Use `ResultHelper.GetValueOrThrow()` for cleaner exception handling
2. Use `Success()` and `Error()` helper methods
3. Throw domain-specific exceptions directly when appropriate

## 🧪 Testing

### Unit Tests

```csharp
[Test]
public void Should_Return_NotFound_When_User_Does_Not_Exist()
{
    // Arrange
    var userId = Guid.NewGuid();
    
    // Act & Assert
    var exception = Assert.ThrowsAsync<EntityNotFoundException>(
        () => _controller.GetUser(userId));
    
    Assert.That(exception.Message, Contains.Substring("User"));
    Assert.That(exception.StatusCode, Is.EqualTo(404));
}
```

### Integration Tests

```csharp
[Test]
public async Task Should_Return_Problem_Details_For_Not_Found()
{
    // Arrange
    var userId = Guid.NewGuid();
    
    // Act
    var response = await _client.GetAsync($"/api/users/{userId}");
    
    // Assert
    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    
    var content = await response.Content.ReadAsStringAsync();
    var error = JsonSerializer.Deserialize<ErrorResponse>(content);
    
    Assert.That(error.Type, Is.EqualTo("https://smartflow.com/problems/entity-not-found"));
    Assert.That(error.Status, Is.EqualTo(404));
    Assert.That(error.CorrelationId, Is.Not.Null);
}
```

## 📈 Benefits

1. **Consistency** - All errors follow the same format
2. **Debuggability** - Correlation IDs and structured logging
3. **Standards Compliance** - Follows RFC 7807 Problem Details
4. **Backward Compatibility** - Existing frontend code continues to work
5. **Security** - No sensitive information leakage
6. **Maintainability** - Centralized error handling logic
7. **Monitoring** - Better observability and error tracking

## 🔧 Configuration

The system is automatically configured via the extension methods in `Program.cs`:

```csharp
// Services registration
builder.Services.AddGlobalExceptionHandling();

// Middleware registration
app.UseComprehensiveExceptionHandling();
```

No additional configuration is required, but logging levels can be adjusted in `appsettings.json` if needed.
