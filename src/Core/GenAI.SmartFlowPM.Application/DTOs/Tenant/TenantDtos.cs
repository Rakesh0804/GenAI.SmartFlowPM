using System.ComponentModel.DataAnnotations;

namespace GenAI.SmartFlowPM.Application.DTOs.Tenant;

public record CreateTenantDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; init; } = string.Empty;
    
    [MaxLength(100)]
    public string? SubDomain { get; init; }
    
    [MaxLength(500)]
    public string? Description { get; init; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string ContactEmail { get; init; } = string.Empty;
    
    [MaxLength(15)]
    public string? ContactPhone { get; init; }
    
    [MaxLength(500)]
    public string? Address { get; init; }
    
    [MaxLength(100)]
    public string? City { get; init; }
    
    [MaxLength(100)]
    public string? State { get; init; }
    
    [MaxLength(20)]
    public string? PostalCode { get; init; }
    
    [MaxLength(100)]
    public string? Country { get; init; }
    
    public DateTime? SubscriptionStartDate { get; init; }
    
    public DateTime? SubscriptionEndDate { get; init; }
    
    [MaxLength(50)]
    public string? SubscriptionPlan { get; init; }
    
    public int MaxUsers { get; init; } = 10;
    
    public int MaxProjects { get; init; } = 5;
    
    [MaxLength(3)]
    public string? TimeZone { get; init; }
    
    [MaxLength(3)]
    public string? Currency { get; init; }
    
    [MaxLength(500)]
    public string? LogoUrl { get; init; }
}

public record UpdateTenantDto
{
    [Required]
    public Guid Id { get; init; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; init; } = string.Empty;
    
    [MaxLength(100)]
    public string? SubDomain { get; init; }
    
    [MaxLength(500)]
    public string? Description { get; init; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string ContactEmail { get; init; } = string.Empty;
    
    [MaxLength(15)]
    public string? ContactPhone { get; init; }
    
    [MaxLength(500)]
    public string? Address { get; init; }
    
    [MaxLength(100)]
    public string? City { get; init; }
    
    [MaxLength(100)]
    public string? State { get; init; }
    
    [MaxLength(20)]
    public string? PostalCode { get; init; }
    
    [MaxLength(100)]
    public string? Country { get; init; }
    
    public bool IsActive { get; init; } = true;
    
    public DateTime? SubscriptionStartDate { get; init; }
    
    public DateTime? SubscriptionEndDate { get; init; }
    
    [MaxLength(50)]
    public string? SubscriptionPlan { get; init; }
    
    public int MaxUsers { get; init; } = 10;
    
    public int MaxProjects { get; init; } = 5;
    
    [MaxLength(3)]
    public string? TimeZone { get; init; }
    
    [MaxLength(3)]
    public string? Currency { get; init; }
    
    [MaxLength(500)]
    public string? LogoUrl { get; init; }
}

public record TenantDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? SubDomain { get; init; }
    public string? Description { get; init; }
    public string ContactEmail { get; init; } = string.Empty;
    public string? ContactPhone { get; init; }
    public string? Address { get; init; }
    public string? City { get; init; }
    public string? State { get; init; }
    public string? PostalCode { get; init; }
    public string? Country { get; init; }
    public bool IsActive { get; init; }
    public DateTime? SubscriptionStartDate { get; init; }
    public DateTime? SubscriptionEndDate { get; init; }
    public string? SubscriptionPlan { get; init; }
    public int MaxUsers { get; init; }
    public int MaxProjects { get; init; }
    public string? TimeZone { get; init; }
    public string? Currency { get; init; }
    public string? LogoUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public record TenantSummaryDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? SubDomain { get; init; }
    public string ContactEmail { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public string? SubscriptionPlan { get; init; }
    public int MaxUsers { get; init; }
    public int MaxProjects { get; init; }
    public DateTime CreatedAt { get; init; }
}
