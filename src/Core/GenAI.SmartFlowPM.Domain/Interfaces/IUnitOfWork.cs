namespace GenAI.SmartFlowPM.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ITenantRepository Tenants { get; }
    IUserRepository Users { get; }
    IRoleRepository Roles { get; }
    IClaimRepository Claims { get; }
    IUserRoleRepository UserRoles { get; }
    IUserClaimRepository UserClaims { get; }
    IProjectRepository Projects { get; }
    IUserProjectRepository UserProjects { get; }
    IProjectTaskRepository ProjectTasks { get; }
    ICampaignRepository Campaigns { get; }
    ICampaignGroupRepository CampaignGroups { get; }
    ICampaignEvaluationRepository CampaignEvaluations { get; }
    ICertificateRepository Certificates { get; }
    ICertificateTemplateRepository CertificateTemplates { get; }
    
    // TimeTracker repositories
    ITimeCategoryRepository TimeCategories { get; }
    ITimeEntryRepository TimeEntries { get; }
    ITimesheetRepository Timesheets { get; }
    IActiveTrackingSessionRepository ActiveTrackingSessions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
