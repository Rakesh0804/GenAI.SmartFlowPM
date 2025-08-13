using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Application.DTOs.User;

namespace GenAI.SmartFlowPM.Application.DTOs.Organization;

public class OrganizationDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("website")]
    public string? Website { get; set; }
    
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    
    [JsonPropertyName("phone")]
    public string? Phone { get; set; }
    
    [JsonPropertyName("address")]
    public string? Address { get; set; }
    
    [JsonPropertyName("city")]
    public string? City { get; set; }
    
    [JsonPropertyName("state")]
    public string? State { get; set; }
    
    [JsonPropertyName("country")]
    public string? Country { get; set; }
    
    [JsonPropertyName("zipCode")]
    public string? ZipCode { get; set; }
    
    [JsonPropertyName("logoUrl")]
    public string? LogoUrl { get; set; }
    
    [JsonPropertyName("establishedDate")]
    public DateOnly? EstablishedDate { get; set; }
    
    [JsonPropertyName("industry")]
    public string? Industry { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

public class BranchDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("organizationId")]
    public Guid OrganizationId { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("code")]
    public string? Code { get; set; }
    
    [JsonPropertyName("branchType")]
    public BranchType BranchType { get; set; }
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("phone")]
    public string? Phone { get; set; }
    
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    
    [JsonPropertyName("address")]
    public string? Address { get; set; }
    
    [JsonPropertyName("city")]
    public string? City { get; set; }
    
    [JsonPropertyName("state")]
    public string? State { get; set; }
    
    [JsonPropertyName("country")]
    public string? Country { get; set; }
    
    [JsonPropertyName("postalCode")]
    public string? PostalCode { get; set; }
    
    [JsonPropertyName("managerId")]
    public Guid? ManagerId { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

public class BranchWithManagerDto : BranchDto
{
    [JsonPropertyName("manager")]
    public UserSummaryDto? Manager { get; set; }
}

public class OrganizationWithBranchesDto : OrganizationDto
{
    [JsonPropertyName("branches")]
    public IEnumerable<BranchWithManagerDto> Branches { get; set; } = new List<BranchWithManagerDto>();
}

public class CreateOrganizationDto
{
    [JsonPropertyName("name")]
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [JsonPropertyName("website")]
    [MaxLength(255)]
    public string? Website { get; set; }
    
    [JsonPropertyName("email")]
    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [JsonPropertyName("phone")]
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [JsonPropertyName("address")]
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [JsonPropertyName("city")]
    [MaxLength(100)]
    public string? City { get; set; }
    
    [JsonPropertyName("state")]
    [MaxLength(100)]
    public string? State { get; set; }
    
    [JsonPropertyName("country")]
    [MaxLength(100)]
    public string? Country { get; set; }
    
    [JsonPropertyName("postalCode")]
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [JsonPropertyName("logo")]
    [MaxLength(500)]
    public string? Logo { get; set; }
    
    [JsonPropertyName("establishedDate")]
    public DateOnly? EstablishedDate { get; set; }
    
    [JsonPropertyName("employeeCount")]
    public int EmployeeCount { get; set; } = 0;
}

public class UpdateOrganizationDto
{
    [JsonPropertyName("name")]
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [JsonPropertyName("website")]
    [MaxLength(255)]
    public string? Website { get; set; }
    
    [JsonPropertyName("email")]
    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [JsonPropertyName("phone")]
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [JsonPropertyName("address")]
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [JsonPropertyName("city")]
    [MaxLength(100)]
    public string? City { get; set; }
    
    [JsonPropertyName("state")]
    [MaxLength(100)]
    public string? State { get; set; }
    
    [JsonPropertyName("country")]
    [MaxLength(100)]
    public string? Country { get; set; }
    
    [JsonPropertyName("postalCode")]
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [JsonPropertyName("logo")]
    [MaxLength(500)]
    public string? Logo { get; set; }
    
    [JsonPropertyName("establishedDate")]
    public DateOnly? EstablishedDate { get; set; }
    
    [JsonPropertyName("employeeCount")]
    public int EmployeeCount { get; set; } = 0;
}

public class CreateBranchDto
{
    [JsonPropertyName("organizationId")]
    public Guid OrganizationId { get; set; }
    
    [JsonPropertyName("name")]
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("code")]
    [MaxLength(50)]
    public string? Code { get; set; }
    
    [JsonPropertyName("branchType")]
    public BranchType BranchType { get; set; }
    
    [JsonPropertyName("description")]
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [JsonPropertyName("phone")]
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [JsonPropertyName("email")]
    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [JsonPropertyName("address")]
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [JsonPropertyName("city")]
    [MaxLength(100)]
    public string? City { get; set; }
    
    [JsonPropertyName("state")]
    [MaxLength(100)]
    public string? State { get; set; }
    
    [JsonPropertyName("country")]
    [MaxLength(100)]
    public string? Country { get; set; }
    
    [JsonPropertyName("postalCode")]
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [JsonPropertyName("managerId")]
    public Guid? ManagerId { get; set; }
}

public class UpdateBranchDto
{
    [JsonPropertyName("name")]
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("code")]
    [MaxLength(50)]
    public string? Code { get; set; }
    
    [JsonPropertyName("branchType")]
    public BranchType BranchType { get; set; }
    
    [JsonPropertyName("description")]
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [JsonPropertyName("phone")]
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [JsonPropertyName("email")]
    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [JsonPropertyName("address")]
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [JsonPropertyName("city")]
    [MaxLength(100)]
    public string? City { get; set; }
    
    [JsonPropertyName("state")]
    [MaxLength(100)]
    public string? State { get; set; }
    
    [JsonPropertyName("country")]
    [MaxLength(100)]
    public string? Country { get; set; }
    
    [JsonPropertyName("postalCode")]
    [MaxLength(20)]
    public string? PostalCode { get; set; }
    
    [JsonPropertyName("managerId")]
    public Guid? ManagerId { get; set; }
}
