# Time Tracker Module - Feature Implementation

## Module Overview
The Time Tracker Module provides comprehensive time tracking capabilities for projects, tasks, and general work activities. It includes timesheet management, productivity analytics, and billing/reporting features.

## Features to Implement (ToDo) 📋

### 1. Domain Layer
- [ ] TimeEntry entity with start/end times and project/task association
- [ ] Timesheet entity for periodic time submission and approval
- [ ] TimeCategory entity for categorizing different types of work
- [ ] TimesheetStatus enum (Draft, Submitted, Approved, Rejected, Paid)
- [ ] TimeEntryType enum (Project, Task, Meeting, Training, Break, Other)
- [ ] BillableStatus enum (Billable, NonBillable, Internal)
- [ ] TimeEntry repository interface
- [ ] Timesheet repository interface
- [ ] TimeCategory repository interface
- [ ] Relationship with User, Project, and Task entities

### 2. Application Layer
- [ ] TimeEntry DTOs (Create, Update, Response, Summary)
- [ ] Timesheet DTOs (Create, Update, Response, Approval)
- [ ] TimeTracking DTOs for active tracking sessions
- [ ] TimeReport DTOs for analytics and reporting
- [ ] TimesheetApproval DTOs for manager approval workflow
- [ ] AutoMapper profile for TimeTracker mappings
- [ ] FluentValidation validators for all DTOs

### 3. CQRS Implementation
- [ ] CQRS Commands (CreateTimeEntryCommand, UpdateTimeEntryCommand, DeleteTimeEntryCommand)
- [ ] Timesheet Commands (CreateTimesheetCommand, SubmitTimesheetCommand, ApproveTimesheetCommand)
- [ ] Time Tracking Commands (StartTrackingCommand, StopTrackingCommand, PauseTrackingCommand)
- [ ] CQRS Queries (GetTimeEntriesByUser, GetTimeEntriesByProject, GetTimesheetsByUser)
- [ ] Time Report Queries (GetTimeReportQuery, GetProductivityReportQuery)
- [ ] Command and Query handlers (TimeTrackerCommandHandlers.cs, TimeTrackerQueryHandlers.cs)

### 4. Data Layer
- [ ] EF Core entity configurations for TimeEntry, Timesheet, TimeCategory
- [ ] Repository implementations
- [ ] Database migrations for time tracking tables
- [ ] Data seeding for time categories and sample data

### 5. API Layer
- [ ] TimeTracker controller with time entry management
- [ ] Timesheet controller with approval workflow
- [ ] Time reports controller for analytics
- [ ] Active tracking controller for real-time tracking
- [ ] API documentation with Swagger

### 6. Frontend (Angular)
- [ ] Time tracker dashboard with active tracking (TimeTrackerComponent)
- [ ] Timesheet management with approval workflow (TimesheetComponent)
- [ ] Time entry forms with project/task selection (TimeEntryFormComponent)
- [ ] Time reports and analytics (TimeReportsComponent)
- [ ] Timer widget for active time tracking (TimerWidgetComponent)
- [ ] Time calendar view for visual time management (TimeCalendarComponent)
- [ ] Professional Material Design implementation

## API Endpoints (ToDo) 📡
- [ ] GET /api/timetracker/entries - Get time entries with filters
- [ ] GET /api/timetracker/entries/{id} - Get time entry by ID
- [ ] POST /api/timetracker/entries - Create new time entry
- [ ] PUT /api/timetracker/entries/{id} - Update time entry
- [ ] DELETE /api/timetracker/entries/{id} - Delete time entry
- [ ] GET /api/timetracker/entries/user/{userId} - Get time entries by user
- [ ] GET /api/timetracker/entries/project/{projectId} - Get time entries by project
- [ ] POST /api/timetracker/start - Start time tracking session
- [ ] POST /api/timetracker/stop - Stop time tracking session
- [ ] POST /api/timetracker/pause - Pause time tracking session
- [ ] GET /api/timetracker/active - Get active tracking session
- [ ] GET /api/timesheets - Get timesheets with pagination
- [ ] GET /api/timesheets/{id} - Get timesheet by ID
- [ ] POST /api/timesheets - Create new timesheet
- [ ] PUT /api/timesheets/{id} - Update timesheet
- [ ] POST /api/timesheets/{id}/submit - Submit timesheet for approval
- [ ] POST /api/timesheets/{id}/approve - Approve timesheet
- [ ] POST /api/timesheets/{id}/reject - Reject timesheet
- [ ] GET /api/timetracker/reports/user/{userId} - Get user time reports
- [ ] GET /api/timetracker/reports/project/{projectId} - Get project time reports
- [ ] GET /api/timetracker/categories - Get time categories

