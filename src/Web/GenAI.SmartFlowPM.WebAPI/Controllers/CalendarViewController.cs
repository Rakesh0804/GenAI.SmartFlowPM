using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

[AllowAnonymous] // Temporarily allow anonymous access for testing
[Route("api/calendar/views")]
public class CalendarViewController : BaseController
{
    public CalendarViewController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Test endpoint to check if controller is working
    /// </summary>
    [HttpGet("test")]
    public IActionResult Test()
    {
        Console.WriteLine("Calendar Test endpoint hit!");
        var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
        Console.WriteLine($"Headers: {string.Join(", ", headers.Select(h => $"{h.Key}={h.Value}"))}");
        
        return Ok(new { 
            message = "Calendar controller is working!", 
            timestamp = DateTime.UtcNow,
            headers = headers
        });
    }

    /// <summary>
    /// Get monthly calendar view with events organized by day
    /// </summary>
    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyView(
        [FromQuery] int year,
        [FromQuery] int month,
        [FromQuery] Guid? userId = null)
    {
        Console.WriteLine($"Monthly view requested - Year: {year}, Month: {month}, UserId: {userId}");
        Console.WriteLine($"Headers: {string.Join(", ", Request.Headers.Select(h => $"{h.Key}={h.Value}"))}");
        
        try
        {
            var query = new GetMonthlyCalendarViewQuery
            {
                Year = year,
                Month = month,
                UserId = userId
            };
            
            Console.WriteLine($"Sending query to MediatR handler...");
            var result = await _mediator.Send(query);
            Console.WriteLine($"MediatR result - IsSuccess: {result.IsSuccess}, Message: {result.Message}");
            
            if (!result.IsSuccess)
            {
                Console.WriteLine($"MediatR errors: {string.Join(", ", result.Errors ?? new List<string>())}");
            }
            
            return HandleResult(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception in GetMonthlyView: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return BadRequest(new { 
                isSuccess = false, 
                message = ex.Message,
                error = "Exception occurred in monthly view endpoint"
            });
        }
    }

    /// <summary>
    /// Get weekly calendar view with events organized by day and time
    /// </summary>
    [HttpGet("weekly")]
    public async Task<IActionResult> GetWeeklyView(
        [FromQuery] DateTime startDate,
        [FromQuery] Guid? userId = null)
    {
        var query = new GetWeeklyCalendarViewQuery
        {
            StartDate = startDate,
            UserId = userId
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get daily calendar view with events organized by time slots
    /// </summary>
    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyView(
        [FromQuery] DateTime date,
        [FromQuery] Guid? userId = null)
    {
        var query = new GetDailyCalendarViewQuery
        {
            Date = date,
            UserId = userId
        };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }
}
