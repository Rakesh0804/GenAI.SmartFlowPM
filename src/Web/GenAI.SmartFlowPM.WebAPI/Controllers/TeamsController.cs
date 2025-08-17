using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Teams.Commands;
using GenAI.SmartFlowPM.Application.Features.Teams.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Team;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class TeamsController : BaseController
{
    public TeamsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all teams with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTeams([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllTeamsQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get team by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeam(Guid id)
    {
        var query = new GetTeamByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get teams by leader ID
    /// </summary>
    [HttpGet("leader/{leaderId}")]
    public async Task<IActionResult> GetTeamsByLeaderId(Guid leaderId)
    {
        var query = new GetTeamsByLeaderIdQuery { LeaderId = leaderId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get teams by user ID (teams where user is a member)
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserTeams(Guid userId)
    {
        var query = new GetUserTeamsQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Search teams
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchTeams([FromQuery] string searchTerm)
    {
        var query = new SearchTeamsQuery { SearchTerm = searchTerm };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get active teams
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveTeams()
    {
        var query = new GetActiveTeamsQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new team
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto createTeamDto)
    {
        var command = new CreateTeamCommand { CreateTeamDto = createTeamDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing team
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(Guid id, [FromBody] UpdateTeamDto updateTeamDto)
    {
        var command = new UpdateTeamCommand { Id = id, UpdateTeamDto = updateTeamDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a team
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(Guid id)
    {
        var command = new DeleteTeamCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Get team members
    /// </summary>
    [HttpGet("{teamId}/members")]
    public async Task<IActionResult> GetTeamMembers(Guid teamId)
    {
        var query = new GetTeamMembersQuery { TeamId = teamId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Add team member
    /// </summary>
    [HttpPost("members")]
    public async Task<IActionResult> AddTeamMember([FromBody] AddTeamMemberDto addTeamMemberDto)
    {
        var command = new AddTeamMemberCommand { AddTeamMemberDto = addTeamMemberDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update team member
    /// </summary>
    [HttpPut("{teamId}/members/{userId}")]
    public async Task<IActionResult> UpdateTeamMember(Guid teamId, Guid userId, [FromBody] UpdateTeamMemberDto updateTeamMemberDto)
    {
        var command = new UpdateTeamMemberCommand 
        { 
            TeamId = teamId, 
            UserId = userId, 
            UpdateTeamMemberDto = updateTeamMemberDto 
        };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Remove team member
    /// </summary>
    [HttpDelete("{teamId}/members/{userId}")]
    public async Task<IActionResult> RemoveTeamMember(Guid teamId, Guid userId)
    {
        var command = new RemoveTeamMemberCommand { TeamId = teamId, UserId = userId };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
