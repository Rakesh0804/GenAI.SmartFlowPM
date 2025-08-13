using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.DTOs.Claim;

public class ClaimDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateClaimDto
{
    [Required]
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    [MaxLength(500)]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;
}

public class UpdateClaimDto
{
    [Required]
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    [MaxLength(500)]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}

public class ClaimSummaryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
}
