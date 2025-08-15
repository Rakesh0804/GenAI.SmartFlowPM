namespace GenAI.SmartFlowPM.Domain.Interfaces.Services;

public interface ICounterService
{
    Task<string> GenerateTaskNumberAsync(string acronym, Guid tenantId);
    Task<int> GetNextCounterValueAsync(string counterName, Guid tenantId);
    Task ResetCounterAsync(string counterName, Guid tenantId);
}
