using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Users.Commands;
using GenAI.SmartFlowPM.Application.Features.Users.Queries;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

public class AuthController : BaseController
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// User login
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        var command = new LoginUserCommand { LoginDto = loginDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// User logout (client-side token removal)
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // JWT is stateless, so logout is handled on the client side
        // by removing the token from storage
        return Ok(new
        {
            success = true,
            message = "Logged out successfully"
        });
    }

    /// <summary>
    /// Get current authenticated user
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        // Get user ID from JWT claims
        var userIdClaim = HttpContext.User.FindFirst("UserId")?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { success = false, message = "Invalid token" });
        }

        var query = new GetUserByIdQuery { Id = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Validate token (optional endpoint for token verification)
    /// </summary>
    [HttpPost("validate-token")]
    public IActionResult ValidateToken([FromBody] string token)
    {
        // This could be implemented to validate tokens if needed
        // For now, it's a placeholder
        return Ok(new
        {
            success = true,
            message = "Token validation endpoint"
        });
    }
}
