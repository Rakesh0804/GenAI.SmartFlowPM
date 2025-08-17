using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;

// Time Category Queries
public class GetTimeCategoryByIdQuery : IRequest<Result<TimeCategoryDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllTimeCategoriesQuery : IRequest<Result<PaginatedResult<TimeCategoryDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetActiveTimeCategoriesQuery : IRequest<Result<IEnumerable<TimeCategoryDto>>>
{
    // No additional parameters needed
}

// Time Entry Queries
public class GetTimeEntryByIdQuery : IRequest<Result<TimeEntryDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllTimeEntriesQuery : IRequest<Result<PaginatedResult<TimeEntryDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetTimeEntriesByUserIdQuery : IRequest<Result<IEnumerable<TimeEntryDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class GetTimeEntriesByProjectIdQuery : IRequest<Result<IEnumerable<TimeEntryDto>>>
{
    [JsonPropertyName("projectId")]
    public Guid ProjectId { get; set; }
}

public class GetTimeEntriesByTaskIdQuery : IRequest<Result<IEnumerable<TimeEntryDto>>>
{
    [JsonPropertyName("taskId")]
    public Guid TaskId { get; set; }
}

public class GetTimeEntriesByDateRangeQuery : IRequest<Result<IEnumerable<TimeEntryDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
}

public class GetTimeEntriesByTimesheetIdQuery : IRequest<Result<IEnumerable<TimeEntryDto>>>
{
    [JsonPropertyName("timesheetId")]
    public Guid TimesheetId { get; set; }
}

// Timesheet Queries
public class GetTimesheetByIdQuery : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllTimesheetsQuery : IRequest<Result<PaginatedResult<TimesheetDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetTimesheetsByUserIdQuery : IRequest<Result<IEnumerable<TimesheetDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class GetTimesheetByUserAndDateRangeQuery : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
}

public class GetPendingTimesheetApprovalsQuery : IRequest<Result<IEnumerable<TimesheetDto>>>
{
    // No additional parameters needed - will get all pending approvals for the tenant
}

public class GetTimesheetsByStatusQuery : IRequest<Result<IEnumerable<TimesheetDto>>>
{
    [JsonPropertyName("status")]
    public TimesheetStatus Status { get; set; }
}

// Active Tracking Queries
public class GetActiveTrackingSessionByIdQuery : IRequest<Result<ActiveTrackingSessionDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetActiveTrackingSessionByUserIdQuery : IRequest<Result<ActiveTrackingSessionDto>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class GetTrackingSessionsByUserIdQuery : IRequest<Result<IEnumerable<ActiveTrackingSessionDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

// Time Report Queries
public class GetUserTimeReportQuery : IRequest<Result<TimeReportDto>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
}

public class GetTeamTimeReportQuery : IRequest<Result<TeamTimeReportDto>>
{
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
}

public class GetProjectTimeReportQuery : IRequest<Result<TimeReportDto>>
{
    [JsonPropertyName("projectId")]
    public Guid ProjectId { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
}
