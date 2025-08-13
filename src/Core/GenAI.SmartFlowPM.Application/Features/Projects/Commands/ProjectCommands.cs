using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Project;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Projects.Commands;

public class CreateProjectCommand : IRequest<Result<ProjectDto>>
{
    [JsonPropertyName("createProjectDto")]
    public CreateProjectDto CreateProjectDto { get; set; } = null!;
}

public class UpdateProjectCommand : IRequest<Result<ProjectDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateProjectDto")]
    public UpdateProjectDto UpdateProjectDto { get; set; } = null!;
}

public class DeleteProjectCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}
