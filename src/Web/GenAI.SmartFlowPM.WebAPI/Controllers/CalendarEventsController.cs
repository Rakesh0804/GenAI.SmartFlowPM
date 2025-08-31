using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Calendar.Commands;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class CalendarEventsController : BaseController
{
    public CalendarEventsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all calendar events with pagination and filtering
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCalendarEvents(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] EventType? eventType = null,
        [FromQuery] EventStatus? eventStatus = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] Guid? projectId = null)
    {
        var query = new GetCalendarEventsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            StartDate = startDate,
            EndDate = endDate,
            EventType = eventType,
            EventStatus = eventStatus,
            SearchTerm = searchTerm,
            ProjectId = projectId
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get calendar event by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCalendarEvent(Guid id)
    {
        var query = new GetCalendarEventByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get user's calendar events
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserEvents(
        Guid userId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] EventStatus? eventStatus = null)
    {
        var query = new GetUserCalendarEventsQuery
        {
            UserId = userId,
            PageNumber = pageNumber,
            PageSize = pageSize,
            StartDate = startDate,
            EndDate = endDate,
            EventStatus = eventStatus
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get upcoming events for a user
    /// </summary>
    [HttpGet("user/{userId}/upcoming")]
    public async Task<IActionResult> GetUpcomingEvents(
        Guid userId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int limit = 10)
    {
        var query = new GetUpcomingEventsQuery
        {
            UserId = userId,
            StartDate = startDate ?? DateTime.UtcNow,
            EndDate = endDate ?? DateTime.UtcNow.AddDays(30),
            Limit = limit
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get calendar events by project
    /// </summary>
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetProjectEvents(Guid projectId)
    {
        var query = new GetCalendarEventsByProjectQuery { ProjectId = projectId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get calendar events by task
    /// </summary>
    [HttpGet("task/{taskId}")]
    public async Task<IActionResult> GetTaskEvents(Guid taskId)
    {
        var query = new GetCalendarEventsByTaskQuery { TaskId = taskId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get calendar events by date range
    /// </summary>
    [HttpGet("date-range")]
    public async Task<IActionResult> GetEventsByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetCalendarEventsByDateRangeQuery
        {
            StartDate = startDate,
            EndDate = endDate
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get recurring events
    /// </summary>
    [HttpGet("recurring")]
    public async Task<IActionResult> GetRecurringEvents()
    {
        var query = new GetRecurringEventsQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new calendar event
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateCalendarEvent([FromBody] CreateCalendarEventDto request)
    {
        var command = new CreateCalendarEventCommand { CreateEventDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing calendar event
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCalendarEvent(Guid id, [FromBody] UpdateCalendarEventDto request)
    {
        var command = new UpdateCalendarEventCommand { Id = id, UpdateEventDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a calendar event
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCalendarEvent(Guid id)
    {
        var command = new DeleteCalendarEventCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
