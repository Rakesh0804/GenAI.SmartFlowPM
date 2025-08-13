using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Projects.Commands;
using GenAI.SmartFlowPM.Application.Features.Projects.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Project;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class ProjectsController : BaseController
{
    public ProjectsController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all projects with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetProjects([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllProjectsQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get project by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(Guid id)
    {
        var query = new GetProjectByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get projects by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetProjectsByUserId(Guid userId)
    {
        var query = new GetProjectsByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new project
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto createProjectDto)
    {
        var command = new CreateProjectCommand { CreateProjectDto = createProjectDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing project
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectDto updateProjectDto)
    {
        var command = new UpdateProjectCommand { Id = id, UpdateProjectDto = updateProjectDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a project
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var command = new DeleteProjectCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }
}
