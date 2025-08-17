using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.TimeTracker.Queries;
using GenAI.SmartFlowPM.Application.DTOs.TimeTracker;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.TimeTracker.Handlers;

public class GetActiveTimeCategoriesQueryHandler : IRequestHandler<GetActiveTimeCategoriesQuery, Result<IEnumerable<TimeCategoryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetActiveTimeCategoriesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimeCategoryDto>>> Handle(GetActiveTimeCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimeCategoryDto>>.Failure("Invalid tenant context");
            }

            var categories = await _unitOfWork.TimeCategories.GetActiveAsync(tenantId, cancellationToken);
            var categoryDtos = _mapper.Map<IEnumerable<TimeCategoryDto>>(categories);
            
            return Result<IEnumerable<TimeCategoryDto>>.Success(categoryDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimeCategoryDto>>.Failure($"Error retrieving active time categories: {ex.Message}");
        }
    }
}

public class GetActiveTrackingSessionByUserIdQueryHandler : IRequestHandler<GetActiveTrackingSessionByUserIdQuery, Result<ActiveTrackingSessionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetActiveTrackingSessionByUserIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<ActiveTrackingSessionDto>> Handle(GetActiveTrackingSessionByUserIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<ActiveTrackingSessionDto>.Failure("Invalid tenant context");
            }

            var session = await _unitOfWork.ActiveTrackingSessions.GetActiveByUserIdAsync(request.UserId, tenantId, cancellationToken);
            
            if (session == null)
            {
                // Return success with null data instead of failure for no active session
                return Result<ActiveTrackingSessionDto>.Success(default!, "No active tracking session found");
            }

            var sessionDto = _mapper.Map<ActiveTrackingSessionDto>(session);
            return Result<ActiveTrackingSessionDto>.Success(sessionDto);
        }
        catch (Exception ex)
        {
            return Result<ActiveTrackingSessionDto>.Failure($"Error retrieving active tracking session: {ex.Message}");
        }
    }
}

public class GetTimeEntriesByUserIdQueryHandler : IRequestHandler<GetTimeEntriesByUserIdQuery, Result<IEnumerable<TimeEntryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimeEntriesByUserIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimeEntryDto>>> Handle(GetTimeEntriesByUserIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimeEntryDto>>.Failure("Invalid tenant context");
            }

            var entries = await _unitOfWork.TimeEntries.GetByUserIdAsync(request.UserId, tenantId, cancellationToken);
            var entryDtos = _mapper.Map<IEnumerable<TimeEntryDto>>(entries);
            
            return Result<IEnumerable<TimeEntryDto>>.Success(entryDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimeEntryDto>>.Failure($"Error retrieving time entries: {ex.Message}");
        }
    }
}

// Time Category Handlers
public class GetAllTimeCategoriesQueryHandler : IRequestHandler<GetAllTimeCategoriesQuery, Result<PaginatedResult<TimeCategoryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetAllTimeCategoriesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<PaginatedResult<TimeCategoryDto>>> Handle(GetAllTimeCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<PaginatedResult<TimeCategoryDto>>.Failure("Invalid tenant context");
            }

            var (categories, totalCount) = await _unitOfWork.TimeCategories.GetPagedAsync(
                request.PagedQuery.PageNumber,
                request.PagedQuery.PageSize,
                predicate: tc => tc.TenantId == tenantId && 
                              (string.IsNullOrEmpty(request.PagedQuery.SearchTerm) || 
                               tc.Name.Contains(request.PagedQuery.SearchTerm) ||
                               (!string.IsNullOrEmpty(tc.Description) && tc.Description.Contains(request.PagedQuery.SearchTerm))),
                orderBy: tc => tc.Name,
                ascending: true,
                cancellationToken: cancellationToken);

            var categoryDtos = _mapper.Map<IEnumerable<TimeCategoryDto>>(categories);
            
            var paginatedResult = new PaginatedResult<TimeCategoryDto>
            {
                Items = categoryDtos,
                TotalCount = totalCount,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize
            };

            return Result<PaginatedResult<TimeCategoryDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TimeCategoryDto>>.Failure($"Error retrieving time categories: {ex.Message}");
        }
    }
}

