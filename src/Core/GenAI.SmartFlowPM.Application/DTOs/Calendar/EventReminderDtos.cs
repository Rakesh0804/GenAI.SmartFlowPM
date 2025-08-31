using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.Calendar;

public class EventReminderDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }

    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("reminderType")]
    public ReminderType ReminderType { get; set; }

    [JsonPropertyName("reminderTime")]
    public int ReminderTime { get; set; } // Minutes before event

    [JsonPropertyName("isSent")]
    public bool IsSent { get; set; }

    [JsonPropertyName("sentAt")]
    public DateTime? SentAt { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateEventReminderDto
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public ReminderType ReminderType { get; set; }

    [Required]
    [Range(1, 43200)] // 1 minute to 30 days in minutes
    public int ReminderTime { get; set; } = 15; // Default: 15 minutes before

    public bool IsActive { get; set; } = true;
}

public class UpdateEventReminderDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [Required]
    public ReminderType ReminderType { get; set; }

    [Required]
    [Range(1, 43200)] // 1 minute to 30 days in minutes
    public int ReminderTime { get; set; }

    public bool IsActive { get; set; }
}

public class EventReminderSummaryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("reminderType")]
    public ReminderType ReminderType { get; set; }

    [JsonPropertyName("reminderTime")]
    public int ReminderTime { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("isSent")]
    public bool IsSent { get; set; }
}
