using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using MediatR;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.Features.Campaigns.Commands;

/// <summary>
/// Create a new audit campaign for roles and claims evaluation
/// </summary>
public record CreateCampaignCommand : IRequest<Result<CampaignDto>>
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; init; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; init; }

    [JsonPropertyName("type")]
    public CampaignType Type { get; init; }

    [JsonPropertyName("status")]
    public CampaignStatus Status { get; init; } = CampaignStatus.Draft;

    [JsonPropertyName("targetUserGroupIds")]
    public List<Guid> TargetUserGroupIds { get; init; } = new();

    [JsonPropertyName("assignedManagerIds")]
    public List<Guid> AssignedManagerIds { get; init; } = new();

    [JsonPropertyName("instructions")]
    public string? Instructions { get; init; }

    [JsonPropertyName("notifyReportees")]
    public bool NotifyReportees { get; init; } = true;
}

/// <summary>
/// Update an existing campaign
/// </summary>
public record UpdateCampaignCommand : IRequest<Result<CampaignDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; init; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; init; }

    [JsonPropertyName("type")]
    public CampaignType Type { get; init; }

    [JsonPropertyName("status")]
    public CampaignStatus Status { get; init; }

    [JsonPropertyName("targetUserGroupIds")]
    public List<Guid> TargetUserGroupIds { get; init; } = new();

    [JsonPropertyName("assignedManagerIds")]
    public List<Guid> AssignedManagerIds { get; init; } = new();

    [JsonPropertyName("instructions")]
    public string? Instructions { get; init; }

    [JsonPropertyName("notifyReportees")]
    public bool NotifyReportees { get; init; }
}

/// <summary>
/// Start a campaign (change status from Draft to Active)
/// </summary>
public record StartCampaignCommand : IRequest<Result<CampaignDto>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }
}

/// <summary>
/// Complete a campaign (change status to Completed)
/// </summary>
public record CompleteCampaignCommand : IRequest<Result<CampaignDto>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("completionNotes")]
    public string? CompletionNotes { get; init; }
}

/// <summary>
/// Cancel a campaign
/// </summary>
public record CancelCampaignCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("cancellationReason")]
    public string? CancellationReason { get; init; }
}

/// <summary>
/// Delete a campaign (soft delete)
/// </summary>
public record DeleteCampaignCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Create a campaign group for organizing target users
/// </summary>
public record CreateCampaignGroupCommand : IRequest<Result<CampaignGroupDto>>
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("userIds")]
    public List<Guid> UserIds { get; init; } = new();
}

/// <summary>
/// Update campaign group membership
/// </summary>
public record UpdateCampaignGroupCommand : IRequest<Result<CampaignGroupDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("userIds")]
    public List<Guid> UserIds { get; init; } = new();
}

/// <summary>
/// Submit campaign evaluation for a user
/// </summary>
public record SubmitCampaignEvaluationCommand : IRequest<Result<CampaignEvaluationDto>>
{
    public Guid CampaignId { get; init; }
    public Guid EvaluatedUserId { get; init; }
    public string EvaluationNotes { get; init; } = string.Empty;
    public List<RoleClaimEvaluationDto> RoleEvaluations { get; init; } = new();
    public List<RoleClaimEvaluationDto> ClaimEvaluations { get; init; } = new();
    public bool IsApproved { get; init; }
    public string? RecommendedActions { get; init; }
}
