using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Project;
using GenAI.SmartFlowPM.Application.Features.Projects.Commands;
using GenAI.SmartFlowPM.Application.Common.Constants;

namespace GenAI.SmartFlowPM.Application.Validators.Project;

public class CreateProjectDtoValidator : AbstractValidator<CreateProjectDto>
{
    public CreateProjectDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Project name is required")
            .MaximumLength(200).WithMessage("Project name must not exceed 200 characters")
            .Matches(ValidationPatterns.PROJECT_NAME).WithMessage(ValidationMessages.PROJECT_NAME_INVALID);

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required")
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("Start date cannot be more than 10 years in the future");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.EndDate.HasValue);

        RuleFor(x => x.Budget)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(0).WithMessage("Budget must be greater than or equal to 0")
            .LessThanOrEqualTo(999999999.99m).WithMessage("Budget cannot exceed 999,999,999.99")
            .When(x => x.Budget.HasValue);

        RuleFor(x => x.ClientName)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Client name must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.ClientName));
    }
}

public class UpdateProjectDtoValidator : AbstractValidator<UpdateProjectDto>
{
    public UpdateProjectDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Project name is required")
            .MaximumLength(200).WithMessage("Project name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required")
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("Start date cannot be more than 10 years in the future");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.EndDate.HasValue);

        RuleFor(x => x.Budget)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(0).WithMessage("Budget must be greater than or equal to 0")
            .LessThanOrEqualTo(999999999.99m).WithMessage("Budget cannot exceed 999,999,999.99")
            .When(x => x.Budget.HasValue);

        RuleFor(x => x.ClientName)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Client name must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.ClientName));
    }
}

// Command Validators
public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.CreateProjectDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Project data is required")
            .SetValidator(new CreateProjectDtoValidator());
    }
}

public class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID is required");

        RuleFor(x => x.UpdateProjectDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Project data is required")
            .SetValidator(new UpdateProjectDtoValidator());
    }
}

public class DeleteProjectCommandValidator : AbstractValidator<DeleteProjectCommand>
{
    public DeleteProjectCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID is required");
    }
}
