using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.Calendar;

public class RecurrencePatternDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("eventId")]
    public Guid EventId { get; set; }

    [JsonPropertyName("recurrenceType")]
    public RecurrenceType RecurrenceType { get; set; }

    [JsonPropertyName("interval")]
    public int Interval { get; set; }

    [JsonPropertyName("daysOfWeek")]
    public int? DaysOfWeek { get; set; } // Bitmask for weekly recurrence

    [JsonPropertyName("dayOfMonth")]
    public int? DayOfMonth { get; set; } // For monthly recurrence

    [JsonPropertyName("monthOfYear")]
    public int? MonthOfYear { get; set; } // For yearly recurrence

    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }

    [JsonPropertyName("maxOccurrences")]
    public int? MaxOccurrences { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateRecurrencePatternDto
{
    [Required]
    public RecurrenceType RecurrenceType { get; set; }

    [Required]
    [Range(1, 365)]
    public int Interval { get; set; } = 1; // Every N days/weeks/months

    [Range(1, 127)] // Bitmask: Sunday=1, Monday=2, Tuesday=4, etc.
    public int? DaysOfWeek { get; set; }

    [Range(1, 31)]
    public int? DayOfMonth { get; set; }

    [Range(1, 12)]
    public int? MonthOfYear { get; set; }

    public DateTime? EndDate { get; set; }

    [Range(1, 365)]
    public int? MaxOccurrences { get; set; }
}

public class UpdateRecurrencePatternDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [Required]
    public RecurrenceType RecurrenceType { get; set; }

    [Required]
    [Range(1, 365)]
    public int Interval { get; set; }

    [Range(1, 127)]
    public int? DaysOfWeek { get; set; }

    [Range(1, 31)]
    public int? DayOfMonth { get; set; }

    [Range(1, 12)]
    public int? MonthOfYear { get; set; }

    public DateTime? EndDate { get; set; }

    [Range(1, 365)]
    public int? MaxOccurrences { get; set; }
}

public class RecurrencePatternSummaryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("recurrenceType")]
    public RecurrenceType RecurrenceType { get; set; }

    [JsonPropertyName("interval")]
    public int Interval { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty; // Human-readable description

    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }

    [JsonPropertyName("maxOccurrences")]
    public int? MaxOccurrences { get; set; }
}
