using FluentValidation;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Application.Validators.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Validators.Calendar;

// ================================
// CALENDAR QUERY VALIDATORS
// ================================

// Basic Calendar Event Query Validators
public class GetCalendarEventByIdQueryValidator : AbstractValidator<GetCalendarEventByIdQuery>
{
    public GetCalendarEventByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event ID is required")
            .NotEqual(Guid.Empty).WithMessage("Event ID must be a valid GUID");
    }
}

public class GetCalendarEventsByUserQueryValidator : AbstractValidator<GetCalendarEventsByUserQuery>
{
    public GetCalendarEventsByUserQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("Start date cannot be more than 10 years in the future")
            .When(x => x.StartDate.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("End date cannot be more than 10 years in the future")
            .When(x => x.EndDate.HasValue);
    }
}

public class GetCalendarEventsByProjectQueryValidator : AbstractValidator<GetCalendarEventsByProjectQuery>
{
    public GetCalendarEventsByProjectQueryValidator()
    {
        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Project ID is required")
            .NotEqual(Guid.Empty).WithMessage("Project ID must be a valid GUID");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("Start date cannot be more than 10 years in the future")
            .When(x => x.StartDate.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("End date cannot be more than 10 years in the future")
            .When(x => x.EndDate.HasValue);
    }
}

public class GetCalendarEventsByTaskQueryValidator : AbstractValidator<GetCalendarEventsByTaskQuery>
{
    public GetCalendarEventsByTaskQueryValidator()
    {
        RuleFor(x => x.TaskId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Task ID is required")
            .NotEqual(Guid.Empty).WithMessage("Task ID must be a valid GUID");
    }
}

public class GetCalendarEventsByDateRangeQueryValidator : AbstractValidator<GetCalendarEventsByDateRangeQuery>
{
    public GetCalendarEventsByDateRangeQueryValidator()
    {
        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required")
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("Start date cannot be more than 10 years in the future");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .LessThanOrEqualTo(DateTime.Now.AddYears(10)).WithMessage("End date cannot be more than 10 years in the future");

        RuleFor(x => x)
            .Cascade(CascadeMode.Stop)
            .Must(x => (x.EndDate - x.StartDate).TotalDays <= 366)
            .WithMessage("Date range cannot exceed 366 days");

        RuleFor(x => x.EventType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event type")
            .When(x => x.EventType.HasValue);

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID")
            .When(x => x.UserId.HasValue);

        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID must be a valid GUID")
            .When(x => x.ProjectId.HasValue);
    }
}

// Paginated Query Validators
public class GetAllCalendarEventsQueryValidator : AbstractValidator<GetAllCalendarEventsQuery>
{
    public GetAllCalendarEventsQueryValidator()
    {
        RuleFor(x => x.PagedQuery)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Paged query is required")
            .SetValidator(new PagedQueryValidator());

        RuleFor(x => x.EventType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event type")
            .When(x => x.EventType.HasValue);

        RuleFor(x => x.Status)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event status")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.Priority)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event priority")
            .When(x => x.Priority.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);
    }
}

public class GetCalendarEventsQueryValidator : AbstractValidator<GetCalendarEventsQuery>
{
    public GetCalendarEventsQueryValidator()
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
            .MaximumLength(200).WithMessage("Search term cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.SearchTerm));

        RuleFor(x => x.EventType)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event type")
            .When(x => x.EventType.HasValue);

        RuleFor(x => x.EventStatus)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event status")
            .When(x => x.EventStatus.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x.ProjectId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Project ID must be a valid GUID")
            .When(x => x.ProjectId.HasValue);
    }
}

public class GetUserCalendarEventsQueryValidator : AbstractValidator<GetUserCalendarEventsQuery>
{
    public GetUserCalendarEventsQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");

        RuleFor(x => x.PageNumber)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Page number must be greater than 0");

        RuleFor(x => x.PageSize)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100");

        RuleFor(x => x.EventStatus)
            .Cascade(CascadeMode.Stop)
            .IsInEnum().WithMessage("Invalid event status")
            .When(x => x.EventStatus.HasValue);

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);
    }
}

public class GetUpcomingEventsQueryValidator : AbstractValidator<GetUpcomingEventsQuery>
{
    public GetUpcomingEventsQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");

        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.Limit)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Limit must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Limit cannot exceed 100");

        RuleFor(x => x)
            .Cascade(CascadeMode.Stop)
            .Must(x => (x.EndDate - x.StartDate).TotalDays <= 90)
            .WithMessage("Date range for upcoming events cannot exceed 90 days");
    }
}

public class GetRecurringEventsQueryValidator : AbstractValidator<GetRecurringEventsQuery>
{
    public GetRecurringEventsQueryValidator()
    {
        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x)
            .Cascade(CascadeMode.Stop)
            .Must(x => x.StartDate.HasValue || x.EndDate.HasValue)
            .WithMessage("At least one date filter (start or end) must be provided");
    }
}

