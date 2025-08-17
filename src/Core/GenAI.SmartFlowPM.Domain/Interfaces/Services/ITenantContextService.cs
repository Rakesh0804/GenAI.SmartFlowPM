namespace GenAI.SmartFlowPM.Domain.Interfaces.Services;

public interface ITenantContextService
{
    Guid GetCurrentTenantId();
    string? GetCurrentUserId();
}
