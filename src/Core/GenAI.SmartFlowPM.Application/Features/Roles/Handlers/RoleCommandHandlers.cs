using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Roles.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Roles.Handlers;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, Result<RoleDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateRoleCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<RoleDto>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        // Check if role name already exists
        if (await _unitOfWork.Roles.IsNameExistsAsync(request.CreateRoleDto.Name, cancellationToken: cancellationToken))
        {
            return Result<RoleDto>.Failure("Role name already exists");
        }

        var role = _mapper.Map<Role>(request.CreateRoleDto);

        await _unitOfWork.Roles.AddAsync(role, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var roleDto = _mapper.Map<RoleDto>(role);
        return Result<RoleDto>.Success(roleDto, "Role created successfully");
    }
}

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, Result<RoleDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateRoleCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<RoleDto>> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _unitOfWork.Roles.GetByIdAsync(request.Id, cancellationToken);
        if (role == null)
        {
            return Result<RoleDto>.Failure("Role not found");
        }

        // Check if role name already exists (excluding current role)
        if (await _unitOfWork.Roles.IsNameExistsAsync(request.UpdateRoleDto.Name, request.Id, cancellationToken))
        {
            return Result<RoleDto>.Failure("Role name already exists");
        }

        _mapper.Map(request.UpdateRoleDto, role);
        role.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Roles.UpdateAsync(role, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var roleDto = _mapper.Map<RoleDto>(role);
        return Result<RoleDto>.Success(roleDto, "Role updated successfully");
    }
}

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteRoleCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _unitOfWork.Roles.GetByIdAsync(request.Id, cancellationToken);
        if (role == null)
        {
            return Result.Failure("Role not found");
        }

        // Check if role is in use by any users
        var usersWithRole = await _unitOfWork.UserRoles.GetByRoleIdAsync(request.Id, cancellationToken);
        if (usersWithRole.Any())
        {
            return Result.Failure("Cannot delete role as it is assigned to users");
        }

        await _unitOfWork.Roles.DeleteAsync(role, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success("Role deleted successfully");
    }
}
