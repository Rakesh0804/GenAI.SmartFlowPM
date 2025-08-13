using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Project;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Projects.Queries;

public class GetProjectByIdQuery : IRequest<Result<ProjectDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllProjectsQuery : IRequest<Result<PaginatedResult<ProjectDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetProjectsByUserIdQuery : IRequest<Result<IEnumerable<ProjectDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}
