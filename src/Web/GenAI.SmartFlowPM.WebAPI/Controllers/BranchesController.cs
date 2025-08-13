using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Organization;
using GenAI.SmartFlowPM.Application.Features.Organizations.Commands;
using GenAI.SmartFlowPM.Application.Features.Organizations.Queries;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize(Roles = "Admin")]
public class BranchesController : BaseController
{
    public BranchesController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all branches for an organization with pagination and search
    /// </summary>
    /// <param name="organizationId">Organization ID</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10)</param>
    /// <param name="searchTerm">Search term for filtering branches</param>
    /// <returns>Paginated list of branches</returns>
    [HttpGet]
    public async Task<IActionResult> GetBranches(
        [FromQuery] Guid organizationId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        var query = new GetAllBranchesQuery
        {
            OrganizationId = organizationId,
            PagedQuery = new PagedQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = searchTerm
            }
        };

        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get branch details by ID
    /// </summary>
    /// <param name="id">Branch ID</param>
    /// <returns>Branch details</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBranch(Guid id)
    {
        var query = new GetBranchByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new branch
    /// </summary>
    /// <param name="command">Branch creation data</param>
    /// <returns>Created branch</returns>
    [HttpPost]
    public async Task<IActionResult> CreateBranch([FromBody] CreateBranchCommand command)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetBranch), new { id = result.Data!.Id }, new
            {
                success = true,
                data = result.Data,
                message = result.Message
            });
        }
        
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing branch
    /// </summary>
    /// <param name="id">Branch ID</param>
    /// <param name="command">Branch update data</param>
    /// <returns>Updated branch</returns>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateBranch(Guid id, [FromBody] UpdateBranchCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("Branch ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a branch
    /// </summary>
    /// <param name="id">Branch ID</param>
    /// <returns>Deletion result</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteBranch(Guid id)
    {
        var command = new DeleteBranchCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
