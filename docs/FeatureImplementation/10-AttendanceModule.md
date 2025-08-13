# Attendance Module - Feature Implementation

## Module Overview
The Attendance Module manages employee attendance tracking, leave management, shift scheduling, and attendance analytics. It provides comprehensive workforce management capabilities.

## Features to Implement (ToDo) 📋

### 1. Domain Layer
- [ ] AttendanceRecord entity with check-in/check-out times
- [ ] LeaveRequest entity with approval workflow
- [ ] LeaveType entity for different leave categories
- [ ] Shift entity for shift scheduling and management
- [ ] Holiday entity for company and regional holidays
- [ ] AttendanceStatus enum (Present, Absent, Late, PartialDay, Leave)
- [ ] LeaveStatus enum (Pending, Approved, Rejected, Cancelled)
- [ ] LeaveType enum (Annual, Sick, Personal, Maternity, Emergency, Compensatory)
- [ ] ShiftType enum (Regular, Night, Weekend, Holiday, Flexible)
- [ ] AttendanceRecord repository interface
- [ ] LeaveRequest repository interface
- [ ] Shift repository interface
- [ ] Relationship with User and Organization entities

### 2. Application Layer
- [ ] AttendanceRecord DTOs (Create, Update, Response, Summary)
- [ ] LeaveRequest DTOs (Create, Update, Response, Approval)
- [ ] Shift DTOs (Create, Update, Response, Schedule)
- [ ] AttendanceReport DTOs for analytics and reporting
- [ ] LeaveBalance DTOs for leave entitlement tracking
- [ ] AutoMapper profile for Attendance mappings
- [ ] FluentValidation validators for all DTOs

### 3. CQRS Implementation
- [ ] CQRS Commands (CheckInCommand, CheckOutCommand, MarkAttendanceCommand)
- [ ] Leave Commands (CreateLeaveRequestCommand, ApproveLeaveCommand, RejectLeaveCommand)
- [ ] Shift Commands (CreateShiftCommand, UpdateShiftCommand, AssignShiftCommand)
- [ ] CQRS Queries (GetAttendanceByUser, GetAttendanceByDateRange, GetLeaveRequests)
- [ ] Attendance Report Queries (GetAttendanceReportQuery, GetLeaveReportQuery)
- [ ] Command and Query handlers (AttendanceCommandHandlers.cs, AttendanceQueryHandlers.cs)

### 4. Data Layer
- [ ] EF Core entity configurations for AttendanceRecord, LeaveRequest, Shift
- [ ] Repository implementations
- [ ] Database migrations for attendance-related tables
- [ ] Data seeding for leave types and holidays

### 5. API Layer
- [ ] Attendance controller with check-in/check-out functionality
- [ ] Leave management controller with approval workflow
- [ ] Shift management controller for scheduling
- [ ] Attendance reports controller for analytics
- [ ] API documentation with Swagger

### 6. Frontend (Angular)
- [ ] Attendance dashboard with check-in/check-out (AttendanceDashboardComponent)
- [ ] Leave request management (LeaveManagementComponent)
- [ ] Attendance calendar view (AttendanceCalendarComponent)
- [ ] Shift scheduling and management (ShiftManagementComponent)
- [ ] Attendance reports and analytics (AttendanceReportsComponent)
- [ ] Leave balance and entitlement tracking (LeaveBalanceComponent)
- [ ] Professional Material Design implementation

## API Endpoints (ToDo) 📡
- [ ] POST /api/attendance/checkin - Employee check-in
- [ ] POST /api/attendance/checkout - Employee check-out
- [ ] GET /api/attendance/records - Get attendance records with filters
- [ ] GET /api/attendance/records/{id} - Get attendance record by ID
- [ ] POST /api/attendance/records - Create/update attendance record
- [ ] GET /api/attendance/user/{userId} - Get attendance by user
- [ ] GET /api/attendance/today - Get today's attendance status
- [ ] GET /api/leave/requests - Get leave requests with pagination
- [ ] GET /api/leave/requests/{id} - Get leave request by ID
- [ ] POST /api/leave/requests - Create new leave request
- [ ] PUT /api/leave/requests/{id} - Update leave request
- [ ] POST /api/leave/requests/{id}/approve - Approve leave request
- [ ] POST /api/leave/requests/{id}/reject - Reject leave request
- [ ] GET /api/leave/balance/{userId} - Get user leave balance
- [ ] GET /api/leave/types - Get available leave types
- [ ] GET /api/shifts - Get shifts with pagination
- [ ] POST /api/shifts - Create new shift
- [ ] PUT /api/shifts/{id} - Update shift
- [ ] DELETE /api/shifts/{id} - Delete shift
- [ ] GET /api/shifts/user/{userId} - Get shifts by user
- [ ] GET /api/attendance/reports/summary - Get attendance summary reports
- [ ] GET /api/attendance/reports/detailed - Get detailed attendance reports

