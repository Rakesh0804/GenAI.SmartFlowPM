using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Commands;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.TimeTracker.Handlers;

// Time Category Command Handlers
public class CreateTimeCategoryCommandHandler : IRequestHandler<CreateTimeCategoryCommand, Result<TimeCategoryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateTimeCategoryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeCategoryDto>> Handle(CreateTimeCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimeCategoryDto>.Failure("Invalid tenant context");
            }

            // Check if category name already exists
            var existingCategory = await _unitOfWork.TimeCategories.GetByNameAsync(request.CreateTimeCategoryDto.Name, tenantId, cancellationToken);
            if (existingCategory != null)
            {
                return Result<TimeCategoryDto>.Failure("Time category with this name already exists");
            }

            var timeCategory = _mapper.Map<TimeCategory>(request.CreateTimeCategoryDto);
            timeCategory.TenantId = tenantId;
            timeCategory.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.TimeCategories.AddAsync(timeCategory, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var categoryDto = _mapper.Map<TimeCategoryDto>(timeCategory);
            return Result<TimeCategoryDto>.Success(categoryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeCategoryDto>.Failure($"Error creating time category: {ex.Message}");
        }
    }
}

public class UpdateTimeCategoryCommandHandler : IRequestHandler<UpdateTimeCategoryCommand, Result<TimeCategoryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTimeCategoryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeCategoryDto>> Handle(UpdateTimeCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimeCategoryDto>.Failure("Invalid tenant context");
            }

            var timeCategory = await _unitOfWork.TimeCategories.GetByIdAsync(request.Id, cancellationToken);
            if (timeCategory == null || timeCategory.TenantId != tenantId)
            {
                return Result<TimeCategoryDto>.Failure("Time category not found");
            }

            // Check if new name already exists (excluding current category)
            var nameExists = await _unitOfWork.TimeCategories.IsNameExistsAsync(request.UpdateTimeCategoryDto.Name, tenantId, request.Id, cancellationToken);
            if (nameExists)
            {
                return Result<TimeCategoryDto>.Failure("Time category with this name already exists");
            }

            _mapper.Map(request.UpdateTimeCategoryDto, timeCategory);
            timeCategory.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.TimeCategories.UpdateAsync(timeCategory, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var categoryDto = _mapper.Map<TimeCategoryDto>(timeCategory);
            return Result<TimeCategoryDto>.Success(categoryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeCategoryDto>.Failure($"Error updating time category: {ex.Message}");
        }
    }
}

public class DeleteTimeCategoryCommandHandler : IRequestHandler<DeleteTimeCategoryCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTimeCategoryCommandHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(DeleteTimeCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result.Failure("Invalid tenant context");
            }

            var timeCategory = await _unitOfWork.TimeCategories.GetByIdAsync(request.Id, cancellationToken);
            if (timeCategory == null || timeCategory.TenantId != tenantId)
            {
                return Result.Failure("Time category not found");
            }

            // Soft delete
            timeCategory.IsDeleted = true;
            timeCategory.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.TimeCategories.UpdateAsync(timeCategory, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Error deleting time category: {ex.Message}");
        }
    }
}

// Time Entry Command Handlers
public class CreateTimeEntryCommandHandler : IRequestHandler<CreateTimeEntryCommand, Result<TimeEntryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateTimeEntryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeEntryDto>> Handle(CreateTimeEntryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<TimeEntryDto>.Failure("Invalid user or tenant context");
            }

            var timeEntry = _mapper.Map<TimeEntry>(request.CreateTimeEntryDto);
            timeEntry.UserId = userId;
            timeEntry.TenantId = tenantId;
            timeEntry.CreatedAt = DateTime.UtcNow;

            // Calculate duration if not provided
            if (timeEntry.Duration == 0 && timeEntry.EndTime.HasValue)
            {
                timeEntry.Duration = (int)(timeEntry.EndTime.Value - timeEntry.StartTime).TotalMinutes;
            }

            await _unitOfWork.TimeEntries.AddAsync(timeEntry, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var entryDto = _mapper.Map<TimeEntryDto>(timeEntry);
            return Result<TimeEntryDto>.Success(entryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeEntryDto>.Failure($"Error creating time entry: {ex.Message}");
        }
    }
}

