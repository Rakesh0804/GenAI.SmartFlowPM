using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Roles.Queries;

public class GetRoleByIdQuery : IRequest<Result<RoleDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllRolesQuery : IRequest<Result<PaginatedResult<RoleDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}
