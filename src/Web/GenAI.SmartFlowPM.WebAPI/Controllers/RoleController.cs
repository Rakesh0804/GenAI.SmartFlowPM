using MediatR;
using Microsoft.AspNetCore.Mvc;
using GenAI.SmartFlowPM.Application.Features.Roles.Commands;
using GenAI.SmartFlowPM.Application.Features.Roles.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly IMediator _mediator;

    public RoleController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles([FromQuery] PagedQuery query)
    {
        var result = await _mediator.Send(new GetAllRolesQuery { PagedQuery = query });
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRole(Guid id)
    {
        var result = await _mediator.Send(new GetRoleByIdQuery { Id = id });
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
    {
        var result = await _mediator.Send(new CreateRoleCommand { CreateRoleDto = createRoleDto });
        return result.IsSuccess ? CreatedAtAction(nameof(GetRole), new { id = result.Data?.Id }, result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleDto updateRoleDto)
    {
        var result = await _mediator.Send(new UpdateRoleCommand { Id = id, UpdateRoleDto = updateRoleDto });
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var result = await _mediator.Send(new DeleteRoleCommand { Id = id });
        return result.IsSuccess ? NoContent() : BadRequest(result);
    }
}
