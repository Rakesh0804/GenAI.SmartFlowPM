using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class CalendarEvent : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public EventType EventType { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public bool IsAllDay { get; set; }
    public string? Location { get; set; }
    public EventPriority Priority { get; set; }
    public EventStatus Status { get; set; }
    public Guid EventCreatedBy { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? TaskId { get; set; }
    public bool IsRecurring { get; set; }
    public string? RecurrencePattern { get; set; } // JSON serialized RecurrencePattern
    public bool IsPrivate { get; set; }
    public string? Color { get; set; } // Hex color code
    public Guid TenantId { get; set; }

    // Navigation properties
    public virtual User EventCreator { get; set; } = null!;
    public virtual Project? Project { get; set; }
    public virtual ProjectTask? Task { get; set; }
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual ICollection<EventAttendee> Attendees { get; set; } = new List<EventAttendee>();
    public virtual ICollection<EventReminder> Reminders { get; set; } = new List<EventReminder>();
    public virtual RecurrencePattern? Recurrence { get; set; }
}
