using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common.Constants;

namespace GenAI.SmartFlowPM.Application.Common.Attributes;

/// <summary>
/// Validation attribute to ensure task acronym is one of the valid predefined values
/// </summary>
public class ValidTaskAcronymAttribute : ValidationAttribute
{
    public ValidTaskAcronymAttribute()
    {
        ErrorMessage = $"Task acronym must be one of: {string.Join(", ", TaskTypeConstants.ValidAcronyms)}";
    }

    /// <summary>
    /// Validates the task acronym value
    /// </summary>
    /// <param name="value">The value to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    public override bool IsValid(object? value)
    {
        if (value == null)
            return false;

        if (value is not string acronym)
            return false;

        return TaskTypeConstants.IsValidAcronym(acronym);
    }

    /// <summary>
    /// Formats the error message with the valid acronyms
    /// </summary>
    /// <param name="name">The field name</param>
    /// <returns>Formatted error message</returns>
    public override string FormatErrorMessage(string name)
    {
        return $"The {name} field must be one of the following valid task types: {string.Join(", ", TaskTypeConstants.ValidAcronyms)}.";
    }
}
