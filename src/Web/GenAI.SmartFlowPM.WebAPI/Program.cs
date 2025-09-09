using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using GenAI.SmartFlowPM.Application.Extensions;
using GenAI.SmartFlowPM.Infrastructure.Extensions;
using GenAI.SmartFlowPM.Persistence.Extensions;
using GenAI.SmartFlowPM.WebAPI.Extensions;
using GenAI.SmartFlowPM.WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Aspire service defaults (this configures OpenTelemetry for Aspire)
builder.AddServiceDefaults();
builder.Services.AddControllers();

// Add HttpContextAccessor for tenant context service
builder.Services.AddHttpContextAccessor();

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Add custom services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices();
builder.Services.AddPersistenceServices(builder.Configuration);

// Add custom observability for EF Core (ServiceDefaults handles basic OpenTelemetry)
builder.Services.AddCustomObservability(builder.Configuration);

// Add Resilience Policies and Named HTTP Clients
builder.Services.AddResiliencePolicies(builder.Configuration);

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "ProjectManagementAPI",
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"] ?? "ProjectManagementClient",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    // Add debugging for JWT authentication failures
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"JWT Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("JWT Token validated successfully");
            var claims = context.Principal?.Claims?.Select(c => $"{c.Type}: {c.Value}") ?? new List<string>();
            Console.WriteLine($"Token claims: {string.Join(", ", claims)}");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine($"JWT Challenge: {context.Error}, {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Add CORS with comprehensive policies
builder.Services.AddSmartFlowCors(builder.Configuration, builder.Environment);

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Project Management API",
        Version = "v1",
        Description = "A comprehensive Project Management API with Clean Architecture"
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add Comprehensive Health Checks
builder.Services.AddComprehensiveHealthChecks(builder.Configuration);

// Add Database Management Service for CLI operations
builder.Services.AddHostedService<DatabaseManagementService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Project Management API V1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

// Only use HTTPS redirection in production to avoid CORS preflight issues in development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseSmartFlowCors(app.Environment);

app.UseAuthentication();
app.UseAuthorization();

// Map Aspire default endpoints (health checks)
app.MapDefaultEndpoints();

// Map comprehensive health check endpoints
app.MapComprehensiveHealthChecks();

app.MapControllers();

// Initialize database (check, create, migrate, seed)
await app.InitializeDatabaseAsync();

app.Run();
