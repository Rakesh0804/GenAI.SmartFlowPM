using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using MediatR;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.Features.Campaigns.Queries;

/// <summary>
/// Get all campaigns with optional filtering
/// </summary>
public record GetCampaignsQuery : IRequest<Result<List<CampaignDto>>>
{
    [JsonPropertyName("status")]
    public CampaignStatus? Status { get; init; }

    [JsonPropertyName("type")]
    public CampaignType? Type { get; init; }

    [JsonPropertyName("startDateFrom")]
    public DateTime? StartDateFrom { get; init; }

    [JsonPropertyName("startDateTo")]
    public DateTime? StartDateTo { get; init; }

    [JsonPropertyName("includeDeleted")]
    public bool IncludeDeleted { get; init; } = false;
}

/// <summary>
/// Get campaign by ID
/// </summary>
public record GetCampaignByIdQuery : IRequest<Result<CampaignDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Get campaigns assigned to current manager
/// </summary>
public record GetMyCampaignsQuery : IRequest<Result<List<CampaignDto>>>
{
    [JsonPropertyName("status")]
    public CampaignStatus? Status { get; init; }
}

/// <summary>
/// Get campaigns where current user is a target
/// </summary>
public record GetMyCampaignTargetsQuery : IRequest<Result<List<CampaignDto>>>
{
    [JsonPropertyName("status")]
    public CampaignStatus? Status { get; init; }
}

/// <summary>
/// Get campaign statistics for dashboard
/// </summary>
public record GetCampaignStatisticsQuery : IRequest<Result<CampaignStatisticsDto>>
{
    [JsonPropertyName("fromDate")]
    public DateTime? FromDate { get; init; }

    [JsonPropertyName("toDate")]
    public DateTime? ToDate { get; init; }
}

/// <summary>
/// Get campaign groups
/// </summary>
public record GetCampaignGroupsQuery : IRequest<Result<List<CampaignGroupDto>>>
{
    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; init; }
}

/// <summary>
/// Get campaign group by ID
/// </summary>
public record GetCampaignGroupByIdQuery : IRequest<Result<CampaignGroupDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Get campaign evaluations for a campaign
/// </summary>
public record GetCampaignEvaluationsQuery : IRequest<Result<List<CampaignEvaluationDto>>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("evaluatedUserId")]
    public Guid? EvaluatedUserId { get; init; }

    [JsonPropertyName("isCompleted")]
    public bool? IsCompleted { get; init; }
}

/// <summary>
/// Get campaign evaluation by ID
/// </summary>
public record GetCampaignEvaluationByIdQuery : IRequest<Result<CampaignEvaluationDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Get users eligible for campaign targeting (users with reportees)
/// </summary>
public record GetCampaignEligibleUsersQuery : IRequest<Result<List<CampaignTargetUserDto>>>
{
    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; init; }

    [JsonPropertyName("hasReportees")]
    public bool HasReportees { get; init; } = true;
}

/// <summary>
/// Get campaign progress report
/// </summary>
public record GetCampaignProgressQuery : IRequest<Result<CampaignProgressDto>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }
}
