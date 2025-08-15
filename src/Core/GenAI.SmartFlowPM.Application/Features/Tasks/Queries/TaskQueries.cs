using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Task;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Tasks.Queries;

public class GetTaskByIdQuery : IRequest<Result<TaskDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class TaskFilteredPagedQuery : PagedQuery
{
    [JsonPropertyName("status")]
    public int? Status { get; set; }
    
    [JsonPropertyName("priority")]
    public int? Priority { get; set; }
    
    [JsonPropertyName("projectId")]
    public Guid? ProjectId { get; set; }
    
    [JsonPropertyName("assignedUserId")]
    public Guid? AssignedUserId { get; set; }
}

public class GetAllTasksQuery : IRequest<Result<PaginatedResult<TaskDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public TaskFilteredPagedQuery PagedQuery { get; set; } = new();
}

public class GetTasksByProjectIdQuery : IRequest<Result<IEnumerable<TaskDto>>>
{
    [JsonPropertyName("projectId")]
    public Guid ProjectId { get; set; }
}

public class GetTasksByUserIdQuery : IRequest<Result<IEnumerable<TaskDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class GetUserTaskDashboardQuery : IRequest<Result<UserTaskDashboardDto>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}
