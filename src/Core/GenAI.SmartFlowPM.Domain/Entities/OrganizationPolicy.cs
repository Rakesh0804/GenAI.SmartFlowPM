using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class OrganizationPolicy : TenantBaseEntity
{
    [Required]
    public Guid OrganizationId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public PolicyType PolicyType { get; set; }
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? DocumentUrl { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Version { get; set; } = "1.0";
    
    [Required]
    public DateTime EffectiveDate { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
    
    public bool RequiresAcknowledgment { get; set; } = false;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public Organization Organization { get; set; } = null!;
}
