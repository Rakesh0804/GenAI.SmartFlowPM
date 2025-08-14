using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Roles.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Application.Features.Roles.Handlers;

public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, Result<RoleDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetRoleByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<RoleDto>> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
    {
        var role = await _unitOfWork.Roles.GetByIdAsync(request.Id, cancellationToken);
        if (role == null)
        {
            return Result<RoleDto>.Failure("Role not found");
        }

        var roleDto = _mapper.Map<RoleDto>(role);
        return Result<RoleDto>.Success(roleDto);
    }
}

public class GetAllRolesQueryHandler : IRequestHandler<GetAllRolesQuery, Result<PaginatedResult<RoleDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllRolesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<RoleDto>>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
    {
        var pagedRoles = await _unitOfWork.Roles.GetPagedAsync(
            pageNumber: request.PagedQuery.PageNumber,
            pageSize: request.PagedQuery.PageSize,
            predicate: r => !r.IsDeleted,
            orderBy: r => r.Name,
            ascending: true,
            cancellationToken: cancellationToken);

        var roleDtos = _mapper.Map<IEnumerable<RoleDto>>(pagedRoles.Items);

        var paginatedResult = new PaginatedResult<RoleDto>
        {
            Items = roleDtos,
            CurrentPage = request.PagedQuery.PageNumber,
            PageSize = request.PagedQuery.PageSize,
            TotalCount = pagedRoles.TotalCount
        };

        return Result<PaginatedResult<RoleDto>>.Success(paginatedResult);
    }
}
