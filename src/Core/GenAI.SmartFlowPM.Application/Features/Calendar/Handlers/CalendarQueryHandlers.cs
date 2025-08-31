using AutoMapper;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.Application.Features.Calendar.Queries;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using MediatR;
using System.Linq;

namespace GenAI.SmartFlowPM.Application.Features.Calendar.Handlers;

public class GetCalendarEventByIdQueryHandler : IRequestHandler<GetCalendarEventByIdQuery, Result<CalendarEventDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetCalendarEventByIdQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CalendarEventDto>> Handle(GetCalendarEventByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId) ||
                string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var currentUserId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<CalendarEventDto>.Failure("User is not authenticated");
            }

            var calendarEvent = await _unitOfWork.CalendarEvents.GetWithAttendeesAsync(request.Id, currentTenantId, cancellationToken);
            if (calendarEvent == null)
            {
                return Result<CalendarEventDto>.Failure("Calendar event not found");
            }

            var result = _mapper.Map<CalendarEventDto>(calendarEvent);
            return Result<CalendarEventDto>.Success(result);
        }
        catch (Exception)
        {
            return Result<CalendarEventDto>.Failure("An error occurred while retrieving the calendar event");
        }
    }
}

public class GetCalendarEventsQueryHandler : IRequestHandler<GetCalendarEventsQuery, Result<PaginatedResult<CalendarEventSummaryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetCalendarEventsQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<PaginatedResult<CalendarEventSummaryDto>>> Handle(GetCalendarEventsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<PaginatedResult<CalendarEventSummaryDto>>.Failure("User is not authenticated");
            }

            var (events, totalCount, pageNumber, pageSize, totalPages) = await _unitOfWork.CalendarEvents.GetPagedAsync(
                currentTenantId,
                request.PageNumber,
                request.PageSize,
                request.StartDate,
                request.EndDate,
                request.EventType,
                request.EventStatus,
                request.SearchTerm,
                request.ProjectId,
                cancellationToken);

            var eventSummaries = _mapper.Map<IEnumerable<CalendarEventSummaryDto>>(events);
            var result = new PaginatedResult<CalendarEventSummaryDto>
            {
                Items = eventSummaries,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };

            return Result<PaginatedResult<CalendarEventSummaryDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<PaginatedResult<CalendarEventSummaryDto>>.Failure("An error occurred while retrieving calendar events");
        }
    }
}

public class GetUserCalendarEventsQueryHandler : IRequestHandler<GetUserCalendarEventsQuery, Result<PaginatedResult<CalendarEventSummaryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetUserCalendarEventsQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<PaginatedResult<CalendarEventSummaryDto>>> Handle(GetUserCalendarEventsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<PaginatedResult<CalendarEventSummaryDto>>.Failure("User is not authenticated");
            }

            var (events, totalCount, pageNumber, pageSize, totalPages) = await _unitOfWork.CalendarEvents.GetUserEventsAsync(
                request.UserId,
                currentTenantId,
                request.PageNumber,
                request.PageSize,
                request.StartDate,
                request.EndDate,
                request.EventStatus,
                cancellationToken);

            var eventSummaries = _mapper.Map<IEnumerable<CalendarEventSummaryDto>>(events);
            var result = new PaginatedResult<CalendarEventSummaryDto>
            {
                Items = eventSummaries,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };

            return Result<PaginatedResult<CalendarEventSummaryDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<PaginatedResult<CalendarEventSummaryDto>>.Failure("An error occurred while retrieving user calendar events");
        }
    }
}

public class GetUpcomingEventsQueryHandler : IRequestHandler<GetUpcomingEventsQuery, Result<IEnumerable<CalendarEventSummaryDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetUpcomingEventsQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<CalendarEventSummaryDto>>> Handle(GetUpcomingEventsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<CalendarEventSummaryDto>>.Failure("User is not authenticated");
            }

            var events = await _unitOfWork.CalendarEvents.GetUpcomingEventsAsync(
                request.UserId,
                currentTenantId,
                request.StartDate,
                request.EndDate,
                request.Limit,
                cancellationToken);

            var eventSummaries = _mapper.Map<IEnumerable<CalendarEventSummaryDto>>(events);
            return Result<IEnumerable<CalendarEventSummaryDto>>.Success(eventSummaries);
        }
        catch (Exception)
        {
            return Result<IEnumerable<CalendarEventSummaryDto>>.Failure("An error occurred while retrieving upcoming events");
        }
    }
}

