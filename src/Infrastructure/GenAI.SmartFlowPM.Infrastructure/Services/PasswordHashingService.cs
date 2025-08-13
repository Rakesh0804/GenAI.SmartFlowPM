using BCrypt.Net;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;

namespace GenAI.SmartFlowPM.Infrastructure.Services;

public class PasswordHashingService : IPasswordHashingService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt());
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
