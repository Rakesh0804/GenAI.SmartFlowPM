using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Commands;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;

namespace GenAI.SmartFlowPM.Application.Validators.TimeTracker;

// Time Entry Validators
public class CreateTimeEntryDtoValidator : AbstractValidator<CreateTimeEntryDto>
{
    public CreateTimeEntryDtoValidator()
    {
        RuleFor(x => x.StartTime)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start time is required");

        RuleFor(x => x.EndTime)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time")
            .When(x => x.EndTime.HasValue);

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID cannot be empty")
            .When(x => x.ProjectId.HasValue);

        RuleFor(x => x.TaskId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Task ID cannot be empty")
            .When(x => x.TaskId.HasValue);

        RuleFor(x => x.TimeCategoryId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");
    }
}

public class UpdateTimeEntryDtoValidator : AbstractValidator<UpdateTimeEntryDto>
{
    public UpdateTimeEntryDtoValidator()
    {
        RuleFor(x => x.StartTime)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start time is required");

        RuleFor(x => x.EndTime)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time")
            .When(x => x.EndTime.HasValue);

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID cannot be empty")
            .When(x => x.ProjectId.HasValue);

        RuleFor(x => x.TaskId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Task ID cannot be empty")
            .When(x => x.TaskId.HasValue);

        RuleFor(x => x.TimeCategoryId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");
    }
}

// Timesheet Validators
public class CreateTimesheetDtoValidator : AbstractValidator<CreateTimesheetDto>
{
    public CreateTimesheetDtoValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");
    }
}

public class UpdateTimesheetDtoValidator : AbstractValidator<UpdateTimesheetDto>
{
    public UpdateTimesheetDtoValidator()
    {
        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");
    }
}

public class ApproveTimesheetDtoValidator : AbstractValidator<ApproveTimesheetDto>
{
    public ApproveTimesheetDtoValidator()
    {
        RuleFor(x => x.ApprovalNotes)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Approval notes must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.ApprovalNotes));
    }
}

public class RejectTimesheetDtoValidator : AbstractValidator<RejectTimesheetDto>
{
    public RejectTimesheetDtoValidator()
    {
        RuleFor(x => x.ApprovalNotes)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Approval notes must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.ApprovalNotes));
    }
}

// Time Category Validators
public class CreateTimeCategoryDtoValidator : AbstractValidator<CreateTimeCategoryDto>
{
    public CreateTimeCategoryDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Category name is required")
            .MaximumLength(100).WithMessage("Category name must not exceed 100 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Color)
            .Cascade(CascadeMode.Stop)
            .Matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").WithMessage("Color must be a valid hex color code")
            .When(x => !string.IsNullOrEmpty(x.Color));
    }
}

public class UpdateTimeCategoryDtoValidator : AbstractValidator<UpdateTimeCategoryDto>
{
    public UpdateTimeCategoryDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Category name is required")
            .MaximumLength(100).WithMessage("Category name must not exceed 100 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Color)
            .Cascade(CascadeMode.Stop)
            .Matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").WithMessage("Color must be a valid hex color code")
            .When(x => !string.IsNullOrEmpty(x.Color));
    }
}

