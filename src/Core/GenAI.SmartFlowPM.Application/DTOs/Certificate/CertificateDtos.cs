using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GenAI.SmartFlowPM.Application.DTOs.Certificate;

/// <summary>
/// Certificate status enumeration
/// </summary>
public enum CertificateStatus
{
    Generated = 0,
    Sent = 1,
    Verified = 2,
    Revoked = 3,
    Expired = 4
}

/// <summary>
/// Certificate type enumeration
/// </summary>
public enum CertificateType
{
    CampaignCompletion = 0,
    ProfessionalDevelopment = 1,
    ComplianceAchievement = 2,
    ExcellenceRecognition = 3,
    TrainingCompletion = 4
}

/// <summary>
/// Certificate export format enumeration
/// </summary>
public enum CertificateExportFormat
{
    PDF = 0,
    PNG = 1,
    JPEG = 2
}

/// <summary>
/// Main certificate DTO
/// </summary>
public class CertificateDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("campaignTitle")]
    public string CampaignTitle { get; set; } = string.Empty;

    [JsonPropertyName("recipientId")]
    public Guid RecipientId { get; set; }

    [JsonPropertyName("recipientName")]
    public string RecipientName { get; set; } = string.Empty;

    [JsonPropertyName("recipientEmail")]
    public string RecipientEmail { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public CertificateType Type { get; set; }

    [JsonPropertyName("status")]
    public CertificateStatus Status { get; set; }

    [JsonPropertyName("verificationToken")]
    public string VerificationToken { get; set; } = string.Empty;

    [JsonPropertyName("templateId")]
    public Guid TemplateId { get; set; }

    [JsonPropertyName("templateName")]
    public string TemplateName { get; set; } = string.Empty;

    [JsonPropertyName("certificateTitle")]
    public string CertificateTitle { get; set; } = string.Empty;

    [JsonPropertyName("customMessage")]
    public string CustomMessage { get; set; } = string.Empty;

    [JsonPropertyName("issuedDate")]
    public DateTime IssuedDate { get; set; }

    [JsonPropertyName("expiryDate")]
    public DateTime? ExpiryDate { get; set; }

    [JsonPropertyName("issuedBy")]
    public Guid IssuedBy { get; set; }

    [JsonPropertyName("issuerName")]
    public string IssuerName { get; set; } = string.Empty;

    [JsonPropertyName("organizationName")]
    public string OrganizationName { get; set; } = string.Empty;

    [JsonPropertyName("organizationLogo")]
    public string OrganizationLogo { get; set; } = string.Empty;

    [JsonPropertyName("pdfFilePath")]
    public string PdfFilePath { get; set; } = string.Empty;

    [JsonPropertyName("isRevoked")]
    public bool IsRevoked { get; set; }

    [JsonPropertyName("revokedDate")]
    public DateTime? RevokedDate { get; set; }

    [JsonPropertyName("revokedBy")]
    public Guid? RevokedBy { get; set; }

    [JsonPropertyName("revokedReason")]
    public string RevokedReason { get; set; } = string.Empty;

    [JsonPropertyName("verificationCount")]
    public int VerificationCount { get; set; }

    [JsonPropertyName("lastVerifiedDate")]
    public DateTime? LastVerifiedDate { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Certificate template DTO
/// </summary>
public class CertificateTemplateDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public CertificateType Type { get; set; }

    [JsonPropertyName("templateContent")]
    public string TemplateContent { get; set; } = string.Empty; // HTML/CSS content

    [JsonPropertyName("isDefault")]
    public bool IsDefault { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("backgroundColor")]
    public string BackgroundColor { get; set; } = "#FFFFFF";

    [JsonPropertyName("textColor")]
    public string TextColor { get; set; } = "#000000";

    [JsonPropertyName("borderColor")]
    public string BorderColor { get; set; } = "#000000";

    [JsonPropertyName("logoUrl")]
    public string LogoUrl { get; set; } = string.Empty;

    [JsonPropertyName("fontSize")]
    public int FontSize { get; set; } = 14;

    [JsonPropertyName("fontFamily")]
    public string FontFamily { get; set; } = "Arial";

    [JsonPropertyName("width")]
    public int Width { get; set; } = 800;

    [JsonPropertyName("height")]
    public int Height { get; set; } = 600;

    [JsonPropertyName("orientation")]
    public string Orientation { get; set; } = "Landscape"; // "Portrait" or "Landscape"

    [JsonPropertyName("createdBy")]
    public Guid CreatedBy { get; set; }

    [JsonPropertyName("createdByName")]
    public string CreatedByName { get; set; } = string.Empty;

    [JsonPropertyName("usageCount")]
    public int UsageCount { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Certificate verification DTO
/// </summary>
public class CertificateVerificationDto
{
    [JsonPropertyName("isValid")]
    public bool IsValid { get; set; }

    [JsonPropertyName("verificationToken")]
    public string VerificationToken { get; set; } = string.Empty;

    [JsonPropertyName("certificate")]
    public CertificateDto? Certificate { get; set; }

    [JsonPropertyName("errorMessage")]
    public string ErrorMessage { get; set; } = string.Empty;

    [JsonPropertyName("verificationDate")]
    public DateTime VerificationDate { get; set; }

    [JsonPropertyName("verificationDetails")]
    public CertificateVerificationDetailsDto VerificationDetails { get; set; } = new();
}

/// <summary>
/// Certificate verification details DTO
/// </summary>
public class CertificateVerificationDetailsDto
{
    [JsonPropertyName("recipientName")]
    public string RecipientName { get; set; } = string.Empty;

    [JsonPropertyName("campaignTitle")]
    public string CampaignTitle { get; set; } = string.Empty;

    [JsonPropertyName("certificateType")]
    public string CertificateType { get; set; } = string.Empty;

    [JsonPropertyName("issuedDate")]
    public DateTime IssuedDate { get; set; }

    [JsonPropertyName("expiryDate")]
    public DateTime? ExpiryDate { get; set; }

    [JsonPropertyName("issuerName")]
    public string IssuerName { get; set; } = string.Empty;

    [JsonPropertyName("organizationName")]
    public string OrganizationName { get; set; } = string.Empty;

    [JsonPropertyName("isExpired")]
    public bool IsExpired { get; set; }

    [JsonPropertyName("isRevoked")]
    public bool IsRevoked { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("customMessage")]
    public string CustomMessage { get; set; } = string.Empty;
}

/// <summary>
/// Certificate statistics DTO
/// </summary>
public class CertificateStatisticsDto
{
    [JsonPropertyName("totalCertificates")]
    public int TotalCertificates { get; set; }

    [JsonPropertyName("activeCertificates")]
    public int ActiveCertificates { get; set; }

    [JsonPropertyName("revokedCertificates")]
    public int RevokedCertificates { get; set; }

    [JsonPropertyName("expiredCertificates")]
    public int ExpiredCertificates { get; set; }

    [JsonPropertyName("totalVerifications")]
    public int TotalVerifications { get; set; }

    [JsonPropertyName("certificatesByType")]
    public List<CertificateTypeStatDto> CertificatesByType { get; set; } = new();

    [JsonPropertyName("monthlyIssuance")]
    public List<CertificateMonthlyStatDto> MonthlyIssuance { get; set; } = new();

    [JsonPropertyName("topRecipients")]
    public List<CertificateRecipientStatDto> TopRecipients { get; set; } = new();

    [JsonPropertyName("templateUsage")]
    public List<CertificateTemplateUsageDto> TemplateUsage { get; set; } = new();

    [JsonPropertyName("averageVerificationTime")]
    public double AverageVerificationTime { get; set; } // in days

    [JsonPropertyName("verificationTrends")]
    public List<CertificateVerificationTrendDto> VerificationTrends { get; set; } = new();
}

/// <summary>
/// Certificate type statistics DTO
/// </summary>
public class CertificateTypeStatDto
{
    [JsonPropertyName("type")]
    public CertificateType Type { get; set; }

    [JsonPropertyName("typeName")]
    public string TypeName { get; set; } = string.Empty;

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("percentage")]
    public decimal Percentage { get; set; }
}

/// <summary>
/// Certificate monthly statistics DTO
/// </summary>
public class CertificateMonthlyStatDto
{
    [JsonPropertyName("month")]
    public string Month { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("verifications")]
    public int Verifications { get; set; }
}

/// <summary>
/// Certificate recipient statistics DTO
/// </summary>
public class CertificateRecipientStatDto
{
    [JsonPropertyName("recipientId")]
    public Guid RecipientId { get; set; }

    [JsonPropertyName("recipientName")]
    public string RecipientName { get; set; } = string.Empty;

    [JsonPropertyName("certificateCount")]
    public int CertificateCount { get; set; }

    [JsonPropertyName("lastCertificateDate")]
    public DateTime LastCertificateDate { get; set; }

    [JsonPropertyName("verificationCount")]
    public int VerificationCount { get; set; }
}

/// <summary>
/// Certificate template usage DTO
/// </summary>
public class CertificateTemplateUsageDto
{
    [JsonPropertyName("templateId")]
    public Guid TemplateId { get; set; }

    [JsonPropertyName("templateName")]
    public string TemplateName { get; set; } = string.Empty;

    [JsonPropertyName("usageCount")]
    public int UsageCount { get; set; }

    [JsonPropertyName("percentage")]
    public decimal Percentage { get; set; }

    [JsonPropertyName("lastUsedDate")]
    public DateTime? LastUsedDate { get; set; }
}

/// <summary>
/// Certificate verification trend DTO
/// </summary>
public class CertificateVerificationTrendDto
{
    [JsonPropertyName("month")]
    public string Month { get; set; } = string.Empty;

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("verificationCount")]
    public int VerificationCount { get; set; }

    [JsonPropertyName("uniqueVerifications")]
    public int UniqueVerifications { get; set; }

    [JsonPropertyName("averagePerDay")]
    public decimal AveragePerDay { get; set; }
}

/// <summary>
/// Certificate export request DTO
/// </summary>
public class CertificateExportRequestDto
{
    [JsonPropertyName("certificateId")]
    public Guid CertificateId { get; set; }

    [JsonPropertyName("format")]
    public CertificateExportFormat Format { get; set; }

    [JsonPropertyName("includeQRCode")]
    public bool IncludeQRCode { get; set; } = true;

    [JsonPropertyName("includeVerificationUrl")]
    public bool IncludeVerificationUrl { get; set; } = true;

    [JsonPropertyName("customMessage")]
    public string CustomMessage { get; set; } = string.Empty;
}

/// <summary>
/// Certificate export response DTO
/// </summary>
public class CertificateExportResponseDto
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("filePath")]
    public string FilePath { get; set; } = string.Empty;

    [JsonPropertyName("downloadUrl")]
    public string DownloadUrl { get; set; } = string.Empty;

    [JsonPropertyName("fileName")]
    public string FileName { get; set; } = string.Empty;

    [JsonPropertyName("fileSize")]
    public long FileSize { get; set; }

    [JsonPropertyName("contentType")]
    public string ContentType { get; set; } = string.Empty;

    [JsonPropertyName("errorMessage")]
    public string ErrorMessage { get; set; } = string.Empty;

    [JsonPropertyName("generatedAt")]
    public DateTime GeneratedAt { get; set; }
}

