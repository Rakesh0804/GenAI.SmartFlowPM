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

// Timesheet Command Handlers
public class CreateTimesheetCommandHandler : IRequestHandler<CreateTimesheetCommand, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateTimesheetCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimesheetDto>> Handle(CreateTimesheetCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimesheetDto>.Failure("Invalid tenant context");
            }

            // Check if timesheet already exists for this user and date range
            var existingTimesheet = await _unitOfWork.Timesheets.GetByUserAndDateRangeAsync(
                request.CreateTimesheetDto.UserId, 
                request.CreateTimesheetDto.StartDate, 
                request.CreateTimesheetDto.EndDate, 
                tenantId, 
                cancellationToken);

            if (existingTimesheet != null)
            {
                return Result<TimesheetDto>.Failure("Timesheet already exists for this date range");
            }

            var timesheet = _mapper.Map<Timesheet>(request.CreateTimesheetDto);
            timesheet.TenantId = tenantId;
            timesheet.Status = TimesheetStatus.Draft;
            timesheet.CreatedAt = DateTime.UtcNow;

            // Calculate totals from time entries
            var timeEntries = await _unitOfWork.TimeEntries.GetByDateRangeAsync(
                timesheet.UserId, 
                timesheet.StartDate, 
                timesheet.EndDate, 
                tenantId, 
                cancellationToken);

            timesheet.TotalHours = timeEntries.Sum(te => te.Duration) / 60m; // Convert minutes to hours
            timesheet.BillableHours = timeEntries.Where(te => te.BillableStatus == BillableStatus.Billable).Sum(te => te.Duration) / 60m;

            await _unitOfWork.Timesheets.AddAsync(timesheet, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error creating timesheet: {ex.Message}");
        }
    }
}

public class UpdateTimesheetCommandHandler : IRequestHandler<UpdateTimesheetCommand, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTimesheetCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimesheetDto>> Handle(UpdateTimesheetCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimesheetDto>.Failure("Invalid tenant context");
            }

            var timesheet = await _unitOfWork.Timesheets.GetByIdAsync(request.Id, cancellationToken);
            if (timesheet == null || timesheet.TenantId != tenantId)
            {
                return Result<TimesheetDto>.Failure("Timesheet not found");
            }

            // Only allow updates if timesheet is in Draft status
            if (timesheet.Status != TimesheetStatus.Draft)
            {
                return Result<TimesheetDto>.Failure("Only draft timesheets can be updated");
            }

            _mapper.Map(request.UpdateTimesheetDto, timesheet);
            timesheet.UpdatedAt = DateTime.UtcNow;

            // Recalculate totals
            var timeEntries = await _unitOfWork.TimeEntries.GetByDateRangeAsync(
                timesheet.UserId, 
                timesheet.StartDate, 
                timesheet.EndDate, 
                tenantId, 
                cancellationToken);

            timesheet.TotalHours = timeEntries.Sum(te => te.Duration) / 60m;
            timesheet.BillableHours = timeEntries.Where(te => te.BillableStatus == BillableStatus.Billable).Sum(te => te.Duration) / 60m;

            await _unitOfWork.Timesheets.UpdateAsync(timesheet, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error updating timesheet: {ex.Message}");
        }
    }
}

public class SubmitTimesheetCommandHandler : IRequestHandler<SubmitTimesheetCommand, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public SubmitTimesheetCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimesheetDto>> Handle(SubmitTimesheetCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<TimesheetDto>.Failure("Invalid user or tenant context");
            }

            var timesheet = await _unitOfWork.Timesheets.GetByIdAsync(request.Id, cancellationToken);
            if (timesheet == null || timesheet.TenantId != tenantId)
            {
                return Result<TimesheetDto>.Failure("Timesheet not found");
            }

            // Only allow submission if timesheet is in Draft status
            if (timesheet.Status != TimesheetStatus.Draft)
            {
                return Result<TimesheetDto>.Failure("Only draft timesheets can be submitted");
            }

            // Verify the user owns this timesheet or has permission to submit it
            if (timesheet.UserId != userId)
            {
                return Result<TimesheetDto>.Failure("You can only submit your own timesheets");
            }

            timesheet.Status = TimesheetStatus.Submitted;
            timesheet.SubmittedAt = DateTime.UtcNow;
            timesheet.SubmittedBy = userId;
            timesheet.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Timesheets.UpdateAsync(timesheet, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error submitting timesheet: {ex.Message}");
        }
    }
}

