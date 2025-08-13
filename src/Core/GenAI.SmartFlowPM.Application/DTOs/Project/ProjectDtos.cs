using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.DTOs.Project;

public class ProjectDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
    
    [JsonPropertyName("status")]
    public ProjectStatus Status { get; set; }
    
    [JsonPropertyName("priority")]
    public ProjectPriority Priority { get; set; }
    
    [JsonPropertyName("budget")]
    public decimal? Budget { get; set; }
    
    [JsonPropertyName("clientName")]
    public string? ClientName { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateProjectDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
    
    public ProjectPriority Priority { get; set; } = ProjectPriority.Medium;
    
    public decimal? Budget { get; set; }
    
    [MaxLength(100)]
    public string? ClientName { get; set; }
    
    public bool IsActive { get; set; } = true;
}

public class UpdateProjectDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public ProjectStatus Status { get; set; }
    
    public ProjectPriority Priority { get; set; }
    
    public decimal? Budget { get; set; }
    
    [MaxLength(100)]
    public string? ClientName { get; set; }
    
    public bool IsActive { get; set; }
}
