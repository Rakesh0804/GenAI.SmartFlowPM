using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Seeders;

public class DataSeeder
{
    private readonly ComprehensiveDataSeeder _comprehensiveSeeder;

    public DataSeeder(ApplicationDbContext context, IPasswordHashingService passwordHashingService, ICounterService counterService)
    {
        _comprehensiveSeeder = new ComprehensiveDataSeeder(context, passwordHashingService, counterService);
    }

    public async Task SeedAsync(bool forceReseed = false)
    {
        try
        {
            Console.WriteLine("Starting comprehensive data seeding...");
            await _comprehensiveSeeder.SeedAllEntitiesAsync(forceReseed);
            Console.WriteLine("Comprehensive data seeding completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during data seeding: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }
}
