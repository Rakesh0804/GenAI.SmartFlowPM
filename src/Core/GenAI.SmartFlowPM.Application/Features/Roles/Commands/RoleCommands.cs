using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Roles.Commands;

public class CreateRoleCommand : IRequest<Result<RoleDto>>
{
    [JsonPropertyName("createRoleDto")]
    public CreateRoleDto CreateRoleDto { get; set; } = null!;
}

public class UpdateRoleCommand : IRequest<Result<RoleDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("updateRoleDto")]
    public UpdateRoleDto UpdateRoleDto { get; set; } = null!;
}

public class DeleteRoleCommand : IRequest<Result>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}
