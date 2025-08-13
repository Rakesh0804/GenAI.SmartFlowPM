using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Claims.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Claim;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Claims.Handlers;

public class ClaimQueryHandlers :
    IRequestHandler<GetAllClaimsQuery, Result<PaginatedResult<ClaimDto>>>,
    IRequestHandler<GetClaimByIdQuery, Result<ClaimDto>>,
    IRequestHandler<GetClaimByNameQuery, Result<ClaimDto>>,
    IRequestHandler<GetActiveClaimsQuery, Result<List<ClaimSummaryDto>>>
{
    private readonly IClaimRepository _claimRepository;
    private readonly IMapper _mapper;

    public ClaimQueryHandlers(IClaimRepository claimRepository, IMapper mapper)
    {
        _claimRepository = claimRepository;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<ClaimDto>>> Handle(GetAllClaimsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (claims, totalCount) = await _claimRepository.GetPagedAsync(
                request.PagedQuery.PageNumber,
                request.PagedQuery.PageSize,
                orderBy: c => c.Name,
                ascending: true,
                cancellationToken: cancellationToken);

            var claimDtos = _mapper.Map<IEnumerable<ClaimDto>>(claims);

            var result = new PaginatedResult<ClaimDto>
            {
                Items = claimDtos,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize,
                TotalCount = totalCount
            };

            return Result<PaginatedResult<ClaimDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<ClaimDto>>.Failure($"Error retrieving claims: {ex.Message}");
        }
    }

    public async Task<Result<ClaimDto>> Handle(GetClaimByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var claim = await _claimRepository.GetByIdAsync(request.Id, cancellationToken);
            if (claim == null)
            {
                return Result<ClaimDto>.Failure("Claim not found.");
            }

            var claimDto = _mapper.Map<ClaimDto>(claim);
            return Result<ClaimDto>.Success(claimDto);
        }
        catch (Exception ex)
        {
            return Result<ClaimDto>.Failure($"Error retrieving claim: {ex.Message}");
        }
    }

    public async Task<Result<ClaimDto>> Handle(GetClaimByNameQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var claim = await _claimRepository.GetByNameAsync(request.Name, cancellationToken);
            if (claim == null)
            {
                return Result<ClaimDto>.Failure("Claim not found.");
            }

            var claimDto = _mapper.Map<ClaimDto>(claim);
            return Result<ClaimDto>.Success(claimDto);
        }
        catch (Exception ex)
        {
            return Result<ClaimDto>.Failure($"Error retrieving claim: {ex.Message}");
        }
    }

    public async Task<Result<List<ClaimSummaryDto>>> Handle(GetActiveClaimsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var activeClaims = await _claimRepository.GetActiveClaimsAsync(cancellationToken);
            var claimSummaryDtos = _mapper.Map<List<ClaimSummaryDto>>(activeClaims);
            
            return Result<List<ClaimSummaryDto>>.Success(claimSummaryDtos);
        }
        catch (Exception ex)
        {
            return Result<List<ClaimSummaryDto>>.Failure($"Error retrieving active claims: {ex.Message}");
        }
    }
}
