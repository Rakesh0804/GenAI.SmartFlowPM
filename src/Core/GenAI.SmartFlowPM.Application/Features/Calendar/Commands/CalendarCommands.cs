using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.Calendar.Commands;

// Calendar Event Commands
public class CreateCalendarEventCommand : IRequest<Result<CalendarEventDto>>
{
    [JsonPropertyName("createEventDto")]
    public CreateCalendarEventDto CreateEventDto { get; set; } = null!;
}

public class UpdateCalendarEventCommand : IRequest<Result<CalendarEventDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateEventDto")]
    public UpdateCalendarEventDto UpdateEventDto { get; set; } = null!;
}

public class DeleteCalendarEventCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

// Event Attendee Commands
public class AddEventAttendeeCommand : IRequest<Result<EventAttendeeDto>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
    
    [JsonPropertyName("createAttendeeDto")]
    public CreateEventAttendeeDto CreateAttendeeDto { get; set; } = null!;
}

public class RemoveEventAttendeeCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class UpdateAttendeeResponseCommand : IRequest<Result<EventAttendeeDto>>
{
    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("updateResponseDto")]
    public UpdateAttendeeResponseDto UpdateResponseDto { get; set; } = null!;
}

public class UpdateEventAttendeeCommand : IRequest<Result<EventAttendeeDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateAttendeeDto")]
    public UpdateEventAttendeeDto UpdateAttendeeDto { get; set; } = null!;
}

// Event Reminder Commands
public class CreateEventReminderCommand : IRequest<Result<EventReminderDto>>
{
    [JsonPropertyName("createEventReminderDto")]
    public CreateEventReminderDto CreateEventReminderDto { get; set; } = null!;
}

public class UpdateEventReminderCommand : IRequest<Result<EventReminderDto>>
{
    [JsonPropertyName("updateEventReminderDto")]
    public UpdateEventReminderDto UpdateEventReminderDto { get; set; } = null!;
}

public class DeleteEventReminderCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

// Recurrence Pattern Commands
public class CreateRecurrencePatternCommand : IRequest<Result<RecurrencePatternDto>>
{
    [JsonPropertyName("createRecurrencePatternDto")]
    public CreateRecurrencePatternDto CreateRecurrencePatternDto { get; set; } = null!;
}

public class UpdateRecurrencePatternCommand : IRequest<Result<RecurrencePatternDto>>
{
    [JsonPropertyName("updateRecurrencePatternDto")]
    public UpdateRecurrencePatternDto UpdateRecurrencePatternDto { get; set; } = null!;
}

public class DeleteRecurrencePatternCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

// Missing reminder commands for controllers
public class MarkReminderAsSentCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}