## Frontend Components (ToDo) 🎨

### TimeTrackerComponent
- **Purpose**: Main time tracking dashboard with active timer
- **Features**:
  - Live timer with start/stop/pause functionality
  - Quick project and task selection
  - Recent time entries list
  - Daily/weekly time summary
  - Quick actions for common tasks
  - Timer widget with floating controls
  - Productivity insights and goals
- **Location**: `src/app/time-tracker/time-tracker/`

### TimesheetComponent
- **Purpose**: Timesheet management and approval workflow
- **Features**:
  - Weekly/monthly timesheet views
  - Time entry editing and validation
  - Timesheet submission for approval
  - Manager approval interface
  - Timesheet history and status tracking
  - Export functionality (PDF, Excel)
  - Comments and approval notes
- **Location**: `src/app/time-tracker/timesheet/`

### TimeEntryFormComponent
- **Purpose**: Create and edit individual time entries
- **Features**:
  - Time entry creation form
  - Project and task selection dropdowns
  - Start/end time pickers
  - Duration calculation
  - Description and notes
  - Billable status selection
  - Time category assignment
  - Dialog and standalone modes
- **Location**: `src/app/time-tracker/time-entry-form/`

### TimeReportsComponent
- **Purpose**: Time tracking analytics and reporting
- **Features**:
  - User productivity reports
  - Project time allocation charts
  - Team utilization analysis
  - Billable vs non-billable time breakdown
  - Time trends and patterns
  - Export and sharing capabilities
  - Custom date range selection
- **Location**: `src/app/time-tracker/time-reports/`

### TimerWidgetComponent
- **Purpose**: Floating timer widget for active tracking
- **Features**:
  - Minimalist timer display
  - Quick start/stop controls
  - Current task/project display
  - Drag-and-drop positioning
  - Keyboard shortcuts
  - System tray integration
  - Auto-save functionality
- **Location**: `src/app/time-tracker/timer-widget/`

### TimeCalendarComponent
- **Purpose**: Calendar view of time entries
- **Features**:
  - Monthly/weekly calendar view
  - Time entries displayed as blocks
  - Visual time allocation overview
  - Drag-and-drop time entry editing
  - Color-coded project/task categories
  - Quick time entry creation
  - Integration with main calendar
- **Location**: `src/app/time-tracker/time-calendar/`

## Database Schema (ToDo) 🗄️

### TimeEntries Table
- [ ] Id (Guid, Primary Key)
- [ ] UserId (Guid, Required, Foreign Key)
- [ ] ProjectId (Guid, Optional, Foreign Key)
- [ ] TaskId (Guid, Optional, Foreign Key)
- [ ] TimeCategoryId (Guid, Required, Foreign Key)
- [ ] StartTime (datetime2, Required)
- [ ] EndTime (datetime2, Optional)
- [ ] Duration (int, Required) // Minutes
- [ ] Description (nvarchar(500), Optional)
- [ ] EntryType (int, Required, enum)
- [ ] BillableStatus (int, Required, enum)
- [ ] HourlyRate (decimal(18,2), Optional)
- [ ] IsManualEntry (bit, Default: false)
- [ ] TimesheetId (Guid, Optional, Foreign Key)
- [ ] IsActive (bit, Default: true)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### Timesheets Table
- [ ] Id (Guid, Primary Key)
- [ ] UserId (Guid, Required, Foreign Key)
- [ ] StartDate (date, Required)
- [ ] EndDate (date, Required)
- [ ] Status (int, Required, enum)
- [ ] TotalHours (decimal(18,2), Required)
- [ ] BillableHours (decimal(18,2), Required)
- [ ] SubmittedAt (datetime2, Optional)
- [ ] SubmittedBy (Guid, Optional, Foreign Key)
- [ ] ApprovedAt (datetime2, Optional)
- [ ] ApprovedBy (Guid, Optional, Foreign Key)
- [ ] RejectedAt (datetime2, Optional)
- [ ] RejectedBy (Guid, Optional, Foreign Key)
- [ ] ApprovalNotes (nvarchar(1000), Optional)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### TimeCategories Table
- [ ] Id (Guid, Primary Key)
- [ ] Name (nvarchar(100), Required)
- [ ] Description (nvarchar(500), Optional)
- [ ] Color (nvarchar(7), Optional) // Hex color code
- [ ] DefaultBillableStatus (int, Required, enum)
- [ ] IsActive (bit, Default: true)
- [ ] CreatedAt, UpdatedAt (Audit fields)

