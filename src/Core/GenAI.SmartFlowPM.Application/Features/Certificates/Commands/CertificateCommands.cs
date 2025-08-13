using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Certificate;
using MediatR;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.Features.Certificates.Commands;

/// <summary>
/// Generate a completion certificate for a manager who completed campaign evaluations
/// </summary>
public record GenerateCertificateCommand : IRequest<Result<CertificateDto>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; init; }

    [JsonPropertyName("customMessage")]
    public string? CustomMessage { get; init; }
}

/// <summary>
/// Regenerate an existing certificate (e.g., if template changes)
/// </summary>
public record RegenerateCertificateCommand : IRequest<Result<CertificateDto>>
{
    [JsonPropertyName("certificateId")]
    public Guid CertificateId { get; init; }

    [JsonPropertyName("customMessage")]
    public string? CustomMessage { get; init; }
}

/// <summary>
/// Update certificate details (mainly for administrative purposes)
/// </summary>
public record UpdateCertificateCommand : IRequest<Result<CertificateDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }

    [JsonPropertyName("customMessage")]
    public string? CustomMessage { get; init; }

    [JsonPropertyName("status")]
    public CertificateStatus Status { get; init; }

    [JsonPropertyName("adminNotes")]
    public string? AdminNotes { get; init; }
}

/// <summary>
/// Revoke a certificate (e.g., if evaluation was found to be invalid)
/// </summary>
public record RevokeCertificateCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("certificateId")]
    public Guid CertificateId { get; init; }

    [JsonPropertyName("revocationReason")]
    public string RevocationReason { get; init; } = string.Empty;
}

/// <summary>
/// Delete a certificate (soft delete)
/// </summary>
public record DeleteCertificateCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Send certificate via email
/// </summary>
public record SendCertificateCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("certificateId")]
    public Guid CertificateId { get; init; }

    [JsonPropertyName("emailAddress")]
    public string EmailAddress { get; init; } = string.Empty;

    [JsonPropertyName("emailMessage")]
    public string? EmailMessage { get; init; }
}

/// <summary>
/// Batch generate certificates for multiple managers who completed a campaign
/// </summary>
public record BatchGenerateCertificatesCommand : IRequest<Result<List<CertificateDto>>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("managerIds")]
    public List<Guid> ManagerIds { get; init; } = new();

    [JsonPropertyName("customMessage")]
    public string? CustomMessage { get; init; }
}

/// <summary>
/// Create a certificate template for customization
/// </summary>
public record CreateCertificateTemplateCommand : IRequest<Result<CertificateTemplateDto>>
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("templateContent")]
    public string TemplateContent { get; init; } = string.Empty;

    [JsonPropertyName("type")]
    public CertificateType Type { get; init; }

    [JsonPropertyName("isDefault")]
    public bool IsDefault { get; init; } = false;
}

/// <summary>
/// Update certificate template
/// </summary>
public record UpdateCertificateTemplateCommand : IRequest<Result<CertificateTemplateDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; init; } = string.Empty;

    [JsonPropertyName("templateContent")]
    public string TemplateContent { get; init; } = string.Empty;

    [JsonPropertyName("type")]
    public CertificateType Type { get; init; }

    [JsonPropertyName("isDefault")]
    public bool IsDefault { get; init; }
}
