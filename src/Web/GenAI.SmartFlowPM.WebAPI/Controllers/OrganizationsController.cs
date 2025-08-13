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
public class OrganizationsController : BaseController
{
    public OrganizationsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get organization details by ID
    /// </summary>
    /// <param name="id">Organization ID</param>
    /// <returns>Organization details</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrganization(Guid id)
    {
        var query = new GetOrganizationDetailsQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get all organizations with pagination
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10)</param>
    /// <returns>Paginated list of organizations</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllOrganizations([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var query = new GetAllOrganizationsQuery 
        { 
            PagedQuery = new PagedQuery 
            { 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            } 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get all organizations with their branches (paginated)
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10)</param>
    /// <returns>Paginated list of organizations with branches</returns>
    [HttpGet("with-branches")]
    public async Task<IActionResult> GetAllOrganizationsWithBranches([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var query = new GetAllOrganizationsWithBranchesQuery 
        { 
            PagedQuery = new PagedQuery 
            { 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            } 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get organization with all its branches
    /// </summary>
    /// <param name="id">Organization ID</param>
    /// <returns>Organization with branches</returns>
    [HttpGet("{id:guid}/with-branches")]
    public async Task<IActionResult> GetOrganizationWithBranches(Guid id)
    {
        var query = new GetOrganizationWithBranchesQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new organization
    /// </summary>
    /// <param name="command">Organization creation data</param>
    /// <returns>Created organization</returns>
    [HttpPost]
    public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganizationCommand command)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetOrganization), new { id = result.Data!.Id }, new
            {
                success = true,
                data = result.Data,
                message = result.Message
            });
        }
        
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing organization
    /// </summary>
    /// <param name="id">Organization ID</param>
    /// <param name="command">Organization update data</param>
    /// <returns>Updated organization</returns>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateOrganization(Guid id, [FromBody] UpdateOrganizationCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("Organization ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
