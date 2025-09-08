using System.Diagnostics;
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace GenAI.SmartFlowPM.WebAPI.Extensions;

public static class ObservabilityExtensions
{
    private static readonly ActivitySource ActivitySource = new("SmartFlowPM.WebAPI");
    
    public static IServiceCollection AddCustomObservability(this IServiceCollection services, IConfiguration configuration)
    {
        // Add custom instrumentation for EF Core that ServiceDefaults doesn't include
        services.AddOpenTelemetry()
            .WithTracing(tracing =>
            {
                tracing
                    .AddSource(ActivitySource.Name)
                    .AddEntityFrameworkCoreInstrumentation(options =>
                    {
                        options.SetDbStatementForText = true;
                        options.SetDbStatementForStoredProcedure = true;
                        options.Filter = (activityName, command) =>
                        {
                            // Skip health check queries to reduce noise
                            return !command.CommandText.Contains("INFORMATION_SCHEMA") &&
                                   !command.CommandText.Contains("pg_stat");
                        };
                        options.EnrichWithIDbCommand = (activity, command) =>
                        {
                            var stateDisplayName = $"{command.CommandType} {command.CommandText}";
                            activity.DisplayName = stateDisplayName;
                            activity.SetTag("db.operation.name", stateDisplayName);
                            activity.SetTag("db.statement", command.CommandText);
                            
                            // Add parameter information for better debugging
                            if (command.Parameters.Count > 0)
                            {
                                var parameters = string.Join(", ", 
                                    command.Parameters.Cast<System.Data.Common.DbParameter>()
                                        .Select(p => $"{p.ParameterName}={p.Value}"));
                                activity.SetTag("db.parameters", parameters);
                            }
                        };
                    });
            });

        // Register ActivitySource as singleton
        services.AddSingleton(ActivitySource);

        return services;
    }

    public static IServiceCollection AddObservability(this IServiceCollection services, IConfiguration configuration)
    {
        var serviceName = configuration["OTEL_SERVICE_NAME"] ?? "SmartFlowPM.WebAPI";
        var serviceVersion = configuration["OTEL_SERVICE_VERSION"] ?? "1.0.0";
        
        // Add OpenTelemetry
        services.AddOpenTelemetry()
            .ConfigureResource(resource =>
                resource.AddService(
                    serviceName: serviceName,
                    serviceVersion: serviceVersion,
                    serviceInstanceId: Environment.MachineName))
            .WithTracing(tracing =>
            {
                tracing
                    .AddSource(ActivitySource.Name)
                    .AddAspNetCoreInstrumentation(options =>
                    {
                        options.RecordException = true;
                        options.Filter = (httpContext) =>
                        {
                            // Don't trace health check endpoints to reduce noise
                            return !httpContext.Request.Path.StartsWithSegments("/health");
                        };
                        options.EnrichWithHttpRequest = (activity, httpRequest) =>
                        {
                            activity.SetTag("http.request.body.size", httpRequest.ContentLength);
                            activity.SetTag("http.request.headers.user-agent", httpRequest.Headers.UserAgent.ToString());
                        };
                        options.EnrichWithHttpResponse = (activity, httpResponse) =>
                        {
                            activity.SetTag("http.response.body.size", httpResponse.ContentLength);
                        };
                        options.EnrichWithException = (activity, exception) =>
                        {
                            activity.SetTag("exception.type", exception.GetType().Name);
                            activity.SetTag("exception.message", exception.Message);
                            activity.SetTag("exception.stacktrace", exception.StackTrace);
                        };
                    })
                    .AddHttpClientInstrumentation(options =>
                    {
                        options.RecordException = true;
                        options.EnrichWithHttpRequestMessage = (activity, httpRequestMessage) =>
                        {
                            activity.SetTag("http.request.method", httpRequestMessage.Method.Method);
                            activity.SetTag("http.request.uri", httpRequestMessage.RequestUri?.ToString());
                        };
                        options.EnrichWithHttpResponseMessage = (activity, httpResponseMessage) =>
                        {
                            activity.SetTag("http.response.status_code", (int)httpResponseMessage.StatusCode);
                            activity.SetTag("http.response.content.type", httpResponseMessage.Content.Headers.ContentType?.ToString());
                        };
                        options.EnrichWithException = (activity, exception) =>
                        {
                            activity.SetTag("exception.type", exception.GetType().Name);
                            activity.SetTag("exception.message", exception.Message);
                        };
                    })
                    .AddEntityFrameworkCoreInstrumentation(options =>
                    {
                        options.SetDbStatementForText = true;
                        options.SetDbStatementForStoredProcedure = true;
                        options.Filter = (activityName, command) =>
                        {
                            // Skip health check queries to reduce noise
                            return !command.CommandText.Contains("INFORMATION_SCHEMA") &&
                                   !command.CommandText.Contains("pg_stat");
                        };
                        options.EnrichWithIDbCommand = (activity, command) =>
                        {
                            var stateDisplayName = $"{command.CommandType} {command.CommandText}";
                            activity.DisplayName = stateDisplayName;
                            activity.SetTag("db.operation.name", stateDisplayName);
                            activity.SetTag("db.statement", command.CommandText);
                            activity.SetTag("db.connection_string", command.Connection?.ConnectionString);
                            
                            // Add parameter information for better debugging
                            if (command.Parameters.Count > 0)
                            {
                                var parameters = string.Join(", ", 
                                    command.Parameters.Cast<System.Data.Common.DbParameter>()
                                        .Select(p => $"{p.ParameterName}={p.Value}"));
                                activity.SetTag("db.parameters", parameters);
                            }
                        };
                    });

                // Add Console exporter for development (Aspire dashboard visibility)
                // Only enable console tracing if specifically configured
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" &&
                    configuration.GetValue<bool>("Observability:EnableConsoleTracing", true))
                {
                    tracing.AddConsoleExporter();
                }

                // Always add OTLP exporter for Aspire
                tracing.AddOtlpExporter();
            })
            .WithMetrics(metrics =>
            {
                metrics
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation();
                
                // Only add runtime and process metrics if specifically needed
                // These generate a lot of noise but are useful for performance monitoring
                if (configuration.GetValue<bool>("Observability:EnableRuntimeMetrics", false))
                {
                    metrics.AddRuntimeInstrumentation();
                    metrics.AddProcessInstrumentation();
                }

                // Only add Console exporter for metrics in specific debug scenarios
                // Comment out the console exporter for metrics to reduce noise
                // if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
                // {
                //     metrics.AddConsoleExporter();
                // }

                // Add OTLP exporter for Aspire dashboard (always enabled)
                metrics.AddOtlpExporter();
            });

        // Register ActivitySource as singleton
        services.AddSingleton(ActivitySource);

        return services;
    }

    public static Activity? StartActivity(string name)
    {
        return ActivitySource.StartActivity(name);
    }

    public static void EnrichActivity(this Activity? activity, string key, object? value)
    {
        activity?.SetTag(key, value?.ToString());
    }
}
