using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Persistence.Context;
using GenAI.SmartFlowPM.Persistence.UnitOfWork;
using GenAI.SmartFlowPM.Persistence.Repositories;
using GenAI.SmartFlowPM.Persistence.Services;

namespace GenAI.SmartFlowPM.Persistence.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
            {
                // Configure query splitting behavior globally to improve performance when loading multiple collections
                // This splits queries with multiple Include() operations into separate queries to avoid Cartesian explosion
                npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            });

            // Enable sensitive data logging in development for better debugging
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
                options.LogTo(Console.WriteLine, LogLevel.Information);
            }
        });

        // Add repositories and unit of work
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IClaimRepository, ClaimRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();
        services.AddScoped<IUserClaimRepository, UserClaimRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IUserProjectRepository, UserProjectRepository>();
        services.AddScoped<IProjectTaskRepository, ProjectTaskRepository>();
        services.AddScoped<IOrganizationRepository, OrganizationRepository>();
        services.AddScoped<IBranchRepository, BranchRepository>();
        services.AddScoped<IOrganizationPolicyRepository, OrganizationPolicyRepository>();
        services.AddScoped<ICompanyHolidayRepository, CompanyHolidayRepository>();
        services.AddScoped<IOrganizationSettingRepository, OrganizationSettingRepository>();
        services.AddScoped<ICampaignRepository, CampaignRepository>();
        services.AddScoped<ICampaignGroupRepository, CampaignGroupRepository>();
        services.AddScoped<ICampaignEvaluationRepository, CampaignEvaluationRepository>();
        services.AddScoped<ICertificateRepository, CertificateRepository>();
        services.AddScoped<ICertificateTemplateRepository, CertificateTemplateRepository>();
        services.AddScoped<ITeamRepository, TeamRepository>();
        services.AddScoped<ITeamMemberRepository, TeamMemberRepository>();

        // TimeTracker repositories
        services.AddScoped<ITimeCategoryRepository, TimeCategoryRepository>();
        services.AddScoped<ITimeEntryRepository, TimeEntryRepository>();
        services.AddScoped<ITimesheetRepository, TimesheetRepository>();
        services.AddScoped<IActiveTrackingSessionRepository, ActiveTrackingSessionRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork.UnitOfWork>();

        // Add services
        services.AddScoped<ICounterService, CounterService>();
        services.AddScoped<IDatabaseInitializationService, DatabaseInitializationService>();

        return services;
    }
}
