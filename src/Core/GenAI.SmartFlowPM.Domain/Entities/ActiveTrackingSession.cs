using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class ActiveTrackingSession : TenantBaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    [Required]
    public Guid TimeCategoryId { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    public int PausedTime { get; set; } = 0; // Total paused minutes

    [Required]
    public DateTime LastActivityTime { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public TrackingStatus Status { get; set; } = TrackingStatus.Running;

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Project? Project { get; set; }
    public virtual ProjectTask? Task { get; set; }
    public virtual TimeCategory TimeCategory { get; set; } = null!;
}