// Calendar View Query Validators
public class GetMonthlyCalendarQueryValidator : AbstractValidator<GetMonthlyCalendarQuery>
{
    public GetMonthlyCalendarQueryValidator()
    {
        RuleFor(x => x.Year)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(1900).WithMessage("Year must be 1900 or later")
            .LessThanOrEqualTo(DateTime.Now.Year + 50).WithMessage($"Year cannot be more than 50 years in the future");

        RuleFor(x => x.Month)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(1).WithMessage("Month must be between 1 and 12")
            .LessThanOrEqualTo(12).WithMessage("Month must be between 1 and 12");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID")
            .When(x => x.UserId.HasValue);
    }
}

public class GetWeeklyCalendarQueryValidator : AbstractValidator<GetWeeklyCalendarQuery>
{
    public GetWeeklyCalendarQueryValidator()
    {
        RuleFor(x => x.StartDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Start date is required")
            .GreaterThanOrEqualTo(new DateTime(1900, 1, 1)).WithMessage("Start date must be 1900 or later")
            .LessThanOrEqualTo(DateTime.Now.AddYears(50)).WithMessage("Start date cannot be more than 50 years in the future");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID")
            .When(x => x.UserId.HasValue);
    }
}

public class GetDailyCalendarQueryValidator : AbstractValidator<GetDailyCalendarQuery>
{
    public GetDailyCalendarQueryValidator()
    {
        RuleFor(x => x.Date)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Date is required")
            .GreaterThanOrEqualTo(new DateTime(1900, 1, 1)).WithMessage("Date must be 1900 or later")
            .LessThanOrEqualTo(DateTime.Now.AddYears(50)).WithMessage("Date cannot be more than 50 years in the future");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID")
            .When(x => x.UserId.HasValue);
    }
}

// Event Attendee Query Validators
public class GetEventAttendeesQueryValidator : AbstractValidator<GetEventAttendeesQuery>
{
    public GetEventAttendeesQueryValidator()
    {
        RuleFor(x => x.EventId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event ID is required")
            .NotEqual(Guid.Empty).WithMessage("Event ID must be a valid GUID");
    }
}

public class GetAttendeeByEventAndUserQueryValidator : AbstractValidator<GetAttendeeByEventAndUserQuery>
{
    public GetAttendeeByEventAndUserQueryValidator()
    {
        RuleFor(x => x.EventId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event ID is required")
            .NotEqual(Guid.Empty).WithMessage("Event ID must be a valid GUID");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");
    }
}

public class GetUserEventAttendeesQueryValidator : AbstractValidator<GetUserEventAttendeesQuery>
{
    public GetUserEventAttendeesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");

        RuleFor(x => x.EndDate)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);
    }
}

public class GetPendingEventResponsesQueryValidator : AbstractValidator<GetPendingEventResponsesQuery>
{
    public GetPendingEventResponsesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");
    }
}

public class GetPendingResponsesQueryValidator : AbstractValidator<GetPendingResponsesQuery>
{
    public GetPendingResponsesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");
    }
}

public class GetEventAttendeeByUserQueryValidator : AbstractValidator<GetEventAttendeeByUserQuery>
{
    public GetEventAttendeeByUserQueryValidator()
    {
        RuleFor(x => x.EventId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event ID is required")
            .NotEqual(Guid.Empty).WithMessage("Event ID must be a valid GUID");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");
    }
}

// Event Reminder Query Validators
public class GetEventRemindersQueryValidator : AbstractValidator<GetEventRemindersQuery>
{
    public GetEventRemindersQueryValidator()
    {
        RuleFor(x => x.EventId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event ID is required")
            .NotEqual(Guid.Empty).WithMessage("Event ID must be a valid GUID");
    }
}

public class GetUserEventRemindersQueryValidator : AbstractValidator<GetUserEventRemindersQuery>
{
    public GetUserEventRemindersQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("User ID is required")
            .NotEqual(Guid.Empty).WithMessage("User ID must be a valid GUID");
    }
}

public class GetPendingRemindersQueryValidator : AbstractValidator<GetPendingRemindersQuery>
{
    public GetPendingRemindersQueryValidator()
    {
        RuleFor(x => x.CheckTime)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Check time is required")
            .LessThanOrEqualTo(DateTime.Now.AddHours(1)).WithMessage("Check time cannot be more than 1 hour in the future");
    }
}

// Recurrence Pattern Query Validators
public class GetRecurrencePatternByEventQueryValidator : AbstractValidator<GetRecurrencePatternByEventQuery>
{
    public GetRecurrencePatternByEventQueryValidator()
    {
        RuleFor(x => x.EventId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Event ID is required")
            .NotEqual(Guid.Empty).WithMessage("Event ID must be a valid GUID");
    }
}
