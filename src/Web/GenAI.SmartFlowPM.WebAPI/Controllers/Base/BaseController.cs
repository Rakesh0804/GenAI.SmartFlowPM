using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace GenAI.SmartFlowPM.WebAPI.Controllers.Base;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected readonly IMediator _mediator;

    protected BaseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    protected IActionResult HandleResult<T>(Application.Common.Models.Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                success = true,
                data = result.Data,
                message = result.Message
            });
        }

        return BadRequest(new
        {
            success = false,
            errors = result.Errors,
            message = result.Errors?.FirstOrDefault()
        });
    }

    protected IActionResult HandleResult(Application.Common.Models.Result result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        return BadRequest(new
        {
            success = false,
            errors = result.Errors,
            message = result.Errors?.FirstOrDefault()
        });
    }
}
