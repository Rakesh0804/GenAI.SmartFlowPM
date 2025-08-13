using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Application.Common.Attributes;

namespace GenAI.SmartFlowPM.Application.DTOs.Task;

/// <summary>
/// DTO for task type information
/// </summary>
public class TaskTypeDto
{
    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;
    
    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("color")]
    public string? Color { get; set; }
}

public class TaskDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("acronym")]
    public string Acronym { get; set; } = string.Empty;
    
    [JsonPropertyName("taskNumber")]
    public string TaskNumber { get; set; } = string.Empty;
    
    [JsonPropertyName("projectId")]
    public Guid ProjectId { get; set; }
    
    [JsonPropertyName("projectName")]
    public string ProjectName { get; set; } = string.Empty;
    
    [JsonPropertyName("assignedToUserId")]
    public Guid? AssignedToUserId { get; set; }
    
    [JsonPropertyName("assignedToUserName")]
    public string? AssignedToUserName { get; set; }
    
    [JsonPropertyName("status")]
    public Domain.Enums.TaskStatus Status { get; set; }
    
    [JsonPropertyName("priority")]
    public TaskPriority Priority { get; set; }
    
    [JsonPropertyName("dueDate")]
    public DateTime? DueDate { get; set; }
    
    [JsonPropertyName("completedDate")]
    public DateTime? CompletedDate { get; set; }
    
    [JsonPropertyName("estimatedHours")]
    public int EstimatedHours { get; set; }
    
    [JsonPropertyName("actualHours")]
    public int ActualHours { get; set; }
    
    [JsonPropertyName("parentTaskId")]
    public Guid? ParentTaskId { get; set; }
    
    [JsonPropertyName("parentTaskTitle")]
    public string? ParentTaskTitle { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class CreateTaskDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [MaxLength(10)]
    [ValidTaskAcronym]
    public string Acronym { get; set; } = string.Empty;
    
    [Required]
    public Guid ProjectId { get; set; }
    
    public Guid? AssignedToUserId { get; set; }
    
    public Domain.Enums.TaskStatus Status { get; set; } = Domain.Enums.TaskStatus.Todo;
    
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    
    public DateTime? DueDate { get; set; }
    
    public int EstimatedHours { get; set; } = 0;
    
    public Guid? ParentTaskId { get; set; }
    
    public bool IsActive { get; set; } = true;
}

public class UpdateTaskDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public Guid? AssignedToUserId { get; set; }
    
    public Domain.Enums.TaskStatus Status { get; set; }
    
    public TaskPriority Priority { get; set; }
    
    public DateTime? DueDate { get; set; }
    
    public DateTime? CompletedDate { get; set; }
    
    public int EstimatedHours { get; set; }
    
    public int ActualHours { get; set; }
    
    public Guid? ParentTaskId { get; set; }
    
    public bool IsActive { get; set; }
}

/// <summary>
/// DTO for task dashboard statistics by user
/// </summary>
public class UserTaskDashboardDto
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("userName")]
    public string UserName { get; set; } = string.Empty;
    
    [JsonPropertyName("totalTaskCount")]
    public int TotalTaskCount { get; set; }
    
    [JsonPropertyName("completedTaskCount")]
    public int CompletedTaskCount { get; set; }
    
    [JsonPropertyName("pendingTaskCount")]
    public int PendingTaskCount { get; set; }
    
    [JsonPropertyName("pendingTasks")]
    public IEnumerable<TaskDto> PendingTasks { get; set; } = new List<TaskDto>();
}