/// <summary>
/// Certificate email delivery DTO
/// </summary>
public class CertificateEmailDeliveryDto
{
    [JsonPropertyName("certificateId")]
    public Guid CertificateId { get; set; }

    [JsonPropertyName("recipientEmail")]
    public string RecipientEmail { get; set; } = string.Empty;

    [JsonPropertyName("emailSubject")]
    public string EmailSubject { get; set; } = string.Empty;

    [JsonPropertyName("emailBody")]
    public string EmailBody { get; set; } = string.Empty;

    [JsonPropertyName("includeAttachment")]
    public bool IncludeAttachment { get; set; } = true;

    [JsonPropertyName("attachmentFormat")]
    public CertificateExportFormat AttachmentFormat { get; set; } = CertificateExportFormat.PDF;

    [JsonPropertyName("ccEmails")]
    public List<string> CcEmails { get; set; } = new();

    [JsonPropertyName("bccEmails")]
    public List<string> BccEmails { get; set; } = new();

    [JsonPropertyName("sendVerificationLink")]
    public bool SendVerificationLink { get; set; } = true;
}

/// <summary>
/// Certificate batch generation request DTO
/// </summary>
public class CertificateBatchGenerationRequestDto
{
    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("recipientIds")]
    public List<Guid> RecipientIds { get; set; } = new();

    [JsonPropertyName("templateId")]
    public Guid? TemplateId { get; set; }

    [JsonPropertyName("customMessage")]
    public string CustomMessage { get; set; } = string.Empty;

    [JsonPropertyName("sendEmailNotifications")]
    public bool SendEmailNotifications { get; set; } = true;

    [JsonPropertyName("emailSubject")]
    public string EmailSubject { get; set; } = string.Empty;

    [JsonPropertyName("emailBody")]
    public string EmailBody { get; set; } = string.Empty;
}

