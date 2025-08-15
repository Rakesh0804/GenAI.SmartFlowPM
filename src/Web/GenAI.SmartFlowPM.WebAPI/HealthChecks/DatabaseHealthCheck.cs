using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.WebAPI.HealthChecks;

public class DatabaseHealthCheck : IHealthCheck
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseHealthCheck> _logger;

    public DatabaseHealthCheck(ApplicationDbContext context, ILogger<DatabaseHealthCheck> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            // Try to connect to the database
            var canConnect = await _context.Database.CanConnectAsync(cancellationToken);
            
            if (!canConnect)
            {
                return HealthCheckResult.Unhealthy("Cannot connect to the database");
            }

            // Check if migrations are applied
            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync(cancellationToken);
            if (pendingMigrations.Any())
            {
                return HealthCheckResult.Degraded($"Database has {pendingMigrations.Count()} pending migrations");
            }

            // Check if basic data exists
            var hasUsers = await _context.Users.AnyAsync(cancellationToken);
            if (!hasUsers)
            {
                return HealthCheckResult.Degraded("Database is empty - no users found");
            }

            return HealthCheckResult.Healthy("Database is healthy and seeded");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database health check failed");
            return HealthCheckResult.Unhealthy($"Database health check failed: {ex.Message}");
        }
    }
}
