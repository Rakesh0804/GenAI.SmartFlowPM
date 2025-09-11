namespace GenAI.SmartFlowPM.Application.Exceptions;

/// <summary>
/// Base class for all application-layer exceptions
/// </summary>
public abstract class ApplicationException : Exception
{
    public string Code { get; }
    public string Title { get; }
    public int StatusCode { get; }

    protected ApplicationException(string code, string title, string message, int statusCode = 500)
        : base(message)
    {
        Code = code;
        Title = title;
        StatusCode = statusCode;
    }

    protected ApplicationException(string code, string title, string message, Exception innerException, int statusCode = 500)
        : base(message, innerException)
    {
        Code = code;
        Title = title;
        StatusCode = statusCode;
    }
}

/// <summary>
/// Exception thrown when validation fails in the application layer
/// </summary>
public class ValidationException : ApplicationException
{
    public IReadOnlyDictionary<string, string[]> ValidationErrors { get; }

    public ValidationException(IDictionary<string, string[]> validationErrors)
        : base("VALIDATION_FAILED", "Validation Failed", "One or more validation errors occurred.", 400)
    {
        ValidationErrors = new Dictionary<string, string[]>(validationErrors);
    }

    public ValidationException(string message)
        : base("VALIDATION_FAILED", "Validation Failed", message, 400)
    {
        ValidationErrors = new Dictionary<string, string[]>();
    }
}

/// <summary>
/// Exception thrown when user is not authorized to perform an action
/// </summary>
public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message = "You are not authorized to perform this action.")
        : base("UNAUTHORIZED", "Unauthorized", message, 401)
    {
    }
}

/// <summary>
/// Exception thrown when user lacks permission for a specific resource or action
/// </summary>
public class ForbiddenException : ApplicationException
{
    public ForbiddenException(string resource, string action)
        : base("FORBIDDEN", "Forbidden", $"You do not have permission to {action} {resource}.", 403)
    {
    }

    public ForbiddenException(string message)
        : base("FORBIDDEN", "Forbidden", message, 403)
    {
    }
}

/// <summary>
/// Exception thrown when external service integration fails
/// </summary>
public class ExternalServiceException : ApplicationException
{
    public string ServiceName { get; }

    public ExternalServiceException(string serviceName, string message)
        : base("EXTERNAL_SERVICE_ERROR", "External Service Error", $"External service '{serviceName}' error: {message}", 502)
    {
        ServiceName = serviceName;
    }

    public ExternalServiceException(string serviceName, string message, Exception innerException)
        : base("EXTERNAL_SERVICE_ERROR", "External Service Error", $"External service '{serviceName}' error: {message}", innerException, 502)
    {
        ServiceName = serviceName;
    }
}

/// <summary>
/// Exception thrown when application configuration is invalid
/// </summary>
public class ConfigurationException : ApplicationException
{
    public ConfigurationException(string configurationKey, string message)
        : base("CONFIGURATION_ERROR", "Configuration Error", $"Configuration error for '{configurationKey}': {message}", 500)
    {
    }
}

/// <summary>
/// Exception thrown when concurrent modification conflicts occur
/// </summary>
public class ConcurrencyException : ApplicationException
{
    public ConcurrencyException(string entityName, object entityId)
        : base("CONCURRENCY_CONFLICT", "Concurrency Conflict", $"The {entityName} with ID '{entityId}' has been modified by another user. Please refresh and try again.", 409)
    {
    }
}
