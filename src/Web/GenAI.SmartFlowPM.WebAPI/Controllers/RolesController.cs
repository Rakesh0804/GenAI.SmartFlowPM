using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GenAI.SmartFlowPM.Application.Features.Roles.Commands;
using GenAI.SmartFlowPM.Application.Features.Roles.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly IMediator _mediator;

    public RolesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all roles with pagination
    /// </summary>
    /// <param name="pagedQuery">Pagination parameters</param>
    /// <returns>Paginated list of roles</returns>
    [HttpGet]
    public async Task<ActionResult<Result<PaginatedResult<RoleDto>>>> GetAllRoles([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllRolesQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Get role by ID
    /// </summary>
    /// <param name="id">Role ID</param>
    /// <returns>Role details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<Result<RoleDto>>> GetRoleById(Guid id)
    {
        var query = new GetRoleByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Create a new role
    /// </summary>
    /// <param name="createRoleDto">Role creation data</param>
    /// <returns>Created role</returns>
    [HttpPost]
    public async Task<ActionResult<Result<RoleDto>>> CreateRole([FromBody] CreateRoleDto createRoleDto)
    {
        var command = new CreateRoleCommand { CreateRoleDto = createRoleDto };
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetRoleById), new { id = result.Data!.Id }, result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Update an existing role
    /// </summary>
    /// <param name="id">Role ID</param>
    /// <param name="updateRoleDto">Role update data</param>
    /// <returns>Updated role</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<Result<RoleDto>>> UpdateRole(Guid id, [FromBody] UpdateRoleDto updateRoleDto)
    {
        var command = new UpdateRoleCommand { Id = id, UpdateRoleDto = updateRoleDto };
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Delete a role
    /// </summary>
    /// <param name="id">Role ID</param>
    /// <returns>Deletion result</returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult<Result>> DeleteRole(Guid id)
    {
        var command = new DeleteRoleCommand { Id = id };
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
