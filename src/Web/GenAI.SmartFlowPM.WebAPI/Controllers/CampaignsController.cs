using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Commands;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

/// <summary>
/// Campaign management controller for audit and evaluation campaigns
/// </summary>
[Authorize]
public class CampaignsController : BaseController
{
    public CampaignsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all campaigns with optional filtering
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCampaigns([FromQuery] GetCampaignsQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaign by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCampaign(Guid id)
    {
        var query = new GetCampaignByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaigns assigned to current user as manager
    /// </summary>
    [HttpGet("my-campaigns")]
    public async Task<IActionResult> GetMyCampaigns([FromQuery] GetMyCampaignsQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaigns where current user is a target
    /// </summary>
    [HttpGet("my-targets")]
    public async Task<IActionResult> GetMyCampaignTargets([FromQuery] GetMyCampaignTargetsQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaign statistics for dashboard
    /// </summary>
    [HttpGet("statistics")]
    public async Task<IActionResult> GetCampaignStatistics([FromQuery] GetCampaignStatisticsQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaign progress report
    /// </summary>
    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetCampaignProgress(Guid id)
    {
        var query = new GetCampaignProgressQuery { CampaignId = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new campaign
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateCampaign([FromBody] CreateCampaignCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetCampaign), new { id = result.Data!.Id }, result);
        }

        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing campaign
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCampaign(Guid id, [FromBody] UpdateCampaignCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Start a campaign (change status from Draft to Active)
    /// </summary>
    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartCampaign(Guid id)
    {
        var command = new StartCampaignCommand { CampaignId = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Complete a campaign
    /// </summary>
    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteCampaign(Guid id, [FromBody] CompleteCampaignCommand command)
    {
        if (id != command.CampaignId)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Cancel a campaign
    /// </summary>
    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelCampaign(Guid id, [FromBody] CancelCampaignCommand command)
    {
        if (id != command.CampaignId)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a campaign (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCampaign(Guid id)
    {
        var command = new DeleteCampaignCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    #region Campaign Groups

    /// <summary>
    /// Get all campaign groups
    /// </summary>
    [HttpGet("groups")]
    public async Task<IActionResult> GetCampaignGroups([FromQuery] GetCampaignGroupsQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaign group by ID
    /// </summary>
    [HttpGet("groups/{id}")]
    public async Task<IActionResult> GetCampaignGroup(Guid id)
    {
        var query = new GetCampaignGroupByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new campaign group
    /// </summary>
    [HttpPost("groups")]
    public async Task<IActionResult> CreateCampaignGroup([FromBody] CreateCampaignGroupCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetCampaignGroup), new { id = result.Data!.Id }, result);
        }

        return HandleResult(result);
    }

    /// <summary>
    /// Update campaign group
    /// </summary>
    [HttpPut("groups/{id}")]
    public async Task<IActionResult> UpdateCampaignGroup(Guid id, [FromBody] UpdateCampaignGroupCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    #endregion

    #region Campaign Evaluations

    /// <summary>
    /// Get evaluations for a campaign
    /// </summary>
    [HttpGet("{campaignId}/evaluations")]
    public async Task<IActionResult> GetCampaignEvaluations(Guid campaignId, [FromQuery] GetCampaignEvaluationsQuery query)
    {
        if (campaignId != query.CampaignId)
        {
            query = query with { CampaignId = campaignId };
        }

        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get campaign evaluation by ID
    /// </summary>
    [HttpGet("evaluations/{id}")]
    public async Task<IActionResult> GetCampaignEvaluation(Guid id)
    {
        var query = new GetCampaignEvaluationByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get users eligible for campaign targeting
    /// </summary>
    [HttpGet("eligible-users")]
    public async Task<IActionResult> GetEligibleUsers([FromQuery] GetCampaignEligibleUsersQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    #endregion
}