public class GetEventAttendeesQueryHandler : IRequestHandler<GetEventAttendeesQuery, Result<IEnumerable<EventAttendeeDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetEventAttendeesQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<EventAttendeeDto>>> Handle(GetEventAttendeesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<EventAttendeeDto>>.Failure("User is not authenticated");
            }

            var attendees = await _unitOfWork.EventAttendees.GetByEventIdAsync(request.EventId, currentTenantId, cancellationToken);
            var result = _mapper.Map<IEnumerable<EventAttendeeDto>>(attendees);

            return Result<IEnumerable<EventAttendeeDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<EventAttendeeDto>>.Failure("An error occurred while retrieving event attendees");
        }
    }
}

public class GetEventRemindersQueryHandler : IRequestHandler<GetEventRemindersQuery, Result<IEnumerable<EventReminderDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetEventRemindersQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<EventReminderDto>>> Handle(GetEventRemindersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<EventReminderDto>>.Failure("User is not authenticated");
            }

            var reminders = await _unitOfWork.EventReminders.GetByEventIdAsync(request.EventId, currentTenantId, cancellationToken);
            var result = _mapper.Map<IEnumerable<EventReminderDto>>(reminders);

            return Result<IEnumerable<EventReminderDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<EventReminderDto>>.Failure("An error occurred while retrieving event reminders");
        }
    }
}

// Additional Query Handlers for Complete Calendar Module

public class GetCalendarEventsByUserQueryHandler : IRequestHandler<GetCalendarEventsByUserQuery, Result<IEnumerable<CalendarEventDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetCalendarEventsByUserQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<CalendarEventDto>>> Handle(GetCalendarEventsByUserQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<CalendarEventDto>>.Failure("User is not authenticated");
            }

            var events = await _unitOfWork.CalendarEvents.GetByUserIdAsync(
                request.UserId,
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<CalendarEventDto>>(events);
            return Result<IEnumerable<CalendarEventDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<CalendarEventDto>>.Failure("An error occurred while retrieving user calendar events");
        }
    }
}

public class GetCalendarEventsByProjectQueryHandler : IRequestHandler<GetCalendarEventsByProjectQuery, Result<IEnumerable<CalendarEventDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetCalendarEventsByProjectQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<CalendarEventDto>>> Handle(GetCalendarEventsByProjectQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<CalendarEventDto>>.Failure("User is not authenticated");
            }

            var events = await _unitOfWork.CalendarEvents.GetByProjectIdAsync(
                request.ProjectId,
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<CalendarEventDto>>(events);
            return Result<IEnumerable<CalendarEventDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<CalendarEventDto>>.Failure("An error occurred while retrieving project calendar events");
        }
    }
}

public class GetCalendarEventsByTaskQueryHandler : IRequestHandler<GetCalendarEventsByTaskQuery, Result<IEnumerable<CalendarEventDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetCalendarEventsByTaskQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<CalendarEventDto>>> Handle(GetCalendarEventsByTaskQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<CalendarEventDto>>.Failure("User is not authenticated");
            }

            var events = await _unitOfWork.CalendarEvents.GetByTaskIdAsync(
                request.TaskId,
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<CalendarEventDto>>(events);
            return Result<IEnumerable<CalendarEventDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<CalendarEventDto>>.Failure("An error occurred while retrieving task calendar events");
        }
    }
}

public class GetMonthlyCalendarQueryHandler : IRequestHandler<GetMonthlyCalendarQuery, Result<MonthlyCalendarDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetMonthlyCalendarQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<MonthlyCalendarDto>> Handle(GetMonthlyCalendarQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Add logging for debugging
            var userId = _currentUserService.UserId;
            var tenantId = _currentUserService.TenantId;
            var isAuth = _currentUserService.IsAuthenticated;
            
            Console.WriteLine($"Calendar Debug - UserId: {userId}, TenantId: {tenantId}, IsAuth: {isAuth}");
            
            Guid currentTenantId;
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out currentTenantId))
            {
                Console.WriteLine($"Calendar Debug - No tenant ID provided, using default tenant");
                // For testing, get the first available tenant
                var tenants = await _unitOfWork.Tenants.GetAllAsync(cancellationToken);
                var defaultTenant = tenants.FirstOrDefault();
                if (defaultTenant == null)
                {
                    Console.WriteLine("Calendar Error - No tenants found in database");
                    return Result<MonthlyCalendarDto>.Failure("No tenants available");
                }
                currentTenantId = defaultTenant.Id;
                Console.WriteLine($"Calendar Debug - Using default tenant: {currentTenantId}");
            }

            var startDate = new DateTime(request.Year, request.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endDate = startDate.AddMonths(1).AddDays(-1).Date.AddDays(1).AddTicks(-1);

            Console.WriteLine($"Calendar Debug - Fetching events from {startDate:yyyy-MM-dd HH:mm:ss} UTC to {endDate:yyyy-MM-dd HH:mm:ss} UTC for tenant {currentTenantId}");

            var events = await _unitOfWork.CalendarEvents.GetByDateRangeAsync(
                startDate,
                endDate,
                currentTenantId,
                cancellationToken);

            Console.WriteLine($"Calendar Debug - Found {events.Count()} events");

            var monthlyCalendar = new MonthlyCalendarDto
            {
                Year = request.Year,
                Month = request.Month,
                MonthName = startDate.ToString("MMMM"),
                StartDate = startDate,
                EndDate = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month), 23, 59, 59, DateTimeKind.Utc),
                Events = _mapper.Map<IEnumerable<CalendarEventSummaryDto>>(events).ToList(),
                TotalEvents = events.Count()
            };

            Console.WriteLine($"Calendar Debug - Returning {monthlyCalendar.Events.Count} events for {monthlyCalendar.MonthName} {monthlyCalendar.Year}");
            return Result<MonthlyCalendarDto>.Success(monthlyCalendar);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Calendar Exception: {ex.Message}");
            Console.WriteLine($"Calendar Stack Trace: {ex.StackTrace}");
            return Result<MonthlyCalendarDto>.Failure($"An error occurred while retrieving monthly calendar: {ex.Message}");
        }
    }
}

