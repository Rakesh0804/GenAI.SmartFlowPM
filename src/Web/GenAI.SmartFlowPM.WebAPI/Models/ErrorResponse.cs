using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.WebAPI.Models;

/// <summary>
/// Enhanced error response model that follows RFC 7807 Problem Details specification
/// while maintaining compatibility with existing frontend error handling
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// A URI reference that identifies the problem type
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = "about:blank";

    /// <summary>
    /// A short, human-readable summary of the problem type
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; } = "An error occurred";

    /// <summary>
    /// The HTTP status code
    /// </summary>
    [JsonPropertyName("status")]
    public int Status { get; set; }

    /// <summary>
    /// A human-readable explanation specific to this occurrence of the problem
    /// </summary>
    [JsonPropertyName("detail")]
    public string? Detail { get; set; }

    /// <summary>
    /// A URI reference that identifies the specific occurrence of the problem
    /// </summary>
    [JsonPropertyName("instance")]
    public string? Instance { get; set; }

    /// <summary>
    /// Correlation ID for request tracking
    /// </summary>
    [JsonPropertyName("correlationId")]
    public string? CorrelationId { get; set; }

    /// <summary>
    /// Timestamp when the error occurred
    /// </summary>
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Compatibility with existing frontend - indicates operation success/failure
    /// </summary>
    [JsonPropertyName("isSuccess")]
    public bool IsSuccess { get; set; } = false;

    /// <summary>
    /// Compatibility with existing frontend - main error message
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }

    /// <summary>
    /// Compatibility with existing frontend - collection of error messages
    /// </summary>
    [JsonPropertyName("errors")]
    public IEnumerable<string>? Errors { get; set; }

    /// <summary>
    /// Validation errors organized by field name
    /// </summary>
    [JsonPropertyName("validationErrors")]
    public IDictionary<string, string[]>? ValidationErrors { get; set; }

    /// <summary>
    /// Additional error-specific data
    /// </summary>
    [JsonPropertyName("extensions")]
    public IDictionary<string, object?>? Extensions { get; set; }

    /// <summary>
    /// Error code for programmatic handling
    /// </summary>
    [JsonPropertyName("code")]
    public string? Code { get; set; }

    /// <summary>
    /// Create an error response from an exception
    /// </summary>
    public static ErrorResponse FromException(Exception exception, string? correlationId = null, string? instance = null)
    {
        var response = new ErrorResponse
        {
            CorrelationId = correlationId,
            Instance = instance,
            Message = exception.Message
        };

        // Handle different exception types
        switch (exception)
        {
            case Domain.Exceptions.DomainException domainEx:
                response.Type = "https://smartflow.com/problems/domain-error";
                response.Title = domainEx.Title;
                response.Status = domainEx.StatusCode;
                response.Detail = domainEx.Message;
                response.Code = domainEx.Code;
                response.Errors = new[] { domainEx.Message };

                if (domainEx is Domain.Exceptions.DomainValidationException validationEx)
                {
                    response.ValidationErrors = new Dictionary<string, string[]>(validationEx.ValidationErrors);
                }
                break;

            case Application.Exceptions.ApplicationException appEx:
                response.Type = "https://smartflow.com/problems/application-error";
                response.Title = appEx.Title;
                response.Status = appEx.StatusCode;
                response.Detail = appEx.Message;
                response.Code = appEx.Code;
                response.Errors = new[] { appEx.Message };

                if (appEx is Application.Exceptions.ValidationException appValidationEx)
                {
                    response.ValidationErrors = new Dictionary<string, string[]>(appValidationEx.ValidationErrors);
                }
                break;

            case Infrastructure.Exceptions.InfrastructureException infraEx:
                response.Type = "https://smartflow.com/problems/infrastructure-error";
                response.Title = infraEx.Title;
                response.Status = infraEx.StatusCode;
                response.Detail = infraEx.Message;
                response.Code = infraEx.Code;
                response.Errors = new[] { infraEx.Message };
                break;

            case FluentValidation.ValidationException fluentValidationEx:
                response.Type = "https://smartflow.com/problems/validation-error";
                response.Title = "Validation Failed";
                response.Status = 400;
                response.Detail = "One or more validation errors occurred.";
                response.Code = "VALIDATION_FAILED";
                response.Message = "One or more validation errors occurred.";
                response.Errors = fluentValidationEx.Errors.Select(e => e.ErrorMessage);
                var validationErrors = fluentValidationEx.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
                response.ValidationErrors = validationErrors;
                break;

            case UnauthorizedAccessException:
                response.Type = "https://smartflow.com/problems/unauthorized";
                response.Title = "Unauthorized";
                response.Status = 401;
                response.Detail = "You are not authorized to access this resource.";
                response.Code = "UNAUTHORIZED";
                response.Message = "You are not authorized to access this resource.";
                response.Errors = new[] { "You are not authorized to access this resource." };
                break;

            case ArgumentException argEx:
                response.Type = "https://smartflow.com/problems/invalid-argument";
                response.Title = "Invalid Argument";
                response.Status = 400;
                response.Detail = argEx.Message;
                response.Code = "INVALID_ARGUMENT";
                response.Message = argEx.Message;
                response.Errors = new[] { argEx.Message };
                break;

            case NotSupportedException:
                response.Type = "https://smartflow.com/problems/not-supported";
                response.Title = "Not Supported";
                response.Status = 501;
                response.Detail = exception.Message;
                response.Code = "NOT_SUPPORTED";
                response.Message = exception.Message;
                response.Errors = new[] { exception.Message };
                break;

            case TimeoutException:
                response.Type = "https://smartflow.com/problems/timeout";
                response.Title = "Request Timeout";
                response.Status = 408;
                response.Detail = "The request timed out. Please try again.";
                response.Code = "REQUEST_TIMEOUT";
                response.Message = "The request timed out. Please try again.";
                response.Errors = new[] { "The request timed out. Please try again." };
                break;

            default:
                response.Type = "https://smartflow.com/problems/internal-error";
                response.Title = "Internal Server Error";
                response.Status = 500;
                response.Detail = "An unexpected error occurred. Please try again later.";
                response.Code = "INTERNAL_ERROR";
                response.Message = "An unexpected error occurred. Please try again later.";
                response.Errors = new[] { "An unexpected error occurred. Please try again later." };
                break;
        }

        return response;
    }
}