// Active Tracking Validators
public class StartTrackingDtoValidator : AbstractValidator<StartTrackingDto>
{
    public StartTrackingDtoValidator()
    {
        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID cannot be empty")
            .When(x => x.ProjectId.HasValue);

        RuleFor(x => x.TaskId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Task ID cannot be empty")
            .When(x => x.TaskId.HasValue);

        RuleFor(x => x.TimeCategoryId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

public class StopTrackingDtoValidator : AbstractValidator<StopTrackingDto>
{
    public StopTrackingDtoValidator()
    {
        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

public class UpdateTrackingDtoValidator : AbstractValidator<UpdateTrackingDto>
{
    public UpdateTrackingDtoValidator()
    {
        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID cannot be empty")
            .When(x => x.ProjectId.HasValue);

        RuleFor(x => x.TaskId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Task ID cannot be empty")
            .When(x => x.TaskId.HasValue);

        RuleFor(x => x.TimeCategoryId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

// Command Validators
public class CreateTimeEntryCommandValidator : AbstractValidator<CreateTimeEntryCommand>
{
    public CreateTimeEntryCommandValidator()
    {
        RuleFor(x => x.CreateTimeEntryDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Time entry data is required")
            .SetValidator(new CreateTimeEntryDtoValidator());
    }
}

public class UpdateTimeEntryCommandValidator : AbstractValidator<UpdateTimeEntryCommand>
{
    public UpdateTimeEntryCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time entry ID is required");

        RuleFor(x => x.UpdateTimeEntryDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Time entry data is required")
            .SetValidator(new UpdateTimeEntryDtoValidator());
    }
}

public class DeleteTimeEntryCommandValidator : AbstractValidator<DeleteTimeEntryCommand>
{
    public DeleteTimeEntryCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time entry ID is required");
    }
}

public class CreateTimesheetCommandValidator : AbstractValidator<CreateTimesheetCommand>
{
    public CreateTimesheetCommandValidator()
    {
        RuleFor(x => x.CreateTimesheetDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Timesheet data is required")
            .SetValidator(new CreateTimesheetDtoValidator());
    }
}

public class UpdateTimesheetCommandValidator : AbstractValidator<UpdateTimesheetCommand>
{
    public UpdateTimesheetCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Timesheet ID is required");

        RuleFor(x => x.UpdateTimesheetDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Timesheet data is required")
            .SetValidator(new UpdateTimesheetDtoValidator());
    }
}

public class SubmitTimesheetCommandValidator : AbstractValidator<SubmitTimesheetCommand>
{
    public SubmitTimesheetCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Timesheet ID is required");
    }
}

public class ApproveTimesheetCommandValidator : AbstractValidator<ApproveTimesheetCommand>
{
    public ApproveTimesheetCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Timesheet ID is required");

        RuleFor(x => x.ApproveTimesheetDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Approval data is required")
            .SetValidator(new ApproveTimesheetDtoValidator());
    }
}

public class RejectTimesheetCommandValidator : AbstractValidator<RejectTimesheetCommand>
{
    public RejectTimesheetCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Timesheet ID is required");

        RuleFor(x => x.RejectTimesheetDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Rejection data is required")
            .SetValidator(new RejectTimesheetDtoValidator());
    }
}

public class CreateTimeCategoryCommandValidator : AbstractValidator<CreateTimeCategoryCommand>
{
    public CreateTimeCategoryCommandValidator()
    {
        RuleFor(x => x.CreateTimeCategoryDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Time category data is required")
            .SetValidator(new CreateTimeCategoryDtoValidator());
    }
}

public class UpdateTimeCategoryCommandValidator : AbstractValidator<UpdateTimeCategoryCommand>
{
    public UpdateTimeCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");

        RuleFor(x => x.UpdateTimeCategoryDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Time category data is required")
            .SetValidator(new UpdateTimeCategoryDtoValidator());
    }
}

public class DeleteTimeCategoryCommandValidator : AbstractValidator<DeleteTimeCategoryCommand>
{
    public DeleteTimeCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");
    }
}

public class StartTrackingCommandValidator : AbstractValidator<StartTrackingCommand>
{
    public StartTrackingCommandValidator()
    {
        RuleFor(x => x.StartTrackingDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Tracking data is required")
            .SetValidator(new StartTrackingDtoValidator());
    }
}

public class UpdateTrackingCommandValidator : AbstractValidator<UpdateTrackingCommand>
{
    public UpdateTrackingCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Session ID is required");

        RuleFor(x => x.UpdateTrackingDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Update tracking data is required")
            .SetValidator(new UpdateTrackingDtoValidator());
    }
}

public class StopTrackingCommandValidator : AbstractValidator<StopTrackingCommand>
{
    public StopTrackingCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Session ID is required");

        RuleFor(x => x.StopTrackingDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Stop tracking data is required")
            .SetValidator(new StopTrackingDtoValidator());
    }
}

public class PauseTrackingCommandValidator : AbstractValidator<PauseTrackingCommand>
{
    public PauseTrackingCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Session ID is required");

        RuleFor(x => x.PauseTrackingDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Pause tracking data is required");
    }
}

public class ResumeTrackingCommandValidator : AbstractValidator<ResumeTrackingCommand>
{
    public ResumeTrackingCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Session ID is required");

        RuleFor(x => x.ResumeTrackingDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Resume tracking data is required");
    }
}

// Query Validators
public class GetTimeEntryByIdQueryValidator : AbstractValidator<GetTimeEntryByIdQuery>
{
    public GetTimeEntryByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time entry ID is required");
    }
}

public class GetTimeEntriesByUserIdQueryValidator : AbstractValidator<GetTimeEntriesByUserIdQuery>
{
    public GetTimeEntriesByUserIdQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class GetTimeEntriesByProjectIdQueryValidator : AbstractValidator<GetTimeEntriesByProjectIdQuery>
{
    public GetTimeEntriesByProjectIdQueryValidator()
    {
        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID is required");
    }
}

public class GetTimeEntriesByDateRangeQueryValidator : AbstractValidator<GetTimeEntriesByDateRangeQuery>
{
    public GetTimeEntriesByDateRangeQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .LessThanOrEqualTo(x => x.EndDate).WithMessage("Start date must be before or equal to end date");
    }
}

public class GetTimesheetByIdQueryValidator : AbstractValidator<GetTimesheetByIdQuery>
{
    public GetTimesheetByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Timesheet ID is required");
    }
}

public class GetTimesheetsByUserIdQueryValidator : AbstractValidator<GetTimesheetsByUserIdQuery>
{
    public GetTimesheetsByUserIdQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class GetTimeCategoryByIdQueryValidator : AbstractValidator<GetTimeCategoryByIdQuery>
{
    public GetTimeCategoryByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Time category ID is required");
    }
}

public class GetActiveTrackingSessionByUserIdQueryValidator : AbstractValidator<GetActiveTrackingSessionByUserIdQuery>
{
    public GetActiveTrackingSessionByUserIdQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class GetUserTimeReportQueryValidator : AbstractValidator<GetUserTimeReportQuery>
{
    public GetUserTimeReportQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be after or equal to start date");
    }
}

public class GetTeamTimeReportQueryValidator : AbstractValidator<GetTeamTimeReportQuery>
{
    public GetTeamTimeReportQueryValidator()
    {
        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be after or equal to start date");
    }
}

public class GetProjectTimeReportQueryValidator : AbstractValidator<GetProjectTimeReportQuery>
{
    public GetProjectTimeReportQueryValidator()
    {
        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID is required");

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be after or equal to start date");
    }
}

public class GetAllTimeEntriesQueryValidator : AbstractValidator<GetAllTimeEntriesQuery>
{
    public GetAllTimeEntriesQueryValidator()
    {
        RuleFor(x => x.PagedQuery)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Paged query parameters are required");

        RuleFor(x => x.PagedQuery.PageNumber)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Page number must be greater than 0")
            .When(x => x.PagedQuery != null);

        RuleFor(x => x.PagedQuery.PageSize)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size must not exceed 100")
            .When(x => x.PagedQuery != null);
    }
}

public class GetTimeEntriesByTimesheetIdQueryValidator : AbstractValidator<GetTimeEntriesByTimesheetIdQuery>
{
    public GetTimeEntriesByTimesheetIdQueryValidator()
    {
        RuleFor(x => x.TimesheetId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Timesheet ID is required");
    }
}

public class GetTimesheetByUserAndDateRangeQueryValidator : AbstractValidator<GetTimesheetByUserAndDateRangeQuery>
{
    public GetTimesheetByUserAndDateRangeQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be after or equal to start date");
    }
}

public class GetTimesheetsByStatusQueryValidator : AbstractValidator<GetTimesheetsByStatusQuery>
{
    public GetTimesheetsByStatusQueryValidator()
    {
        RuleFor(x => x.Status)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid timesheet status");
    }
}
