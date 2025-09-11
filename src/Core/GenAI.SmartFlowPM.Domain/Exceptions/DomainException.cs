namespace GenAI.SmartFlowPM.Domain.Exceptions;

/// <summary>
/// Base class for all domain-specific exceptions
/// </summary>
public abstract class DomainException : Exception
{
    public string Code { get; }
    public string Title { get; }
    public int StatusCode { get; }

    protected DomainException(string code, string title, string message, int statusCode = 400)
        : base(message)
    {
        Code = code;
        Title = title;
        StatusCode = statusCode;
    }

    protected DomainException(string code, string title, string message, Exception innerException, int statusCode = 400)
        : base(message, innerException)
    {
        Code = code;
        Title = title;
        StatusCode = statusCode;
    }
}

/// <summary>
/// Exception thrown when a business rule is violated
/// </summary>
public class BusinessRuleValidationException : DomainException
{
    public BusinessRuleValidationException(string rule, string message)
        : base("BUSINESS_RULE_VIOLATION", "Business Rule Violation", $"Business rule '{rule}' was violated: {message}", 400)
    {
    }
}

/// <summary>
/// Exception thrown when an entity is not found
/// </summary>
public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, object id)
        : base("ENTITY_NOT_FOUND", "Entity Not Found", $"{entityName} with ID '{id}' was not found.", 404)
    {
    }

    public EntityNotFoundException(string entityName, string criteria)
        : base("ENTITY_NOT_FOUND", "Entity Not Found", $"{entityName} with criteria '{criteria}' was not found.", 404)
    {
    }
}

/// <summary>
/// Exception thrown when an entity already exists (conflict)
/// </summary>
public class EntityAlreadyExistsException : DomainException
{
    public EntityAlreadyExistsException(string entityName, string identifier)
        : base("ENTITY_ALREADY_EXISTS", "Entity Already Exists", $"{entityName} with identifier '{identifier}' already exists.", 409)
    {
    }
}

/// <summary>
/// Exception thrown when an operation is forbidden for business reasons
/// </summary>
public class ForbiddenOperationException : DomainException
{
    public ForbiddenOperationException(string operation, string reason)
        : base("FORBIDDEN_OPERATION", "Forbidden Operation", $"Operation '{operation}' is forbidden: {reason}", 403)
    {
    }
}

/// <summary>
/// Exception thrown when domain validation fails
/// </summary>
public class DomainValidationException : DomainException
{
    public IReadOnlyDictionary<string, string[]> ValidationErrors { get; }

    public DomainValidationException(IDictionary<string, string[]> validationErrors)
        : base("DOMAIN_VALIDATION_FAILED", "Domain Validation Failed", "One or more domain validation errors occurred.", 400)
    {
        ValidationErrors = new Dictionary<string, string[]>(validationErrors);
    }

    public DomainValidationException(string field, string error)
        : base("DOMAIN_VALIDATION_FAILED", "Domain Validation Failed", $"Validation failed for field '{field}': {error}", 400)
    {
        ValidationErrors = new Dictionary<string, string[]>
        {
            { field, new[] { error } }
        };
    }
}