public class UpdateTimeEntryCommandHandler : IRequestHandler<UpdateTimeEntryCommand, Result<TimeEntryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTimeEntryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeEntryDto>> Handle(UpdateTimeEntryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimeEntryDto>.Failure("Invalid tenant context");
            }

            var timeEntry = await _unitOfWork.TimeEntries.GetByIdAsync(request.Id, cancellationToken);
            if (timeEntry == null || timeEntry.TenantId != tenantId)
            {
                return Result<TimeEntryDto>.Failure("Time entry not found");
            }

            _mapper.Map(request.UpdateTimeEntryDto, timeEntry);
            timeEntry.UpdatedAt = DateTime.UtcNow;

            // Recalculate duration if not provided
            if (timeEntry.Duration == 0 && timeEntry.EndTime.HasValue)
            {
                timeEntry.Duration = (int)(timeEntry.EndTime.Value - timeEntry.StartTime).TotalMinutes;
            }

            await _unitOfWork.TimeEntries.UpdateAsync(timeEntry, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var entryDto = _mapper.Map<TimeEntryDto>(timeEntry);
            return Result<TimeEntryDto>.Success(entryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeEntryDto>.Failure($"Error updating time entry: {ex.Message}");
        }
    }
}

public class DeleteTimeEntryCommandHandler : IRequestHandler<DeleteTimeEntryCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTimeEntryCommandHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(DeleteTimeEntryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result.Failure("Invalid tenant context");
            }

            var timeEntry = await _unitOfWork.TimeEntries.GetByIdAsync(request.Id, cancellationToken);
            if (timeEntry == null || timeEntry.TenantId != tenantId)
            {
                return Result.Failure("Time entry not found");
            }

            // Soft delete
            timeEntry.IsDeleted = true;
            timeEntry.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.TimeEntries.UpdateAsync(timeEntry, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Error deleting time entry: {ex.Message}");
        }
    }
}

// Active Tracking Command Handlers
public class StartTrackingCommandHandler : IRequestHandler<StartTrackingCommand, Result<ActiveTrackingSessionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public StartTrackingCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<ActiveTrackingSessionDto>> Handle(StartTrackingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<ActiveTrackingSessionDto>.Failure("Invalid user or tenant context");
            }

            // Stop any existing active sessions for this user
            await _unitOfWork.ActiveTrackingSessions.StopAllActiveSessionsAsync(userId, tenantId, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken); // Save changes to clear existing active sessions

            var session = _mapper.Map<ActiveTrackingSession>(request.StartTrackingDto);
            session.UserId = userId;
            session.TenantId = tenantId;
            session.StartTime = DateTime.UtcNow;
            session.LastActivityTime = DateTime.UtcNow;
            session.Status = TrackingStatus.Running;
            session.IsActive = true;
            session.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.ActiveTrackingSessions.AddAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var sessionDto = _mapper.Map<ActiveTrackingSessionDto>(session);
            return Result<ActiveTrackingSessionDto>.Success(sessionDto);
        }
        catch (Exception ex)
        {
            return Result<ActiveTrackingSessionDto>.Failure($"Error starting tracking session: {ex.Message}");
        }
    }
}

public class StopTrackingCommandHandler : IRequestHandler<StopTrackingCommand, Result<TimeEntryDto?>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public StopTrackingCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeEntryDto?>> Handle(StopTrackingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<TimeEntryDto?>.Failure("Invalid user or tenant context");
            }

            var session = await _unitOfWork.ActiveTrackingSessions.GetByIdAsync(request.Id, cancellationToken);
            if (session == null || session.TenantId != tenantId || session.UserId != userId)
            {
                return Result<TimeEntryDto?>.Failure("Active tracking session not found");
            }

            // Stop the session
            session.Status = TrackingStatus.Stopped;
            session.IsActive = false;
            session.UpdatedAt = DateTime.UtcNow;

            TimeEntry? timeEntry = null;
            TimeEntryDto? timeEntryDto = null;

            // Create time entry if requested
            if (request.StopTrackingDto.CreateTimeEntry)
            {
                var totalMinutes = (int)(DateTime.UtcNow - session.StartTime).TotalMinutes - session.PausedTime;
                
                timeEntry = new TimeEntry
                {
                    Id = Guid.NewGuid(),
                    UserId = session.UserId,
                    TenantId = session.TenantId,
                    TimeCategoryId = session.TimeCategoryId,
                    ProjectId = session.ProjectId,
                    TaskId = session.TaskId,
                    StartTime = session.StartTime,
                    EndTime = DateTime.UtcNow,
                    Duration = totalMinutes,
                    Description = request.StopTrackingDto.Description ?? session.Description,
                    EntryType = TimeEntryType.Other,
                    BillableStatus = BillableStatus.NonBillable, // Default, can be changed later
                    IsManualEntry = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.TimeEntries.AddAsync(timeEntry, cancellationToken);
                timeEntryDto = _mapper.Map<TimeEntryDto>(timeEntry);
            }

            await _unitOfWork.ActiveTrackingSessions.UpdateAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<TimeEntryDto?>.Success(timeEntryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeEntryDto?>.Failure($"Error stopping tracking session: {ex.Message}");
        }
    }
}

