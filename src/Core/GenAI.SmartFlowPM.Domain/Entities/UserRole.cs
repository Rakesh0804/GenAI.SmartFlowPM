using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class UserRole : TenantBaseEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}
