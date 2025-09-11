using System.Diagnostics;
using System.Net;
using System.Text.Json;
using GenAI.SmartFlowPM.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace GenAI.SmartFlowPM.WebAPI.Middleware;

/// <summary>
/// Global exception handling middleware that provides consistent error responses
/// following RFC 7807 Problem Details specification while maintaining backward compatibility
/// </summary>
public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;
    private readonly JsonSerializerOptions _jsonOptions;

    public GlobalExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = _environment.IsDevelopment()
        };
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Generate correlation ID for request tracking
        var correlationId = GetCorrelationId(context);
        var instance = $"{context.Request.Method} {context.Request.Path}";

        // Log the exception with correlation ID
        LogException(exception, correlationId, context);

        // Create error response
        var errorResponse = ErrorResponse.FromException(exception, correlationId, instance);

        // Add development-specific information
        if (_environment.IsDevelopment())
        {
            errorResponse.Extensions ??= new Dictionary<string, object?>();
            errorResponse.Extensions["stackTrace"] = exception.StackTrace;
            errorResponse.Extensions["innerException"] = exception.InnerException?.Message;
        }

        // Set response properties
        context.Response.StatusCode = errorResponse.Status;
        context.Response.ContentType = "application/json";

        // Add correlation ID header
        if (!string.IsNullOrEmpty(correlationId))
        {
            context.Response.Headers.TryAdd("X-Correlation-ID", correlationId);
        }

        // Add problem details headers for RFC 7807 compliance
        context.Response.Headers.TryAdd("Content-Type", "application/problem+json");

        // Serialize and write response
        var json = JsonSerializer.Serialize(errorResponse, _jsonOptions);
        await context.Response.WriteAsync(json);
    }

    private string GetCorrelationId(HttpContext context)
    {
        // Try to get correlation ID from various sources
        if (context.Request.Headers.TryGetValue("X-Correlation-ID", out var correlationId))
        {
            return correlationId.ToString();
        }

        if (context.Request.Headers.TryGetValue("X-Request-ID", out var requestId))
        {
            return requestId.ToString();
        }

        // Check if there's a trace ID from distributed tracing
        var activity = Activity.Current;
        if (activity != null && !string.IsNullOrEmpty(activity.Id))
        {
            return activity.Id;
        }

        // Generate new correlation ID
        return Guid.NewGuid().ToString("N")[..8]; // Short format for logs
    }

    private void LogException(Exception exception, string correlationId, HttpContext context)
    {
        var logLevel = GetLogLevel(exception);
        var requestPath = context.Request.Path;
        var requestMethod = context.Request.Method;
        var userId = context.User?.Identity?.Name ?? "Anonymous";

        using var scope = _logger.BeginScope(new Dictionary<string, object>
        {
            ["CorrelationId"] = correlationId,
            ["RequestPath"] = requestPath,
            ["RequestMethod"] = requestMethod,
            ["UserId"] = userId,
            ["UserAgent"] = context.Request.Headers["User-Agent"].ToString(),
            ["RemoteIpAddress"] = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
        });

        switch (logLevel)
        {
            case LogLevel.Error:
                _logger.LogError(exception,
                    "Unhandled exception occurred. CorrelationId: {CorrelationId}, Path: {RequestPath}, Method: {RequestMethod}",
                    correlationId, requestPath, requestMethod);
                break;

            case LogLevel.Warning:
                _logger.LogWarning(exception,
                    "Business exception occurred. CorrelationId: {CorrelationId}, Path: {RequestPath}, Method: {RequestMethod}",
                    correlationId, requestPath, requestMethod);
                break;

            case LogLevel.Information:
                _logger.LogInformation(exception,
                    "Expected exception occurred. CorrelationId: {CorrelationId}, Path: {RequestPath}, Method: {RequestMethod}",
                    correlationId, requestPath, requestMethod);
                break;
        }
    }

    private static LogLevel GetLogLevel(Exception exception)
    {
        return exception switch
        {
            // Domain exceptions are usually business rule violations (expected)
            Domain.Exceptions.EntityNotFoundException => LogLevel.Information,
            Domain.Exceptions.BusinessRuleValidationException => LogLevel.Information,
            Domain.Exceptions.DomainValidationException => LogLevel.Information,

            // Application exceptions
            Application.Exceptions.ValidationException => LogLevel.Information,
            Application.Exceptions.UnauthorizedException => LogLevel.Information,
            Application.Exceptions.ForbiddenException => LogLevel.Information,
            Application.Exceptions.ExternalServiceException => LogLevel.Warning,

            // Infrastructure exceptions are more serious
            Infrastructure.Exceptions.DatabaseConnectionException => LogLevel.Error,
            Infrastructure.Exceptions.DatabaseException => LogLevel.Warning,

            // Framework exceptions
            FluentValidation.ValidationException => LogLevel.Information,
            UnauthorizedAccessException => LogLevel.Information,
            ArgumentException => LogLevel.Warning,

            // Unknown exceptions are errors
            _ => LogLevel.Error
        };
    }
}
