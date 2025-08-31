using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.Calendar;

public class EventAttendeeDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }

    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("userEmail")]
    public string UserEmail { get; set; } = string.Empty;

    [JsonPropertyName("response")]
    public AttendeeResponse Response { get; set; }

    [JsonPropertyName("isRequired")]
    public bool IsRequired { get; set; }

    [JsonPropertyName("isOrganizer")]
    public bool IsOrganizer { get; set; }

    [JsonPropertyName("invitedAt")]
    public DateTime InvitedAt { get; set; }

    [JsonPropertyName("responseAt")]
    public DateTime? ResponseAt { get; set; }

    [JsonPropertyName("notes")]
    public string? Notes { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateEventAttendeeDto
{
    [Required]
    public Guid UserId { get; set; }

    public bool IsRequired { get; set; } = true;

    public bool IsOrganizer { get; set; } = false;

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateEventAttendeeDto
{
    public bool IsRequired { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateAttendeeResponseDto
{
    [Required]
    public AttendeeResponse Response { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class EventAttendeeSummaryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("userEmail")]
    public string UserEmail { get; set; } = string.Empty;

    [JsonPropertyName("response")]
    public AttendeeResponse Response { get; set; }

    [JsonPropertyName("isRequired")]
    public bool IsRequired { get; set; }

    [JsonPropertyName("isOrganizer")]
    public bool IsOrganizer { get; set; }
}
