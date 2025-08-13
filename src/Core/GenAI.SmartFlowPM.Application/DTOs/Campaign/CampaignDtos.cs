using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.DTOs.Campaign;

/// <summary>
/// Campaign status enumeration
/// </summary>
public enum CampaignStatus
{
    Draft = 0,
    Active = 1,
    Completed = 2,
    Cancelled = 3,
    Paused = 4
}

/// <summary>
/// Campaign type enumeration
/// </summary>
public enum CampaignType
{
    RoleEvaluation = 0,
    ClaimsAudit = 1,
    ComplianceReview = 2,
    SecurityAssessment = 3,
    PerformanceReview = 4
}

/// <summary>
/// Main campaign DTO
/// </summary>
public class CampaignDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public CampaignType Type { get; set; }

    [JsonPropertyName("status")]
    public CampaignStatus Status { get; set; }

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("createdBy")]
    public Guid CreatedBy { get; set; }

    [JsonPropertyName("createdByName")]
    public string CreatedByName { get; set; } = string.Empty;

    [JsonPropertyName("assignedManagers")]
    public List<Guid> AssignedManagers { get; set; } = new();

    [JsonPropertyName("assignedManagerNames")]
    public List<string> AssignedManagerNames { get; set; } = new();

    [JsonPropertyName("targetUserIds")]
    public List<Guid> TargetUserIds { get; set; } = new();

    [JsonPropertyName("totalTargets")]
    public int TotalTargets { get; set; }

    [JsonPropertyName("completedEvaluations")]
    public int CompletedEvaluations { get; set; }

    [JsonPropertyName("pendingEvaluations")]
    public int PendingEvaluations { get; set; }

    [JsonPropertyName("progressPercentage")]
    public decimal ProgressPercentage { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("groups")]
    public List<CampaignGroupDto> Groups { get; set; } = new();
}

/// <summary>
/// Campaign group DTO for organizing campaign targets
/// </summary>
public class CampaignGroupDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; set; }

    [JsonPropertyName("managerName")]
    public string ManagerName { get; set; } = string.Empty;

    [JsonPropertyName("targetUserIds")]
    public List<Guid> TargetUserIds { get; set; } = new();

    [JsonPropertyName("targetUserNames")]
    public List<string> TargetUserNames { get; set; } = new();

    [JsonPropertyName("totalTargets")]
    public int TotalTargets { get; set; }

    [JsonPropertyName("completedEvaluations")]
    public int CompletedEvaluations { get; set; }

    [JsonPropertyName("pendingEvaluations")]
    public int PendingEvaluations { get; set; }

    [JsonPropertyName("progressPercentage")]
    public decimal ProgressPercentage { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Campaign evaluation DTO
/// </summary>
public class CampaignEvaluationDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("campaignTitle")]
    public string CampaignTitle { get; set; } = string.Empty;

    [JsonPropertyName("evaluatedUserId")]
    public Guid EvaluatedUserId { get; set; }

    [JsonPropertyName("evaluatedUserName")]
    public string EvaluatedUserName { get; set; } = string.Empty;

    [JsonPropertyName("evaluatorId")]
    public Guid EvaluatorId { get; set; }

    [JsonPropertyName("evaluatorName")]
    public string EvaluatorName { get; set; } = string.Empty;

    [JsonPropertyName("groupId")]
    public Guid? GroupId { get; set; }

    [JsonPropertyName("groupName")]
    public string GroupName { get; set; } = string.Empty;

    [JsonPropertyName("roleEvaluations")]
    public List<RoleClaimEvaluationDto> RoleEvaluations { get; set; } = new();

    [JsonPropertyName("claimEvaluations")]
    public List<RoleClaimEvaluationDto> ClaimEvaluations { get; set; } = new();

    [JsonPropertyName("overallScore")]
    public decimal OverallScore { get; set; }

    [JsonPropertyName("feedback")]
    public string Feedback { get; set; } = string.Empty;

    [JsonPropertyName("isCompleted")]
    public bool IsCompleted { get; set; }

    [JsonPropertyName("submittedAt")]
    public DateTime? SubmittedAt { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Role or claim evaluation DTO
/// </summary>
public class RoleClaimEvaluationDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("campaignEvaluationId")]
    public Guid CampaignEvaluationId { get; set; }

    [JsonPropertyName("itemId")]
    public Guid ItemId { get; set; }

    [JsonPropertyName("itemName")]
    public string ItemName { get; set; } = string.Empty;

    [JsonPropertyName("itemType")]
    public string ItemType { get; set; } = string.Empty; // "Role" or "Claim"

    [JsonPropertyName("currentlyAssigned")]
    public bool CurrentlyAssigned { get; set; }

    [JsonPropertyName("shouldBeAssigned")]
    public bool ShouldBeAssigned { get; set; }

    [JsonPropertyName("evaluatorComments")]
    public string EvaluatorComments { get; set; } = string.Empty;

    [JsonPropertyName("businessJustification")]
    public string BusinessJustification { get; set; } = string.Empty;

    [JsonPropertyName("riskLevel")]
    public string RiskLevel { get; set; } = string.Empty; // "Low", "Medium", "High"

    [JsonPropertyName("actionRequired")]
    public string ActionRequired { get; set; } = string.Empty; // "None", "Add", "Remove", "Review"

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Campaign statistics DTO
/// </summary>
public class CampaignStatisticsDto
{
    [JsonPropertyName("totalCampaigns")]
    public int TotalCampaigns { get; set; }

