using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.TimeTracker;

public class TimeEntryDto
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

    [JsonPropertyName("endTime")]
    public DateTime? EndTime { get; set; }

    [JsonPropertyName("duration")]
    public int Duration { get; set; } // Duration in minutes

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("entryType")]
    public TimeEntryType EntryType { get; set; }

    [JsonPropertyName("billableStatus")]
    public BillableStatus BillableStatus { get; set; }

    [JsonPropertyName("hourlyRate")]
    public decimal? HourlyRate { get; set; }

    [JsonPropertyName("isManualEntry")]
    public bool IsManualEntry { get; set; }

    [JsonPropertyName("timesheetId")]
    public Guid? TimesheetId { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateTimeEntryDto
{
    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    [Required]
    public Guid TimeCategoryId { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? Duration { get; set; } // Duration in minutes, will be calculated if not provided

    [MaxLength(500)]
    public string? Description { get; set; }

    public TimeEntryType EntryType { get; set; }

    public BillableStatus BillableStatus { get; set; }

    public decimal? HourlyRate { get; set; }

    public bool IsManualEntry { get; set; } = true;
}

public class UpdateTimeEntryDto
{
    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    [Required]
    public Guid TimeCategoryId { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? Duration { get; set; } // Duration in minutes

    [MaxLength(500)]
    public string? Description { get; set; }

    public TimeEntryType EntryType { get; set; }

    public BillableStatus BillableStatus { get; set; }

    public decimal? HourlyRate { get; set; }
}

public class TimeEntrySummaryDto
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("billableHours")]
    public decimal BillableHours { get; set; }

    [JsonPropertyName("nonBillableHours")]
    public decimal NonBillableHours { get; set; }

    [JsonPropertyName("entryCount")]
    public int EntryCount { get; set; }

    [JsonPropertyName("entries")]
    public List<TimeEntryDto> Entries { get; set; } = new();
}
