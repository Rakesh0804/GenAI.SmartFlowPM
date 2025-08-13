namespace GenAI.SmartFlowPM.Domain.Enums;

public enum CertificateStatus
{
    Generated = 1,
    Sent = 2,
    Downloaded = 3,
    Revoked = 4
}

public enum CertificateType
{
    CampaignCompletion = 1,
    RoleAuditCompletion = 2,
    ClaimsAuditCompletion = 3,
    PerformanceReviewCompletion = 4,
    ComplianceCompletion = 5
}