/// <summary>
/// Certificate batch generation response DTO
/// </summary>
public class CertificateBatchGenerationResponseDto
{
    [JsonPropertyName("batchId")]
    public Guid BatchId { get; set; }

    [JsonPropertyName("totalRequested")]
    public int TotalRequested { get; set; }

    [JsonPropertyName("successfullyGenerated")]
    public int SuccessfullyGenerated { get; set; }

    [JsonPropertyName("failed")]
    public int Failed { get; set; }

    [JsonPropertyName("generatedCertificates")]
    public List<CertificateDto> GeneratedCertificates { get; set; } = new();

    [JsonPropertyName("failedGenerations")]
    public List<CertificateGenerationErrorDto> FailedGenerations { get; set; } = new();

    [JsonPropertyName("emailsQueued")]
    public int EmailsQueued { get; set; }

    [JsonPropertyName("completedAt")]
    public DateTime CompletedAt { get; set; }
}

/// <summary>
/// Certificate generation error DTO
/// </summary>
public class CertificateGenerationErrorDto
{
    [JsonPropertyName("recipientId")]
    public Guid RecipientId { get; set; }

    [JsonPropertyName("recipientName")]
    public string RecipientName { get; set; } = string.Empty;

    [JsonPropertyName("errorMessage")]
    public string ErrorMessage { get; set; } = string.Empty;

