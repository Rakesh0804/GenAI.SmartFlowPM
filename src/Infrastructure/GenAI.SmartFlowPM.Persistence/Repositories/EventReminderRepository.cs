using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class EventReminderRepository : GenericRepository<EventReminder>, IEventReminderRepository
{
    public EventReminderRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<EventReminder>> GetByEventIdAsync(Guid eventId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventReminders
            .Where(r => r.EventId == eventId && r.TenantId == tenantId)
            .Include(r => r.Event)
            .Include(r => r.User)
            .OrderBy(r => r.ReminderTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventReminder>> GetByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventReminders
            .Where(r => r.UserId == userId && r.TenantId == tenantId)
            .Include(r => r.Event)
                .ThenInclude(e => e.Project)
            .Include(r => r.Event)
                .ThenInclude(e => e.Task)
            .Include(r => r.User)
            .OrderBy(r => r.Event.StartDateTime.AddMinutes(-r.ReminderTime))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventReminder>> GetPendingRemindersAsync(DateTime checkTime, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventReminders
            .Where(r => r.TenantId == tenantId &&
                       r.Event.StartDateTime.AddMinutes(-r.ReminderTime) <= checkTime &&
                       !r.IsSent &&
                       r.IsActive &&
                       r.Event.Status == EventStatus.Scheduled &&
                       r.Event.StartDateTime > DateTime.UtcNow)
            .Include(r => r.Event)
                .ThenInclude(e => e.Project)
            .Include(r => r.Event)
                .ThenInclude(e => e.Task)
            .Include(r => r.User)
            .OrderBy(r => r.Event.StartDateTime.AddMinutes(-r.ReminderTime))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EventReminder>> GetActiveRemindersAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.EventReminders
            .Where(r => r.TenantId == tenantId &&
                       r.IsActive &&
                       !r.IsSent &&
                       r.Event.Status == EventStatus.Scheduled &&
                       r.Event.StartDateTime > DateTime.UtcNow)
            .Include(r => r.Event)
                .ThenInclude(e => e.Project)
            .Include(r => r.Event)
                .ThenInclude(e => e.Task)
            .Include(r => r.User)
            .OrderBy(r => r.Event.StartDateTime.AddMinutes(-r.ReminderTime))
            .ToListAsync(cancellationToken);
    }
}