    [JsonPropertyName("activeCampaigns")]
    public int ActiveCampaigns { get; set; }

    [JsonPropertyName("completedCampaigns")]
    public int CompletedCampaigns { get; set; }

    [JsonPropertyName("draftCampaigns")]
    public int DraftCampaigns { get; set; }

    [JsonPropertyName("totalEvaluations")]
    public int TotalEvaluations { get; set; }

    [JsonPropertyName("completedEvaluations")]
    public int CompletedEvaluations { get; set; }

    [JsonPropertyName("pendingEvaluations")]
    public int PendingEvaluations { get; set; }

    [JsonPropertyName("overallProgressPercentage")]
    public decimal OverallProgressPercentage { get; set; }

    [JsonPropertyName("averageCompletionTime")]
    public double AverageCompletionTime { get; set; } // in days

    [JsonPropertyName("mostActiveCampaignType")]
    public CampaignType MostActiveCampaignType { get; set; }

    [JsonPropertyName("recentActivity")]
    public List<CampaignActivityDto> RecentActivity { get; set; } = new();
}

/// <summary>
/// Campaign activity DTO for recent activities
/// </summary>
public class CampaignActivityDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("campaignTitle")]
    public string CampaignTitle { get; set; } = string.Empty;

    [JsonPropertyName("activityType")]
    public string ActivityType { get; set; } = string.Empty; // "Created", "Started", "Completed", "EvaluationSubmitted"

    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("activityDate")]
    public DateTime ActivityDate { get; set; }
}

/// <summary>
/// Campaign target user DTO
/// </summary>
public class CampaignTargetUserDto
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = string.Empty;

    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = string.Empty;

    [JsonPropertyName("department")]
    public string Department { get; set; } = string.Empty;

    [JsonPropertyName("managerName")]
    public string ManagerName { get; set; } = string.Empty;

    [JsonPropertyName("currentRoles")]
    public List<string> CurrentRoles { get; set; } = new();

    [JsonPropertyName("currentClaims")]
    public List<string> CurrentClaims { get; set; } = new();

    [JsonPropertyName("isEligible")]
    public bool IsEligible { get; set; }

    [JsonPropertyName("lastEvaluationDate")]
    public DateTime? LastEvaluationDate { get; set; }
}

/// <summary>
/// Campaign progress DTO
/// </summary>
public class CampaignProgressDto
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("campaignTitle")]
    public string CampaignTitle { get; set; } = string.Empty;

    [JsonPropertyName("totalTargets")]
    public int TotalTargets { get; set; }

    [JsonPropertyName("completedEvaluations")]
    public int CompletedEvaluations { get; set; }

    [JsonPropertyName("pendingEvaluations")]
    public int PendingEvaluations { get; set; }

    [JsonPropertyName("progressPercentage")]
    public decimal ProgressPercentage { get; set; }

    [JsonPropertyName("daysRemaining")]
    public int DaysRemaining { get; set; }

    [JsonPropertyName("groupProgress")]
    public List<CampaignGroupProgressDto> GroupProgress { get; set; } = new();

    [JsonPropertyName("managerProgress")]
    public List<CampaignManagerProgressDto> ManagerProgress { get; set; } = new();
}

/// <summary>
/// Campaign group progress DTO
/// </summary>
public class CampaignGroupProgressDto
{
    [JsonPropertyName("groupId")]
    public Guid GroupId { get; set; }

    [JsonPropertyName("groupName")]
    public string GroupName { get; set; } = string.Empty;

    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; set; }

    [JsonPropertyName("managerName")]
    public string ManagerName { get; set; } = string.Empty;

    [JsonPropertyName("totalTargets")]
    public int TotalTargets { get; set; }

    [JsonPropertyName("completedEvaluations")]
    public int CompletedEvaluations { get; set; }

    [JsonPropertyName("pendingEvaluations")]
    public int PendingEvaluations { get; set; }

    [JsonPropertyName("progressPercentage")]
    public decimal ProgressPercentage { get; set; }
}

/// <summary>
/// Campaign manager progress DTO
/// </summary>
public class CampaignManagerProgressDto
{
    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; set; }

    [JsonPropertyName("managerName")]
    public string ManagerName { get; set; } = string.Empty;

    [JsonPropertyName("totalAssignedTargets")]
    public int TotalAssignedTargets { get; set; }

    [JsonPropertyName("completedEvaluations")]
    public int CompletedEvaluations { get; set; }

    [JsonPropertyName("pendingEvaluations")]
    public int PendingEvaluations { get; set; }

    [JsonPropertyName("progressPercentage")]
    public decimal ProgressPercentage { get; set; }

    [JsonPropertyName("groupsAssigned")]
    public int GroupsAssigned { get; set; }
}
