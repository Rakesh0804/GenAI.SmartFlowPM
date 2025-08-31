using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class EventReminder : BaseEntity
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public ReminderType ReminderType { get; set; }
    public int ReminderTime { get; set; } // Minutes before event
    public bool IsSent { get; set; } = false;
    public DateTime? SentAt { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid TenantId { get; set; }

    // Navigation properties
    public virtual CalendarEvent Event { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual Tenant Tenant { get; set; } = null!;
}