## Frontend Components (ToDo) 🎨

### AttendanceDashboardComponent
- **Purpose**: Main attendance interface for employees
- **Features**:
  - Quick check-in/check-out buttons
  - Today's attendance status
  - Current shift information
  - Recent attendance history
  - Leave balance summary
  - Attendance statistics and trends
  - Quick leave request creation
- **Location**: `src/app/attendance/attendance-dashboard/`

### LeaveManagementComponent
- **Purpose**: Leave request management for employees and managers
- **Features**:
  - Leave request creation form
  - Leave history and status tracking
  - Manager approval interface
  - Leave balance tracking
  - Leave calendar view
  - Leave policy information
  - Bulk leave operations for managers
- **Location**: `src/app/attendance/leave-management/`

### AttendanceCalendarComponent
- **Purpose**: Calendar view of attendance and leave data
- **Features**:
  - Monthly attendance calendar
  - Visual attendance status indicators
  - Leave periods highlighted
  - Public holidays marked
  - Quick attendance correction
  - Team attendance overview for managers
  - Export and print functionality
- **Location**: `src/app/attendance/attendance-calendar/`

### ShiftManagementComponent
- **Purpose**: Shift scheduling and management
- **Features**:
  - Shift schedule creation
  - Employee shift assignment
  - Shift pattern management
  - Shift change requests
  - Overtime tracking
  - Shift coverage analysis
  - Manager approval for shift changes
- **Location**: `src/app/attendance/shift-management/`

### AttendanceReportsComponent
- **Purpose**: Attendance analytics and reporting
- **Features**:
  - Individual attendance reports
  - Team attendance analysis
  - Leave utilization reports
  - Attendance trends and patterns
  - Export capabilities (PDF, Excel)
  - Custom date range selection
  - Comparative analysis tools
- **Location**: `src/app/attendance/attendance-reports/`

### LeaveBalanceComponent
- **Purpose**: Leave entitlement and balance tracking
- **Features**:
  - Current leave balances by type
  - Leave accrual tracking
  - Leave policy information
  - Projected leave availability
  - Leave history and usage patterns
  - Manager view of team leave balances
- **Location**: `src/app/attendance/leave-balance/`

## Database Schema (ToDo) 🗄️

### AttendanceRecords Table
- [ ] Id (Guid, Primary Key)
- [ ] UserId (Guid, Required, Foreign Key)
- [ ] Date (date, Required)
- [ ] CheckInTime (datetime2, Optional)
- [ ] CheckOutTime (datetime2, Optional)
- [ ] TotalWorkHours (decimal(5,2), Optional)
- [ ] BreakHours (decimal(5,2), Default: 0)
- [ ] OvertimeHours (decimal(5,2), Default: 0)
- [ ] Status (int, Required, enum)
- [ ] ShiftId (Guid, Optional, Foreign Key)
- [ ] Location (nvarchar(255), Optional) // Check-in location
- [ ] IPAddress (nvarchar(45), Optional)
- [ ] Device (nvarchar(255), Optional)
- [ ] Notes (nvarchar(500), Optional)
- [ ] IsManualEntry (bit, Default: false)
- [ ] ApprovedBy (Guid, Optional, Foreign Key)
- [ ] ApprovedAt (datetime2, Optional)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### LeaveRequests Table
- [ ] Id (Guid, Primary Key)
- [ ] UserId (Guid, Required, Foreign Key)
- [ ] LeaveTypeId (Guid, Required, Foreign Key)
- [ ] StartDate (date, Required)
- [ ] EndDate (date, Required)
- [ ] TotalDays (decimal(5,2), Required)
- [ ] Reason (nvarchar(1000), Required)
- [ ] Status (int, Required, enum)
- [ ] SubmittedAt (datetime2, Required)
- [ ] ApprovedBy (Guid, Optional, Foreign Key)
- [ ] ApprovedAt (datetime2, Optional)
- [ ] RejectedBy (Guid, Optional, Foreign Key)
- [ ] RejectedAt (datetime2, Optional)
- [ ] ApprovalNotes (nvarchar(1000), Optional)
- [ ] IsEmergency (bit, Default: false)
- [ ] ContactNumber (nvarchar(20), Optional)
- [ ] AlternateContact (nvarchar(20), Optional)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### LeaveTypes Table
- [ ] Id (Guid, Primary Key)
- [ ] Name (nvarchar(100), Required)
- [ ] Description (nvarchar(500), Optional)
- [ ] MaxDaysPerYear (int, Required)
- [ ] MaxConsecutiveDays (int, Optional)
- [ ] RequiresApproval (bit, Default: true)
- [ ] IsCarryForward (bit, Default: false)
- [ ] CarryForwardLimit (int, Default: 0)
- [ ] AccrualRate (decimal(5,2), Default: 0) // Days per month
- [ ] Color (nvarchar(7), Optional) // Hex color code
- [ ] IsActive (bit, Default: true)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### Shifts Table
- [ ] Id (Guid, Primary Key)
- [ ] Name (nvarchar(100), Required)
- [ ] Description (nvarchar(500), Optional)
- [ ] StartTime (time, Required)
- [ ] EndTime (time, Required)
- [ ] WorkHours (decimal(5,2), Required)
- [ ] BreakHours (decimal(5,2), Default: 0)
- [ ] ShiftType (int, Required, enum)
- [ ] DaysOfWeek (int, Required) // Bitmask for applicable days
- [ ] IsFlexible (bit, Default: false)
- [ ] FlexibilityMinutes (int, Default: 0)
- [ ] IsActive (bit, Default: true)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### UserLeaveBalances Table
- [ ] Id (Guid, Primary Key)
- [ ] UserId (Guid, Required, Foreign Key)
- [ ] LeaveTypeId (Guid, Required, Foreign Key)
- [ ] Year (int, Required)
- [ ] EntitledDays (decimal(5,2), Required)
- [ ] UsedDays (decimal(5,2), Default: 0)
- [ ] RemainingDays (decimal(5,2), Required)
- [ ] CarriedForwardDays (decimal(5,2), Default: 0)
- [ ] LastUpdated (datetime2, Required)

