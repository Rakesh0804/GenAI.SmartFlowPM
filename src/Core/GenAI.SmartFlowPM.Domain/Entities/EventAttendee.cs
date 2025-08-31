using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class EventAttendee : BaseEntity
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public AttendeeResponse Response { get; set; } = AttendeeResponse.Pending;
    public bool IsRequired { get; set; } = true;
    public bool IsOrganizer { get; set; } = false;
    public DateTime InvitedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResponseAt { get; set; }
    public string? Notes { get; set; }
    public Guid TenantId { get; set; }

    // Navigation properties
    public virtual CalendarEvent Event { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual Tenant Tenant { get; set; } = null!;
}
