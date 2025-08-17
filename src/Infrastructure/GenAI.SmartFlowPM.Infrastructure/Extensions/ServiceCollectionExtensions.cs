using Microsoft.Extensions.DependencyInjection;
using GenAI.SmartFlowPM.Infrastructure.Services;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;

namespace GenAI.SmartFlowPM.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // Add services
        services.AddScoped<Domain.Interfaces.Services.IJwtTokenService, JwtTokenService>();
        services.AddScoped<Domain.Interfaces.Services.IPasswordHashingService, PasswordHashingService>();
        services.AddScoped<Domain.Interfaces.Services.ICurrentUserService, CurrentUserService>();
        services.AddScoped<Domain.Interfaces.Services.ITenantContextService, TenantContextService>();

        return services;
    }
}