public class PauseTrackingCommandHandler : IRequestHandler<PauseTrackingCommand, Result<ActiveTrackingSessionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public PauseTrackingCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<ActiveTrackingSessionDto>> Handle(PauseTrackingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<ActiveTrackingSessionDto>.Failure("Invalid user or tenant context");
            }

            var session = await _unitOfWork.ActiveTrackingSessions.GetByIdAsync(request.Id, cancellationToken);
            if (session == null || session.TenantId != tenantId || session.UserId != userId)
            {
                return Result<ActiveTrackingSessionDto>.Failure("Active tracking session not found");
            }

            if (session.Status != TrackingStatus.Running)
            {
                return Result<ActiveTrackingSessionDto>.Failure("Session is not currently running");
            }

            session.Status = TrackingStatus.Paused;
            session.LastActivityTime = DateTime.UtcNow;
            session.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.ActiveTrackingSessions.UpdateAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var sessionDto = _mapper.Map<ActiveTrackingSessionDto>(session);
            return Result<ActiveTrackingSessionDto>.Success(sessionDto);
        }
        catch (Exception ex)
        {
            return Result<ActiveTrackingSessionDto>.Failure($"Error pausing tracking session: {ex.Message}");
        }
    }
}

public class ResumeTrackingCommandHandler : IRequestHandler<ResumeTrackingCommand, Result<ActiveTrackingSessionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public ResumeTrackingCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<ActiveTrackingSessionDto>> Handle(ResumeTrackingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<ActiveTrackingSessionDto>.Failure("Invalid user or tenant context");
            }

            var session = await _unitOfWork.ActiveTrackingSessions.GetByIdAsync(request.Id, cancellationToken);
            if (session == null || session.TenantId != tenantId || session.UserId != userId)
            {
                return Result<ActiveTrackingSessionDto>.Failure("Active tracking session not found");
            }

            if (session.Status != TrackingStatus.Paused)
            {
                return Result<ActiveTrackingSessionDto>.Failure("Session is not currently paused");
            }

            // Calculate paused time and add to total
            var pausedDuration = (int)(DateTime.UtcNow - session.LastActivityTime).TotalMinutes;
            session.PausedTime += pausedDuration;
            
            session.Status = TrackingStatus.Running;
            session.LastActivityTime = DateTime.UtcNow;
            session.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.ActiveTrackingSessions.UpdateAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var sessionDto = _mapper.Map<ActiveTrackingSessionDto>(session);
            return Result<ActiveTrackingSessionDto>.Success(sessionDto);
        }
        catch (Exception ex)
        {
            return Result<ActiveTrackingSessionDto>.Failure($"Error resuming tracking session: {ex.Message}");
        }
    }
}

public class UpdateTrackingCommandHandler : IRequestHandler<UpdateTrackingCommand, Result<ActiveTrackingSessionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTrackingCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<ActiveTrackingSessionDto>> Handle(UpdateTrackingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<ActiveTrackingSessionDto>.Failure("Invalid user or tenant context");
            }

            var session = await _unitOfWork.ActiveTrackingSessions.GetByIdAsync(request.Id, cancellationToken);
            if (session == null || session.TenantId != tenantId || session.UserId != userId)
            {
                return Result<ActiveTrackingSessionDto>.Failure("Active tracking session not found");
            }

            _mapper.Map(request.UpdateTrackingDto, session);
            session.LastActivityTime = DateTime.UtcNow;
            session.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.ActiveTrackingSessions.UpdateAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var sessionDto = _mapper.Map<ActiveTrackingSessionDto>(session);
            return Result<ActiveTrackingSessionDto>.Success(sessionDto);
        }
        catch (Exception ex)
        {
            return Result<ActiveTrackingSessionDto>.Failure($"Error updating tracking session: {ex.Message}");
        }
    }
}
