# API Service Architecture Migration

## Overview

The frontend API layer has been completely refactored from a monolithic `api.ts` file to a modular service-based architecture with automatic JWT token management and comprehensive refresh token support.

## Architecture

### Base Service

- **`base-api.service.ts`**: Foundation service with shared functionality
  - Automatic JWT Bearer token injection
  - Request/Response interceptors with refresh token handling
  - Error handling with automatic token refresh using refresh tokens
  - Generic CRUD methods
  - Pagination utilities
  - Tenant ID header injection
  - Production-ready implementation without debug logs

### Modular Services

All services extend `BaseApiService` and use singleton pattern:

1. **`auth.service.ts`**: Authentication operations
   - Login/logout with refresh token generation
   - Automatic refresh token management
   - Current user retrieval
   - Token validation (access and refresh tokens)
   - Production-ready implementation

2. **`user.service.ts`**: User management
   - CRUD operations
   - User search and filtering
   - Role management
   - Status updates

3. **`project.service.ts`**: Project lifecycle
   - Project CRUD
   - Member management
   - Status filtering
   - Search capabilities

4. **`task.service.ts`**: Task management
   - Task CRUD operations
   - Assignment management
   - Comments and progress tracking
   - Priority and status updates

5. **`dashboard.service.ts`**: Dashboard data
   - Dashboard statistics
   - Analytics and metrics
   - Productivity data
   - Progress tracking

### Token Management with Refresh Token Support

- **`TokenManager`**: Centralized token storage and management
  - Dual token storage (access tokens + refresh tokens)
  - Multiple storage fallback (localStorage → sessionStorage → cookies)
  - Automatic token validation and expiration checking
- Automatic Bearer token injection in all requests
- Tenant ID header for multi-tenant support
- **Refresh Token Logic**: Automatic refresh using stored refresh tokens on 401 errors
  - Backend generates 30-day refresh tokens
  - Frontend automatically uses refresh tokens when access tokens expire
  - Seamless token renewal without user intervention
- Production-ready implementation without debug logging

## Usage

### Import Services

```typescript
import { authService, userService, projectService, taskService, dashboardService } from '../services';
```

### Service Usage

```typescript
// All services automatically include JWT tokens and refresh token handling
const dashboard = await dashboardService.getHomeDashboard();
const users = await userService.getUsers();
const projects = await projectService.getProjects();
```

### Benefits
✅ **Modular Architecture**: Clean separation of concerns  
✅ **Automatic JWT**: No manual token management needed  
✅ **Type Safety**: Full TypeScript support  
✅ **Error Handling**: Centralized with automatic token refresh  
✅ **Maintainability**: Easy to extend and test  
✅ **Consistency**: Unified API interface across all services  

## Migration Status
- ✅ **api.ts removed**: Old monolithic file completely removed
- ✅ **Components updated**: Dashboard page using new services
- ✅ **Hooks updated**: useAuth and useApiWithToast migrated
- ✅ **No compilation errors**: All services working correctly

## Files Created
- `lib/base-api.service.ts`
- `services/auth.service.ts`
- `services/user.service.ts`
- `services/project.service.ts`
- `services/task.service.ts`
- `services/dashboard.service.ts`
- `services/index.ts`

## Files Updated
- `app/dashboard/page.tsx`
- `hooks/useAuth.tsx`
- `hooks/useApiWithToast.ts`

## Files Removed
- `lib/api.ts` (353 lines of monolithic code replaced with modular services)
