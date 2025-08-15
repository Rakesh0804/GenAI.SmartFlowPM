using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Security.Claims;
using GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs;
using GenAI.SmartFlowPM.Application.Features.Dashboards.Queries;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardsController : BaseController
    {
        public DashboardsController(IMediator mediator) : base(mediator) { }

        /// <summary>
        /// Returns data for the Home Dashboard (summary stats, chart data, etc.)
        /// </summary>
        [HttpGet("home")]
        public async Task<IActionResult> GetHomeDashboard()
        {
            // Get user ID from JWT claims - try multiple claim types like AuthController
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             HttpContext.User.FindFirst("UserId")?.Value ??
                             HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

            var userId = Guid.Empty;

            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }
            else
            {
                // Debug: Log all available claims for troubleshooting
                var claims = HttpContext.User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
                Console.WriteLine($"Dashboard - Available claims: {string.Join(", ", claims)}");
                Console.WriteLine($"Dashboard - Could not parse user ID from claim: '{userIdClaim}'");
            }

            var query = new GetHomeDashboardQuery(userId);
            var result = await _mediator.Send(query);
            return HandleResult(Result<HomeDashboardDto>.Success(result));
        }
    }
}
