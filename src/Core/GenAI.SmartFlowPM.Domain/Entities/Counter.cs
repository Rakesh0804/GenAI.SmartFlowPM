using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class Counter : TenantBaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public int CurrentValue { get; set; } = 0;
    
    [MaxLength(200)]
    public string? Description { get; set; }
}
