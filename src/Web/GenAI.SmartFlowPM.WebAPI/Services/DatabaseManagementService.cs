using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using GenAI.SmartFlowPM.Persistence.Services;

namespace GenAI.SmartFlowPM.WebAPI.Services;

public class DatabaseManagementService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseManagementService> _logger;
    private readonly IHostApplicationLifetime _applicationLifetime;

    public DatabaseManagementService(
        IServiceProvider serviceProvider,
        ILogger<DatabaseManagementService> logger,
        IHostApplicationLifetime applicationLifetime)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _applicationLifetime = applicationLifetime;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // This service only runs for specific command line arguments
        var args = Environment.GetCommandLineArgs();
        
        if (args.Contains("--init-db"))
        {
            await InitializeDatabase();
            _applicationLifetime.StopApplication();
        }
        else if (args.Contains("--seed-db") || args.Contains("seed"))
        {
            await SeedDatabase(forceReseed: args.Contains("--force"));
            _applicationLifetime.StopApplication();
        }
        else if (args.Contains("--check-db"))
        {
            await CheckDatabase();
            _applicationLifetime.StopApplication();
        }
    }

    private async Task InitializeDatabase()
    {
        try
        {
            _logger.LogInformation("Manual database initialization requested...");
            
            using var scope = _serviceProvider.CreateScope();
            var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializationService>();
            
            await databaseInitializer.InitializeAsync();
            
            _logger.LogInformation("Manual database initialization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Manual database initialization failed: {ErrorMessage}", ex.Message);
            Environment.ExitCode = 1;
        }
    }

    private async Task SeedDatabase(bool forceReseed)
    {
        try
        {
            _logger.LogInformation("Manual database seeding requested (Force: {ForceReseed})...", forceReseed);
            
            using var scope = _serviceProvider.CreateScope();
            var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializationService>();
            
            await databaseInitializer.SeedDataAsync(forceReseed);
            
            _logger.LogInformation("Manual database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Manual database seeding failed: {ErrorMessage}", ex.Message);
            Environment.ExitCode = 1;
        }
    }

    private async Task CheckDatabase()
    {
        try
        {
            _logger.LogInformation("Database status check requested...");
            
            using var scope = _serviceProvider.CreateScope();
            var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializationService>();
            
            var exists = await databaseInitializer.DatabaseExistsAsync();
            _logger.LogInformation("Database exists: {DatabaseExists}", exists);
            
            if (exists)
            {
                _logger.LogInformation("Database is accessible and ready.");
            }
            else
            {
                _logger.LogWarning("Database is not accessible. You may need to run --init-db");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database status check failed: {ErrorMessage}", ex.Message);
            Environment.ExitCode = 1;
        }
    }
}
