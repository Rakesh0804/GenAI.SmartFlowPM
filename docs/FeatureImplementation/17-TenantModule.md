# Tenant Module Implementation

## Overview
The Tenant Module implements multi-tenancy for the GenAI.SmartFlowPM application, allowing multiple organizations to use the same application instance while maintaining complete data isolation.

## Architecture

### Multi-Tenant Strategy
- **Shared Database with Tenant ID**: All tenant data is stored in the same database with a `TenantId` column for data isolation
- **Row-Level Security**: Each entity includes a `TenantId` foreign key to ensure data segregation
- **Tenant Context**: All operations are scoped to the current tenant context

### Core Components

#### Domain Layer
- **Tenant Entity**: Core tenant information and settings
- **TenantBaseEntity**: Base class for all tenant-specific entities
- **ITenantRepository**: Repository interface for tenant operations

#### Application Layer
- **Tenant DTOs**: Data transfer objects for tenant operations
- **Tenant Commands**: CQRS commands for tenant management
- **Tenant Queries**: CQRS queries for tenant data retrieval
- **Tenant Handlers**: Command and query handlers

#### Infrastructure Layer
- **TenantRepository**: Implementation of tenant data access
- **TenantConfiguration**: Entity Framework configuration
- **Multi-tenant DbContext**: Database context with tenant filtering

#### Presentation Layer
- **TenantsController**: RESTful API endpoints for tenant management

## Database Schema

### Tenant Table
```sql
CREATE TABLE "Tenants" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "SubDomain" character varying(100),
    "Description" character varying(500),
    "ContactEmail" character varying(255) NOT NULL,
    "ContactPhone" character varying(15),
    "Address" character varying(500),
    "City" character varying(100),
    "State" character varying(100),
    "PostalCode" character varying(20),
    "Country" character varying(100),
    "IsActive" boolean NOT NULL,
    "SubscriptionStartDate" timestamp with time zone,
    "SubscriptionEndDate" timestamp with time zone,
    "SubscriptionPlan" character varying(50),
    "MaxUsers" integer NOT NULL,
    "MaxProjects" integer NOT NULL,
    "TimeZone" character varying(3),
    "Currency" character varying(3),
    "LogoUrl" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "CreatedBy" text,
    "UpdatedBy" text,
    "IsDeleted" boolean NOT NULL,
    "DeletedAt" timestamp with time zone,
    "DeletedBy" text,
    CONSTRAINT "PK_Tenants" PRIMARY KEY ("Id")
);
```

### Multi-Tenant Entities
All entities now inherit from `TenantBaseEntity` and include:
- `TenantId` (Guid): Foreign key to Tenant table
- Tenant navigation property

**Affected Tables:**
- Users (also added `HasReportee` boolean field)
- Roles
- Claims
- Projects
- ProjectTasks
- Organizations
- Branches
- Counters
- CompanyHolidays
- OrganizationPolicies
- OrganizationSettings
- UserRoles (junction table)
- UserClaims (junction table)
- UserProjects (junction table)

### Indexes and Constraints
- **Unique Constraints**: SubDomain and ContactEmail (with soft delete filter)
- **Foreign Key Constraints**: All tenant entities reference Tenants table
- **Performance Indexes**: TenantId indexes on all multi-tenant tables

## API Endpoints

### Tenant Management
```
GET    /api/tenants                    - Get paginated list of tenants
GET    /api/tenants/active             - Get active tenants summary
GET    /api/tenants/{id}               - Get tenant by ID
GET    /api/tenants/subdomain/{domain} - Get tenant by subdomain
GET    /api/tenants/search             - Search tenants
POST   /api/tenants                    - Create new tenant
PUT    /api/tenants/{id}               - Update tenant
DELETE /api/tenants/{id}               - Soft delete tenant
PATCH  /api/tenants/{id}/activate      - Activate tenant
PATCH  /api/tenants/{id}/deactivate    - Deactivate tenant
```

## Features Implemented

### Core Tenant Features
- ✅ Tenant CRUD operations
- ✅ Subdomain-based tenant identification
- ✅ Tenant activation/deactivation
- ✅ Subscription management (plan, dates, limits)
- ✅ Tenant search and filtering
- ✅ Data validation and business rules

