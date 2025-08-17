using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Commands;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class TimeEntriesController : BaseController
{
    public TimeEntriesController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all time entries with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTimeEntries([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllTimeEntriesQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time entry by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTimeEntry(Guid id)
    {
        var query = new GetTimeEntryByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time entries by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetTimeEntriesByUserId(Guid userId)
    {
        var query = new GetTimeEntriesByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time entries by project ID
    /// </summary>
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetTimeEntriesByProjectId(Guid projectId)
    {
        var query = new GetTimeEntriesByProjectIdQuery { ProjectId = projectId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time entries by task ID
    /// </summary>
    [HttpGet("task/{taskId}")]
    public async Task<IActionResult> GetTimeEntriesByTaskId(Guid taskId)
    {
        var query = new GetTimeEntriesByTaskIdQuery { TaskId = taskId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time entries by date range
    /// </summary>
    [HttpGet("user/{userId}/date-range")]
    public async Task<IActionResult> GetTimeEntriesByDateRange(
        Guid userId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetTimeEntriesByDateRangeQuery 
        { 
            UserId = userId, 
            StartDate = startDate, 
            EndDate = endDate 
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time entries by timesheet ID
    /// </summary>
    [HttpGet("timesheet/{timesheetId}")]
    public async Task<IActionResult> GetTimeEntriesByTimesheetId(Guid timesheetId)
    {
        var query = new GetTimeEntriesByTimesheetIdQuery { TimesheetId = timesheetId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new time entry
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTimeEntry([FromBody] CreateTimeEntryDto createTimeEntryDto)
    {
        var command = new CreateTimeEntryCommand { CreateTimeEntryDto = createTimeEntryDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing time entry
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTimeEntry(Guid id, [FromBody] UpdateTimeEntryDto updateTimeEntryDto)
    {
        var command = new UpdateTimeEntryCommand { Id = id, UpdateTimeEntryDto = updateTimeEntryDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a time entry
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTimeEntry(Guid id)
    {
        var command = new DeleteTimeEntryCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
