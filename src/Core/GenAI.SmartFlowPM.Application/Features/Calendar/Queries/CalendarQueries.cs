using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.Calendar.Queries;

// Calendar Event Queries
public class GetCalendarEventByIdQuery : IRequest<Result<CalendarEventDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetCalendarEventsByUserQuery : IRequest<Result<IEnumerable<CalendarEventDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
}

public class GetCalendarEventsByProjectQuery : IRequest<Result<IEnumerable<CalendarEventDto>>>
{
    [JsonPropertyName("projectId")]
    public Guid ProjectId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
}

public class GetCalendarEventsByTaskQuery : IRequest<Result<IEnumerable<CalendarEventDto>>>
{
    [JsonPropertyName("taskId")]
    public Guid TaskId { get; set; }
}

public class GetCalendarEventsByDateRangeQuery : IRequest<Result<IEnumerable<CalendarEventDto>>>
{
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
    
    [JsonPropertyName("eventType")]
    public EventType? EventType { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
    
    [JsonPropertyName("projectId")]
    public Guid? ProjectId { get; set; }
}

public class GetAllCalendarEventsQuery : IRequest<Result<PaginatedResult<CalendarEventDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = null!;
    
    [JsonPropertyName("eventType")]
    public EventType? EventType { get; set; }
    
    [JsonPropertyName("status")]
    public EventStatus? Status { get; set; }
    
    [JsonPropertyName("priority")]
    public EventPriority? Priority { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
}

public class GetRecurringEventsQuery : IRequest<Result<IEnumerable<CalendarEventDto>>>
{
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
}

// Pagination and Filtering Queries
public class GetCalendarEventsQuery : IRequest<Result<PaginatedResult<CalendarEventSummaryDto>>>
{
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; } = 1;
    
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
    
    [JsonPropertyName("eventType")]
    public EventType? EventType { get; set; }
    
    [JsonPropertyName("eventStatus")]
    public EventStatus? EventStatus { get; set; }
    
    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; set; }
    
    [JsonPropertyName("projectId")]
    public Guid? ProjectId { get; set; }
}

public class GetUserCalendarEventsQuery : IRequest<Result<PaginatedResult<CalendarEventSummaryDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; } = 1;
    
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
    
    [JsonPropertyName("eventStatus")]
    public EventStatus? EventStatus { get; set; }
}

public class GetUpcomingEventsQuery : IRequest<Result<IEnumerable<CalendarEventSummaryDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
    
    [JsonPropertyName("limit")]
    public int Limit { get; set; } = 10;
}

// Calendar View Queries
public class GetMonthlyCalendarQuery : IRequest<Result<MonthlyCalendarDto>>
{
    [JsonPropertyName("year")]
    public int Year { get; set; }
    
    [JsonPropertyName("month")]
    public int Month { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
}

public class GetWeeklyCalendarQuery : IRequest<Result<WeeklyCalendarDto>>
{
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
}

public class GetDailyCalendarQuery : IRequest<Result<DailyCalendarDto>>
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
}

// Calendar View Queries for Controller compatibility
public class GetMonthlyCalendarViewQuery : IRequest<Result<MonthlyCalendarDto>>
{
    [JsonPropertyName("year")]
    public int Year { get; set; }
    
    [JsonPropertyName("month")]
    public int Month { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
}

public class GetWeeklyCalendarViewQuery : IRequest<Result<WeeklyCalendarDto>>
{
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
}

public class GetDailyCalendarViewQuery : IRequest<Result<DailyCalendarDto>>
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }
}

// Event Attendee Queries
public class GetEventAttendeesQuery : IRequest<Result<IEnumerable<EventAttendeeDto>>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
}

public class GetAttendeeByEventAndUserQuery : IRequest<Result<EventAttendeeDto>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class GetUserEventAttendeesQuery : IRequest<Result<IEnumerable<EventAttendeeDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
}

public class GetPendingEventResponsesQuery : IRequest<Result<IEnumerable<EventAttendeeDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

// Alias for controller compatibility
public class GetPendingResponsesQuery : IRequest<Result<IEnumerable<EventAttendeeDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

// Alias for controller compatibility  
public class GetEventAttendeeByUserQuery : IRequest<Result<EventAttendeeDto>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

// Missing query for active reminders
public class GetActiveRemindersQuery : IRequest<Result<IEnumerable<EventReminderDto>>>
{
}

// Event Reminder Queries
public class GetEventRemindersQuery : IRequest<Result<IEnumerable<EventReminderDto>>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
}

public class GetUserEventRemindersQuery : IRequest<Result<IEnumerable<EventReminderDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool? IsActive { get; set; }
}

public class GetPendingRemindersQuery : IRequest<Result<IEnumerable<EventReminderDto>>>
{
    [JsonPropertyName("checkTime")]
    public DateTime CheckTime { get; set; }
}

// Recurrence Pattern Queries
public class GetRecurrencePatternByEventQuery : IRequest<Result<RecurrencePatternDto>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
}

public class GetActiveRecurrencePatternsQuery : IRequest<Result<IEnumerable<RecurrencePatternDto>>>
{
}
