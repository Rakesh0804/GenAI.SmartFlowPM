using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Task;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Tasks.Commands;

public class CreateTaskCommand : IRequest<Result<TaskDto>>
{
    [JsonPropertyName("createTaskDto")]
    public CreateTaskDto CreateTaskDto { get; set; } = null!;
}

public class UpdateTaskCommand : IRequest<Result<TaskDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateTaskDto")]
    public UpdateTaskDto UpdateTaskDto { get; set; } = null!;
}

public class DeleteTaskCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class AssignTaskCommand : IRequest<Result<TaskDto>>
{
    [JsonPropertyName("taskId")]
    public Guid TaskId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}
