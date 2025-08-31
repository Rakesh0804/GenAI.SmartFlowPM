using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.Calendar;

public class CalendarEventDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("tenantId")]
    public Guid TenantId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("eventType")]
    public EventType EventType { get; set; }

    [JsonPropertyName("startDateTime")]
    public DateTime StartDateTime { get; set; }

    [JsonPropertyName("endDateTime")]
    public DateTime EndDateTime { get; set; }

    [JsonPropertyName("isAllDay")]
    public bool IsAllDay { get; set; }

    [JsonPropertyName("location")]
    public string? Location { get; set; }

    [JsonPropertyName("priority")]
    public EventPriority Priority { get; set; }

    [JsonPropertyName("status")]
    public EventStatus Status { get; set; }

    [JsonPropertyName("eventCreatedBy")]
    public Guid EventCreatedBy { get; set; }

    [JsonPropertyName("eventCreatorName")]
    public string? EventCreatorName { get; set; }

    [JsonPropertyName("projectId")]
    public Guid? ProjectId { get; set; }

    [JsonPropertyName("projectName")]
    public string? ProjectName { get; set; }

    [JsonPropertyName("taskId")]
    public Guid? TaskId { get; set; }

    [JsonPropertyName("taskName")]
    public string? TaskName { get; set; }

    [JsonPropertyName("isRecurring")]
    public bool IsRecurring { get; set; }

    [JsonPropertyName("isPrivate")]
    public bool IsPrivate { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("attendees")]
    public List<EventAttendeeDto> Attendees { get; set; } = new List<EventAttendeeDto>();

    [JsonPropertyName("reminders")]
    public List<EventReminderDto> Reminders { get; set; } = new List<EventReminderDto>();

    [JsonPropertyName("recurrencePattern")]
    public RecurrencePatternDto? RecurrencePattern { get; set; }
}

public class CreateCalendarEventDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public EventType EventType { get; set; }

    [Required]
    public DateTime StartDateTime { get; set; }

    [Required]
    public DateTime EndDateTime { get; set; }

    public bool IsAllDay { get; set; } = false;

    [MaxLength(255)]
    public string? Location { get; set; }

    public EventPriority Priority { get; set; } = EventPriority.Medium;

    public EventStatus Status { get; set; } = EventStatus.Scheduled;

    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    public bool IsRecurring { get; set; } = false;

    public bool IsPrivate { get; set; } = false;

    [MaxLength(7)] // Hex color code
    public string? Color { get; set; }

    public List<CreateEventAttendeeDto> Attendees { get; set; } = new List<CreateEventAttendeeDto>();

    public List<CreateEventReminderDto> Reminders { get; set; } = new List<CreateEventReminderDto>();

    public CreateRecurrencePatternDto? RecurrencePattern { get; set; }
}

public class UpdateCalendarEventDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public EventType EventType { get; set; }

    [Required]
    public DateTime StartDateTime { get; set; }

    [Required]
    public DateTime EndDateTime { get; set; }

    public bool IsAllDay { get; set; }

    [MaxLength(255)]
    public string? Location { get; set; }

    public EventPriority Priority { get; set; }

    public EventStatus Status { get; set; }

    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    public bool IsRecurring { get; set; }

    public bool IsPrivate { get; set; }

    [MaxLength(7)] // Hex color code
    public string? Color { get; set; }
}

public class CalendarEventSummaryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("eventType")]
    public EventType EventType { get; set; }

    [JsonPropertyName("startDateTime")]
    public DateTime StartDateTime { get; set; }

    [JsonPropertyName("endDateTime")]
    public DateTime EndDateTime { get; set; }

    [JsonPropertyName("isAllDay")]
    public bool IsAllDay { get; set; }

    [JsonPropertyName("status")]
    public EventStatus Status { get; set; }

    [JsonPropertyName("priority")]
    public EventPriority Priority { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("attendeeCount")]
    public int AttendeeCount { get; set; }
}

public class CalendarViewDto
{
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("events")]
    public List<CalendarEventSummaryDto> Events { get; set; } = new List<CalendarEventSummaryDto>();

    [JsonPropertyName("totalEvents")]
    public int TotalEvents { get; set; }
}

public class MonthlyCalendarDto : CalendarViewDto
{
    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("month")]
    public int Month { get; set; }

    [JsonPropertyName("monthName")]
    public string MonthName { get; set; } = string.Empty;
}

public class WeeklyCalendarDto : CalendarViewDto
{
    [JsonPropertyName("weekNumber")]
    public int WeekNumber { get; set; }

    [JsonPropertyName("year")]
    public int Year { get; set; }
}

public class DailyCalendarDto : CalendarViewDto
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("dayOfWeek")]
    public string DayOfWeek { get; set; } = string.Empty;
}
