namespace GenAI.SmartFlowPM.Domain.Interfaces.Services;

public interface IPasswordHashingService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
}

public interface IJwtTokenService
{
    string GenerateToken(string userId, string tenantId, string email, string userName, IEnumerable<string> roles);
    string GenerateRefreshToken(string userId, string tenantId, string email, string userName, IEnumerable<string> roles);
    bool ValidateToken(string token);
    string? GetUserIdFromToken(string token);
}

public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    string? Email { get; }
    string? TenantId { get; }
    bool IsAuthenticated { get; }
}
