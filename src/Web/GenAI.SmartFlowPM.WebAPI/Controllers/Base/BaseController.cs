using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Diagnostics;
using GenAI.SmartFlowPM.WebAPI.Models;

namespace GenAI.SmartFlowPM.WebAPI.Controllers.Base;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected readonly IMediator _mediator;

    protected BaseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets correlation ID from current request for tracking
    /// </summary>
    protected string GetCorrelationId()
    {
        // Try to get from headers first
        if (HttpContext.Request.Headers.TryGetValue("X-Correlation-ID", out var correlationId))
        {
            return correlationId.ToString();
        }

        // Use trace ID from Activity
        var activity = Activity.Current;
        if (activity != null && !string.IsNullOrEmpty(activity.Id))
        {
            return activity.Id;
        }

        // Generate new one
        return Guid.NewGuid().ToString("N")[..8];
    }

    /// <summary>
    /// Enhanced result handler with better error responses
    /// </summary>
    protected IActionResult HandleResult<T>(Application.Common.Models.Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                isSuccess = true,
                data = result.Data,
                message = result.Message,
                correlationId = GetCorrelationId(),
                timestamp = DateTime.UtcNow
            });
        }

        var errorResponse = new
        {
            isSuccess = false,
            data = (T?)default,
            message = result.Errors?.FirstOrDefault() ?? "An error occurred",
            errors = result.Errors ?? new[] { "An error occurred" },
            correlationId = GetCorrelationId(),
            timestamp = DateTime.UtcNow,
            // Additional fields for consistency with ErrorResponse model
            type = "https://smartflow.com/problems/business-error",
            title = "Business Logic Error",
            status = 400,
            detail = result.Errors?.FirstOrDefault() ?? "A business logic error occurred"
        };

        return BadRequest(errorResponse);
    }

    /// <summary>
    /// Enhanced result handler for non-generic results
    /// </summary>
    protected IActionResult HandleResult(Application.Common.Models.Result result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                isSuccess = true,
                message = result.Message,
                correlationId = GetCorrelationId(),
                timestamp = DateTime.UtcNow
            });
        }

        var errorResponse = new
        {
            isSuccess = false,
            message = result.Errors?.FirstOrDefault() ?? "An error occurred",
            errors = result.Errors ?? new[] { "An error occurred" },
            correlationId = GetCorrelationId(),
            timestamp = DateTime.UtcNow,
            // Additional fields for consistency with ErrorResponse model
            type = "https://smartflow.com/problems/business-error",
            title = "Business Logic Error",
            status = 400,
            detail = result.Errors?.FirstOrDefault() ?? "A business logic error occurred"
        };

        return BadRequest(errorResponse);
    }

    /// <summary>
    /// Helper method to create standardized success responses
    /// </summary>
    protected IActionResult Success<T>(T data, string? message = null)
    {
        return Ok(new
        {
            isSuccess = true,
            data = data,
            message = message ?? "Operation completed successfully",
            correlationId = GetCorrelationId(),
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Helper method to create standardized success responses without data
    /// </summary>
    protected IActionResult Success(string? message = null)
    {
        return Ok(new
        {
            isSuccess = true,
            message = message ?? "Operation completed successfully",
            correlationId = GetCorrelationId(),
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Helper method to create standardized error responses
    /// </summary>
    protected IActionResult Error(string message, int statusCode = 400, string? code = null)
    {
        var errorResponse = new ErrorResponse
        {
            IsSuccess = false,
            Message = message,
            Errors = new[] { message },
            Status = statusCode,
            Title = GetTitleForStatusCode(statusCode),
            Code = code ?? GetCodeForStatusCode(statusCode),
            CorrelationId = GetCorrelationId(),
            Instance = $"{HttpContext.Request.Method} {HttpContext.Request.Path}"
        };

        return StatusCode(statusCode, errorResponse);
    }

    /// <summary>
    /// Helper method to create validation error responses
    /// </summary>
    protected IActionResult ValidationError(IDictionary<string, string[]> validationErrors)
    {
        var errorResponse = new ErrorResponse
        {
            IsSuccess = false,
            Message = "One or more validation errors occurred",
            Errors = validationErrors.SelectMany(e => e.Value),
            ValidationErrors = validationErrors,
            Status = 400,
            Title = "Validation Error",
            Code = "VALIDATION_ERROR",
            CorrelationId = GetCorrelationId(),
            Instance = $"{HttpContext.Request.Method} {HttpContext.Request.Path}"
        };

        return BadRequest(errorResponse);
    }

    private static string GetTitleForStatusCode(int statusCode)
    {
        return statusCode switch
        {
            400 => "Bad Request",
            401 => "Unauthorized",
            403 => "Forbidden",
            404 => "Not Found",
            409 => "Conflict",
            422 => "Unprocessable Entity",
            500 => "Internal Server Error",
            _ => "Error"
        };
    }

    private static string GetCodeForStatusCode(int statusCode)
    {
        return statusCode switch
        {
            400 => "BAD_REQUEST",
            401 => "UNAUTHORIZED",
            403 => "FORBIDDEN",
            404 => "NOT_FOUND",
            409 => "CONFLICT",
            422 => "UNPROCESSABLE_ENTITY",
            500 => "INTERNAL_SERVER_ERROR",
            _ => "ERROR"
        };
    }
}
