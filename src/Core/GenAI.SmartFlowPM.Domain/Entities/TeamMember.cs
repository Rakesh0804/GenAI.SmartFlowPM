using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class TeamMember : TenantBaseEntity
{
    public Guid TeamId { get; set; }
    public Guid UserId { get; set; }
    public TeamMemberRole Role { get; set; } = TeamMemberRole.Member;
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LeftDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public Team Team { get; set; } = null!;
    public User User { get; set; } = null!;
}