    [JsonPropertyName("errorCode")]
    public string ErrorCode { get; set; } = string.Empty;
}

/// <summary>
/// Certificate preview DTO
/// </summary>
public class CertificatePreviewDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("recipientName")]
    public string RecipientName { get; set; } = string.Empty;

    [JsonPropertyName("issuerName")]
    public string IssuerName { get; set; } = string.Empty;

    [JsonPropertyName("issuedDate")]
    public DateTime IssuedDate { get; set; }

    [JsonPropertyName("templateName")]
    public string TemplateName { get; set; } = string.Empty;

    [JsonPropertyName("customMessage")]
    public string? CustomMessage { get; set; }

    [JsonPropertyName("previewImageUrl")]
    public string? PreviewImageUrl { get; set; }

    [JsonPropertyName("canGenerate")]
    public bool CanGenerate { get; set; }

    [JsonPropertyName("validationMessages")]
    public List<string> ValidationMessages { get; set; } = new();
}

/// <summary>
/// Certificate eligible manager DTO
/// </summary>
public class CertificateEligibleManagerDto
{
    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; set; }

    [JsonPropertyName("managerName")]
    public string ManagerName { get; set; } = string.Empty;

    [JsonPropertyName("managerEmail")]
    public string ManagerEmail { get; set; } = string.Empty;

    [JsonPropertyName("completedEvaluationsCount")]
    public int CompletedEvaluationsCount { get; set; }

    [JsonPropertyName("totalEvaluationsCount")]
    public int TotalEvaluationsCount { get; set; }

    [JsonPropertyName("completionPercentage")]
    public decimal CompletionPercentage { get; set; }

    [JsonPropertyName("isEligible")]
    public bool IsEligible { get; set; }

    [JsonPropertyName("eligibilityReason")]
    public string EligibilityReason { get; set; } = string.Empty;

    [JsonPropertyName("campaignId")]
    public Guid CampaignId { get; set; }

    [JsonPropertyName("campaignTitle")]
    public string CampaignTitle { get; set; } = string.Empty;

    [JsonPropertyName("assignedUserIds")]
    public List<Guid> AssignedUserIds { get; set; } = new();
}
