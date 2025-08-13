using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using System.Security.Claims;
using GenAI.SmartFlowPM.Application.Features.Users.Commands;
using GenAI.SmartFlowPM.Application.Features.Users.Queries;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

public class AuthController : BaseController
{
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(IMediator mediator, IJwtTokenService jwtTokenService) : base(mediator)
    {
        _jwtTokenService = jwtTokenService;
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
        // Get user ID from JWT claims - ClaimTypes.NameIdentifier maps to the standard claim
        var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                         HttpContext.User.FindFirst("UserId")?.Value ??
                         HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            // Debug: Log all available claims
            var claims = HttpContext.User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
            Console.WriteLine($"Available claims: {string.Join(", ", claims)}");

            return Unauthorized(new { success = false, message = "Invalid token - user ID not found" });
        }

        var query = new GetUserByIdQuery { Id = userId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Refresh JWT token using refresh token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrEmpty(request.RefreshToken))
        {
            return BadRequest(new { success = false, message = "Refresh token is required" });
        }

        try
        {
            // Validate the refresh token using JWT service
            if (!_jwtTokenService.ValidateToken(request.RefreshToken))
            {
                return Unauthorized(new { success = false, message = "Invalid refresh token" });
            }

            // Get user ID from the refresh token
            var userIdFromToken = _jwtTokenService.GetUserIdFromToken(request.RefreshToken);
            if (userIdFromToken == null || !Guid.TryParse(userIdFromToken, out var userId))
            {
                return Unauthorized(new { success = false, message = "Invalid refresh token" });
            }

            // Get user to validate they still exist and are active
            var query = new GetUserByIdQuery { Id = userId };
            var userResult = await _mediator.Send(query);

            if (!userResult.IsSuccess)
            {
                return Unauthorized(new { success = false, message = "User not found" });
            }

            var user = userResult.Data;
            if (user == null || !user.IsActive)
            {
                return Unauthorized(new { success = false, message = "User is not active" });
            }

            // Extract roles from the current token (refresh token)
            // In a production system, you'd typically get fresh roles from the database
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(request.RefreshToken);
            var roleClaims = jwtToken.Claims
                .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();

            // If no roles found in token, use default role
            if (!roleClaims.Any())
            {
                roleClaims = new List<string> { "User" };
            }

            // Generate new access token and refresh token
            var newToken = _jwtTokenService.GenerateToken(
                user.Id.ToString(),
                user.Email,
                user.UserName,
                roleClaims);

            var newRefreshToken = _jwtTokenService.GenerateRefreshToken(
                user.Id.ToString(),
                user.Email,
                user.UserName,
                roleClaims);

            return Ok(new
            {
                success = true,
                data = new RefreshTokenResponse
                {
                    Token = newToken,
                    RefreshToken = newRefreshToken,
                    Expires = DateTime.UtcNow.AddHours(1) // Should match JWT expiration from config
                },
                message = "Token refreshed successfully"
            });
        }
        catch (Exception)
        {
            return BadRequest(new { success = false, message = "Token refresh failed" });
        }
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
