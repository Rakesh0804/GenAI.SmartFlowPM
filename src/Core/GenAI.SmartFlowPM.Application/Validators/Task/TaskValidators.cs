using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Task;
using GenAI.SmartFlowPM.Application.Features.Tasks.Commands;
using GenAI.SmartFlowPM.Domain.Common.Constants;
using GenAI.SmartFlowPM.Application.Common.Constants;

namespace GenAI.SmartFlowPM.Application.Validators.Task;

/// <summary>
/// Validator for CreateTaskDto
/// </summary>
public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Task title is required")
            .MaximumLength(200)
            .WithMessage("Task title must not exceed 200 characters")
            .Matches(ValidationPatterns.TASK_TITLE)
            .WithMessage(ValidationMessages.TASK_TITLE_INVALID);

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => x.Acronym)
            .NotEmpty()
            .WithMessage("Task acronym is required")
            .Must(BeValidTaskAcronym)
            .WithMessage($"Task acronym must be one of: {string.Join(", ", TaskTypeConstants.ValidAcronyms)}");

        RuleFor(x => x.ProjectId)
            .NotEmpty()
            .WithMessage("Project ID is required");

        RuleFor(x => x.EstimatedHours)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Estimated hours must be zero or greater");
    }

    private static bool BeValidTaskAcronym(string acronym)
    {
        return TaskTypeConstants.IsValidAcronym(acronym);
    }
}

/// <summary>
/// Validator for UpdateTaskDto
/// </summary>
public class UpdateTaskDtoValidator : AbstractValidator<UpdateTaskDto>
{
    public UpdateTaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Task title is required")
            .MaximumLength(200)
            .WithMessage("Task title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => x.EstimatedHours)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Estimated hours must be zero or greater");

        RuleFor(x => x.ActualHours)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Actual hours must be zero or greater");
    }
}

/// <summary>
/// Validator for CreateTaskCommand
/// </summary>
public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.CreateTaskDto)
            .NotNull()
            .WithMessage("CreateTaskDto is required")
            .SetValidator(new CreateTaskDtoValidator());
    }
}

/// <summary>
/// Validator for UpdateTaskCommand
/// </summary>
public class UpdateTaskCommandValidator : AbstractValidator<UpdateTaskCommand>
{
    public UpdateTaskCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Task ID is required");

        RuleFor(x => x.UpdateTaskDto)
            .NotNull()
            .WithMessage("UpdateTaskDto is required")
            .SetValidator(new UpdateTaskDtoValidator());
    }
}

/// <summary>
/// Validator for DeleteTaskCommand
/// </summary>
public class DeleteTaskCommandValidator : AbstractValidator<DeleteTaskCommand>
{
    public DeleteTaskCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Task ID is required");
    }
}

/// <summary>
/// Validator for AssignTaskCommand
/// </summary>
public class AssignTaskCommandValidator : AbstractValidator<AssignTaskCommand>
{
    public AssignTaskCommandValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty()
            .WithMessage("Task ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");
    }
}
