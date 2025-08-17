using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Common;

namespace GenAI.SmartFlowPM.Persistence.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Claim> Claims { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<UserClaim> UserClaims { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<UserProject> UserProjects { get; set; }
    public DbSet<ProjectTask> ProjectTasks { get; set; }
    public DbSet<Counter> Counters { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Branch> Branches { get; set; }
    public DbSet<OrganizationPolicy> OrganizationPolicies { get; set; }
    public DbSet<CompanyHoliday> CompanyHolidays { get; set; }
    public DbSet<OrganizationSetting> OrganizationSettings { get; set; }
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<CampaignGroup> CampaignGroups { get; set; }
    public DbSet<CampaignEvaluation> CampaignEvaluations { get; set; }
    public DbSet<Certificate> Certificates { get; set; }
    public DbSet<CertificateTemplate> CertificateTemplates { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }
    
    // TimeTracker entities
    public DbSet<TimeCategory> TimeCategories { get; set; }
    public DbSet<TimeEntry> TimeEntries { get; set; }
    public DbSet<Timesheet> Timesheets { get; set; }
    public DbSet<ActiveTrackingSession> ActiveTrackingSessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from the current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global query filter for soft delete
        modelBuilder.Entity<Tenant>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Role>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Claim>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserRole>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserClaim>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Project>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserProject>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ProjectTask>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Counter>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Organization>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Branch>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<OrganizationPolicy>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CompanyHoliday>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<OrganizationSetting>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Campaign>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CampaignGroup>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CampaignEvaluation>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Certificate>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CertificateTemplate>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Team>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<TeamMember>().HasQueryFilter(e => !e.IsDeleted);
        
        // TimeTracker query filters
        modelBuilder.Entity<TimeCategory>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<TimeEntry>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Timesheet>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ActiveTrackingSession>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added
                || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var entity = (BaseEntity)entityEntry.Entity;

            if (entityEntry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }

            if (entityEntry.State == EntityState.Modified)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