public class GetTimeCategoryByIdQueryHandler : IRequestHandler<GetTimeCategoryByIdQuery, Result<TimeCategoryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetTimeCategoryByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TimeCategoryDto>> Handle(GetTimeCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var category = await _unitOfWork.TimeCategories.GetByIdAsync(request.Id, cancellationToken);
            
            if (category == null)
            {
                return Result<TimeCategoryDto>.Failure($"Time category with ID {request.Id} not found.");
            }

            var categoryDto = _mapper.Map<TimeCategoryDto>(category);
            return Result<TimeCategoryDto>.Success(categoryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeCategoryDto>.Failure($"Error retrieving time category: {ex.Message}");
        }
    }
}

// Time Entry Handlers
public class GetTimeEntryByIdQueryHandler : IRequestHandler<GetTimeEntryByIdQuery, Result<TimeEntryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetTimeEntryByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TimeEntryDto>> Handle(GetTimeEntryByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var entry = await _unitOfWork.TimeEntries.GetByIdAsync(request.Id, cancellationToken);
            
            if (entry == null)
            {
                return Result<TimeEntryDto>.Failure($"Time entry with ID {request.Id} not found.");
            }

            var entryDto = _mapper.Map<TimeEntryDto>(entry);
            return Result<TimeEntryDto>.Success(entryDto);
        }
        catch (Exception ex)
        {
            return Result<TimeEntryDto>.Failure($"Error retrieving time entry: {ex.Message}");
        }
    }
}

public class GetTimeEntriesByProjectIdQueryHandler : IRequestHandler<GetTimeEntriesByProjectIdQuery, Result<IEnumerable<TimeEntryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimeEntriesByProjectIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimeEntryDto>>> Handle(GetTimeEntriesByProjectIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimeEntryDto>>.Failure("Invalid tenant context");
            }

            var entries = await _unitOfWork.TimeEntries.GetByProjectIdAsync(request.ProjectId, tenantId, cancellationToken);
            var entryDtos = _mapper.Map<IEnumerable<TimeEntryDto>>(entries);
            
            return Result<IEnumerable<TimeEntryDto>>.Success(entryDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimeEntryDto>>.Failure($"Error retrieving time entries for project: {ex.Message}");
        }
    }
}

public class GetTimeEntriesByTaskIdQueryHandler : IRequestHandler<GetTimeEntriesByTaskIdQuery, Result<IEnumerable<TimeEntryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimeEntriesByTaskIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimeEntryDto>>> Handle(GetTimeEntriesByTaskIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimeEntryDto>>.Failure("Invalid tenant context");
            }

            var entries = await _unitOfWork.TimeEntries.GetByTaskIdAsync(request.TaskId, tenantId, cancellationToken);
            var entryDtos = _mapper.Map<IEnumerable<TimeEntryDto>>(entries);
            
            return Result<IEnumerable<TimeEntryDto>>.Success(entryDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimeEntryDto>>.Failure($"Error retrieving time entries for task: {ex.Message}");
        }
    }
}

public class GetTimeEntriesByDateRangeQueryHandler : IRequestHandler<GetTimeEntriesByDateRangeQuery, Result<IEnumerable<TimeEntryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimeEntriesByDateRangeQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimeEntryDto>>> Handle(GetTimeEntriesByDateRangeQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimeEntryDto>>.Failure("Invalid tenant context");
            }

            var entries = await _unitOfWork.TimeEntries.GetByDateRangeAsync(request.UserId, request.StartDate, request.EndDate, tenantId, cancellationToken);
            var entryDtos = _mapper.Map<IEnumerable<TimeEntryDto>>(entries);
            
            return Result<IEnumerable<TimeEntryDto>>.Success(entryDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimeEntryDto>>.Failure($"Error retrieving time entries for date range: {ex.Message}");
        }
    }
}

// Timesheet Handlers
public class GetTimesheetByIdQueryHandler : IRequestHandler<GetTimesheetByIdQuery, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetTimesheetByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TimesheetDto>> Handle(GetTimesheetByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var timesheet = await _unitOfWork.Timesheets.GetByIdAsync(request.Id, cancellationToken);
            
            if (timesheet == null)
            {
                return Result<TimesheetDto>.Failure($"Timesheet with ID {request.Id} not found.");
            }

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error retrieving timesheet: {ex.Message}");
        }
    }
}

