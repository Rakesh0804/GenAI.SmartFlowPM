# Angular Services Restructuring

## Overview
This document outlines the restructuring of Angular services to follow a consistent naming convention and organizational structure.

## Changes Made

### 1. Service Consolidation
- **Merged duplicate User services**: Combined `user.service.ts` and `user.ts` into a single consolidated `user.service.ts`
- **Moved Organization service**: Relocated from `organizations/services/` to `core/services/`

### 2. Consistent Naming Convention
All services now follow the `.service.ts` naming pattern:

**Before:**
```
core/services/
├── auth.ts
├── error-handler.ts
├── project.ts
├── task.ts
├── user.service.ts
├── user.ts (duplicate)
└── ...

organizations/services/
└── organization.service.ts
```

**After:**
```
core/services/
├── auth.service.ts
├── error-handler.service.ts
├── organization.service.ts
├── project.service.ts
├── task.service.ts
└── user.service.ts
```

### 3. Updated Component Imports
All component imports have been updated to reference the new service locations and names:

#### Components Updated:
- `auth/login/login.ts`
- `dashboard/dashboard.ts`
- `projects/project-detail/project-detail.ts`
- `projects/project-list/project-list.ts`
- `shared/layout/layout.ts`
- `shared/navbar/navbar.ts`
- `tasks/task-form/task-form.ts`
- `tasks/task-list/task-list.ts`
- `users/user-detail/user-detail.component.ts`
- `users/user-form/user-form.component.ts`
- `users/user-list/user-list.component.ts`
- `organizations/components/organization-dashboard/organization-dashboard.component.ts`
- `organizations/components/branch-list/branch-list.component.ts`

#### Import Pattern Changes:
```typescript
// Old imports
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { OrganizationService } from '../../services/organization.service';

// New imports
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { OrganizationService } from '../../../core/services/organization.service';
```

### 4. Enhanced User Service
The consolidated UserService now includes:
- **Proper authentication headers** via AuthService integration
- **Configuration-based API URLs** via AppConfigService
- **Both paginated and non-paginated methods**:
  - `getUsers()` - For paginated user lists
  - `getAllUsersForDropdown()` - For dropdown selections
- **Complete CRUD operations**
- **Manager relationship support**

### 5. Service Dependencies
All services now properly inject dependencies:
- **AuthService**: For authentication tokens
- **AppConfigService**: For dynamic API URL configuration
- **HttpClient**: For HTTP operations

## Benefits

### 1. Consistency
- Uniform naming convention across all services
- Predictable file locations
- Standardized import patterns

### 2. Maintainability
- Single source of truth for each service type
- Centralized service location in `core/services/`
- Easier navigation and debugging

### 3. Scalability
- Clear organizational structure
- Easy to add new services
- Consistent patterns for future development

### 4. Developer Experience
- Reduced confusion from duplicate services
- Clear service responsibilities
- Better IDE autocomplete and navigation

## Migration Guide

### For New Components
Always import services from `core/services/` with the `.service.ts` pattern:

```typescript
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { OrganizationService } from '../../core/services/organization.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
```

### For Service Development
1. Create services in `core/services/` directory
2. Follow `.service.ts` naming convention
3. Inject AuthService and AppConfigService for authenticated requests
4. Use consistent API response patterns with `ApiResponse<T>` and `PaginatedResponse<T>`

## File Structure
```
src/app/core/services/
├── auth.service.ts           # Authentication and authorization
├── error-handler.service.ts  # Global error handling
├── organization.service.ts   # Organization and branch management
├── project.service.ts        # Project management
├── task.service.ts          # Task management
└── user.service.ts          # User management
```

## Next Steps
1. Monitor for any remaining import issues
2. Update any additional documentation that references old service paths
3. Consider creating service barrel exports for cleaner imports
4. Implement consistent error handling patterns across all services
