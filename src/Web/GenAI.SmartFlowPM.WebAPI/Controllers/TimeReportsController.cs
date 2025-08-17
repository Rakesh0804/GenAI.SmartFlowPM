using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class TimeReportsController : BaseController
{
    public TimeReportsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Generate user time report
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserTimeReport(
        Guid userId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetUserTimeReportQuery 
        { 
            UserId = userId, 
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc), 
            EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc) 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Generate team time report
    /// </summary>
    [HttpGet("team")]
    public async Task<IActionResult> GetTeamTimeReport(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetTeamTimeReportQuery 
        { 
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc), 
            EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc) 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Generate project time report
    /// </summary>
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetProjectTimeReport(
        Guid projectId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetProjectTimeReportQuery 
        { 
            ProjectId = projectId, 
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc), 
            EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc) 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }
}
