using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.TimeTracker;

public class ActiveTrackingSessionDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("projectId")]
    public Guid? ProjectId { get; set; }

    [JsonPropertyName("projectName")]
    public string? ProjectName { get; set; }

    [JsonPropertyName("taskId")]
    public Guid? TaskId { get; set; }

    [JsonPropertyName("taskName")]
    public string? TaskName { get; set; }

    [JsonPropertyName("timeCategoryId")]
    public Guid TimeCategoryId { get; set; }

    [JsonPropertyName("timeCategoryName")]
    public string TimeCategoryName { get; set; } = string.Empty;

    [JsonPropertyName("timeCategoryColor")]
    public string? TimeCategoryColor { get; set; }

    [JsonPropertyName("startTime")]
    public DateTime StartTime { get; set; }

    [JsonPropertyName("pausedTime")]
    public int PausedTime { get; set; } // Total paused minutes

    [JsonPropertyName("lastActivityTime")]
    public DateTime LastActivityTime { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("status")]
    public TrackingStatus Status { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("elapsedMinutes")]
    public int ElapsedMinutes { get; set; } // Calculated field

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class StartTrackingDto
{
    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    [Required]
    public Guid TimeCategoryId { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class UpdateTrackingDto
{
    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    [Required]
    public Guid TimeCategoryId { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class StopTrackingDto
{
    [MaxLength(500)]
    public string? Description { get; set; }

    public bool CreateTimeEntry { get; set; } = true;
}

public class PauseTrackingDto
{
    // No additional properties needed for pausing
}

public class ResumeTrackingDto
{
    // No additional properties needed for resuming
}
