using Microsoft.Extensions.Diagnostics.HealthChecks;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using GenAI.SmartFlowPM.WebAPI.HealthChecks;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.WebAPI.Extensions;

public static class HealthCheckExtensions
{
    public static IServiceCollection AddComprehensiveHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        var healthChecksBuilder = services.AddHealthChecks();

        // Database health check
        healthChecksBuilder.AddCheck<DatabaseHealthCheck>(
            name: "database",
            failureStatus: HealthStatus.Unhealthy,
            tags: new[] { "database", "ready" });

        // PostgreSQL connection health check
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(connectionString))
        {
            healthChecksBuilder.AddNpgSql(
                connectionString,
                name: "postgresql",
                failureStatus: HealthStatus.Unhealthy,
                tags: new[] { "database", "postgresql", "ready" });
        }

        // Memory health check
        healthChecksBuilder.AddCheck<MemoryHealthCheck>(
            name: "memory",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "memory", "ready" });

        // HTTP client health checks for external dependencies
        healthChecksBuilder.AddTypeActivatedCheck<HttpHealthCheck>(
            name: "external-api-ready",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "external", "ready" },
            args: new object[] { "https://httpbin.org/status/200", "External API" });

        // Self health check
        healthChecksBuilder.AddCheck<SelfHealthCheck>(
            name: "self",
            failureStatus: HealthStatus.Unhealthy,
            tags: new[] { "self", "ready" });

        // Add Health Checks UI with PostgreSQL storage
        services.AddHealthChecksUI(opt =>
        {
            opt.SetEvaluationTimeInSeconds(10); // Check every 10 seconds
            opt.MaximumHistoryEntriesPerEndpoint(60); // Keep 60 history entries
            opt.SetApiMaxActiveRequests(1);
            
            opt.AddHealthCheckEndpoint("SmartFlowPM API", "/health");
            opt.AddHealthCheckEndpoint("SmartFlowPM Ready", "/health/ready");
            opt.AddHealthCheckEndpoint("SmartFlowPM Live", "/health/live");
        })
        .AddPostgreSqlStorage(connectionString ?? throw new InvalidOperationException("Database connection string not found"), options =>
        {
            // Suppress the pending model changes warning for Health Checks UI
            options.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        });

        return services;
    }

    public static void MapComprehensiveHealthChecks(this IEndpointRouteBuilder endpoints)
    {
        // Comprehensive health check endpoint
        endpoints.MapHealthChecks("/health", new HealthCheckOptions()
        {
            Predicate = _ => true,
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            ResultStatusCodes =
            {
                [HealthStatus.Healthy] = StatusCodes.Status200OK,
                [HealthStatus.Degraded] = StatusCodes.Status200OK,
                [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
            }
        });

        // Readiness probe (ready to serve traffic)
        endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions()
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            ResultStatusCodes =
            {
                [HealthStatus.Healthy] = StatusCodes.Status200OK,
                [HealthStatus.Degraded] = StatusCodes.Status200OK,
                [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
            }
        });

        // Liveness probe (application is running)
        endpoints.MapHealthChecks("/health/live", new HealthCheckOptions()
        {
            Predicate = check => check.Tags.Contains("self"),
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            ResultStatusCodes =
            {
                [HealthStatus.Healthy] = StatusCodes.Status200OK,
                [HealthStatus.Degraded] = StatusCodes.Status200OK,
                [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
            }
        });

        // Health Checks UI
        endpoints.MapHealthChecksUI(options =>
        {
            options.UIPath = "/health-ui";
            options.ApiPath = "/health-ui-api";
        });
    }
}

// Memory Health Check
public class MemoryHealthCheck : IHealthCheck
{
    private readonly ILogger<MemoryHealthCheck> _logger;

    public MemoryHealthCheck(ILogger<MemoryHealthCheck> logger)
    {
        _logger = logger;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var allocatedBytes = GC.GetTotalMemory(false);
        var data = new Dictionary<string, object>()
        {
            ["AllocatedBytes"] = allocatedBytes,
            ["AllocatedMB"] = allocatedBytes / 1024 / 1024,
            ["Gen0Collections"] = GC.CollectionCount(0),
            ["Gen1Collections"] = GC.CollectionCount(1),
            ["Gen2Collections"] = GC.CollectionCount(2)
        };

        var status = allocatedBytes > 100 * 1024 * 1024 // 100 MB
            ? HealthStatus.Degraded
            : HealthStatus.Healthy;

        var message = $"Memory usage: {allocatedBytes / 1024 / 1024} MB";

        return Task.FromResult(new HealthCheckResult(status, message, data: data));
    }
}

// HTTP Health Check
public class HttpHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;
    private readonly string _url;
    private readonly string _name;
    private readonly ILogger<HttpHealthCheck> _logger;

    public HttpHealthCheck(IHttpClientFactory httpClientFactory, string url, string name, ILogger<HttpHealthCheck> logger)
    {
        _httpClient = httpClientFactory.CreateClient("SmartFlowPM.HealthCheck");
        _url = url;
        _name = name;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync(_url, cancellationToken);
            
            var data = new Dictionary<string, object>()
            {
                ["Url"] = _url,
                ["StatusCode"] = (int)response.StatusCode,
                ["ResponseTime"] = DateTime.UtcNow.ToString("O")
            };

            if (response.IsSuccessStatusCode)
            {
                return HealthCheckResult.Healthy($"{_name} is healthy", data);
            }

            return HealthCheckResult.Degraded($"{_name} returned {response.StatusCode}", data: data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed for {Name} at {Url}", _name, _url);
            return HealthCheckResult.Unhealthy($"{_name} health check failed: {ex.Message}");
        }
    }
}

// Self Health Check
public class SelfHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var data = new Dictionary<string, object>()
        {
            ["MachineName"] = Environment.MachineName,
            ["ProcessId"] = Environment.ProcessId,
            ["WorkingSet"] = Environment.WorkingSet,
            ["ProcessorCount"] = Environment.ProcessorCount,
            ["TickCount"] = Environment.TickCount64
        };

        return Task.FromResult(HealthCheckResult.Healthy("Application is running", data));
    }
}
