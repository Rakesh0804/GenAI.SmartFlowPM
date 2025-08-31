using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class EventAttendeeRepository : GenericRepository<EventAttendee>, IEventAttendeeRepository
{
    public EventAttendeeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<EventAttendee>> GetByEventIdAsync(Guid eventId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventAttendees
            .Where(a => a.EventId == eventId && a.TenantId == tenantId)
            .Include(a => a.User)
            .Include(a => a.Event)
            .OrderBy(a => a.User.FirstName)
            .ThenBy(a => a.User.LastName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventAttendee>> GetByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventAttendees
            .Where(a => a.UserId == userId && a.TenantId == tenantId)
            .Include(a => a.Event)
                .ThenInclude(e => e.Project)
            .Include(a => a.Event)
                .ThenInclude(e => e.Task)
            .Include(a => a.User)
            .OrderByDescending(a => a.Event.StartDateTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<EventAttendee?> GetByEventAndUserAsync(Guid eventId, Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventAttendees
            .Where(a => a.EventId == eventId && a.UserId == userId && a.TenantId == tenantId)
            .Include(a => a.User)
            .Include(a => a.Event)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid eventId, Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventAttendees
            .AnyAsync(a => a.EventId == eventId && a.UserId == userId && a.TenantId == tenantId, cancellationToken);
    }

    public async Task<IEnumerable<EventAttendee>> GetPendingResponsesAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventAttendees
            .Where(a => a.UserId == userId && 
                       a.TenantId == tenantId && 
                       a.Response == AttendeeResponse.Pending &&
                       a.Event.StartDateTime > DateTime.UtcNow &&
                       a.Event.Status == EventStatus.Scheduled)
            .Include(a => a.Event)
                .ThenInclude(e => e.Project)
            .Include(a => a.Event)
                .ThenInclude(e => e.Task)
            .Include(a => a.Event)
                .ThenInclude(e => e.EventCreator)
            .OrderBy(a => a.Event.StartDateTime)
            .ToListAsync(cancellationToken);
    }
}