## Attendance Features (ToDo) 📈

### Time Tracking
- **Check-in/Check-out**: Employee time tracking with location
- **Shift Management**: Flexible shift scheduling and assignment
- **Overtime Tracking**: Automatic overtime calculation
- **Break Management**: Break time tracking and management

### Leave Management
- **Leave Requests**: Employee leave request submission
- **Approval Workflow**: Manager approval process for leave
- **Leave Balance**: Automatic leave balance calculation
- **Leave Policies**: Configurable leave types and policies

### Reporting & Analytics
- **Attendance Reports**: Individual and team attendance analysis
- **Leave Reports**: Leave utilization and pattern analysis
- **Compliance Reports**: Regulatory compliance reporting
- **Productivity Analysis**: Work pattern and productivity insights

## Integration Points (ToDo) 🔗

### User Management Integration
- **Employee Records**: Integration with user profiles
- **Manager Hierarchy**: Manager approval workflows
- **Role-based Access**: Different access levels for attendance data
- **Employee Onboarding**: Automatic attendance setup for new employees

### Project Integration
- **Project Time Allocation**: Link attendance to project work
- **Resource Planning**: Attendance-based resource allocation
- **Project Scheduling**: Consider attendance patterns in planning
- **Billable Time**: Integration with time tracking for billing

### Dashboard Integration
- **Attendance Widget**: Quick check-in/check-out on dashboard
- **Today's Status**: Current attendance status display
- **Leave Notifications**: Pending leave requests and approvals
- **Team Overview**: Manager view of team attendance

### Calendar Integration
- **Leave Calendar**: Integration with calendar for leave visualization
- **Shift Schedule**: Calendar view of shift schedules
- **Holiday Integration**: Company holiday integration
- **Meeting Conflicts**: Check for attendance conflicts with meetings

## Advanced Features (ToDo) 🚀
- [ ] Mobile attendance app with GPS tracking
- [ ] Biometric integration for check-in/check-out
- [ ] Facial recognition for attendance tracking
- [ ] Integration with access control systems
- [ ] Automated attendance notifications and alerts
- [ ] Machine learning for attendance pattern analysis
- [ ] Integration with payroll systems
- [ ] Compliance reporting for labor regulations
- [ ] Real-time attendance monitoring dashboard
- [ ] Employee self-service portal for attendance management

## Security & Permissions (ToDo) 🔒
- [ ] Employee permissions for own attendance data
- [ ] Manager permissions for team attendance oversight
- [ ] HR permissions for company-wide attendance management
- [ ] Admin permissions for system configuration
- [ ] Audit trail for all attendance modifications

## Reporting & Analytics (ToDo) 📊
- [ ] Individual attendance and punctuality reports
- [ ] Team attendance analysis and trends
- [ ] Leave utilization and pattern reports
- [ ] Overtime analysis and cost reports
- [ ] Compliance and regulatory reports
- [ ] Predictive analytics for attendance patterns

Last Updated: August 6, 2025
