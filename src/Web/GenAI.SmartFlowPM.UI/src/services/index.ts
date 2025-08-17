// Export all services for easy importing throughout the application
export { authService } from './auth.service';
export { userService } from './user.service';
export { projectService } from './project.service';
export { taskService } from './task.service';
export { dashboardService } from './dashboard.service';
export { roleService } from './role.service';
export { claimService } from './claim.service';
export { organizationService } from './organization.service';
export { tenantService } from './tenant.service';
export { timeTrackerService } from './timetracker.service';

// Export service classes for advanced usage
export { AuthService } from './auth.service';
export { UserService } from './user.service';
export { ProjectService } from './project.service';
export { TaskService } from './task.service';
export { DashboardService } from './dashboard.service';
export { TenantService } from './tenant.service';
export { TimeTrackerService } from './timetracker.service';

// Export base service for extending
export { BaseApiService } from '../lib/base-api.service';
