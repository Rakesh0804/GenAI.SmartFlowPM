using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class TimeEntry : TenantBaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    [Required]
    public Guid TimeCategoryId { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    [Required]
    public int Duration { get; set; } // Duration in minutes

    [MaxLength(500)]
    public string? Description { get; set; }

    public TimeEntryType EntryType { get; set; }

    public BillableStatus BillableStatus { get; set; }

    public decimal? HourlyRate { get; set; }

    public bool IsManualEntry { get; set; } = false;

    public Guid? TimesheetId { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Project? Project { get; set; }
    public virtual ProjectTask? Task { get; set; }
    public virtual TimeCategory TimeCategory { get; set; } = null!;
    public virtual Timesheet? Timesheet { get; set; }
}
