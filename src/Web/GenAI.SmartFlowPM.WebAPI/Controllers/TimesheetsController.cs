using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Commands;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class TimesheetsController : BaseController
{
    public TimesheetsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all timesheets with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTimesheets([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllTimesheetsQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get timesheet by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTimesheet(Guid id)
    {
        var query = new GetTimesheetByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get timesheets by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetTimesheetsByUserId(Guid userId)
    {
        var query = new GetTimesheetsByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get timesheet by user and date range
    /// </summary>
    [HttpGet("user/{userId}/date-range")]
    public async Task<IActionResult> GetTimesheetByUserAndDateRange(
        Guid userId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetTimesheetByUserAndDateRangeQuery 
        { 
            UserId = userId, 
            StartDate = startDate, 
            EndDate = endDate 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get pending timesheet approvals
    /// </summary>
    [HttpGet("pending-approvals")]
    public async Task<IActionResult> GetPendingTimesheetApprovals()
    {
        var query = new GetPendingTimesheetApprovalsQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get timesheets by status
    /// </summary>
    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetTimesheetsByStatus(TimesheetStatus status)
    {
        var query = new GetTimesheetsByStatusQuery { Status = status };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new timesheet
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTimesheet([FromBody] CreateTimesheetDto createTimesheetDto)
    {
        var command = new CreateTimesheetCommand { CreateTimesheetDto = createTimesheetDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing timesheet
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTimesheet(Guid id, [FromBody] UpdateTimesheetDto updateTimesheetDto)
    {
        var command = new UpdateTimesheetCommand { Id = id, UpdateTimesheetDto = updateTimesheetDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Submit a timesheet for approval
    /// </summary>
    [HttpPost("{id}/submit")]
    public async Task<IActionResult> SubmitTimesheet(Guid id, [FromBody] SubmitTimesheetDto submitTimesheetDto)
    {
        var command = new SubmitTimesheetCommand { Id = id, SubmitTimesheetDto = submitTimesheetDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Approve a timesheet
    /// </summary>
    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveTimesheet(Guid id, [FromBody] ApproveTimesheetDto approveTimesheetDto)
    {
        var command = new ApproveTimesheetCommand { Id = id, ApproveTimesheetDto = approveTimesheetDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Reject a timesheet
    /// </summary>
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectTimesheet(Guid id, [FromBody] RejectTimesheetDto rejectTimesheetDto)
    {
        var command = new RejectTimesheetCommand { Id = id, RejectTimesheetDto = rejectTimesheetDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a timesheet
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTimesheet(Guid id)
    {
        var command = new DeleteTimesheetCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
