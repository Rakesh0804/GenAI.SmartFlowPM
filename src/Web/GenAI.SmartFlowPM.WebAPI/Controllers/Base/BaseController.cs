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
                isSuccess = true,
                data = result.Data,
                message = result.Message
            });
        }

        return BadRequest(new
        {
            isSuccess = false,
            data = (T?)default,
            message = result.Errors?.FirstOrDefault(),
            errors = result.Errors
        });
    }

    protected IActionResult HandleResult(Application.Common.Models.Result result)
    {
        if (result.IsSuccess)
        {
            return Ok(new
            {
                isSuccess = true,
                message = result.Message
            });
        }

        return BadRequest(new
        {
            isSuccess = false,
            message = result.Errors?.FirstOrDefault(),
            errors = result.Errors
        });
    }
}
