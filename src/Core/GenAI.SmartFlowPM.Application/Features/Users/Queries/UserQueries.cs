using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Users.Queries;

public class GetUserByIdQuery : IRequest<Result<UserDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllUsersQuery : IRequest<Result<PaginatedResult<UserDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetUsersByManagerIdQuery : IRequest<Result<IEnumerable<UserDto>>>
{
    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; set; }
}
