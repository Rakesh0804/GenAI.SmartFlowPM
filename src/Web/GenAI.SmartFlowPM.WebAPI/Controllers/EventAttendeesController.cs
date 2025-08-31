using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Calendar.Commands;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class EventAttendeesController : BaseController
{
    public EventAttendeesController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all attendees for an event
    /// </summary>
    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetEventAttendees(Guid eventId)
    {
        var query = new GetEventAttendeesQuery { EventId = eventId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get user's event attendances
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserAttendances(Guid userId)
    {
        var query = new GetUserEventAttendeesQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get pending responses for a user
    /// </summary>
    [HttpGet("user/{userId}/pending")]
    public async Task<IActionResult> GetPendingResponses(Guid userId)
    {
        var query = new GetPendingResponsesQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get specific attendee by event and user
    /// </summary>
    [HttpGet("event/{eventId}/user/{userId}")]
    public async Task<IActionResult> GetEventAttendee(Guid eventId, Guid userId)
    {
        var query = new GetEventAttendeeByUserQuery { EventId = eventId, UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Add an attendee to an event
    /// </summary>
    [HttpPost("event/{eventId}")]
    public async Task<IActionResult> AddEventAttendee(Guid eventId, [FromBody] CreateEventAttendeeDto request)
    {
        var command = new AddEventAttendeeCommand { EventId = eventId, CreateAttendeeDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update attendee response
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEventAttendee(Guid id, [FromBody] UpdateEventAttendeeDto request)
    {
        var command = new UpdateEventAttendeeCommand { Id = id, UpdateAttendeeDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Remove an attendee from an event
    /// </summary>
    [HttpDelete("event/{eventId}/user/{userId}")]
    public async Task<IActionResult> RemoveEventAttendee(Guid eventId, Guid userId)
    {
        var command = new RemoveEventAttendeeCommand { EventId = eventId, UserId = userId };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
