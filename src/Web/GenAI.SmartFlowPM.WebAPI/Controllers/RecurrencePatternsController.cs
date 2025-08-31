using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Calendar.Commands;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class RecurrencePatternsController : BaseController
{
    public RecurrencePatternsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get recurrence pattern by event ID
    /// </summary>
    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetRecurrencePattern(Guid eventId)
    {
        var query = new GetRecurrencePatternByEventQuery { EventId = eventId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get all active recurrence patterns
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveRecurrencePatterns()
    {
        var query = new GetActiveRecurrencePatternsQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new recurrence pattern
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateRecurrencePattern([FromBody] CreateRecurrencePatternDto request)
    {
        var command = new CreateRecurrencePatternCommand { CreateRecurrencePatternDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing recurrence pattern
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecurrencePattern(Guid id, [FromBody] UpdateRecurrencePatternDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("ID mismatch");
        }

        var command = new UpdateRecurrencePatternCommand { UpdateRecurrencePatternDto = request };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a recurrence pattern
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecurrencePattern(Guid id)
    {
        var command = new DeleteRecurrencePatternCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
