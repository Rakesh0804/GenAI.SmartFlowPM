namespace GenAI.SmartFlowPM.Infrastructure.Exceptions;

/// <summary>
/// Base class for all infrastructure-layer exceptions
/// </summary>
public abstract class InfrastructureException : Exception
{
    public string Code { get; }
    public string Title { get; }
    public int StatusCode { get; }

    protected InfrastructureException(string code, string title, string message, int statusCode = 500)
        : base(message)
    {
        Code = code;
        Title = title;
        StatusCode = statusCode;
    }

    protected InfrastructureException(string code, string title, string message, Exception innerException, int statusCode = 500)
        : base(message, innerException)
    {
        Code = code;
        Title = title;
        StatusCode = statusCode;
    }
}

/// <summary>
/// Exception thrown when database operations fail
/// </summary>
public class DatabaseException : InfrastructureException
{
    public DatabaseException(string message)
        : base("DATABASE_ERROR", "Database Error", message, 500)
    {
    }

    public DatabaseException(string message, Exception innerException)
        : base("DATABASE_ERROR", "Database Error", message, innerException, 500)
    {
    }
}

/// <summary>
/// Exception thrown when database connection fails
/// </summary>
public class DatabaseConnectionException : InfrastructureException
{
    public DatabaseConnectionException(string message)
        : base("DATABASE_CONNECTION_ERROR", "Database Connection Error", message, 503)
    {
    }

    public DatabaseConnectionException(string message, Exception innerException)
        : base("DATABASE_CONNECTION_ERROR", "Database Connection Error", message, innerException, 503)
    {
    }
}

/// <summary>
/// Exception thrown when file operations fail
/// </summary>
public class FileOperationException : InfrastructureException
{
    public string FilePath { get; }

    public FileOperationException(string filePath, string operation, string message)
        : base("FILE_OPERATION_ERROR", "File Operation Error", $"File operation '{operation}' failed for '{filePath}': {message}", 500)
    {
        FilePath = filePath;
    }

    public FileOperationException(string filePath, string operation, string message, Exception innerException)
        : base("FILE_OPERATION_ERROR", "File Operation Error", $"File operation '{operation}' failed for '{filePath}': {message}", innerException, 500)
    {
        FilePath = filePath;
    }
}

/// <summary>
/// Exception thrown when email sending fails
/// </summary>
public class EmailException : InfrastructureException
{
    public EmailException(string message)
        : base("EMAIL_ERROR", "Email Error", message, 502)
    {
    }

    public EmailException(string message, Exception innerException)
        : base("EMAIL_ERROR", "Email Error", message, innerException, 502)
    {
    }
}

/// <summary>
/// Exception thrown when cache operations fail
/// </summary>
public class CacheException : InfrastructureException
{
    public CacheException(string operation, string message)
        : base("CACHE_ERROR", "Cache Error", $"Cache operation '{operation}' failed: {message}", 500)
    {
    }

    public CacheException(string operation, string message, Exception innerException)
        : base("CACHE_ERROR", "Cache Error", $"Cache operation '{operation}' failed: {message}", innerException, 500)
    {
    }
}