### Multi-Tenancy Features
- ✅ Complete data isolation per tenant
- ✅ Tenant-scoped repositories
- ✅ Foreign key relationships maintained
- ✅ Soft delete support
- ✅ Performance optimizations with indexes

### User Management Enhancement
- ✅ Added `HasReportee` boolean field to User entity
- ✅ Users are scoped to tenants
- ✅ Manager-subordinate relationships within tenant

## Business Rules

### Tenant Creation
- Unique subdomain across all active tenants
- Unique contact email across all active tenants
- Default subscription limits (10 users, 5 projects)
- Automatic activation upon creation

### Tenant Deletion
- Soft delete only (preserves audit trail)
- Cannot delete tenant with active users
- Cascade relationships maintained for data integrity

### Subscription Limits
- MaxUsers: Maximum number of users per tenant
- MaxProjects: Maximum number of projects per tenant
- Subscription dates: Track subscription validity

## Data Access Patterns

### Repository Pattern
```csharp
public interface ITenantRepository : IGenericRepository<Tenant>
{
    Task<Tenant?> GetBySubDomainAsync(string subDomain, CancellationToken cancellationToken = default);
    Task<bool> IsSubDomainExistsAsync(string subDomain, Guid? excludeTenantId = null, CancellationToken cancellationToken = default);
    Task<bool> IsContactEmailExistsAsync(string contactEmail, Guid? excludeTenantId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Tenant>> GetActiveTenantsAsync(CancellationToken cancellationToken = default);
}
```

### CQRS Pattern
- **Commands**: CreateTenant, UpdateTenant, DeleteTenant, ActivateTenant, DeactivateTenant
- **Queries**: GetTenantById, GetTenantBySubDomain, GetAllTenants, GetActiveTenants, SearchTenants

## Migration Information

### Migration: AddTenantModuleAndMultiTenancy
**Date**: 2025-08-12
**Description**: Adds complete multi-tenant support

**Changes**:
1. Created Tenants table with full schema
2. Added TenantId column to all relevant entities
3. Added HasReportee column to Users table
4. Created foreign key relationships
5. Added performance indexes
6. Added unique constraints for subdomain and email

## Security Considerations

### Data Isolation
- All queries automatically filtered by TenantId
- Foreign key constraints prevent cross-tenant data access
- Soft delete preserves data integrity

### Tenant Context
- Tenant identification via subdomain or context
- All operations scoped to current tenant
- No cross-tenant data visibility

## Performance Optimizations

### Database Indexes
- TenantId indexes on all multi-tenant tables
- Composite indexes for common query patterns
- Unique indexes for business constraints

### Query Optimization
- Automatic tenant filtering at repository level
- Pagination support for large datasets
- Optimized search queries

## Future Enhancements

### Planned Features
- [ ] Tenant-specific themes and branding
- [ ] Advanced subscription management
- [ ] Tenant analytics and reporting
- [ ] Multi-database tenancy option
- [ ] Tenant data export/import
- [ ] Custom tenant configurations

### Scalability Considerations
- [ ] Database sharding for large tenant bases
- [ ] Caching strategies for tenant data
- [ ] Background job processing per tenant
- [ ] Tenant-specific rate limiting

## Testing Strategy

### Unit Tests
- Tenant entity validation
- Repository operations
- Command/query handlers
- Business rule validation

### Integration Tests
- API endpoint testing
- Database operations
- Multi-tenant data isolation
- Subscription limit enforcement

### End-to-End Tests
- Complete tenant lifecycle
- Cross-tenant isolation verification
- Subscription management flows
- User management within tenants

## Deployment Considerations

### Database Migration
```bash
# Apply the migration
dotnet ef database update --startup-project src/Web/GenAI.SmartFlowPM.WebAPI

# Verify migration
dotnet ef migrations list --startup-project src/Web/GenAI.SmartFlowPM.WebAPI
```

### Configuration
- Update connection strings if needed
- Configure tenant identification strategy
- Set up monitoring for tenant operations
- Configure backup strategies for multi-tenant data

## Related Documentation
- [User Module](01-UserModule.md) - Updated for multi-tenancy
- [Organization Module](07-OrganizationModule.md) - Tenant-scoped organizations
- [Project Architecture Overview](../Architecture/Project-Architecture-Overview.md)
