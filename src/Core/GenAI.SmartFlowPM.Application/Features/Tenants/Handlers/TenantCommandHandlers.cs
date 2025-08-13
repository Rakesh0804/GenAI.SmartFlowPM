using AutoMapper;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Tenant;
using GenAI.SmartFlowPM.Application.Features.Tenants.Commands;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Features.Tenants.Handlers;

public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, Result<TenantDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateTenantCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TenantDto>> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if subdomain already exists
            if (!string.IsNullOrEmpty(request.Tenant.SubDomain))
            {
                var existingSubDomain = await _unitOfWork.Tenants.IsSubDomainExistsAsync(request.Tenant.SubDomain, cancellationToken: cancellationToken);
                if (existingSubDomain)
                {
                    return Result<TenantDto>.Failure("Subdomain already exists.");
                }
            }

            // Check if contact email already exists
            var existingEmail = await _unitOfWork.Tenants.IsContactEmailExistsAsync(request.Tenant.ContactEmail, cancellationToken: cancellationToken);
            if (existingEmail)
            {
                return Result<TenantDto>.Failure("Contact email already exists.");
            }

            var tenant = _mapper.Map<Tenant>(request.Tenant);
            await _unitOfWork.Tenants.AddAsync(tenant, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var tenantDto = _mapper.Map<TenantDto>(tenant);
            return Result<TenantDto>.Success(tenantDto);
        }
        catch (Exception ex)
        {
            return Result<TenantDto>.Failure($"Error creating tenant: {ex.Message}");
        }
    }
}

public class UpdateTenantCommandHandler : IRequestHandler<UpdateTenantCommand, Result<TenantDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateTenantCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TenantDto>> Handle(UpdateTenantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var tenant = await _unitOfWork.Tenants.GetByIdAsync(request.Tenant.Id, cancellationToken);
            if (tenant == null)
            {
                return Result<TenantDto>.Failure("Tenant not found.");
            }

            // Check if subdomain already exists (excluding current tenant)
            if (!string.IsNullOrEmpty(request.Tenant.SubDomain))
            {
                var existingSubDomain = await _unitOfWork.Tenants.IsSubDomainExistsAsync(request.Tenant.SubDomain, request.Tenant.Id, cancellationToken);
                if (existingSubDomain)
                {
                    return Result<TenantDto>.Failure("Subdomain already exists.");
                }
            }

            // Check if contact email already exists (excluding current tenant)
            var existingEmail = await _unitOfWork.Tenants.IsContactEmailExistsAsync(request.Tenant.ContactEmail, request.Tenant.Id, cancellationToken);
            if (existingEmail)
            {
                return Result<TenantDto>.Failure("Contact email already exists.");
            }

            _mapper.Map(request.Tenant, tenant);
            tenant.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Tenants.UpdateAsync(tenant, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var tenantDto = _mapper.Map<TenantDto>(tenant);
            return Result<TenantDto>.Success(tenantDto);
        }
        catch (Exception ex)
        {
            return Result<TenantDto>.Failure($"Error updating tenant: {ex.Message}");
        }
    }
}

public class DeleteTenantCommandHandler : IRequestHandler<DeleteTenantCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTenantCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteTenantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var tenant = await _unitOfWork.Tenants.GetByIdAsync(request.Id, cancellationToken);
            if (tenant == null)
            {
                return Result<bool>.Failure("Tenant not found.");
            }

            // Check if tenant has active users or projects
            var users = await _unitOfWork.Users.FindAsync(u => u.TenantId == request.Id && !u.IsDeleted, cancellationToken);
            if (users.Any())
            {
                return Result<bool>.Failure("Cannot delete tenant with active users. Please deactivate the tenant instead.");
            }

            // Soft delete
            tenant.IsDeleted = true;
            tenant.DeletedAt = DateTime.UtcNow;
            
            await _unitOfWork.Tenants.UpdateAsync(tenant, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Error deleting tenant: {ex.Message}");
        }
    }
}

public class ActivateTenantCommandHandler : IRequestHandler<ActivateTenantCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public ActivateTenantCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(ActivateTenantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var tenant = await _unitOfWork.Tenants.GetByIdAsync(request.Id, cancellationToken);
            if (tenant == null)
            {
                return Result<bool>.Failure("Tenant not found.");
            }

            tenant.IsActive = true;
            tenant.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Tenants.UpdateAsync(tenant, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Error activating tenant: {ex.Message}");
        }
    }
}

public class DeactivateTenantCommandHandler : IRequestHandler<DeactivateTenantCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeactivateTenantCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeactivateTenantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var tenant = await _unitOfWork.Tenants.GetByIdAsync(request.Id, cancellationToken);
            if (tenant == null)
            {
                return Result<bool>.Failure("Tenant not found.");
            }

            tenant.IsActive = false;
            tenant.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Tenants.UpdateAsync(tenant, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Error deactivating tenant: {ex.Message}");
        }
    }
}
