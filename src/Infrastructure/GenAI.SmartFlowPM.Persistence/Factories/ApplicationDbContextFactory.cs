using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Factories;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // Build configuration to read from appsettings files
        var webApiPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "Web", "GenAI.SmartFlowPM.WebAPI");
        
        var configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(webApiPath, "appsettings.json"), optional: false)
            .AddJsonFile(Path.Combine(webApiPath, "appsettings.Development.json"), optional: true)
            .Build();

        // Get connection string from configuration
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        if (string.IsNullOrEmpty(connectionString))
        {
            // Fallback connection string if configuration is not found
            connectionString = "Host=localhost;Database=SmartFlowPMDB;Username=postgres;Password=postgres;Port=5433";
        }

        optionsBuilder.UseNpgsql(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
