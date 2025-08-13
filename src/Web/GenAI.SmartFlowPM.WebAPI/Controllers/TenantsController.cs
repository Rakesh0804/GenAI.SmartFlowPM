using GenAI.SmartFlowPM.Application.DTOs.Tenant;
using GenAI.SmartFlowPM.Application.Features.Tenants.Commands;
using GenAI.SmartFlowPM.Application.Features.Tenants.Queries;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Route("api/[controller]")]
public class TenantsController : BaseController
{
    public TenantsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTenants([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetAllTenantsQuery(pageNumber, pageSize));
        return HandleResult(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveTenants()
    {
        var result = await _mediator.Send(new GetActiveTenantsQuery());
        return HandleResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTenantById(Guid id)
    {
        var result = await _mediator.Send(new GetTenantByIdQuery(id));
        return HandleResult(result);
    }

    [HttpGet("subdomain/{subdomain}")]
    public async Task<IActionResult> GetTenantBySubDomain(string subdomain)
    {
        var result = await _mediator.Send(new GetTenantBySubDomainQuery(subdomain));
        return HandleResult(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchTenants([FromQuery] string searchTerm, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new SearchTenantsQuery(searchTerm, pageNumber, pageSize));
        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantDto createTenantDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _mediator.Send(new CreateTenantCommand(createTenantDto));
        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetTenantById), new { id = result.Data!.Id }, result.Data);
        }
        return HandleResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTenant(Guid id, [FromBody] UpdateTenantDto updateTenantDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Create a new UpdateTenantDto with the Id from the route
        var tenantDto = updateTenantDto with { Id = id };
        var result = await _mediator.Send(new UpdateTenantCommand(tenantDto));
        return HandleResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTenant(Guid id)
    {
        var result = await _mediator.Send(new DeleteTenantCommand(id));
        return HandleResult(result);
    }

    [HttpPatch("{id:guid}/activate")]
    public async Task<IActionResult> ActivateTenant(Guid id)
    {
        var result = await _mediator.Send(new ActivateTenantCommand(id));
        return HandleResult(result);
    }

    [HttpPatch("{id:guid}/deactivate")]
    public async Task<IActionResult> DeactivateTenant(Guid id)
    {
        var result = await _mediator.Send(new DeactivateTenantCommand(id));
        return HandleResult(result);
    }
}
