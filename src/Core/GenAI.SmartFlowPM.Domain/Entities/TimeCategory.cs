using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class TimeCategory : TenantBaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(7)]
    public string? Color { get; set; } // Hex color code

    public BillableStatus DefaultBillableStatus { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
    public virtual ICollection<ActiveTrackingSession> ActiveTrackingSessions { get; set; } = new List<ActiveTrackingSession>();
}
