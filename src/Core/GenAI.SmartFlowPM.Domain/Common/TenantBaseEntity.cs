using System.ComponentModel.DataAnnotations;

namespace GenAI.SmartFlowPM.Domain.Common;

public abstract class TenantBaseEntity : BaseEntity
{
    [Required]
    public Guid TenantId { get; set; }
    
    // Navigation property to Tenant
    public virtual Entities.Tenant Tenant { get; set; } = null!;
}
