# Aspire Integration Guide

## Overview
The SmartFlowPM project now includes full .NET Aspire integration, orchestrating both the backend API and Next.js frontend as a unified distributed application.

## Architecture

```
SmartFlowPM Aspire Application
├── PostgreSQL Database (postgres)
│   └── SmartFlowPMDB
├── Backend API (api)
│   ├── ASP.NET Core Web API
│   ├── Connected to PostgreSQL
│   └── Runs on auto-assigned port
└── Frontend UI (frontend)
    ├── Next.js Application
    ├── Connected to Backend API
    └── Runs on auto-assigned port
```

## Services Configuration

### Database Service
- **Name**: `postgres`
- **Type**: PostgreSQL container
- **Database**: `SmartFlowPMDB`
- **Features**: Data volume persistence

### API Service
- **Name**: `api`
- **Type**: .NET Project
- **Project**: `GenAI.SmartFlowPM.WebAPI`
- **Dependencies**: PostgreSQL database
- **Features**: Service discovery, health checks

### Frontend Service
- **Name**: `frontend`
- **Type**: npm Application
- **Path**: `../src/Web/GenAI.SmartFlowPM.UI`
- **Dependencies**: Backend API
- **Features**: 
  - Docker containerization support
  - Service discovery for API endpoints
  - External HTTP endpoints
  - Standalone output for production

## Running the Application

### Prerequisites
- .NET 9 SDK
- Docker Desktop (for PostgreSQL)
- Node.js 18+ (for npm applications)

### Start Complete Application
```bash
cd SmartFlowPM.AppHost
dotnet run
```

This will:
1. Start PostgreSQL container
2. Run database migrations
3. Start the .NET API
4. Start the Next.js frontend
5. Open Aspire Dashboard

### Aspire Dashboard
- **URL**: https://localhost:17057
- **Features**:
  - Service status monitoring
  - Logs aggregation
  - Metrics and traces
  - Service endpoint discovery

## Service Discovery

### API Endpoints
The frontend automatically discovers the API service through Aspire's service discovery:

```typescript
// API client automatically resolves to:
// - process.env.services__api__https__0 (Aspire HTTPS)
// - process.env.services__api__http__0 (Aspire HTTP)
// - Fallback to configured URL
```

### Environment Variables
Aspire automatically provides service endpoints:
- `services__api__https__0`: API HTTPS endpoint
- `services__api__http__0`: API HTTP endpoint
- `ConnectionStrings__SmartFlowPMDB`: Database connection

## Docker Support

### Frontend Dockerfile
The Next.js application includes a multi-stage Dockerfile:
- **Development**: Full Node.js environment
- **Production**: Optimized Alpine Linux image
- **Features**: Standalone output, non-root user, minimal attack surface

### Container Configuration
```yaml
# Frontend container specifications
- Base Image: node:18-alpine
- Port: 3000
- Output: Standalone Next.js
- User: nextjs (non-root)
- Environment: Production optimized
```

## Development Workflow

### Local Development
```bash
# Start individual services
cd src/Web/GenAI.SmartFlowPM.WebAPI
dotnet run

cd src/Web/GenAI.SmartFlowPM.UI
npm run dev
```

### Aspire Development
```bash
# Start all services through Aspire
cd SmartFlowPM.AppHost
dotnet run
```

### Production Deployment
The application is configured for:
- **Container orchestration** (Docker Compose, Kubernetes)
- **Cloud deployment** (Azure Container Apps, AWS ECS)
- **Service mesh integration** (Istio, Linkerd)

## Monitoring & Observability

### Built-in Features
- **Health Checks**: All services expose health endpoints
- **Distributed Tracing**: OpenTelemetry integration
- **Metrics Collection**: Prometheus-compatible metrics
- **Structured Logging**: JSON logging with correlation IDs

### Dashboard Features
- Real-time service status
- Log aggregation and filtering
- Performance metrics
- Resource utilization
- Service dependency graph

## Configuration

### AppHost Configuration
```csharp
// Program.cs - Environment-aware service definition
var postgres = builder.AddPostgres("postgres").WithDataVolume();
var projectDb = postgres.AddDatabase("SmartFlowPMDB");

var apiService = builder.AddProject<Projects.GenAI_SmartFlowPM_WebAPI>("api")
    .WithReference(projectDb);

// Automatic environment detection for development vs production
var isDevelopment = builder.Environment.EnvironmentName == "Development";
var frontend = builder.AddNpmApp("frontend", "../src/Web/GenAI.SmartFlowPM.UI", isDevelopment ? "dev" : "start")
    .WithReference(apiService)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("NODE_ENV", isDevelopment ? "development" : "production");

// Add Docker publishing for production
if (!isDevelopment)
{
    frontend.PublishAsDockerFile();
}
```

### Frontend Configuration
```javascript
// next.config.js - Aspire optimizations
const nextConfig = {
  output: 'standalone', // For containerization
  // ... other configurations
};
```

## Troubleshooting

### Common Issues

1. **NODE_ENV Warnings**: Ensure Aspire is configured with environment-aware settings (development mode uses "dev" script)
2. **Production Build Errors**: For development, use "dev" script; for production, run `npm run build` first
3. **Port Conflicts**: Aspire auto-assigns ports to avoid conflicts
4. **Service Discovery**: Check dashboard for service endpoints
5. **Database Connection**: Verify PostgreSQL container is running
6. **Frontend API Calls**: Ensure service references are configured

### Debug Commands
```bash
# Check service status
docker ps

# View Aspire logs
# Check dashboard at https://localhost:17057

# Manual service testing
curl http://localhost:{api-port}/health
curl http://localhost:{frontend-port}
```

## Security Considerations

### Production Checklist
- [ ] Enable HTTPS for all services
- [ ] Configure proper CORS policies
- [ ] Set up authentication certificates
- [ ] Enable container scanning
- [ ] Configure network policies
- [ ] Set up secrets management

### Development Security
- Container runs as non-root user
- Minimal base images (Alpine Linux)
- No sensitive data in environment variables
- Proper service isolation

## Next Steps

1. **Add more services** (Redis cache, message queue)
2. **Configure CI/CD** pipeline integration
3. **Set up monitoring** (Application Insights, Grafana)
4. **Implement** blue-green deployments
5. **Add** integration tests with TestContainers

The application is now fully integrated with .NET Aspire and ready for modern cloud-native deployment patterns.
