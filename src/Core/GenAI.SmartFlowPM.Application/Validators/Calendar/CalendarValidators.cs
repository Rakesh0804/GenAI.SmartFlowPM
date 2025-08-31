using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.Validators.Common;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Validators.Calendar;

public class CreateCalendarEventDtoValidator : AbstractValidator<CreateCalendarEventDto>
{
    public CreateCalendarEventDtoValidator()
    {
        RuleFor(x => x.Title)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event title is required")
            .MaximumLength(200).WithMessage("Event title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.EventType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event type");

        RuleFor(x => x.StartDateTime)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date and time is required")
            .GreaterThan(DateTime.Now.AddMinutes(-5)).WithMessage("Start date must be in the future");

        RuleFor(x => x.EndDateTime)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date and time is required")
            .GreaterThan(x => x.StartDateTime).WithMessage("End date must be after start date");

        RuleFor(x => x.Location)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(255).WithMessage("Location must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.Priority)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid priority");

        RuleFor(x => x.Status)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid status");

        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID must be a valid GUID")
            .When(x => x.ProjectId.HasValue);

        RuleFor(x => x.TaskId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Task ID must be a valid GUID")
            .When(x => x.TaskId.HasValue);

        RuleFor(x => x.Color)
            .Cascade(CascadeMode.Stop)
            .Matches(@"^#([A-Fa-f0-9]{6})$").WithMessage("Color must be a valid hex color code (e.g., #FF0000)")
            .When(x => !string.IsNullOrEmpty(x.Color));

        RuleFor(x => x.Attendees)
            .Cascade(CascadeMode.Stop)
            .Must(attendees => attendees.Select(a => a.UserId).Distinct().Count() == attendees.Count)
            .WithMessage("Duplicate attendees are not allowed")
            .When(x => x.Attendees != null && x.Attendees.Any());

        RuleForEach(x => x.Attendees)
            .Cascade(CascadeMode.Stop)
            .SetValidator(new CreateEventAttendeeDtoValidator())
            .When(x => x.Attendees != null && x.Attendees.Any());

        RuleForEach(x => x.Reminders)
            .Cascade(CascadeMode.Stop)
            .SetValidator(new CreateEventReminderDtoValidator())
            .When(x => x.Reminders != null && x.Reminders.Any());

        RuleFor(x => x.RecurrencePattern)
            .Cascade(CascadeMode.Stop)
            .SetValidator(new CreateRecurrencePatternDtoValidator()!)
            .When(x => x.IsRecurring && x.RecurrencePattern != null);

        RuleFor(x => x.RecurrencePattern)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Recurrence pattern is required for recurring events")
            .When(x => x.IsRecurring);
    }
}

public class UpdateCalendarEventDtoValidator : AbstractValidator<UpdateCalendarEventDto>
{
    public UpdateCalendarEventDtoValidator()
    {
        RuleFor(x => x.Title)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event title is required")
            .MaximumLength(200).WithMessage("Event title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.EventType)
            .IsInEnum().WithMessage("Invalid event type");

        RuleFor(x => x.StartDateTime)
            .NotEmpty().WithMessage("Start date and time is required");

        RuleFor(x => x.EndDateTime)
            .NotEmpty().WithMessage("End date and time is required")
            .GreaterThan(x => x.StartDateTime).WithMessage("End date must be after start date");

        RuleFor(x => x.Location)
            .MaximumLength(255).WithMessage("Location must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid priority");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status");

        RuleFor(x => x.ProjectId)
            .NotEqual(Guid.Empty).WithMessage("Project ID must be a valid GUID")
            .When(x => x.ProjectId.HasValue);

        RuleFor(x => x.TaskId)
            .NotEqual(Guid.Empty).WithMessage("Task ID must be a valid GUID")
            .When(x => x.TaskId.HasValue);

        RuleFor(x => x.Color)
            .Matches(@"^#([A-Fa-f0-9]{6})$").WithMessage("Color must be a valid hex color code (e.g., #FF0000)")
            .When(x => !string.IsNullOrEmpty(x.Color));
    }
}

public class CreateEventAttendeeDtoValidator : AbstractValidator<CreateEventAttendeeDto>
{
    public CreateEventAttendeeDtoValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.Notes)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Notes));
    }
}

public class UpdateEventAttendeeDtoValidator : AbstractValidator<UpdateEventAttendeeDto>
{
    public UpdateEventAttendeeDtoValidator()
    {
        RuleFor(x => x.Notes)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Notes));
    }
}

public class UpdateAttendeeResponseDtoValidator : AbstractValidator<UpdateAttendeeResponseDto>
{
    public UpdateAttendeeResponseDtoValidator()
    {
        RuleFor(x => x.Response)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid response type");

        RuleFor(x => x.Notes)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Notes));
    }
}

