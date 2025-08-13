using System.ComponentModel.DataAnnotations;

namespace GenAI.SmartFlowPM.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public string? CreatedBy { get; set; }
    
    public string? UpdatedBy { get; set; }
    
    public bool IsDeleted { get; set; } = false;
    
    public DateTime? DeletedAt { get; set; }
    
    public string? DeletedBy { get; set; }
}
