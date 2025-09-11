using System.Diagnostics;
using GenAI.SmartFlowPM.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GenAI.SmartFlowPM.WebAPI.Filters;

/// <summary>
/// Exception filter that provides additional exception handling for specific scenarios
/// Works in conjunction with the global exception middleware
/// </summary>
public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;
    private readonly IWebHostEnvironment _environment;

    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger, IWebHostEnvironment environment)
    {
        _logger = logger;
        _environment = environment;
    }

    public void OnException(ExceptionContext context)
    {
        // Only handle if not already handled
        if (context.ExceptionHandled)
            return;

        var exception = context.Exception;
        var correlationId = GetCorrelationId(context.HttpContext);

        // Log exception details
        _logger.LogError(exception,
            "Exception handled by GlobalExceptionFilter. CorrelationId: {CorrelationId}",
            correlationId);

        // Create error response
        var errorResponse = ErrorResponse.FromException(
            exception,
            correlationId,
            $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}");

        // Add development information
        if (_environment.IsDevelopment())
        {
            errorResponse.Extensions ??= new Dictionary<string, object?>();
            errorResponse.Extensions["stackTrace"] = exception.StackTrace;
            errorResponse.Extensions["actionName"] = context.ActionDescriptor.DisplayName;
        }

        // Set result
        context.Result = new ObjectResult(errorResponse)
        {
            StatusCode = errorResponse.Status
        };

        // Add headers
        if (!string.IsNullOrEmpty(correlationId))
        {
            context.HttpContext.Response.Headers.TryAdd("X-Correlation-ID", correlationId);
        }

        context.ExceptionHandled = true;
    }

    private static string GetCorrelationId(HttpContext context)
    {
        // Try existing correlation ID
        if (context.Request.Headers.TryGetValue("X-Correlation-ID", out var correlationId))
        {
            return correlationId.ToString();
        }

        // Use trace ID
        var activity = Activity.Current;
        if (activity != null && !string.IsNullOrEmpty(activity.Id))
        {
            return activity.Id;
        }

        // Generate new one
        return Guid.NewGuid().ToString("N")[..8];
    }
}
