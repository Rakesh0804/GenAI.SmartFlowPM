using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Team;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Teams.Commands;

public class CreateTeamCommand : IRequest<Result<TeamDto>>
{
    [JsonPropertyName("createTeamDto")]
    public CreateTeamDto CreateTeamDto { get; set; } = null!;
}

public class UpdateTeamCommand : IRequest<Result<TeamDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateTeamDto")]
    public UpdateTeamDto UpdateTeamDto { get; set; } = null!;
}

public class DeleteTeamCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class AddTeamMemberCommand : IRequest<Result<TeamMemberDto>>
{
    [JsonPropertyName("addTeamMemberDto")]
    public AddTeamMemberDto AddTeamMemberDto { get; set; } = null!;
}

public class UpdateTeamMemberCommand : IRequest<Result<TeamMemberDto>>
{
    [JsonPropertyName("teamId")]
    public Guid TeamId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("updateTeamMemberDto")]
    public UpdateTeamMemberDto UpdateTeamMemberDto { get; set; } = null!;
}

public class RemoveTeamMemberCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("teamId")]
    public Guid TeamId { get; set; }
    
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}
