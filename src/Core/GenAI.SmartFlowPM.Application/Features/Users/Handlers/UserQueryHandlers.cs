using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Users.Queries;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Users.Handlers;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetUserByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetUserWithRolesAsync(request.Id, cancellationToken);
        if (user == null)
        {
            return Result<UserDto>.Failure("User not found");
        }

        var userDto = _mapper.Map<UserDto>(user);
        return Result<UserDto>.Success(userDto);
    }
}

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, Result<PaginatedResult<UserDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllUsersQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var (users, totalCount) = await _unitOfWork.Users.GetPagedUsersWithRolesAsync(
            request.PagedQuery.PageNumber,
            request.PagedQuery.PageSize,
            predicate: string.IsNullOrEmpty(request.PagedQuery.SearchTerm) ? null :
                u => u.FirstName.Contains(request.PagedQuery.SearchTerm) ||
                     u.LastName.Contains(request.PagedQuery.SearchTerm) ||
                     u.Email.Contains(request.PagedQuery.SearchTerm) ||
                     u.UserName.Contains(request.PagedQuery.SearchTerm),
            orderBy: !string.IsNullOrEmpty(request.PagedQuery.SortBy) ? GetSortExpression(request.PagedQuery.SortBy) : u => u.CreatedAt,
            ascending: !request.PagedQuery.SortDescending,
            cancellationToken: cancellationToken);

        var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

        var result = new PaginatedResult<UserDto>
        {
            Items = userDtos,
            CurrentPage = request.PagedQuery.PageNumber,
            PageSize = request.PagedQuery.PageSize,
            TotalCount = totalCount
        };

        return Result<PaginatedResult<UserDto>>.Success(result);
    }

    private static System.Linq.Expressions.Expression<Func<Domain.Entities.User, object>> GetSortExpression(string sortBy)
    {
        return sortBy.ToLower() switch
        {
            "firstname" => u => u.FirstName,
            "lastname" => u => u.LastName,
            "email" => u => u.Email,
            "username" => u => u.UserName,
            "createdat" => u => u.CreatedAt,
            _ => u => u.CreatedAt
        };
    }
}

public class GetUsersByManagerIdQueryHandler : IRequestHandler<GetUsersByManagerIdQuery, Result<IEnumerable<UserDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetUsersByManagerIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<UserDto>>> Handle(GetUsersByManagerIdQuery request, CancellationToken cancellationToken)
    {
        var users = await _unitOfWork.Users.GetUsersByManagerIdWithRolesAsync(request.ManagerId, cancellationToken);
        var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

        return Result<IEnumerable<UserDto>>.Success(userDtos);
    }
}
