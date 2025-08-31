using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using System.Linq;

namespace GenAI.SmartFlowPM.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string? UserName => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);

    public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

    public string? TenantId 
    {
        get
        {
            // First try to get from JWT claims
            var tenantIdFromClaims = _httpContextAccessor.HttpContext?.User?.FindFirstValue("TenantId");
            Console.WriteLine($"CurrentUserService Debug - TenantId from claims: '{tenantIdFromClaims}'");
            
            if (!string.IsNullOrEmpty(tenantIdFromClaims))
            {
                Console.WriteLine($"CurrentUserService Debug - Using tenant ID from claims: {tenantIdFromClaims}");
                return tenantIdFromClaims;
            }

            // Fallback to header
            var tenantIdFromHeader = _httpContextAccessor.HttpContext?.Request?.Headers["X-Tenant-ID"].FirstOrDefault();
            Console.WriteLine($"CurrentUserService Debug - TenantId from header: '{tenantIdFromHeader}'");
            
            if (!string.IsNullOrEmpty(tenantIdFromHeader))
            {
                Console.WriteLine($"CurrentUserService Debug - Using tenant ID from header: {tenantIdFromHeader}");
            }
            else
            {
                Console.WriteLine("CurrentUserService Debug - No tenant ID found in claims or headers");
            }
            
            return tenantIdFromHeader;
        }
    }

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
}
