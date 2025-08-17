using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Team;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Teams.Queries;

public class GetTeamByIdQuery : IRequest<Result<TeamDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllTeamsQuery : IRequest<Result<PaginatedResult<TeamDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetTeamsByLeaderIdQuery : IRequest<Result<IEnumerable<TeamDto>>>
{
    [JsonPropertyName("leaderId")]
    public Guid LeaderId { get; set; }
}

public class GetTeamMembersQuery : IRequest<Result<IEnumerable<TeamMemberDto>>>
{
    [JsonPropertyName("teamId")]
    public Guid TeamId { get; set; }
}

public class GetUserTeamsQuery : IRequest<Result<IEnumerable<TeamDto>>>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
}

public class SearchTeamsQuery : IRequest<Result<IEnumerable<TeamDto>>>
{
    [JsonPropertyName("searchTerm")]
    public string SearchTerm { get; set; } = string.Empty;
}

public class GetActiveTeamsQuery : IRequest<Result<IEnumerable<TeamDto>>>
{
}
