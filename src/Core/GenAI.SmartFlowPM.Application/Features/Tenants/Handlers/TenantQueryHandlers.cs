using AutoMapper;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Tenant;
using GenAI.SmartFlowPM.Application.Features.Tenants.Queries;
using GenAI.SmartFlowPM.Domain.Interfaces;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Features.Tenants.Handlers;

public class GetTenantByIdQueryHandler : IRequestHandler<GetTenantByIdQuery, Result<TenantDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetTenantByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TenantDto>> Handle(GetTenantByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tenant = await _unitOfWork.Tenants.GetByIdAsync(request.Id, cancellationToken);
            if (tenant == null)
            {
                return Result<TenantDto>.Failure("Tenant not found.");
            }

            var tenantDto = _mapper.Map<TenantDto>(tenant);
            return Result<TenantDto>.Success(tenantDto);
        }
        catch (Exception ex)
        {
            return Result<TenantDto>.Failure($"Error retrieving tenant: {ex.Message}");
        }
    }
}

public class GetTenantBySubDomainQueryHandler : IRequestHandler<GetTenantBySubDomainQuery, Result<TenantDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetTenantBySubDomainQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TenantDto>> Handle(GetTenantBySubDomainQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tenant = await _unitOfWork.Tenants.GetBySubDomainAsync(request.SubDomain, cancellationToken);
            if (tenant == null)
            {
                return Result<TenantDto>.Failure("Tenant not found.");
            }

            var tenantDto = _mapper.Map<TenantDto>(tenant);
            return Result<TenantDto>.Success(tenantDto);
        }
        catch (Exception ex)
        {
            return Result<TenantDto>.Failure($"Error retrieving tenant: {ex.Message}");
        }
    }
}

public class GetAllTenantsQueryHandler : IRequestHandler<GetAllTenantsQuery, Result<PaginatedResult<TenantSummaryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllTenantsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<TenantSummaryDto>>> Handle(GetAllTenantsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tenants = await _unitOfWork.Tenants.GetPagedAsync(
                pageNumber: request.PageNumber,
                pageSize: request.PageSize,
                cancellationToken: cancellationToken);

            var tenantDtos = _mapper.Map<IEnumerable<TenantSummaryDto>>(tenants.Items);
            
            var result = new PaginatedResult<TenantSummaryDto>
            {
                Items = tenantDtos,
                TotalCount = tenants.TotalCount,
                CurrentPage = request.PageNumber,
                PageSize = request.PageSize
            };

            return Result<PaginatedResult<TenantSummaryDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TenantSummaryDto>>.Failure($"Error retrieving tenants: {ex.Message}");
        }
    }
}

public class GetActiveTenantsQueryHandler : IRequestHandler<GetActiveTenantsQuery, Result<IEnumerable<TenantSummaryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetActiveTenantsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TenantSummaryDto>>> Handle(GetActiveTenantsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tenants = await _unitOfWork.Tenants.GetActiveTenantsAsync(cancellationToken);
            var tenantDtos = _mapper.Map<IEnumerable<TenantSummaryDto>>(tenants);
            
            return Result<IEnumerable<TenantSummaryDto>>.Success(tenantDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TenantSummaryDto>>.Failure($"Error retrieving active tenants: {ex.Message}");
        }
    }
}

public class SearchTenantsQueryHandler : IRequestHandler<SearchTenantsQuery, Result<PaginatedResult<TenantSummaryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SearchTenantsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<TenantSummaryDto>>> Handle(SearchTenantsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tenants = await _unitOfWork.Tenants.GetPagedAsync(
                pageNumber: request.PageNumber,
                pageSize: request.PageSize,
                predicate: t => t.Name.Contains(request.SearchTerm) || 
                           (t.SubDomain != null && t.SubDomain.Contains(request.SearchTerm)) ||
                           t.ContactEmail.Contains(request.SearchTerm),
                cancellationToken: cancellationToken);

            var tenantDtos = _mapper.Map<IEnumerable<TenantSummaryDto>>(tenants.Items);
            
            var result = new PaginatedResult<TenantSummaryDto>
            {
                Items = tenantDtos,
                TotalCount = tenants.TotalCount,
                CurrentPage = request.PageNumber,
                PageSize = request.PageSize
            };

            return Result<PaginatedResult<TenantSummaryDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TenantSummaryDto>>.Failure($"Error searching tenants: {ex.Message}");
        }
    }
}