public class GetTimesheetsByUserIdQueryHandler : IRequestHandler<GetTimesheetsByUserIdQuery, Result<IEnumerable<TimesheetDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimesheetsByUserIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimesheetDto>>> Handle(GetTimesheetsByUserIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimesheetDto>>.Failure("Invalid tenant context");
            }

            var timesheets = await _unitOfWork.Timesheets.GetByUserIdAsync(request.UserId, tenantId, cancellationToken);
            var timesheetDtos = _mapper.Map<IEnumerable<TimesheetDto>>(timesheets);
            
            return Result<IEnumerable<TimesheetDto>>.Success(timesheetDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimesheetDto>>.Failure($"Error retrieving timesheets for user: {ex.Message}");
        }
    }
}

public class GetPendingTimesheetApprovalsQueryHandler : IRequestHandler<GetPendingTimesheetApprovalsQuery, Result<IEnumerable<TimesheetDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetPendingTimesheetApprovalsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimesheetDto>>> Handle(GetPendingTimesheetApprovalsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimesheetDto>>.Failure("Invalid tenant context");
            }

            var timesheets = await _unitOfWork.Timesheets.GetPendingApprovalsAsync(tenantId, cancellationToken);
            var timesheetDtos = _mapper.Map<IEnumerable<TimesheetDto>>(timesheets);
            
            return Result<IEnumerable<TimesheetDto>>.Success(timesheetDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimesheetDto>>.Failure($"Error retrieving pending timesheet approvals: {ex.Message}");
        }
    }
}

// Active Tracking Session Handlers
public class GetActiveTrackingSessionByIdQueryHandler : IRequestHandler<GetActiveTrackingSessionByIdQuery, Result<ActiveTrackingSessionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetActiveTrackingSessionByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ActiveTrackingSessionDto>> Handle(GetActiveTrackingSessionByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var session = await _unitOfWork.ActiveTrackingSessions.GetByIdAsync(request.Id, cancellationToken);
            
            if (session == null)
            {
                return Result<ActiveTrackingSessionDto>.Failure($"Active tracking session with ID {request.Id} not found.");
            }

            var sessionDto = _mapper.Map<ActiveTrackingSessionDto>(session);
            return Result<ActiveTrackingSessionDto>.Success(sessionDto);
        }
        catch (Exception ex)
        {
            return Result<ActiveTrackingSessionDto>.Failure($"Error retrieving active tracking session: {ex.Message}");
        }
    }
}

public class GetTrackingSessionsByUserIdQueryHandler : IRequestHandler<GetTrackingSessionsByUserIdQuery, Result<IEnumerable<ActiveTrackingSessionDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTrackingSessionsByUserIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<ActiveTrackingSessionDto>>> Handle(GetTrackingSessionsByUserIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<ActiveTrackingSessionDto>>.Failure("Invalid tenant context");
            }

            var sessions = await _unitOfWork.ActiveTrackingSessions.GetByUserIdAsync(request.UserId, tenantId, cancellationToken);
            var sessionDtos = _mapper.Map<IEnumerable<ActiveTrackingSessionDto>>(sessions);
            
            return Result<IEnumerable<ActiveTrackingSessionDto>>.Success(sessionDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<ActiveTrackingSessionDto>>.Failure($"Error retrieving tracking sessions for user: {ex.Message}");
        }
    }
}

public class GetAllTimesheetsQueryHandler : IRequestHandler<GetAllTimesheetsQuery, Result<PaginatedResult<TimesheetDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetAllTimesheetsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<PaginatedResult<TimesheetDto>>> Handle(GetAllTimesheetsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<PaginatedResult<TimesheetDto>>.Failure("Invalid tenant context");
            }

            var pagedTimesheets = await _unitOfWork.Timesheets.GetPagedAsync(
                pageNumber: request.PagedQuery.PageNumber,
                pageSize: request.PagedQuery.PageSize,
                predicate: t => t.TenantId == tenantId && !t.IsDeleted,
                orderBy: t => t.CreatedAt,
                ascending: false,
                cancellationToken: cancellationToken);

            var timesheetDtos = _mapper.Map<IEnumerable<TimesheetDto>>(pagedTimesheets.Items);

            var paginatedResult = new PaginatedResult<TimesheetDto>
            {
                Items = timesheetDtos,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize,
                TotalCount = pagedTimesheets.TotalCount
            };

            return Result<PaginatedResult<TimesheetDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TimesheetDto>>.Failure($"Error retrieving timesheets: {ex.Message}");
        }
    }
}

