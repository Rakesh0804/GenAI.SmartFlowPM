using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Tenant;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Features.Tenants.Queries;

public record GetTenantByIdQuery(Guid Id) : IRequest<Result<TenantDto>>;

public record GetTenantBySubDomainQuery(string SubDomain) : IRequest<Result<TenantDto>>;

public record GetAllTenantsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<Result<PaginatedResult<TenantSummaryDto>>>;

public record GetActiveTenantsQuery() : IRequest<Result<IEnumerable<TenantSummaryDto>>>;

public record SearchTenantsQuery(string SearchTerm, int PageNumber = 1, int PageSize = 10) : IRequest<Result<PaginatedResult<TenantSummaryDto>>>;
