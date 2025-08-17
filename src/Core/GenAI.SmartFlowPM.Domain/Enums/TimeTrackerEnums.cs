namespace GenAI.SmartFlowPM.Domain.Enums;

public enum TimesheetStatus
{
    Draft = 0,
    Submitted = 1,
    Approved = 2,
    Rejected = 3,
    Paid = 4
}

public enum TimeEntryType
{
    Project = 0,
    Task = 1,
    Meeting = 2,
    Training = 3,
    Break = 4,
    Other = 5
}

public enum BillableStatus
{
    Billable = 0,
    NonBillable = 1,
    Internal = 2
}

public enum TrackingStatus
{
    Stopped = 0,
    Running = 1,
    Paused = 2
}
