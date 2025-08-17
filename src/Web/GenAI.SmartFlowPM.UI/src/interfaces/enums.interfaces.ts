// Enums used across modules
export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum ProjectPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum TaskStatus {
  Todo = 1,
  InProgress = 2,
  Review = 3,
  Testing = 4,
  Done = 5,
  Blocked = 6
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export enum BranchType {
  Headquarters = 1,
  Regional = 2,
  Satellite = 3,
  Remote = 4
}

export enum TeamMemberRole {
  Member = 0,
  Lead = 1,
  Admin = 2
}

// TimeTracker Enums
export enum TimesheetStatus {
  Draft = 0,
  Submitted = 1,
  Approved = 2,
  Rejected = 3
}

export enum TimeEntryType {
  Regular = 0,
  Overtime = 1,
  Break = 2,
  Meeting = 3
}

export enum BillableStatus {
  Billable = 0,
  NonBillable = 1,
  Internal = 2
}

export enum TrackingStatus {
  Stopped = 0,
  Running = 1,
  Paused = 2
}