public class GetAllTimeEntriesQueryHandler : IRequestHandler<GetAllTimeEntriesQuery, Result<PaginatedResult<TimeEntryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetAllTimeEntriesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<PaginatedResult<TimeEntryDto>>> Handle(GetAllTimeEntriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<PaginatedResult<TimeEntryDto>>.Failure("Invalid tenant context");
            }

            var pagedTimeEntries = await _unitOfWork.TimeEntries.GetPagedAsync(
                pageNumber: request.PagedQuery.PageNumber,
                pageSize: request.PagedQuery.PageSize,
                predicate: te => te.TenantId == tenantId && !te.IsDeleted,
                orderBy: te => te.StartTime,
                ascending: false,
                cancellationToken: cancellationToken);

            var timeEntryDtos = _mapper.Map<IEnumerable<TimeEntryDto>>(pagedTimeEntries.Items);

            var paginatedResult = new PaginatedResult<TimeEntryDto>
            {
                Items = timeEntryDtos,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize,
                TotalCount = pagedTimeEntries.TotalCount
            };

            return Result<PaginatedResult<TimeEntryDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TimeEntryDto>>.Failure($"Error retrieving time entries: {ex.Message}");
        }
    }
}

public class GetTimeEntriesByTimesheetIdQueryHandler : IRequestHandler<GetTimeEntriesByTimesheetIdQuery, Result<IEnumerable<TimeEntryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimeEntriesByTimesheetIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimeEntryDto>>> Handle(GetTimeEntriesByTimesheetIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimeEntryDto>>.Failure("Invalid tenant context");
            }

            var timeEntries = await _unitOfWork.TimeEntries.GetByTimesheetIdAsync(request.TimesheetId, tenantId, cancellationToken);
            var timeEntryDtos = _mapper.Map<IEnumerable<TimeEntryDto>>(timeEntries);
            
            return Result<IEnumerable<TimeEntryDto>>.Success(timeEntryDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimeEntryDto>>.Failure($"Error retrieving time entries for timesheet: {ex.Message}");
        }
    }
}

public class GetTimesheetByUserAndDateRangeQueryHandler : IRequestHandler<GetTimesheetByUserAndDateRangeQuery, Result<TimesheetDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimesheetByUserAndDateRangeQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimesheetDto>> Handle(GetTimesheetByUserAndDateRangeQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimesheetDto>.Failure("Invalid tenant context");
            }

            var timesheet = await _unitOfWork.Timesheets.GetByUserAndDateRangeAsync(
                request.UserId, 
                request.StartDate, 
                request.EndDate, 
                tenantId, 
                cancellationToken);
            
            if (timesheet == null)
            {
                return Result<TimesheetDto>.Failure($"Timesheet not found for user {request.UserId} in date range {request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd}");
            }

            var timesheetDto = _mapper.Map<TimesheetDto>(timesheet);
            return Result<TimesheetDto>.Success(timesheetDto);
        }
        catch (Exception ex)
        {
            return Result<TimesheetDto>.Failure($"Error retrieving timesheet by user and date range: {ex.Message}");
        }
    }
}

public class GetTimesheetsByStatusQueryHandler : IRequestHandler<GetTimesheetsByStatusQuery, Result<IEnumerable<TimesheetDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTimesheetsByStatusQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<TimesheetDto>>> Handle(GetTimesheetsByStatusQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<IEnumerable<TimesheetDto>>.Failure("Invalid tenant context");
            }

            var timesheets = await _unitOfWork.Timesheets.GetByStatusAsync(request.Status, tenantId, cancellationToken);
            var timesheetDtos = _mapper.Map<IEnumerable<TimesheetDto>>(timesheets);
            
            return Result<IEnumerable<TimesheetDto>>.Success(timesheetDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TimesheetDto>>.Failure($"Error retrieving timesheets by status: {ex.Message}");
        }
    }
}

