using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Certificates.Commands;
using GenAI.SmartFlowPM.Application.Features.Certificates.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Certificate;
using GenAI.SmartFlowPM.WebAPI.Controllers.Base;

namespace GenAI.SmartFlowPM.WebAPI.Controllers;

/// <summary>
/// Certificate management controller for campaign completion recognition
/// </summary>
[Authorize]
public class CertificatesController : BaseController
{
    public CertificatesController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Get all certificates with optional filtering
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCertificates([FromQuery] GetCertificatesQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get certificate by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCertificate(Guid id)
    {
        var query = new GetCertificateByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get certificate by verification token (public endpoint)
    /// </summary>
    [HttpGet("verify/{token}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCertificateByToken(string token)
    {
        var query = new GetCertificateByTokenQuery { VerificationToken = token };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get certificates for current user
    /// </summary>
    [HttpGet("my-certificates")]
    public async Task<IActionResult> GetMyCertificates([FromQuery] GetMyCertificatesQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get certificates for a specific campaign
    /// </summary>
    [HttpGet("campaign/{campaignId}")]
    public async Task<IActionResult> GetCampaignCertificates(Guid campaignId, [FromQuery] GetCampaignCertificatesQuery query)
    {
        if (campaignId != query.CampaignId)
        {
            query = query with { CampaignId = campaignId };
        }

        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get certificate statistics for dashboard
    /// </summary>
    [HttpGet("statistics")]
    public async Task<IActionResult> GetCertificateStatistics([FromQuery] GetCertificateStatisticsQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Verify certificate authenticity
    /// </summary>
    [HttpPost("verify")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyCertificate([FromBody] VerifyCertificateQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Generate a completion certificate for a manager
    /// </summary>
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateCertificate([FromBody] GenerateCertificateCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetCertificate), new { id = result.Data.Id }, new
            {
                success = true,
                data = result.Data,
                message = result.Message
            });
        }

        return HandleResult(result);
    }

    /// <summary>
    /// Batch generate certificates for multiple managers
    /// </summary>
    [HttpPost("batch-generate")]
    public async Task<IActionResult> BatchGenerateCertificates([FromBody] BatchGenerateCertificatesCommand command)
    {
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Regenerate an existing certificate
    /// </summary>
    [HttpPost("{id}/regenerate")]
    public async Task<IActionResult> RegenerateCertificate(Guid id, [FromBody] RegenerateCertificateCommand command)
    {
        if (id != command.CertificateId)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Update certificate details
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCertificate(Guid id, [FromBody] UpdateCertificateCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Revoke a certificate
    /// </summary>
    [HttpPost("{id}/revoke")]
    public async Task<IActionResult> RevokeCertificate(Guid id, [FromBody] RevokeCertificateCommand command)
    {
        if (id != command.CertificateId)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Send certificate via email
    /// </summary>
    [HttpPost("{id}/send")]
    public async Task<IActionResult> SendCertificate(Guid id, [FromBody] SendCertificateCommand command)
    {
        if (id != command.CertificateId)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Export certificate as PDF/image
    /// </summary>
    [HttpGet("{id}/export")]
    public async Task<IActionResult> ExportCertificate(Guid id, [FromQuery] string format = "PDF")
    {
        var query = new ExportCertificateQuery { CertificateId = id, Format = format };
        var result = await _mediator.Send(query);

        if (result.IsSuccess)
        {
            var contentType = format.ToUpper() switch
            {
                "PDF" => "application/pdf",
                "PNG" => "image/png",
                "JPEG" => "image/jpeg",
                _ => "application/octet-stream"
            };

            return File(result.Data, contentType, $"certificate.{format.ToLower()}");
        }

        return HandleResult(result);
    }

    /// <summary>
    /// Delete a certificate (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCertificate(Guid id)
    {
        var command = new DeleteCertificateCommand { Id = id };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// Preview certificate before generation
    /// </summary>
    [HttpPost("preview")]
    public async Task<IActionResult> PreviewCertificate([FromBody] PreviewCertificateQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get managers eligible for certificate generation for a campaign
    /// </summary>
    [HttpGet("campaign/{campaignId}/eligible-managers")]
    public async Task<IActionResult> GetEligibleManagers(Guid campaignId)
    {
        var query = new GetEligibleManagersForCertificateQuery { CampaignId = campaignId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    #region Certificate Templates

    /// <summary>
    /// Get certificate templates
    /// </summary>
    [HttpGet("templates")]
    public async Task<IActionResult> GetCertificateTemplates([FromQuery] GetCertificateTemplatesQuery query)
    {
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get certificate template by ID
    /// </summary>
    [HttpGet("templates/{id}")]
    public async Task<IActionResult> GetCertificateTemplate(Guid id)
    {
        var query = new GetCertificateTemplateByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get default certificate template for a type
    /// </summary>
    [HttpGet("templates/default/{type}")]
    public async Task<IActionResult> GetDefaultCertificateTemplate(CertificateType type)
    {
        var query = new GetDefaultCertificateTemplateQuery { Type = type };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new certificate template
    /// </summary>
    [HttpPost("templates")]
    public async Task<IActionResult> CreateCertificateTemplate([FromBody] CreateCertificateTemplateCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetCertificateTemplate), new { id = result.Data.Id }, new
            {
                success = true,
                data = result.Data,
                message = result.Message
            });
        }

        return HandleResult(result);
    }

    /// <summary>
    /// Update certificate template
    /// </summary>
    [HttpPut("templates/{id}")]
    public async Task<IActionResult> UpdateCertificateTemplate(Guid id, [FromBody] UpdateCertificateTemplateCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID mismatch" });
        }

        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    #endregion
}
