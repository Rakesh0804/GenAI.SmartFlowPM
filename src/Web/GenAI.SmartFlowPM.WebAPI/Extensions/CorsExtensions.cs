namespace GenAI.SmartFlowPM.WebAPI.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddSmartFlowCors(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services.AddCors(options =>
        {
            // Development policy - more permissive
            options.AddPolicy("Development", policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                {
                    if (string.IsNullOrEmpty(origin)) return false;
                    
                    var uri = new Uri(origin);
                    var isLocalhost = uri.Host == "localhost" || uri.Host == "127.0.0.1";
                    var isNextJsPort = uri.Port == 3000 || uri.Port == 3001 || uri.Port == 3002;
                    var isAspirePort = uri.Port == 17057; // Aspire dashboard
                    
                    return isLocalhost && (isNextJsPort || isAspirePort);
                })
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("x-total-count", "x-pagination", "x-request-id")
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
            });

            // Production policy - more restrictive
            options.AddPolicy("Production", policy =>
            {
                var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                    ?? new[] { "https://smartflowpm.com", "https://app.smartflowpm.com" };
                
                policy.WithOrigins(allowedOrigins)
                    .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .WithHeaders("Authorization", "Content-Type", "Accept", "Origin", "x-tenant-id")
                    .AllowCredentials()
                    .WithExposedHeaders("x-total-count", "x-pagination", "x-request-id")
                    .SetPreflightMaxAge(TimeSpan.FromHours(1));
            });

            // Health checks policy - minimal CORS for health endpoints
            options.AddPolicy("HealthChecks", policy =>
            {
                policy.AllowAnyOrigin()
                    .WithMethods("GET")
                    .WithHeaders("Accept");
            });

            // Default policy based on environment
            if (environment.IsDevelopment())
            {
                options.DefaultPolicyName = "Development";
            }
            else
            {
                options.DefaultPolicyName = "Production";
            }
        });

        return services;
    }

    public static void UseSmartFlowCors(this IApplicationBuilder app, IHostEnvironment environment)
    {
        if (environment.IsDevelopment())
        {
            app.UseCors("Development");
        }
        else
        {
            app.UseCors("Production");
        }
    }
}
