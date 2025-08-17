using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.Team;

public class TeamDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("leaderId")]
    public Guid? LeaderId { get; set; }
    
    [JsonPropertyName("leaderName")]
    public string? LeaderName { get; set; }
    
    [JsonPropertyName("status")]
    public TeamStatus Status { get; set; }
    
    [JsonPropertyName("type")]
    public TeamType Type { get; set; }
    
    [JsonPropertyName("location")]
    public string? Location { get; set; }
    
    [JsonPropertyName("maxMembers")]
    public int MaxMembers { get; set; }
    
    [JsonPropertyName("memberCount")]
    public int MemberCount { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
    
    [JsonPropertyName("members")]
    public List<TeamMemberDto> Members { get; set; } = new();
}

public class CreateTeamDto
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
}

public class UpdateTeamDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public Guid? LeaderId { get; set; }
    
    public TeamStatus Status { get; set; }
    
    public TeamType Type { get; set; }
    
    [MaxLength(50)]
    public string? Location { get; set; }
    
    public int MaxMembers { get; set; }
    
    public bool IsActive { get; set; }
}

public class TeamMemberDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("teamId")]
    public Guid TeamId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;
    
    [JsonPropertyName("userEmail")]
    public string UserEmail { get; set; } = string.Empty;
    
    [JsonPropertyName("role")]
    public TeamMemberRole Role { get; set; }
    
    [JsonPropertyName("joinedDate")]
    public DateTime JoinedDate { get; set; }
    
    [JsonPropertyName("leftDate")]
    public DateTime? LeftDate { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class AddTeamMemberDto
{
    public Guid TeamId { get; set; }
    public Guid UserId { get; set; }
    public TeamMemberRole Role { get; set; } = TeamMemberRole.Member;
}

public class UpdateTeamMemberDto
{
    public TeamMemberRole Role { get; set; }
    public bool IsActive { get; set; }
}
