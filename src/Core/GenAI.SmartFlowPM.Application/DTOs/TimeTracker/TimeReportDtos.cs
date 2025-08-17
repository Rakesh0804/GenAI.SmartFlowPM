using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.DTOs.TimeTracker;

public class TimeReportDto
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("billableHours")]
    public decimal BillableHours { get; set; }

    [JsonPropertyName("nonBillableHours")]
    public decimal NonBillableHours { get; set; }

    [JsonPropertyName("utilizationRate")]
    public decimal UtilizationRate { get; set; }

    [JsonPropertyName("projectBreakdown")]
    public List<ProjectTimeDto> ProjectBreakdown { get; set; } = new();

    [JsonPropertyName("categoryBreakdown")]
    public List<CategoryTimeDto> CategoryBreakdown { get; set; } = new();

    [JsonPropertyName("dailyBreakdown")]
    public List<DailyTimeDto> DailyBreakdown { get; set; } = new();
}

public class ProjectTimeDto
{
    [JsonPropertyName("projectId")]
    public Guid ProjectId { get; set; }

    [JsonPropertyName("projectName")]
    public string ProjectName { get; set; } = string.Empty;

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("billableHours")]
    public decimal BillableHours { get; set; }

    [JsonPropertyName("percentage")]
    public decimal Percentage { get; set; }
}

public class CategoryTimeDto
{
    [JsonPropertyName("categoryId")]
    public Guid CategoryId { get; set; }

    [JsonPropertyName("categoryName")]
    public string CategoryName { get; set; } = string.Empty;

    [JsonPropertyName("categoryColor")]
    public string? CategoryColor { get; set; }

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("percentage")]
    public decimal Percentage { get; set; }
}

public class DailyTimeDto
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("billableHours")]
    public decimal BillableHours { get; set; }

    [JsonPropertyName("entryCount")]
    public int EntryCount { get; set; }
}

public class TeamTimeReportDto
{
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("totalTeamHours")]
    public decimal TotalTeamHours { get; set; }

    [JsonPropertyName("averageUtilization")]
    public decimal AverageUtilization { get; set; }

    [JsonPropertyName("userReports")]
    public List<UserTimeReportDto> UserReports { get; set; } = new();

    [JsonPropertyName("projectBreakdown")]
    public List<ProjectTimeDto> ProjectBreakdown { get; set; } = new();
}

public class UserTimeReportDto
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("totalHours")]
    public decimal TotalHours { get; set; }

    [JsonPropertyName("billableHours")]
    public decimal BillableHours { get; set; }

    [JsonPropertyName("utilizationRate")]
    public decimal UtilizationRate { get; set; }
}
