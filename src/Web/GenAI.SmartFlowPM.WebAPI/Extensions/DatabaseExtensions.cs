using GenAI.SmartFlowPM.Persistence.Services;

namespace GenAI.SmartFlowPM.WebAPI.Extensions;

public static class DatabaseExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        
        try
        {
            logger.LogInformation("Starting database initialization...");
            
            var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializationService>();
            await databaseInitializer.InitializeAsync();
            
            logger.LogInformation("Database initialization completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database initialization: {ErrorMessage}", ex.Message);
            
            // Don't let the application start if database initialization fails
            throw new InvalidOperationException("Database initialization failed. Please check the logs for more details.", ex);
        }
    }
}
