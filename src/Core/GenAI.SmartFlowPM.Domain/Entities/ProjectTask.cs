using System.ComponentModel.DataAnnotations;
using GenAI.SmartFlowPM.Domain.Common;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Entities;

public class ProjectTask : TenantBaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Acronym { get; set; } = string.Empty;
    
    [Required]
    public string TaskNumber { get; set; } = string.Empty;
    
    public Guid ProjectId { get; set; }
    
    public Guid? AssignedToUserId { get; set; }
    
    public Domain.Enums.TaskStatus Status { get; set; } = Domain.Enums.TaskStatus.Todo;
    
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    
    public DateTime? DueDate { get; set; }
    
    public DateTime? CompletedDate { get; set; }
    
    public int EstimatedHours { get; set; } = 0;
    
    public int ActualHours { get; set; } = 0;
    
    public Guid? ParentTaskId { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public Project Project { get; set; } = null!;
    public User? AssignedToUser { get; set; }
    public ProjectTask? ParentTask { get; set; }
    public ICollection<ProjectTask> SubTasks { get; set; } = new List<ProjectTask>();
}