public class GetUserTimeReportQueryHandler : IRequestHandler<GetUserTimeReportQuery, Result<TimeReportDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetUserTimeReportQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeReportDto>> Handle(GetUserTimeReportQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimeReportDto>.Failure("Invalid tenant context");
            }

            var userTimeEntries = await _unitOfWork.TimeEntries.GetByDateRangeAsync(
                request.UserId,
                request.StartDate, 
                request.EndDate, 
                tenantId, 
                cancellationToken);

            var totalHours = userTimeEntries.Sum(e => e.Duration);
            var billableHours = userTimeEntries.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration);

            // Generate project breakdown
            var projectBreakdown = userTimeEntries
                .Where(e => e.ProjectId.HasValue)
                .GroupBy(e => new { e.ProjectId, ProjectName = e.Project?.Name ?? "Unknown Project" })
                .Select(g => new ProjectTimeDto
                {
                    ProjectId = g.Key.ProjectId!.Value,
                    ProjectName = g.Key.ProjectName,
                    TotalHours = g.Sum(e => e.Duration),
                    BillableHours = g.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration),
                    Percentage = totalHours > 0 ? (g.Sum(e => e.Duration) / totalHours) * 100 : 0
                }).ToList();

            // Generate category breakdown
            var categoryBreakdown = userTimeEntries
                .GroupBy(e => new { e.TimeCategoryId, CategoryName = e.TimeCategory?.Name ?? "Unknown Category", e.TimeCategory?.Color })
                .Select(g => new CategoryTimeDto
                {
                    CategoryId = g.Key.TimeCategoryId,
                    CategoryName = g.Key.CategoryName,
                    CategoryColor = g.Key.Color,
                    TotalHours = g.Sum(e => e.Duration),
                    Percentage = totalHours > 0 ? (g.Sum(e => e.Duration) / totalHours) * 100 : 0
                }).ToList();

            // Generate daily breakdown
            var dailyBreakdown = userTimeEntries
                .GroupBy(e => e.StartTime.Date)
                .Select(g => new DailyTimeDto
                {
                    Date = g.Key,
                    TotalHours = g.Sum(e => e.Duration),
                    BillableHours = g.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration),
                    EntryCount = g.Count()
                }).OrderBy(d => d.Date).ToList();

            // Generate report
            var report = new TimeReportDto
            {
                UserId = request.UserId,
                UserName = userTimeEntries.FirstOrDefault()?.User?.FirstName + " " + userTimeEntries.FirstOrDefault()?.User?.LastName ?? "Unknown User",
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalHours = totalHours,
                BillableHours = billableHours,
                NonBillableHours = totalHours - billableHours,
                UtilizationRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0,
                ProjectBreakdown = projectBreakdown,
                CategoryBreakdown = categoryBreakdown,
                DailyBreakdown = dailyBreakdown
            };
            
            return Result<TimeReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return Result<TimeReportDto>.Failure($"Error generating user time report: {ex.Message}");
        }
    }
}

public class GetTeamTimeReportQueryHandler : IRequestHandler<GetTeamTimeReportQuery, Result<TeamTimeReportDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetTeamTimeReportQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TeamTimeReportDto>> Handle(GetTeamTimeReportQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TeamTimeReportDto>.Failure("Invalid tenant context");
            }

            // For team report, we'll get all time entries in the date range and group by user
            var allTeamMembers = await _unitOfWork.Users.GetAllAsync(cancellationToken);
            var tenantUsers = allTeamMembers.Where(u => u.TenantId == tenantId);
            
            var userReports = new List<UserTimeReportDto>();

            foreach (var user in tenantUsers)
            {
                var userTimeEntries = await _unitOfWork.TimeEntries.GetByDateRangeAsync(
                    user.Id,
                    request.StartDate,
                    request.EndDate,
                    tenantId,
                    cancellationToken);

                if (userTimeEntries.Any())
                {
                    var totalHours = userTimeEntries.Sum(e => e.Duration);
                    var billableHours = userTimeEntries.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration);

                    var userReport = new UserTimeReportDto
                    {
                        UserId = user.Id,
                        UserName = $"{user.FirstName} {user.LastName}",
                        TotalHours = totalHours,
                        BillableHours = billableHours,
                        UtilizationRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0
                    };
                    userReports.Add(userReport);
                }
            }

            // Generate project breakdown for the team
            var allTimeEntries = new List<Domain.Entities.TimeEntry>();
            foreach (var user in tenantUsers)
            {
                var entries = await _unitOfWork.TimeEntries.GetByDateRangeAsync(
                    user.Id,
                    request.StartDate,
                    request.EndDate,
                    tenantId,
                    cancellationToken);
                allTimeEntries.AddRange(entries);
            }

            var projectBreakdown = allTimeEntries
                .Where(e => e.ProjectId.HasValue)
                .GroupBy(e => new { e.ProjectId, ProjectName = e.Project?.Name ?? "Unknown Project" })
                .Select(g => new ProjectTimeDto
                {
                    ProjectId = g.Key.ProjectId!.Value,
                    ProjectName = g.Key.ProjectName,
                    TotalHours = g.Sum(e => e.Duration),
                    BillableHours = g.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration),
                    Percentage = allTimeEntries.Sum(e => e.Duration) > 0 ? 
                        (g.Sum(e => e.Duration) / allTimeEntries.Sum(e => e.Duration)) * 100 : 0
                }).ToList();

            var totalTeamHours = userReports.Sum(ur => ur.TotalHours);

            var teamReport = new TeamTimeReportDto
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalTeamHours = totalTeamHours,
                AverageUtilization = userReports.Any() ? userReports.Average(ur => ur.UtilizationRate) : 0,
                UserReports = userReports,
                ProjectBreakdown = projectBreakdown
            };
            
            return Result<TeamTimeReportDto>.Success(teamReport);
        }
        catch (Exception ex)
        {
            return Result<TeamTimeReportDto>.Failure($"Error generating team time report: {ex.Message}");
        }
    }
}

