using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class Timesheet : TenantBaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public TimesheetStatus Status { get; set; } = TimesheetStatus.Draft;

    public decimal TotalHours { get; set; }

    public decimal BillableHours { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public Guid? SubmittedBy { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public Guid? ApprovedBy { get; set; }

    public DateTime? RejectedAt { get; set; }

    public Guid? RejectedBy { get; set; }

    [MaxLength(1000)]
    public string? ApprovalNotes { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual User? SubmittedByUser { get; set; }
    public virtual User? ApprovedByUser { get; set; }
    public virtual User? RejectedByUser { get; set; }
    public virtual ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
}
