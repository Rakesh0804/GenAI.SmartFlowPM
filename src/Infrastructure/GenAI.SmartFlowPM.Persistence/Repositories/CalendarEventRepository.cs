using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class CalendarEventRepository : GenericRepository<CalendarEvent>, ICalendarEventRepository
{
    public CalendarEventRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CalendarEvent>> GetByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.TenantId == tenantId && 
                       (e.EventCreatedBy == userId || 
                        e.Attendees.Any(a => a.UserId == userId)))
            .Include(e => e.Attendees)
            .Include(e => e.Reminders)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CalendarEvent>> GetByProjectIdAsync(Guid projectId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.ProjectId == projectId && e.TenantId == tenantId)
            .Include(e => e.Attendees)
            .Include(e => e.Reminders)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CalendarEvent>> GetByTaskIdAsync(Guid taskId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.TaskId == taskId && e.TenantId == tenantId)
            .Include(e => e.Attendees)
            .Include(e => e.Reminders)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CalendarEvent>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.TenantId == tenantId &&
                       e.StartDateTime >= startDate &&
                       e.StartDateTime <= endDate)
            .Include(e => e.Attendees)
            .Include(e => e.Reminders)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CalendarEvent>> GetByUserAndDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.TenantId == tenantId &&
                       e.StartDateTime >= startDate &&
                       e.StartDateTime <= endDate &&
                       (e.EventCreatedBy == userId || 
                        e.Attendees.Any(a => a.UserId == userId)))
            .Include(e => e.Attendees)
            .Include(e => e.Reminders)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<CalendarEvent?> GetWithAttendeesAsync(Guid eventId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.Id == eventId && e.TenantId == tenantId)
            .Include(e => e.Attendees)
                .ThenInclude(a => a.User)
            .Include(e => e.Reminders)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .Include(e => e.EventCreator)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<CalendarEvent?> GetWithRemindersAsync(Guid eventId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.Id == eventId && e.TenantId == tenantId)
            .Include(e => e.Reminders)
            .Include(e => e.Attendees)
            .Include(e => e.Recurrence)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<CalendarEvent>> GetRecurringEventsAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.TenantId == tenantId && e.IsRecurring && e.Recurrence != null)
            .Include(e => e.Recurrence)
            .Include(e => e.Attendees)
            .Include(e => e.Reminders)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<CalendarEvent> Items, int TotalCount, int PageNumber, int PageSize, int TotalPages)> GetPagedAsync(
        Guid tenantId,
        int pageNumber,
        int pageSize,
        DateTime? startDate = null,
        DateTime? endDate = null,
        EventType? eventType = null,
        EventStatus? eventStatus = null,
        string? searchTerm = null,
        Guid? projectId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.CalendarEvents
            .Where(e => e.TenantId == tenantId);

        // Apply filters
        if (startDate.HasValue)
        {
            query = query.Where(e => e.StartDateTime >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(e => e.StartDateTime <= endDate.Value);
        }

        if (eventType.HasValue)
        {
            query = query.Where(e => e.EventType == eventType.Value);
        }

        if (eventStatus.HasValue)
        {
            query = query.Where(e => e.Status == eventStatus.Value);
        }

        if (projectId.HasValue)
        {
            query = query.Where(e => e.ProjectId == projectId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(e => e.Title.Contains(searchTerm) || 
                                    (e.Description != null && e.Description.Contains(searchTerm)) ||
                                    (e.Location != null && e.Location.Contains(searchTerm)));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Include(e => e.Attendees)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .Include(e => e.EventCreator)
            .OrderBy(e => e.StartDateTime)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount, pageNumber, pageSize, totalPages);
    }

    public async Task<(IEnumerable<CalendarEvent> Items, int TotalCount, int PageNumber, int PageSize, int TotalPages)> GetUserEventsAsync(
        Guid userId,
        Guid tenantId,
        int pageNumber,
        int pageSize,
        DateTime? startDate = null,
        DateTime? endDate = null,
        EventStatus? eventStatus = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.CalendarEvents
            .Where(e => e.TenantId == tenantId && 
                       (e.EventCreatedBy == userId || 
                        e.Attendees.Any(a => a.UserId == userId)));

        // Apply filters
        if (startDate.HasValue)
        {
            query = query.Where(e => e.StartDateTime >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(e => e.StartDateTime <= endDate.Value);
        }

        if (eventStatus.HasValue)
        {
            query = query.Where(e => e.Status == eventStatus.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Include(e => e.Attendees)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .Include(e => e.EventCreator)
            .OrderBy(e => e.StartDateTime)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount, pageNumber, pageSize, totalPages);
    }

    public async Task<IEnumerable<CalendarEvent>> GetUpcomingEventsAsync(
        Guid userId,
        Guid tenantId,
        DateTime startDate,
        DateTime endDate,
        int limit,
        CancellationToken cancellationToken = default)
    {
        return await _context.CalendarEvents
            .Where(e => e.TenantId == tenantId &&
                       e.StartDateTime >= startDate &&
                       e.StartDateTime <= endDate &&
                       e.Status == EventStatus.Scheduled &&
                       (e.EventCreatedBy == userId || 
                        e.Attendees.Any(a => a.UserId == userId && a.Response == AttendeeResponse.Accepted)))
            .Include(e => e.Attendees)
            .Include(e => e.Project)
            .Include(e => e.Task)
            .OrderBy(e => e.StartDateTime)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }
}
