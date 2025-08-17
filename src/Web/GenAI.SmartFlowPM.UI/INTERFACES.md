# Modular Interface Structure

This project now uses a modular interface structure to improve maintainability and organization.

## Structure

The interfaces are organized in the `src/interfaces/` folder with the following files:

- `api.interfaces.ts` - Generic API response types
- `auth.interfaces.ts` - Authentication related interfaces
- `branch.interfaces.ts` - Branch management interfaces
- `claim.interfaces.ts` - Claims/permissions interfaces
- `dashboard.interfaces.ts` - Basic dashboard interfaces
- `dashboard-home.interfaces.ts` - Home dashboard specific interfaces
- `dashboard-shared.interfaces.ts` - Shared dashboard components
- `enums.interfaces.ts` - All enums used across modules
- `organization.interfaces.ts` - Organization management interfaces
- `project.interfaces.ts` - Project management interfaces
- `role.interfaces.ts` - Role management interfaces
- `task.interfaces.ts` - Task management interfaces
- `team.interfaces.ts` - Team management interfaces
- `tenant.interfaces.ts` - Multi-tenant interfaces
- `user.interfaces.ts` - User management interfaces

## Usage Options

### Option 1: Import from api.types.ts (Backward Compatible)
```typescript
// This still works - all interfaces are re-exported from api.types.ts
import { UserDto, ProjectDto, TaskDto } from '@/types/api.types';
```

### Option 2: Import from specific modules (Recommended for new code)
```typescript
// Import only what you need from specific modules
import { UserDto, CreateUserDto } from '@/interfaces/user.interfaces';
import { ProjectDto, ProjectStatus } from '@/interfaces/project.interfaces';
import { TaskDto, TaskStatus } from '@/interfaces/task.interfaces';
```

### Option 3: Import from interfaces index (All interfaces)
```typescript
// Import from the main interfaces barrel export
import { UserDto, ProjectDto, TaskDto } from '@/interfaces';
```

## Benefits

1. **Modularity**: Each module's interfaces are isolated
2. **Tree Shaking**: Only import what you need
3. **Maintainability**: Easier to find and update specific interfaces
4. **Backward Compatibility**: Existing imports continue to work
5. **Type Safety**: Better TypeScript intellisense and error checking

## Migration

No immediate migration is required as all existing imports will continue to work through the re-exports in `api.types.ts`. However, for new components, consider using the modular imports for better code organization.
