using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Calendar.Commands;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class EventRemindersController : BaseController
{
    public EventRemindersController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all reminders for an event
    /// </summary>
    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetEventReminders(Guid eventId)
    {
        var query = new GetEventRemindersQuery { EventId = eventId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get user's reminders
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserReminders(Guid userId)
    {
        var query = new GetUserEventRemindersQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get pending reminders
    /// </summary>
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingReminders([FromQuery] DateTime? checkTime = null)
    {
        var query = new GetPendingRemindersQuery { CheckTime = checkTime ?? DateTime.UtcNow };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get active reminders
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveReminders()
    {
        var query = new GetActiveRemindersQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new event reminder
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateEventReminder([FromBody] CreateEventReminderDto request)
    {
        var command = new CreateEventReminderCommand { CreateEventReminderDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing event reminder
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEventReminder(Guid id, [FromBody] UpdateEventReminderDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("ID mismatch");
        }

        var command = new UpdateEventReminderCommand { UpdateEventReminderDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete an event reminder
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEventReminder(Guid id)
    {
        var command = new DeleteEventReminderCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Mark reminder as sent
    /// </summary>
    [HttpPatch("{id}/mark-sent")]
    public async Task<IActionResult> MarkReminderAsSent(Guid id)
    {
        var command = new MarkReminderAsSentCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
