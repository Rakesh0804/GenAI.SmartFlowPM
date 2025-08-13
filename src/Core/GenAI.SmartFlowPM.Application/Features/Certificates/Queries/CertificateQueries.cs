using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Certificate;
using MediatR;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.Features.Certificates.Queries;

/// <summary>
/// Get all certificates with optional filtering
/// </summary>
public record GetCertificatesQuery : IRequest<Result<List<CertificateDto>>>
{
    [JsonPropertyName("campaignId")]
    public Guid? CampaignId { get; init; }

    [JsonPropertyName("managerId")]
    public Guid? ManagerId { get; init; }

    [JsonPropertyName("status")]
    public CertificateStatus? Status { get; init; }

    [JsonPropertyName("type")]
    public CertificateType? Type { get; init; }

    [JsonPropertyName("issuedFrom")]
    public DateTime? IssuedFrom { get; init; }

    [JsonPropertyName("issuedTo")]
    public DateTime? IssuedTo { get; init; }

    [JsonPropertyName("includeRevoked")]
    public bool IncludeRevoked { get; init; } = false;
}

/// <summary>
/// Get certificate by ID
/// </summary>
public record GetCertificateByIdQuery : IRequest<Result<CertificateDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Get certificate by verification token (for public verification)
/// </summary>
public record GetCertificateByTokenQuery : IRequest<Result<CertificateDto>>
{
    [JsonPropertyName("verificationToken")]
    public string VerificationToken { get; init; } = string.Empty;
}

/// <summary>
/// Get certificates for current user
/// </summary>
public record GetMyCertificatesQuery : IRequest<Result<List<CertificateDto>>>
{
    [JsonPropertyName("status")]
    public CertificateStatus? Status { get; init; }

    [JsonPropertyName("type")]
    public CertificateType? Type { get; init; }
}

/// <summary>
/// Get certificates for a specific campaign
/// </summary>
public record GetCampaignCertificatesQuery : IRequest<Result<List<CertificateDto>>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("status")]
    public CertificateStatus? Status { get; init; }
}

/// <summary>
/// Get certificate statistics for dashboard
/// </summary>
public record GetCertificateStatisticsQuery : IRequest<Result<CertificateStatisticsDto>>
{
    [JsonPropertyName("fromDate")]
    public DateTime? FromDate { get; init; }

    [JsonPropertyName("toDate")]
    public DateTime? ToDate { get; init; }

    [JsonPropertyName("campaignId")]
    public Guid? CampaignId { get; init; }
}

/// <summary>
/// Verify certificate authenticity
/// </summary>
public record VerifyCertificateQuery : IRequest<Result<CertificateVerificationDto>>
{
    [JsonPropertyName("verificationToken")]
    public string VerificationToken { get; init; } = string.Empty;
}

/// <summary>
/// Get certificate templates
/// </summary>
public record GetCertificateTemplatesQuery : IRequest<Result<List<CertificateTemplateDto>>>
{
    [JsonPropertyName("type")]
    public CertificateType? Type { get; init; }

    [JsonPropertyName("activeOnly")]
    public bool ActiveOnly { get; init; } = true;
}

/// <summary>
/// Get certificate template by ID
/// </summary>
public record GetCertificateTemplateByIdQuery : IRequest<Result<CertificateTemplateDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; init; }
}

/// <summary>
/// Get default certificate template for a type
/// </summary>
public record GetDefaultCertificateTemplateQuery : IRequest<Result<CertificateTemplateDto>>
{
    [JsonPropertyName("type")]
    public CertificateType Type { get; init; }
}

/// <summary>
/// Preview certificate before generation
/// </summary>
public record PreviewCertificateQuery : IRequest<Result<CertificatePreviewDto>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }

    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; init; }

    [JsonPropertyName("templateId")]
    public Guid? TemplateId { get; init; }

    [JsonPropertyName("customMessage")]
    public string? CustomMessage { get; init; }
}

/// <summary>
/// Get managers eligible for certificate generation for a campaign
/// </summary>
public record GetEligibleManagersForCertificateQuery : IRequest<Result<List<CertificateEligibleManagerDto>>>
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; init; }
}

/// <summary>
/// Export certificate as PDF
/// </summary>
public record ExportCertificateQuery : IRequest<Result<byte[]>>
{
    [JsonPropertyName("certificateId")]
    public Guid CertificateId { get; init; }

    [JsonPropertyName("format")]
    public string Format { get; init; } = "PDF"; // PDF, PNG, etc.
}
