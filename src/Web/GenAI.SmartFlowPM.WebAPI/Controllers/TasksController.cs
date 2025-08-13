using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Tasks.Commands;
using GenAI.SmartFlowPM.Application.Features.Tasks.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Task;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;
using GenAI.SmartFlowPM.Domain.Common.Constants;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class TasksController : BaseController
{
    public TasksController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get available task types
    /// </summary>
    [HttpGet("types")]
    public IActionResult GetTaskTypes()
    {
        var taskTypes = TaskTypeConstants.ValidAcronyms.Select(acronym => new
        {
            value = acronym,
            label = TaskTypeConstants.GetLabel(acronym),
            description = TaskTypeConstants.GetDescription(acronym)
        }).ToArray();

        return Ok(Result<object>.Success(taskTypes));
    }

    /// <summary>
    /// Get all tasks with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] PagedQuery pagedQuery)
    {
        var query = new GetAllTasksQuery { PagedQuery = pagedQuery };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get task by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        var query = new GetTaskByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get tasks by project ID
    /// </summary>
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetTasksByProjectId(Guid projectId)
    {
        var query = new GetTasksByProjectIdQuery { ProjectId = projectId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get tasks by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetTasksByUserId(Guid userId)
    {
        var query = new GetTasksByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new task
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        var command = new CreateTaskCommand { CreateTaskDto = createTaskDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing task
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskDto updateTaskDto)
    {
        var command = new UpdateTaskCommand { Id = id, UpdateTaskDto = updateTaskDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a task
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var command = new DeleteTaskCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Assign task to a user
    /// </summary>
    [HttpPut("{taskId}/assign/{userId}")]
    public async Task<IActionResult> AssignTask(Guid taskId, Guid userId)
    {
        var command = new AssignTaskCommand { TaskId = taskId, UserId = userId };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Get user task dashboard data including total, completed, and pending tasks
    /// </summary>
    [HttpGet("dashboard/user/{userId}")]
    public async Task<IActionResult> GetUserTaskDashboard(Guid userId)
    {
        var query = new GetUserTaskDashboardQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }
}
