using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

/// <summary>
/// Certificate entity for recognition and verification
/// </summary>
public class Certificate : TenantBaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public Guid RecipientId { get; set; }

    [Required]
    [MaxLength(200)]
    public string RecipientName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string RecipientEmail { get; set; } = string.Empty;

    [Required]
    public Guid IssuedBy { get; set; }

    [Required]
    [MaxLength(200)]
    public string IssuerName { get; set; } = string.Empty;

    [Required]
    public DateTime IssuedDate { get; set; } = DateTime.UtcNow;

    public DateTime? ExpiryDate { get; set; }

    [Required]
    [MaxLength(100)]
    public string VerificationToken { get; set; } = string.Empty;

    public int Status { get; set; } = 1; // CertificateStatus enum - Default: Valid

    public int Type { get; set; } = 1; // CertificateType enum - Default: CampaignCompletion

    public Guid? CampaignId { get; set; }

    public Guid? TemplateId { get; set; }

    [MaxLength(500)]
    public string? CertificateUrl { get; set; }

    [MaxLength(2000)]
    public string? CustomMessage { get; set; }

    /// <summary>
    /// JSON serialized metadata for additional certificate information
    /// </summary>
    [MaxLength(4000)]
    public string? MetaData { get; set; }

    public DateTime? RevokedAt { get; set; }

    [MaxLength(500)]
    public string? RevokedReason { get; set; }

    public Guid? RevokedBy { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public int VerificationCount { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    // Helper properties for working with JSON metadata
    public Dictionary<string, object> GetMetaData()
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(MetaData ?? "{}") ?? new Dictionary<string, object>();
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }

    public void SetMetaData(Dictionary<string, object> metadata)
    {
        MetaData = JsonSerializer.Serialize(metadata);
    }

    // Navigation Properties
    public User Recipient { get; set; } = null!;
    public User Issuer { get; set; } = null!;
    public Campaign? Campaign { get; set; }
    public CertificateTemplate? Template { get; set; }
    public User? RevokedByUser { get; set; }
}

/// <summary>
/// Certificate template entity for customizable certificate layouts
/// </summary>
public class CertificateTemplate : TenantBaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(4000)]
    public string TemplateContent { get; set; } = string.Empty;

    /// <summary>
    /// JSON serialized template variables and their default values
    /// </summary>
    [MaxLength(4000)]
    public string? Variables { get; set; }

    /// <summary>
    /// JSON serialized style configuration for the template
    /// </summary>
    [MaxLength(4000)]
    public string? StyleConfig { get; set; }

    [MaxLength(500)]
    public string? PreviewImageUrl { get; set; }

    public int Type { get; set; } = 1; // CertificateType enum

    public bool IsDefault { get; set; } = false;

    public bool IsActive { get; set; } = true;

    // Helper properties for working with JSON data
    public Dictionary<string, string> GetVariables()
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(Variables ?? "{}") ?? new Dictionary<string, string>();
        }
        catch
        {
            return new Dictionary<string, string>();
        }
    }

    public void SetVariables(Dictionary<string, string> variables)
    {
        Variables = JsonSerializer.Serialize(variables);
    }

    public Dictionary<string, object> GetStyleConfig()
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(StyleConfig ?? "{}") ?? new Dictionary<string, object>();
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }

    public void SetStyleConfig(Dictionary<string, object> config)
    {
        StyleConfig = JsonSerializer.Serialize(config);
    }

    // Navigation Properties
    public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
}
