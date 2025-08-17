using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;

namespace GenAI.SmartFlowPM.Infrastructure.Services;

public class TenantContextService : ITenantContextService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantContextService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetCurrentTenantId()
    {
        var tenantIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("TenantId")?.Value;
        
        if (Guid.TryParse(tenantIdClaim, out var tenantId))
        {
            return tenantId;
        }

        // Fallback: try to get from default seeded tenant if no valid tenant ID found
        // This should not happen in production, but helps with development
        throw new UnauthorizedAccessException("No valid tenant ID found in current context");
    }

    public string? GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                         _httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value;
        
        return userIdClaim;
    }
}