public class ApproveTimesheetCommandHandler : IRequestHandler<ApproveTimesheetCommand, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public ApproveTimesheetCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimesheetDto>> Handle(ApproveTimesheetCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<TimesheetDto>.Failure("Invalid user or tenant context");
            }

            var timesheet = await _unitOfWork.Timesheets.GetByIdAsync(request.Id, cancellationToken);
            if (timesheet == null || timesheet.TenantId != tenantId)
            {
                return Result<TimesheetDto>.Failure("Timesheet not found");
            }

            // Only allow approval if timesheet is submitted
            if (timesheet.Status != TimesheetStatus.Submitted)
            {
                return Result<TimesheetDto>.Failure("Only submitted timesheets can be approved");
            }

            // User cannot approve their own timesheet
            if (timesheet.UserId == userId)
            {
                return Result<TimesheetDto>.Failure("You cannot approve your own timesheet");
            }

            timesheet.Status = TimesheetStatus.Approved;
            timesheet.ApprovedAt = DateTime.UtcNow;
            timesheet.ApprovedBy = userId;
            timesheet.ApprovalNotes = request.ApproveTimesheetDto.ApprovalNotes;
            timesheet.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Timesheets.UpdateAsync(timesheet, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error approving timesheet: {ex.Message}");
        }
    }
}

public class RejectTimesheetCommandHandler : IRequestHandler<RejectTimesheetCommand, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public RejectTimesheetCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimesheetDto>> Handle(RejectTimesheetCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                return Result<TimesheetDto>.Failure("Invalid user or tenant context");
            }

            var timesheet = await _unitOfWork.Timesheets.GetByIdAsync(request.Id, cancellationToken);
            if (timesheet == null || timesheet.TenantId != tenantId)
            {
                return Result<TimesheetDto>.Failure("Timesheet not found");
            }

            // Only allow rejection if timesheet is submitted
            if (timesheet.Status != TimesheetStatus.Submitted)
            {
                return Result<TimesheetDto>.Failure("Only submitted timesheets can be rejected");
            }

            // User cannot reject their own timesheet
            if (timesheet.UserId == userId)
            {
                return Result<TimesheetDto>.Failure("You cannot reject your own timesheet");
            }

            timesheet.Status = TimesheetStatus.Rejected;
            timesheet.RejectedAt = DateTime.UtcNow;
            timesheet.RejectedBy = userId;
            timesheet.ApprovalNotes = request.RejectTimesheetDto.ApprovalNotes;
            timesheet.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Timesheets.UpdateAsync(timesheet, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error rejecting timesheet: {ex.Message}");
        }
    }
}

public class DeleteTimesheetCommandHandler : IRequestHandler<DeleteTimesheetCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTimesheetCommandHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(DeleteTimesheetCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result.Failure("Invalid tenant context");
            }

            var timesheet = await _unitOfWork.Timesheets.GetByIdAsync(request.Id, cancellationToken);
            if (timesheet == null || timesheet.TenantId != tenantId)
            {
                return Result.Failure("Timesheet not found");
            }

            // Only allow deletion if timesheet is in Draft status
            if (timesheet.Status != TimesheetStatus.Draft)
            {
                return Result.Failure("Only draft timesheets can be deleted");
            }

            // Soft delete
            timesheet.IsDeleted = true;
            timesheet.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Timesheets.UpdateAsync(timesheet, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Error deleting timesheet: {ex.Message}");
        }
    }
}
