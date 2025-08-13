using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.DTOs.User;

public class UserDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = string.Empty;
    
    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = string.Empty;
    
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;
    
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("lastLoginAt")]
    public DateTime? LastLoginAt { get; set; }
    
    [JsonPropertyName("managerId")]
    public Guid? ManagerId { get; set; }
    
    [JsonPropertyName("managerName")]
    public string? ManagerName { get; set; }
    
    [JsonPropertyName("hasReportee")]
    public bool HasReportee { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateUserDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string UserName { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;
    
    [MaxLength(15)]
    public string? PhoneNumber { get; set; }
    
    public Guid? ManagerId { get; set; }
    
    public bool HasReportee { get; set; } = false;
    
    public bool IsActive { get; set; } = true;
}

public class UpdateUserDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(15)]
    public string? PhoneNumber { get; set; }
    
    public Guid? ManagerId { get; set; }
    
    public bool HasReportee { get; set; }
    
    public bool IsActive { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string NewPassword { get; set; } = string.Empty;
}

public class UserLoginDto
{
    [Required]
    [JsonPropertyName("userNameOrEmail")]
    public string UserNameOrEmail { get; set; } = string.Empty;
    
    [Required]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;
    
    [JsonPropertyName("expires")]
    public DateTime Expires { get; set; }
    
    [JsonPropertyName("user")]
    public UserDto User { get; set; } = null!;
}

public class UserSummaryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = string.Empty;
    
    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = string.Empty;
    
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;
    
    [JsonPropertyName("hasReportee")]
    public bool HasReportee { get; set; }
}
