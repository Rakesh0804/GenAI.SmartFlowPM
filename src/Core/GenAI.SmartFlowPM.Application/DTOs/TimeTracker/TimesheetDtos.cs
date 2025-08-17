using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.TimeTracker;

public class TimesheetDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("status")]
    public TimesheetStatus Status { get; set; }

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("billableHours")]
    public decimal BillableHours { get; set; }

    [JsonPropertyName("submittedAt")]
    public DateTime? SubmittedAt { get; set; }

    [JsonPropertyName("submittedBy")]
    public Guid? SubmittedBy { get; set; }

    [JsonPropertyName("submittedByName")]
    public string? SubmittedByName { get; set; }

    [JsonPropertyName("approvedAt")]
    public DateTime? ApprovedAt { get; set; }

    [JsonPropertyName("approvedBy")]
    public Guid? ApprovedBy { get; set; }

    [JsonPropertyName("approvedByName")]
    public string? ApprovedByName { get; set; }

    [JsonPropertyName("rejectedAt")]
    public DateTime? RejectedAt { get; set; }

    [JsonPropertyName("rejectedBy")]
    public Guid? RejectedBy { get; set; }

    [JsonPropertyName("rejectedByName")]
    public string? RejectedByName { get; set; }

    [JsonPropertyName("approvalNotes")]
    public string? ApprovalNotes { get; set; }

    [JsonPropertyName("timeEntries")]
    public List<TimeEntryDto> TimeEntries { get; set; } = new();

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateTimesheetDto
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}

public class UpdateTimesheetDto
{
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}

public class SubmitTimesheetDto
{
    // No additional properties needed for submission
}

public class ApproveTimesheetDto
{
    [MaxLength(1000)]
    public string? ApprovalNotes { get; set; }
}

public class RejectTimesheetDto
{
    [MaxLength(1000)]
    public string? ApprovalNotes { get; set; }
}
