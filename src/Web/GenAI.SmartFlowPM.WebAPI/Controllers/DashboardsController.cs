using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
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
            // Get current user ID from JWT claims
            var userIdClaim = HttpContext.User.FindFirst("UserId")?.Value;
            var userId = Guid.Empty;

            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            var query = new GetHomeDashboardQuery(userId);
            var result = await _mediator.Send(query);
            return HandleResult(Result<HomeDashboardDto>.Success(result));
        }
    }
}