public class GetWeeklyCalendarQueryHandler : IRequestHandler<GetWeeklyCalendarQuery, Result<WeeklyCalendarDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetWeeklyCalendarQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<WeeklyCalendarDto>> Handle(GetWeeklyCalendarQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<WeeklyCalendarDto>.Failure("User is not authenticated");
            }

            var endDate = request.StartDate.AddDays(6);

            // Ensure UTC DateTimes for PostgreSQL compatibility
            var startDateUtc = DateTime.SpecifyKind(request.StartDate.Date, DateTimeKind.Utc);
            var endDateUtc = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);

            var events = await _unitOfWork.CalendarEvents.GetByDateRangeAsync(
                startDateUtc,
                endDateUtc,
                currentTenantId,
                cancellationToken);

            var weeklyCalendar = new WeeklyCalendarDto
            {
                StartDate = startDateUtc,
                EndDate = DateTime.SpecifyKind(endDate.Date.AddHours(23).AddMinutes(59).AddSeconds(59), DateTimeKind.Utc),
                Events = _mapper.Map<IEnumerable<CalendarEventSummaryDto>>(events).ToList()
            };

            return Result<WeeklyCalendarDto>.Success(weeklyCalendar);
        }
        catch (Exception)
        {
            return Result<WeeklyCalendarDto>.Failure("An error occurred while retrieving weekly calendar");
        }
    }
}

public class GetDailyCalendarQueryHandler : IRequestHandler<GetDailyCalendarQuery, Result<DailyCalendarDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetDailyCalendarQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<DailyCalendarDto>> Handle(GetDailyCalendarQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<DailyCalendarDto>.Failure("User is not authenticated");
            }

            // Ensure UTC DateTimes for PostgreSQL compatibility
            var startDateUtc = DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Utc);
            var endDateUtc = DateTime.SpecifyKind(request.Date.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);

            var events = await _unitOfWork.CalendarEvents.GetByDateRangeAsync(
                startDateUtc,
                endDateUtc,
                currentTenantId,
                cancellationToken);

            var dailyCalendar = new DailyCalendarDto
            {
                Date = DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Utc),
                Events = _mapper.Map<IEnumerable<CalendarEventSummaryDto>>(events).ToList()
            };

            return Result<DailyCalendarDto>.Success(dailyCalendar);
        }
        catch (Exception)
        {
            return Result<DailyCalendarDto>.Failure("An error occurred while retrieving daily calendar");
        }
    }
}

// Alias Handlers for Controller Compatibility
public class GetPendingResponsesQueryHandler : IRequestHandler<GetPendingResponsesQuery, Result<IEnumerable<EventAttendeeDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetPendingResponsesQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<EventAttendeeDto>>> Handle(GetPendingResponsesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<EventAttendeeDto>>.Failure("User is not authenticated");
            }

            var pendingAttendees = await _unitOfWork.EventAttendees.GetPendingResponsesAsync(
                request.UserId,
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<EventAttendeeDto>>(pendingAttendees);
            return Result<IEnumerable<EventAttendeeDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<EventAttendeeDto>>.Failure("An error occurred while retrieving pending responses");
        }
    }
}

