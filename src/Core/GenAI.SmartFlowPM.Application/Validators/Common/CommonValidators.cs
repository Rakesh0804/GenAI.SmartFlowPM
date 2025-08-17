using FluentValidation;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Validators.Common;

/// <summary>
/// Shared validator for PagedQuery across all modules
/// </summary>
public class PagedQueryValidator : AbstractValidator<PagedQuery>
{
    public PagedQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Page number must be greater than 0");

        RuleFor(x => x.PageSize)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100");

        RuleFor(x => x.SearchTerm)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Search term must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.SearchTerm));

        RuleFor(x => x.SortBy)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Sort by field must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.SortBy));
    }
}

/// <summary>
/// Shared validator for GUID IDs across all modules
/// </summary>
public class GuidIdValidator : AbstractValidator<Guid>
{
    public GuidIdValidator()
    {
        RuleFor(x => x)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("ID is required");
    }
}
