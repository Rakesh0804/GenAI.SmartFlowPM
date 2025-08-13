namespace GenAI.SmartFlowPM.Domain.Interfaces.Services;

public interface ICounterService
{
    Task<string> GenerateTaskNumberAsync(string acronym);
    Task<int> GetNextCounterValueAsync(string counterName);
    Task ResetCounterAsync(string counterName);
}
