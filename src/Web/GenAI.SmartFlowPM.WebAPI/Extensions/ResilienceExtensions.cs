using Microsoft.Extensions.Http.Resilience;
using System.Net;

namespace GenAI.SmartFlowPM.WebAPI.Extensions;

public static class ResilienceExtensions
{
    public static IServiceCollection AddResiliencePolicies(this IServiceCollection services, IConfiguration configuration)
    {
        // Add standard resilience handler
        services.AddHttpClient("SmartFlowPM.Default")
            .AddStandardResilienceHandler(options =>
            {
                // Configure retry policy
                options.Retry.MaxRetryAttempts = 3;
                options.Retry.UseJitter = true;
                options.Retry.Delay = TimeSpan.FromSeconds(1);
                
                // Configure circuit breaker
                options.CircuitBreaker.FailureRatio = 0.5;
                options.CircuitBreaker.MinimumThroughput = 3;
                options.CircuitBreaker.SamplingDuration = TimeSpan.FromSeconds(60); // Must be at least double the attempt timeout
                options.CircuitBreaker.BreakDuration = TimeSpan.FromSeconds(30);
                
                // Configure timeout
                options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(30);
                options.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(120);
            });

        // Add named HTTP client for external APIs
        services.AddHttpClient("SmartFlowPM.ExternalAPI", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "SmartFlowPM/1.0");
        })
        .AddStandardResilienceHandler();

        // Add named HTTP client for database health checks
        services.AddHttpClient("SmartFlowPM.HealthCheck", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(10);
        })
        .AddStandardResilienceHandler(options =>
        {
            options.Retry.MaxRetryAttempts = 2;
            options.Retry.Delay = TimeSpan.FromMilliseconds(500);
        });

        return services;
    }
}
