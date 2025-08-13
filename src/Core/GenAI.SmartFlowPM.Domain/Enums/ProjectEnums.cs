namespace GenAI.SmartFlowPM.Domain.Enums;

public enum ProjectStatus
{
    Planning = 1,
    Active = 2,
    OnHold = 3,
    Completed = 4,
    Cancelled = 5
}

public enum ProjectPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum ProjectRole
{
    TeamMember = 1,
    TeamLead = 2,
    ProjectManager = 3,
    Stakeholder = 4
}

public enum TaskStatus
{
    Todo = 1,
    InProgress = 2,
    Review = 3,
    Testing = 4,
    Done = 5,
    Blocked = 6
}

public enum TaskPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}
