using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Users.Commands;
using GenAI.SmartFlowPM.Application.Features.Users.Queries;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[Authorize]
public class UsersController : BaseController
{
    public UsersController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all users with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] PagedQuery query)
    {
        var command = new GetAllUsersQuery { PagedQuery = query };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var query = new GetUserByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        var command = new CreateUserCommand { CreateUserDto = createUserDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto updateUserDto)
    {
        var command = new UpdateUserCommand { Id = id, UpdateUserDto = updateUserDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var command = new DeleteUserCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Change user password
    /// </summary>
    [HttpPut("{id}/change-password")]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDto changePasswordDto)
    {
        var command = new ChangePasswordCommand { UserId = id, ChangePasswordDto = changePasswordDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Get users by manager ID
    /// </summary>
    [HttpGet("{managerId}/subordinates")]
    public async Task<IActionResult> GetSubordinates(Guid managerId)
    {
        var query = new GetUsersByManagerIdQuery { ManagerId = managerId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }
}
