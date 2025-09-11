using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Exceptions;

namespace GenAI.SmartFlowPM.WebAPI.Helpers;

/// <summary>
/// Helper class to convert Result patterns to exceptions for consistent error handling
/// </summary>
public static class ResultHelper
{
    /// <summary>
    /// Throws appropriate exception if Result indicates failure
    /// </summary>
    public static void ThrowIfFailure<T>(Result<T> result)
    {
        if (!result.IsSuccess)
        {
            ThrowAppropriateException(result.Errors);
        }
    }

    /// <summary>
    /// Throws appropriate exception if Result indicates failure
    /// </summary>
    public static void ThrowIfFailure(Result result)
    {
        if (!result.IsSuccess)
        {
            ThrowAppropriateException(result.Errors);
        }
    }

    /// <summary>
    /// Gets the value from Result or throws exception if failed
    /// </summary>
    public static T GetValueOrThrow<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return result.Data ?? throw new InvalidOperationException("Successful result cannot have null data.");
        }

        ThrowAppropriateException(result.Errors);
        return default!; // This will never be reached
    }

    private static void ThrowAppropriateException(IEnumerable<string>? errors)
    {
        var errorList = errors?.ToList() ?? new List<string> { "An unknown error occurred" };
        var primaryError = errorList.FirstOrDefault() ?? "An unknown error occurred";

        // Analyze the error message to determine appropriate exception type
        var lowerError = primaryError.ToLowerInvariant();

        if (lowerError.Contains("not found"))
        {
            // Extract entity name if possible
            var words = primaryError.Split(' ');
            var entityName = words.FirstOrDefault() ?? "Entity";
            throw new EntityNotFoundException(entityName, "unknown");
        }

        if (lowerError.Contains("already exists") || lowerError.Contains("duplicate"))
        {
            var words = primaryError.Split(' ');
            var entityName = words.FirstOrDefault() ?? "Entity";
            throw new EntityAlreadyExistsException(entityName, "unknown");
        }

        if (lowerError.Contains("unauthorized") || lowerError.Contains("not authenticated"))
        {
            throw new Application.Exceptions.UnauthorizedException(primaryError);
        }

        if (lowerError.Contains("forbidden") || lowerError.Contains("permission"))
        {
            throw new Application.Exceptions.ForbiddenException(primaryError);
        }

        if (lowerError.Contains("validation") || errorList.Count > 1)
        {
            // If multiple errors, treat as validation error
            var validationErrors = new Dictionary<string, string[]>
            {
                ["general"] = errorList.ToArray()
            };
            throw new Application.Exceptions.ValidationException(validationErrors);
        }

        // Default to business rule validation exception
        throw new BusinessRuleValidationException("BusinessRule", primaryError);
    }
}
