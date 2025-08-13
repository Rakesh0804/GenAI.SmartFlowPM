using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class Organization : TenantBaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [MaxLength(255)]
    public string? Website { get; set; }
    
    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [MaxLength(100)]
    public string? State { get; set; }
    
    [MaxLength(100)]
    public string? Country { get; set; }
    
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [MaxLength(500)]
    public string? Logo { get; set; }
    
    public int EmployeeCount { get; set; } = 0;
    
    public DateTime? EstablishedDate { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    public ICollection<OrganizationPolicy> Policies { get; set; } = new List<OrganizationPolicy>();
    public ICollection<CompanyHoliday> Holidays { get; set; } = new List<CompanyHoliday>();
    public ICollection<OrganizationSetting> Settings { get; set; } = new List<OrganizationSetting>();
}
