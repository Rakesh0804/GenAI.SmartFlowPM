using Microsoft.EntityFrameworkCore.Storage;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;
using GenAI.SmartFlowPM.Persistence.Repositories;

namespace GenAI.SmartFlowPM.Persistence.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;

        Tenants = new TenantRepository(_context);
        Users = new UserRepository(_context);
        Roles = new RoleRepository(_context);
        Claims = new ClaimRepository(_context);
        UserRoles = new UserRoleRepository(_context);
        UserClaims = new UserClaimRepository(_context);
        Projects = new ProjectRepository(_context);
        UserProjects = new UserProjectRepository(_context);
        ProjectTasks = new ProjectTaskRepository(_context);
        Campaigns = new CampaignRepository(_context);
        CampaignGroups = new CampaignGroupRepository(_context);
        CampaignEvaluations = new CampaignEvaluationRepository(_context);
        Certificates = new CertificateRepository(_context);
        CertificateTemplates = new CertificateTemplateRepository(_context);
        TimeCategories = new TimeCategoryRepository(_context);
        TimeEntries = new TimeEntryRepository(_context);
        Timesheets = new TimesheetRepository(_context);
        ActiveTrackingSessions = new ActiveTrackingSessionRepository(_context);
        
        // Calendar repositories
        CalendarEvents = new CalendarEventRepository(_context);
        EventAttendees = new EventAttendeeRepository(_context);
        EventReminders = new EventReminderRepository(_context);
        RecurrencePatterns = new RecurrencePatternRepository(_context);
    }

    public ITenantRepository Tenants { get; }
    public IUserRepository Users { get; }
    public IRoleRepository Roles { get; }
    public IClaimRepository Claims { get; }
    public IUserRoleRepository UserRoles { get; }
    public IUserClaimRepository UserClaims { get; }
    public IProjectRepository Projects { get; }
    public IUserProjectRepository UserProjects { get; }
    public IProjectTaskRepository ProjectTasks { get; }
    public ICampaignRepository Campaigns { get; }
    public ICampaignGroupRepository CampaignGroups { get; }
    public ICampaignEvaluationRepository CampaignEvaluations { get; }
    public ICertificateRepository Certificates { get; }
    public ICertificateTemplateRepository CertificateTemplates { get; }
    public ITimeCategoryRepository TimeCategories { get; }
    public ITimeEntryRepository TimeEntries { get; }
    public ITimesheetRepository Timesheets { get; }
    public IActiveTrackingSessionRepository ActiveTrackingSessions { get; }
    
    // Calendar repositories
    public ICalendarEventRepository CalendarEvents { get; }
    public IEventAttendeeRepository EventAttendees { get; }
    public IEventReminderRepository EventReminders { get; }
    public IRecurrencePatternRepository RecurrencePatterns { get; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
