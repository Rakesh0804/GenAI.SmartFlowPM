using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class RecurrencePattern : BaseEntity
{
    public Guid EventId { get; set; }
    public RecurrenceType RecurrenceType { get; set; }
    public int Interval { get; set; } = 1; // Every N days/weeks/months
    public int? DaysOfWeek { get; set; } // Bitmask for weekly recurrence
    public int? DayOfMonth { get; set; } // For monthly recurrence
    public int? MonthOfYear { get; set; } // For yearly recurrence
    public DateTime? EndDate { get; set; }
    public int? MaxOccurrences { get; set; }
    public Guid TenantId { get; set; }

    // Navigation properties
    public virtual CalendarEvent Event { get; set; } = null!;
    public virtual Tenant Tenant { get; set; } = null!;
}
