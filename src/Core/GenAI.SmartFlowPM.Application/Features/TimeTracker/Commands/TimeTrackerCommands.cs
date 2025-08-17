using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.TimeTracker.Commands;

// Time Category Commands
public class CreateTimeCategoryCommand : IRequest<Result<TimeCategoryDto>>
{
    [JsonPropertyName("createTimeCategoryDto")]
    public CreateTimeCategoryDto CreateTimeCategoryDto { get; set; } = null!;
}

public class UpdateTimeCategoryCommand : IRequest<Result<TimeCategoryDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateTimeCategoryDto")]
    public UpdateTimeCategoryDto UpdateTimeCategoryDto { get; set; } = null!;
}

public class DeleteTimeCategoryCommand : IRequest<Result>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

// Time Entry Commands
public class CreateTimeEntryCommand : IRequest<Result<TimeEntryDto>>
{
    [JsonPropertyName("createTimeEntryDto")]
    public CreateTimeEntryDto CreateTimeEntryDto { get; set; } = null!;
}

public class UpdateTimeEntryCommand : IRequest<Result<TimeEntryDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateTimeEntryDto")]
    public UpdateTimeEntryDto UpdateTimeEntryDto { get; set; } = null!;
}

public class DeleteTimeEntryCommand : IRequest<Result>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

// Timesheet Commands
public class CreateTimesheetCommand : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("createTimesheetDto")]
    public CreateTimesheetDto CreateTimesheetDto { get; set; } = null!;
}

public class UpdateTimesheetCommand : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateTimesheetDto")]
    public UpdateTimesheetDto UpdateTimesheetDto { get; set; } = null!;
}

public class SubmitTimesheetCommand : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("submitTimesheetDto")]
    public SubmitTimesheetDto SubmitTimesheetDto { get; set; } = null!;
}

public class ApproveTimesheetCommand : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("approveTimesheetDto")]
    public ApproveTimesheetDto ApproveTimesheetDto { get; set; } = null!;
}

public class RejectTimesheetCommand : IRequest<Result<TimesheetDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("rejectTimesheetDto")]
    public RejectTimesheetDto RejectTimesheetDto { get; set; } = null!;
}

public class DeleteTimesheetCommand : IRequest<Result>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

// Active Tracking Commands
public class StartTrackingCommand : IRequest<Result<ActiveTrackingSessionDto>>
{
    [JsonPropertyName("startTrackingDto")]
    public StartTrackingDto StartTrackingDto { get; set; } = null!;
}

public class UpdateTrackingCommand : IRequest<Result<ActiveTrackingSessionDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateTrackingDto")]
    public UpdateTrackingDto UpdateTrackingDto { get; set; } = null!;
}

public class StopTrackingCommand : IRequest<Result<TimeEntryDto?>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("stopTrackingDto")]
    public StopTrackingDto StopTrackingDto { get; set; } = null!;
}

public class PauseTrackingCommand : IRequest<Result<ActiveTrackingSessionDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("pauseTrackingDto")]
    public PauseTrackingDto PauseTrackingDto { get; set; } = null!;
}

public class ResumeTrackingCommand : IRequest<Result<ActiveTrackingSessionDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("resumeTrackingDto")]
    public ResumeTrackingDto ResumeTrackingDto { get; set; } = null!;
}
