using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class Tenant : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? SubDomain { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string ContactEmail { get; set; } = string.Empty;
    
    [MaxLength(15)]
    public string? ContactPhone { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [MaxLength(100)]
    public string? State { get; set; }
    
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [MaxLength(100)]
    public string? Country { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime? SubscriptionStartDate { get; set; }
    
    public DateTime? SubscriptionEndDate { get; set; }
    
    [MaxLength(50)]
    public string? SubscriptionPlan { get; set; }
    
    public int MaxUsers { get; set; } = 10;
    
    public int MaxProjects { get; set; } = 5;
    
    [MaxLength(3)]
    public string? TimeZone { get; set; }
    
    [MaxLength(3)]
    public string? Currency { get; set; }
    
    [MaxLength(500)]
    public string? LogoUrl { get; set; }
    
    // Navigation Properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Organization> Organizations { get; set; } = new List<Organization>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<Role> Roles { get; set; } = new List<Role>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
}
