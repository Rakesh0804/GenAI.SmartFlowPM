using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Claims.Commands;
using GenAI.SmartFlowPM.Application.Features.Claims.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Claim;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class ClaimsController : BaseController
{
    public ClaimsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all claims with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetClaims([FromQuery] PagedQuery query)
    {
        var command = new GetAllClaimsQuery { PagedQuery = query };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Get claim by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetClaim(Guid id)
    {
        var query = new GetClaimByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get claim by name
    /// </summary>
    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetClaimByName(string name)
    {
        var query = new GetClaimByNameQuery { Name = name };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get all active claims
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveClaims()
    {
        var query = new GetActiveClaimsQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new claim
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateClaim([FromBody] CreateClaimDto createClaimDto)
    {
        var command = new CreateClaimCommand { CreateClaimDto = createClaimDto };
        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetClaim), new { id = result.Data!.Id }, result);
        }
        
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing claim
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateClaim(Guid id, [FromBody] UpdateClaimDto updateClaimDto)
    {
        var command = new UpdateClaimCommand { Id = id, UpdateClaimDto = updateClaimDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a claim
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteClaim(Guid id)
    {
        var command = new DeleteClaimCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
