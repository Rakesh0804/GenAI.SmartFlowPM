using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class UserClaim : TenantBaseEntity
{
    public Guid UserId { get; set; }
    public Guid ClaimId { get; set; }
    public string? ClaimValue { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Claim Claim { get; set; } = null!;
}
