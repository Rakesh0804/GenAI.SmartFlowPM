using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Tenant;
using MediatR;

namespace GenAI.SmartFlowPM.Application.Features.Tenants.Commands;

public record CreateTenantCommand(CreateTenantDto Tenant) : IRequest<Result<TenantDto>>;

public record UpdateTenantCommand(UpdateTenantDto Tenant) : IRequest<Result<TenantDto>>;

public record DeleteTenantCommand(Guid Id) : IRequest<Result<bool>>;

public record ActivateTenantCommand(Guid Id) : IRequest<Result<bool>>;

public record DeactivateTenantCommand(Guid Id) : IRequest<Result<bool>>;
