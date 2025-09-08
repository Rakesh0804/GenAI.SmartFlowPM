using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

/// <summary>
/// Campaign entity for audit and evaluation campaigns
/// </summary>
public class Campaign : TenantBaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public int Type { get; set; } // CampaignType enum

    public int Status { get; set; } = 1; // CampaignStatus enum - Default: Draft

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    /// <summary>
    /// JSON serialized list of manager user IDs assigned to this campaign
    /// </summary>
    [MaxLength(4000)]
    public string AssignedManagers { get; set; } = "[]";

    /// <summary>
    /// JSON serialized list of target user IDs for evaluation
    /// </summary>
    [MaxLength(4000)]
    public string TargetUserIds { get; set; } = "[]";

    public DateTime? ActualStartDate { get; set; }

    public DateTime? ActualEndDate { get; set; }

    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Foreign key to User who created this campaign
    /// </summary>
    public Guid CreatedByUserId { get; set; }

    /// <summary>
    /// Navigation property to the User who created this campaign
    /// </summary>
    public virtual User CreatedByUser { get; set; } = null!;

    // Helper properties for working with JSON lists
    public List<Guid> GetAssignedManagers()
    {
        try
        {
            return JsonSerializer.Deserialize<List<Guid>>(AssignedManagers) ?? new List<Guid>();
        }
        catch
        {
            return new List<Guid>();
        }
    }

    public void SetAssignedManagers(List<Guid> managers)
    {
        AssignedManagers = JsonSerializer.Serialize(managers);
    }

    public List<Guid> GetTargetUserIds()
    {
        try
        {
            return JsonSerializer.Deserialize<List<Guid>>(TargetUserIds) ?? new List<Guid>();
        }
        catch
        {
            return new List<Guid>();
        }
    }

    public void SetTargetUserIds(List<Guid> userIds)
    {
        TargetUserIds = JsonSerializer.Serialize(userIds);
    }

    // Navigation Properties
    public ICollection<CampaignGroup> Groups { get; set; } = new List<CampaignGroup>();
    public ICollection<CampaignEvaluation> Evaluations { get; set; } = new List<CampaignEvaluation>();
    public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
}

/// <summary>
/// Campaign group entity for organizing evaluations by manager
/// </summary>
public class CampaignGroup : TenantBaseEntity
{
    public Guid? CampaignId { get; set; } // Nullable to allow standalone groups

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public Guid ManagerId { get; set; }

    /// <summary>
    /// JSON serialized list of target user IDs for this group
    /// </summary>
    [MaxLength(4000)]
    public string TargetUserIds { get; set; } = "[]";

    public bool IsActive { get; set; } = true;

    // Helper properties for working with JSON lists
    public List<Guid> GetTargetUserIds()
    {
        try
        {
            return JsonSerializer.Deserialize<List<Guid>>(TargetUserIds) ?? new List<Guid>();
        }
        catch
        {
            return new List<Guid>();
        }
    }

    public void SetTargetUserIds(List<Guid> userIds)
    {
        TargetUserIds = JsonSerializer.Serialize(userIds);
    }

    // Navigation Properties
    public Campaign Campaign { get; set; } = null!;
    public User Manager { get; set; } = null!;
    public ICollection<CampaignEvaluation> Evaluations { get; set; } = new List<CampaignEvaluation>();
}

/// <summary>
/// Campaign evaluation entity for individual evaluation submissions
/// </summary>
public class CampaignEvaluation : TenantBaseEntity
{
    [Required]
    public Guid CampaignId { get; set; }

    public Guid? GroupId { get; set; }

    [Required]
    public Guid EvaluatedUserId { get; set; }

    [Required]
    public Guid EvaluatorId { get; set; }

    /// <summary>
    /// JSON serialized role evaluations data
    /// </summary>
    [MaxLength(4000)]
    public string? RoleEvaluations { get; set; }

    /// <summary>
    /// JSON serialized claim evaluations data
    /// </summary>
    [MaxLength(4000)]
    public string? ClaimEvaluations { get; set; }

    [MaxLength(2000)]
    public string? Feedback { get; set; }

    public bool IsCompleted { get; set; } = false;

    public DateTime? SubmittedAt { get; set; }

    // Helper properties for working with JSON data
    public Dictionary<string, object> GetRoleEvaluations()
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(RoleEvaluations ?? "{}") ?? new Dictionary<string, object>();
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }

    public void SetRoleEvaluations(Dictionary<string, object> evaluations)
    {
        RoleEvaluations = JsonSerializer.Serialize(evaluations);
    }

    public Dictionary<string, object> GetClaimEvaluations()
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(ClaimEvaluations ?? "{}") ?? new Dictionary<string, object>();
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }

    public void SetClaimEvaluations(Dictionary<string, object> evaluations)
    {
        ClaimEvaluations = JsonSerializer.Serialize(evaluations);
    }

    // Navigation Properties
    public Campaign Campaign { get; set; } = null!;
    public CampaignGroup? Group { get; set; }
    public User EvaluatedUser { get; set; } = null!;
    public User Evaluator { get; set; } = null!;
}