public class GetProjectTimeReportQueryHandler : IRequestHandler<GetProjectTimeReportQuery, Result<TimeReportDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetProjectTimeReportQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<TimeReportDto>> Handle(GetProjectTimeReportQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (!Guid.TryParse(_currentUserService.TenantId, out var tenantId))
            {
                return Result<TimeReportDto>.Failure("Invalid tenant context");
            }

            var timeEntries = await _unitOfWork.TimeEntries.GetByProjectIdAsync(request.ProjectId, tenantId, cancellationToken);

            // Filter by date range
            var filteredEntries = timeEntries.Where(te => 
                te.StartTime.Date >= request.StartDate.Date && 
                te.StartTime.Date <= request.EndDate.Date).ToList();

            var totalHours = filteredEntries.Sum(e => e.Duration);
            var billableHours = filteredEntries.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration);

            // Generate user breakdown for the project
            var userBreakdown = filteredEntries
                .GroupBy(e => new { e.UserId, UserName = $"{e.User?.FirstName} {e.User?.LastName}" ?? "Unknown User" })
                .Select(g => new ProjectTimeDto
                {
                    ProjectId = g.Key.UserId, // Using ProjectId field to store UserId for user breakdown
                    ProjectName = g.Key.UserName,
                    TotalHours = g.Sum(e => e.Duration),
                    BillableHours = g.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration),
                    Percentage = totalHours > 0 ? (g.Sum(e => e.Duration) / totalHours) * 100 : 0
                }).ToList();

            // Generate category breakdown
            var categoryBreakdown = filteredEntries
                .GroupBy(e => new { e.TimeCategoryId, CategoryName = e.TimeCategory?.Name ?? "Unknown Category", e.TimeCategory?.Color })
                .Select(g => new CategoryTimeDto
                {
                    CategoryId = g.Key.TimeCategoryId,
                    CategoryName = g.Key.CategoryName,
                    CategoryColor = g.Key.Color,
                    TotalHours = g.Sum(e => e.Duration),
                    Percentage = totalHours > 0 ? (g.Sum(e => e.Duration) / totalHours) * 100 : 0
                }).ToList();

            // Generate daily breakdown
            var dailyBreakdown = filteredEntries
                .GroupBy(e => e.StartTime.Date)
                .Select(g => new DailyTimeDto
                {
                    Date = g.Key,
                    TotalHours = g.Sum(e => e.Duration),
                    BillableHours = g.Where(e => e.BillableStatus == BillableStatus.Billable).Sum(e => e.Duration),
                    EntryCount = g.Count()
                }).OrderBy(d => d.Date).ToList();

            var projectName = filteredEntries.FirstOrDefault()?.Project?.Name ?? "Unknown Project";

            var report = new TimeReportDto
            {
                UserId = Guid.Empty, // Project report doesn't have a specific user
                UserName = $"Project: {projectName}",
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalHours = totalHours,
                BillableHours = billableHours,
                NonBillableHours = totalHours - billableHours,
                UtilizationRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0,
                ProjectBreakdown = userBreakdown, // Using project breakdown to show user breakdown
                CategoryBreakdown = categoryBreakdown,
                DailyBreakdown = dailyBreakdown
            };
            
            return Result<TimeReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return Result<TimeReportDto>.Failure($"Error generating project time report: {ex.Message}");
        }
    }
}
