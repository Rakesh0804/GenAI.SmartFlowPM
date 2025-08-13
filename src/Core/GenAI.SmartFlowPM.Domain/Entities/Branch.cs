using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class Branch : TenantBaseEntity
{
    [Required]
    public Guid OrganizationId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? Code { get; set; }
    
    [Required]
    public BranchType BranchType { get; set; }
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string State { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }
    
    public Guid? ManagerId { get; set; }
    
    public int EmployeeCount { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public Organization Organization { get; set; } = null!;
    public User? Manager { get; set; }
}
