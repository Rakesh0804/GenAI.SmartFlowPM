using System.Text.Json.Serialization;
using MediatR;
using GenAI.SmartFlowPM.Application.DTOs.Organization;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Organizations.Queries;

public class GetOrganizationDetailsQuery : IRequest<Result<OrganizationDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetOrganizationWithBranchesQuery : IRequest<Result<OrganizationWithBranchesDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllBranchesQuery : IRequest<Result<PaginatedResult<BranchDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();

    [JsonPropertyName("organizationId")]
    public Guid? OrganizationId { get; set; }
}

public class GetBranchByIdQuery : IRequest<Result<BranchDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllOrganizationsQuery : IRequest<Result<PaginatedResult<OrganizationDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetAllOrganizationsWithBranchesQuery : IRequest<Result<PaginatedResult<OrganizationWithBranchesDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}