public class GetEventAttendeeByUserQueryHandler : IRequestHandler<GetEventAttendeeByUserQuery, Result<EventAttendeeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetEventAttendeeByUserQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<EventAttendeeDto>> Handle(GetEventAttendeeByUserQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<EventAttendeeDto>.Failure("User is not authenticated");
            }

            var attendee = await _unitOfWork.EventAttendees.GetByEventAndUserAsync(
                request.EventId,
                request.UserId,
                currentTenantId,
                cancellationToken);

            if (attendee == null)
            {
                return Result<EventAttendeeDto>.Failure("Event attendee not found");
            }

            var result = _mapper.Map<EventAttendeeDto>(attendee);
            return Result<EventAttendeeDto>.Success(result);
        }
        catch (Exception)
        {
            return Result<EventAttendeeDto>.Failure("An error occurred while retrieving event attendee");
        }
    }
}

public class GetActiveRemindersQueryHandler : IRequestHandler<GetActiveRemindersQuery, Result<IEnumerable<EventReminderDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetActiveRemindersQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<EventReminderDto>>> Handle(GetActiveRemindersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<EventReminderDto>>.Failure("User is not authenticated");
            }

            var activeReminders = await _unitOfWork.EventReminders.GetActiveRemindersAsync(
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<EventReminderDto>>(activeReminders);
            return Result<IEnumerable<EventReminderDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<EventReminderDto>>.Failure("An error occurred while retrieving active reminders");
        }
    }
}

public class GetUserEventRemindersQueryHandler : IRequestHandler<GetUserEventRemindersQuery, Result<IEnumerable<EventReminderDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetUserEventRemindersQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<EventReminderDto>>> Handle(GetUserEventRemindersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<EventReminderDto>>.Failure("User is not authenticated");
            }

            var reminders = await _unitOfWork.EventReminders.GetByUserIdAsync(
                request.UserId,
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<EventReminderDto>>(reminders);
            return Result<IEnumerable<EventReminderDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<EventReminderDto>>.Failure("An error occurred while retrieving user event reminders");
        }
    }
}

public class GetPendingRemindersQueryHandler : IRequestHandler<GetPendingRemindersQuery, Result<IEnumerable<EventReminderDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetPendingRemindersQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<IEnumerable<EventReminderDto>>> Handle(GetPendingRemindersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<IEnumerable<EventReminderDto>>.Failure("User is not authenticated");
            }

            var pendingReminders = await _unitOfWork.EventReminders.GetPendingRemindersAsync(
                request.CheckTime,
                currentTenantId,
                cancellationToken);

            var result = _mapper.Map<IEnumerable<EventReminderDto>>(pendingReminders);
            return Result<IEnumerable<EventReminderDto>>.Success(result);
        }
        catch (Exception)
        {
            return Result<IEnumerable<EventReminderDto>>.Failure("An error occurred while retrieving pending reminders");
        }
    }
}

// Calendar View Query Handlers for Controller Compatibility
public class GetMonthlyCalendarViewQueryHandler : IRequestHandler<GetMonthlyCalendarViewQuery, Result<MonthlyCalendarDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetMonthlyCalendarViewQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<MonthlyCalendarDto>> Handle(GetMonthlyCalendarViewQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = new GetMonthlyCalendarQuery
        {
            Year = request.Year,
            Month = request.Month,
            UserId = request.UserId
        };
        
        var baseHandler = new GetMonthlyCalendarQueryHandler(_unitOfWork, _mapper, _currentUserService);
        return await baseHandler.Handle(baseQuery, cancellationToken);
    }
}

public class GetWeeklyCalendarViewQueryHandler : IRequestHandler<GetWeeklyCalendarViewQuery, Result<WeeklyCalendarDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetWeeklyCalendarViewQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<WeeklyCalendarDto>> Handle(GetWeeklyCalendarViewQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = new GetWeeklyCalendarQuery
        {
            StartDate = request.StartDate,
            UserId = request.UserId
        };
        
        var baseHandler = new GetWeeklyCalendarQueryHandler(_unitOfWork, _mapper, _currentUserService);
        return await baseHandler.Handle(baseQuery, cancellationToken);
    }
}

public class GetDailyCalendarViewQueryHandler : IRequestHandler<GetDailyCalendarViewQuery, Result<DailyCalendarDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetDailyCalendarViewQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<DailyCalendarDto>> Handle(GetDailyCalendarViewQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = new GetDailyCalendarQuery
        {
            Date = request.Date,
            UserId = request.UserId
        };
        
        var baseHandler = new GetDailyCalendarQueryHandler(_unitOfWork, _mapper, _currentUserService);
        return await baseHandler.Handle(baseQuery, cancellationToken);
    }
}
