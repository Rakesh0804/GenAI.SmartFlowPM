namespace GenAI.SmartFlowPM.Domain.Enums;

public enum CampaignStatus
{
    Draft = 1,
    Active = 2,
    Paused = 3,
    Completed = 4,
    Cancelled = 5
}

public enum CampaignType
{
    RoleAudit = 1,
    ClaimsAudit = 2,
    PerformanceReview = 3,
    ComplianceCheck = 4
}

public enum EvaluationStatus
{
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Overdue = 4
}
