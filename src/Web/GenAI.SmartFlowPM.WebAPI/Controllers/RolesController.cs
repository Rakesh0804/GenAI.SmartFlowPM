using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GenAI.SmartFlowPM.Application.Features.Roles.Commands;
using GenAI.SmartFlowPM.Application.Features.Roles.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Role;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class RolesController : BaseController
{
    public RolesController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all roles with pagination
    /// </summary>
    /// <param name="pagedQuery">Pagination parameters</param>
    /// <returns>Paginated list of roles</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllRoles([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllRolesQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get role by ID
    /// </summary>
    /// <param name="id">Role ID</param>
    /// <returns>Role details</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRoleById(Guid id)
    {
        var query = new GetRoleByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new role
    /// </summary>
    /// <param name="createRoleDto">Role creation data</param>
    /// <returns>Created role</returns>
    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
    {
        var command = new CreateRoleCommand { CreateRoleDto = createRoleDto };
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetRoleById), new { id = result.Data!.Id }, new
            {
                isSuccess = true,
                data = result.Data,
                message = result.Message,
                correlationId = GetCorrelationId(),
                timestamp = DateTime.UtcNow
            });
        }

        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing role
    /// </summary>
    /// <param name="id">Role ID</param>
    /// <param name="updateRoleDto">Role update data</param>
    /// <returns>Updated role</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleDto updateRoleDto)
    {
        var command = new UpdateRoleCommand { Id = id, UpdateRoleDto = updateRoleDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a role
    /// </summary>
    /// <param name="id">Role ID</param>
    /// <returns>Deletion result</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var command = new DeleteRoleCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
