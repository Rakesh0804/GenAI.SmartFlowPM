using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class OrganizationSetting : TenantBaseEntity
{
    [Required]
    public Guid OrganizationId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string SettingKey { get; set; } = string.Empty;
    
    [Required]
    public string SettingValue { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string SettingType { get; set; } = "String"; // String, Boolean, Integer, JSON
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public bool IsEditable { get; set; } = true;
    
    // Navigation Properties
    public Organization Organization { get; set; } = null!;
}
