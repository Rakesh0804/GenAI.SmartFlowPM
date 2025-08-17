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
public class TimeCategoriesController : BaseController
{
    public TimeCategoriesController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all time categories with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTimeCategories([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllTimeCategoriesQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get active time categories
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveTimeCategories()
    {
        var query = new GetActiveTimeCategoriesQuery();
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get time category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTimeCategory(Guid id)
    {
        var query = new GetTimeCategoryByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new time category
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTimeCategory([FromBody] CreateTimeCategoryDto createTimeCategoryDto)
    {
        var command = new CreateTimeCategoryCommand { CreateTimeCategoryDto = createTimeCategoryDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing time category
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTimeCategory(Guid id, [FromBody] UpdateTimeCategoryDto updateTimeCategoryDto)
    {
        var command = new UpdateTimeCategoryCommand { Id = id, UpdateTimeCategoryDto = updateTimeCategoryDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a time category
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTimeCategory(Guid id)
    {
        var command = new DeleteTimeCategoryCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
