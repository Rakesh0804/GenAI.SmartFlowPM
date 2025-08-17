using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Commands;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class TimeTrackingController : BaseController
{
    public TimeTrackingController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get active tracking session by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetActiveTrackingSession(Guid id)
    {
        var query = new GetActiveTrackingSessionByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get active tracking session by user ID
    /// </summary>
    [HttpGet("user/{userId}/active")]
    public async Task<IActionResult> GetActiveTrackingSessionByUserId(Guid userId)
    {
        var query = new GetActiveTrackingSessionByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get all tracking sessions by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetTrackingSessionsByUserId(Guid userId)
    {
        var query = new GetTrackingSessionsByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Start time tracking
    /// </summary>
    [HttpPost("start")]
    public async Task<IActionResult> StartTracking([FromBody] StartTrackingDto startTrackingDto)
    {
        var command = new StartTrackingCommand { StartTrackingDto = startTrackingDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update active tracking session
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTracking(Guid id, [FromBody] UpdateTrackingDto updateTrackingDto)
    {
        var command = new UpdateTrackingCommand { Id = id, UpdateTrackingDto = updateTrackingDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Stop time tracking
    /// </summary>
    [HttpPost("{id}/stop")]
    public async Task<IActionResult> StopTracking(Guid id, [FromBody] StopTrackingDto stopTrackingDto)
    {
        var command = new StopTrackingCommand { Id = id, StopTrackingDto = stopTrackingDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Pause time tracking
    /// </summary>
    [HttpPost("{id}/pause")]
    public async Task<IActionResult> PauseTracking(Guid id, [FromBody] PauseTrackingDto pauseTrackingDto)
    {
        var command = new PauseTrackingCommand { Id = id, PauseTrackingDto = pauseTrackingDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Resume time tracking
    /// </summary>
    [HttpPost("{id}/resume")]
    public async Task<IActionResult> ResumeTracking(Guid id, [FromBody] ResumeTrackingDto resumeTrackingDto)
    {
        var command = new ResumeTrackingCommand { Id = id, ResumeTrackingDto = resumeTrackingDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
