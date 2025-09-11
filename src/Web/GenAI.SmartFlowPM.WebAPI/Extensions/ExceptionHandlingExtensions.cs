using GenAI.SmartFlowPM.WebAPI.Filters;
using GenAI.SmartFlowPM.WebAPI.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace GenAI.SmartFlowPM.WebAPI.Extensions;

/// <summary>
/// Extension methods for configuring global exception handling
/// </summary>
public static class ExceptionHandlingExtensions
{
    /// <summary>
    /// Adds global exception handling services to the service collection
    /// </summary>
    public static IServiceCollection AddGlobalExceptionHandling(this IServiceCollection services)
    {
        // Add exception filter
        services.AddScoped<GlobalExceptionFilter>();

        // Configure MVC options to include the global exception filter
        services.Configure<MvcOptions>(options =>
        {
            options.Filters.Add<GlobalExceptionFilter>();
        });

        // Configure Problem Details
        services.AddProblemDetails(options =>
        {
            // Customize problem details behavior if needed
            options.CustomizeProblemDetails = context =>
            {
                // Add correlation ID to all problem details
                var correlationId = context.HttpContext.Request.Headers["X-Correlation-ID"].FirstOrDefault()
                    ?? System.Diagnostics.Activity.Current?.Id
                    ?? Guid.NewGuid().ToString("N")[..8];

                context.ProblemDetails.Extensions["correlationId"] = correlationId;
                context.ProblemDetails.Extensions["timestamp"] = DateTime.UtcNow;
                context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";

                // Add development-specific information
                if (context.HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
                {
                    context.ProblemDetails.Extensions["requestId"] = context.HttpContext.TraceIdentifier;
                }
            };
        });

        return services;
    }

    /// <summary>
    /// Adds the global exception handling middleware to the application pipeline
    /// </summary>
    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
    }

    /// <summary>
    /// Adds comprehensive exception handling including both middleware and filters
    /// </summary>
    public static WebApplication UseComprehensiveExceptionHandling(this WebApplication app)
    {
        // Add the global exception handling middleware early in the pipeline
        app.UseGlobalExceptionHandling();

        // Use problem details for additional error handling
        app.UseStatusCodePages();

        return app;
    }
}
