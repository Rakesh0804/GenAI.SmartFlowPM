using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.Claim;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Claims.Queries;

public class GetAllClaimsQuery : IRequest<Result<PaginatedResult<ClaimDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetClaimByIdQuery : IRequest<Result<ClaimDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetClaimByNameQuery : IRequest<Result<ClaimDto>>
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

public class GetActiveClaimsQuery : IRequest<Result<List<ClaimSummaryDto>>>
{
}