### ActiveTrackingSessions Table
- [ ] Id (Guid, Primary Key)
- [ ] UserId (Guid, Required, Foreign Key)
- [ ] ProjectId (Guid, Optional, Foreign Key)
- [ ] TaskId (Guid, Optional, Foreign Key)
- [ ] TimeCategoryId (Guid, Required, Foreign Key)
- [ ] StartTime (datetime2, Required)
- [ ] PausedTime (int, Default: 0) // Total paused minutes
- [ ] LastActivityTime (datetime2, Required)
- [ ] Description (nvarchar(500), Optional)
- [ ] IsActive (bit, Default: true)

## Time Tracking Features (ToDo) 📈

### Active Tracking
- **Real-time Timer**: Live tracking with start/stop/pause functionality
- **Auto-tracking**: Automatic time detection based on computer activity
- **Idle Detection**: Automatic pause during idle periods
- **Manual Entry**: Support for manual time entry and corrections

### Timesheet Management
- **Periodic Timesheets**: Weekly/monthly timesheet generation
- **Approval Workflow**: Manager approval process
- **Validation Rules**: Time entry validation and business rules
- **Export Options**: PDF, Excel, and CSV export capabilities

### Reporting & Analytics
- **Productivity Reports**: User and team productivity analysis
- **Project Time Reports**: Time allocation by project and task
- **Billable Time Tracking**: Billable vs non-billable time analysis
- **Utilization Reports**: Resource utilization and capacity planning

## Integration Points (ToDo) 🔗

### Project Integration
- **Project Time Tracking**: Track time spent on specific projects
- **Task Time Association**: Link time entries to specific tasks
- **Project Budgets**: Compare actual time vs estimated time
- **Project Reports**: Time-based project analytics

### Task Integration
- **Task Time Tracking**: Automatic time tracking for task work
- **Task Estimates**: Compare actual vs estimated task time
- **Task Productivity**: Analyze task completion efficiency
- **Time-based Task Updates**: Automatic task progress updates

### User Management Integration
- **User Time Reports**: Individual productivity tracking
- **Manager Oversight**: Manager access to team time data
- **Role-based Permissions**: Different access levels for time data
- **User Productivity Goals**: Set and track productivity targets

### Dashboard Integration
- **Time Tracking Widget**: Live timer on dashboard
- **Today's Time Summary**: Daily time tracking summary
- **Weekly Goals**: Time tracking goals and progress
- **Quick Actions**: Start tracking common tasks

## Advanced Features (ToDo) 🚀
- [ ] Mobile time tracking app
- [ ] Desktop timer application
- [ ] Browser extension for web-based tracking
- [ ] Integration with calendar for automatic time blocking
- [ ] AI-powered time estimation and suggestions
- [ ] Automatic project/task detection based on activity
- [ ] Time tracking reminders and notifications
- [ ] Integration with billing and invoicing systems
- [ ] Offline time tracking with sync capabilities
- [ ] Team collaboration and shared time tracking

## Security & Permissions (ToDo) 🔒
- [ ] User permissions for viewing own time data
- [ ] Manager permissions for team time oversight
- [ ] Admin permissions for all time data management
- [ ] Timesheet approval permissions
- [ ] Data privacy and protection controls

## Reporting & Analytics (ToDo) 📊
- [ ] Individual productivity reports
- [ ] Team utilization analysis
- [ ] Project time allocation reports
- [ ] Billable time and revenue reports
- [ ] Time trend analysis and forecasting
- [ ] Comparative productivity metrics

Last Updated: August 6, 2025
