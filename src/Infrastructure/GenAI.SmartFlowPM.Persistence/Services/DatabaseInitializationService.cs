using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using GenAI.SmartFlowPM.Persistence.Context;
using GenAI.SmartFlowPM.Persistence.Seeders;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;

namespace GenAI.SmartFlowPM.Persistence.Services;

public interface IDatabaseInitializationService
{
    Task InitializeAsync();
    Task<bool> DatabaseExistsAsync();
    Task CreateDatabaseAsync();
    Task RunMigrationsAsync();
    Task SeedDataAsync(bool forceReseed = false);
}

public class DatabaseInitializationService : IDatabaseInitializationService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseInitializationService> _logger;

    public DatabaseInitializationService(
        IServiceProvider serviceProvider,
        ILogger<DatabaseInitializationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        _logger.LogInformation("Starting database initialization...");
        
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Check if database exists
            var databaseExists = await DatabaseExistsAsync();
            
            if (!databaseExists)
            {
                _logger.LogInformation("Database does not exist. Creating database...");
                await CreateDatabaseAsync();
                _logger.LogInformation("Database created successfully.");
            }
            else
            {
                _logger.LogInformation("Database already exists.");
            }
            
            // Run migrations
            _logger.LogInformation("Applying database migrations...");
            await RunMigrationsAsync();
            _logger.LogInformation("Database migrations applied successfully.");
            
            // Seed data
            _logger.LogInformation("Checking if data seeding is required...");
            await SeedDataAsync(forceReseed: false);
            _logger.LogInformation("Data seeding completed.");
            
            _logger.LogInformation("Database initialization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during database initialization: {ErrorMessage}", ex.Message);
            throw;
        }
    }

    public async Task<bool> DatabaseExistsAsync()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            var canConnect = await context.Database.CanConnectAsync();
            _logger.LogInformation("Database connection test result: {CanConnect}", canConnect);
            
            return canConnect;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Database connection test failed: {ErrorMessage}", ex.Message);
            return false;
        }
    }

    public async Task CreateDatabaseAsync()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            _logger.LogInformation("Creating database...");
            var created = await context.Database.EnsureCreatedAsync();
            
            if (created)
            {
                _logger.LogInformation("Database created successfully.");
            }
            else
            {
                _logger.LogInformation("Database already existed.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create database: {ErrorMessage}", ex.Message);
            throw;
        }
    }

    public async Task RunMigrationsAsync()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            _logger.LogInformation("Checking for pending migrations...");
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            
            if (pendingMigrations.Any())
            {
                _logger.LogInformation("Found {MigrationCount} pending migrations. Applying...", pendingMigrations.Count());
                foreach (var migration in pendingMigrations)
                {
                    _logger.LogInformation("Pending migration: {MigrationName}", migration);
                }
                
                await context.Database.MigrateAsync();
                _logger.LogInformation("All migrations applied successfully.");
            }
            else
            {
                _logger.LogInformation("No pending migrations found. Database is up to date.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to run migrations: {ErrorMessage}", ex.Message);
            throw;
        }
    }

    public async Task SeedDataAsync(bool forceReseed = false)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordHashingService>();
            var counterService = scope.ServiceProvider.GetRequiredService<ICounterService>();
            
            _logger.LogInformation("Starting data seeding process...");
            
            var seeder = new DataSeeder(context, passwordService, counterService);
            await seeder.SeedAsync(forceReseed);
            
            _logger.LogInformation("Data seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to seed data: {ErrorMessage}", ex.Message);
            throw;
        }
    }
}
