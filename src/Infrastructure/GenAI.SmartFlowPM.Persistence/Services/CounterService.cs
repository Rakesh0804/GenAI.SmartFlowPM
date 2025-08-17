using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GenAI.SmartFlowPM.Persistence.Services;

public class CounterService : ICounterService
{
    private readonly ApplicationDbContext _context;
    private readonly object _lockObject = new object();

    public CounterService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateTaskNumberAsync(string acronym, Guid tenantId)
    {
        var counterName = $"Task_{acronym}";
        var nextValue = await GetNextCounterValueAsync(counterName, tenantId);
        
        // Format: ACRONYM-000001 (minimum 6 digits with trailing zeros)
        return $"{acronym}-{nextValue:D6}";
    }

    public Task<int> GetNextCounterValueAsync(string counterName, Guid tenantId)
    {
        // Use lock to ensure thread safety
        lock (_lockObject)
        {
            var counter = _context.Counters.FirstOrDefault(c => c.Name == counterName && c.TenantId == tenantId);
            
            if (counter == null)
            {
                // Create new counter starting from 1
                counter = new Counter
                {
                    Id = Guid.NewGuid(),
                    Name = counterName,
                    CurrentValue = 1,
                    Description = $"Counter for {counterName}",
                    TenantId = tenantId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                };
                _context.Counters.Add(counter);
            }
            else
            {
                // Increment existing counter
                counter.CurrentValue++;
                counter.UpdatedAt = DateTime.UtcNow;
                counter.UpdatedBy = "System";
            }

            _context.SaveChanges();
            return Task.FromResult(counter.CurrentValue);
        }
    }

    public async Task ResetCounterAsync(string counterName, Guid tenantId)
    {
        var counter = await _context.Counters.FirstOrDefaultAsync(c => c.Name == counterName && c.TenantId == tenantId);
        if (counter != null)
        {
            counter.CurrentValue = 0;
            counter.UpdatedAt = DateTime.UtcNow;
            counter.UpdatedBy = "System";
            await _context.SaveChangesAsync();
        }
    }
}
