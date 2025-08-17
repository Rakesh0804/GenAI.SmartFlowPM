using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class Team : TenantBaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public Guid? LeaderId { get; set; }
    
    public TeamStatus Status { get; set; } = TeamStatus.Active;
    
    public TeamType Type { get; set; } = TeamType.Other;
    
    [MaxLength(50)]
    public string? Location { get; set; }
    
    public int MaxMembers { get; set; } = 10;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public User? Leader { get; set; }
    public ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
    public ICollection<UserProject> TeamProjects { get; set; } = new List<UserProject>();
}