public class CreateEventReminderDtoValidator : AbstractValidator<CreateEventReminderDto>
{
    public CreateEventReminderDtoValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.ReminderType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid reminder type");

        RuleFor(x => x.ReminderTime)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Reminder time must be greater than 0")
            .LessThanOrEqualTo(43200).WithMessage("Reminder time cannot exceed 30 days (43200 minutes)");
    }
}

public class UpdateEventReminderDtoValidator : AbstractValidator<UpdateEventReminderDto>
{
    public UpdateEventReminderDtoValidator()
    {
        RuleFor(x => x.ReminderType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid reminder type");

        RuleFor(x => x.ReminderTime)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Reminder time must be greater than 0")
            .LessThanOrEqualTo(43200).WithMessage("Reminder time cannot exceed 30 days (43200 minutes)");
    }
}

public class CreateRecurrencePatternDtoValidator : AbstractValidator<CreateRecurrencePatternDto>
{
    public CreateRecurrencePatternDtoValidator()
    {
        RuleFor(x => x.RecurrenceType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid recurrence type");

        RuleFor(x => x.Interval)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Interval must be greater than 0")
            .LessThanOrEqualTo(365).WithMessage("Interval cannot exceed 365");

        RuleFor(x => x.DaysOfWeek)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("At least one day must be selected for weekly recurrence")
            .LessThanOrEqualTo(127).WithMessage("Invalid days of week value")
            .When(x => x.RecurrenceType == RecurrenceType.Weekly);

        RuleFor(x => x.DayOfMonth)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Day of month must be between 1 and 31")
            .LessThanOrEqualTo(31).WithMessage("Day of month must be between 1 and 31")
            .When(x => x.RecurrenceType == RecurrenceType.Monthly && x.DayOfMonth.HasValue);

        RuleFor(x => x.MonthOfYear)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Month of year must be between 1 and 12")
            .LessThanOrEqualTo(12).WithMessage("Month of year must be between 1 and 12")
            .When(x => x.RecurrenceType == RecurrenceType.Yearly && x.MonthOfYear.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(DateTime.Now).WithMessage("End date must be in the future")
            .When(x => x.EndDate.HasValue);

        RuleFor(x => x.MaxOccurrences)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Max occurrences must be greater than 0")
            .LessThanOrEqualTo(365).WithMessage("Max occurrences cannot exceed 365")
            .When(x => x.MaxOccurrences.HasValue);

        RuleFor(x => x)
            .Cascade(CascadeMode.Stop)
            .Must(x => x.EndDate.HasValue || x.MaxOccurrences.HasValue)
            .WithMessage("Either end date or max occurrences must be specified for recurring events");
    }
}

public class UpdateRecurrencePatternDtoValidator : AbstractValidator<UpdateRecurrencePatternDto>
{
    public UpdateRecurrencePatternDtoValidator()
    {
        RuleFor(x => x.RecurrenceType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid recurrence type");

        RuleFor(x => x.Interval)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Interval must be greater than 0")
            .LessThanOrEqualTo(365).WithMessage("Interval cannot exceed 365");

        RuleFor(x => x.DaysOfWeek)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("At least one day must be selected for weekly recurrence")
            .LessThanOrEqualTo(127).WithMessage("Invalid days of week value")
            .When(x => x.RecurrenceType == RecurrenceType.Weekly);

        RuleFor(x => x.DayOfMonth)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Day of month must be between 1 and 31")
            .LessThanOrEqualTo(31).WithMessage("Day of month must be between 1 and 31")
            .When(x => x.RecurrenceType == RecurrenceType.Monthly && x.DayOfMonth.HasValue);

        RuleFor(x => x.MonthOfYear)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Month of year must be between 1 and 12")
            .LessThanOrEqualTo(12).WithMessage("Month of year must be between 1 and 12")
            .When(x => x.RecurrenceType == RecurrenceType.Yearly && x.MonthOfYear.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(DateTime.Now).WithMessage("End date must be in the future")
            .When(x => x.EndDate.HasValue);

        RuleFor(x => x.MaxOccurrences)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Max occurrences must be greater than 0")
            .LessThanOrEqualTo(365).WithMessage("Max occurrences cannot exceed 365")
            .When(x => x.MaxOccurrences.HasValue);

        RuleFor(x => x)
            .Cascade(CascadeMode.Stop)
            .Must(x => x.EndDate.HasValue || x.MaxOccurrences.HasValue)
            .WithMessage("Either end date or max occurrences must be specified for recurring events");
    }
}
