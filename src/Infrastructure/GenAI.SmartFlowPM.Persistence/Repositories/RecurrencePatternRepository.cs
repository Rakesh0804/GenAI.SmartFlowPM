using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class RecurrencePatternRepository : GenericRepository<RecurrencePattern>, IRecurrencePatternRepository
{
    public RecurrencePatternRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<RecurrencePattern?> GetByEventIdAsync(Guid eventId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.RecurrencePatterns
            .Where(r => r.EventId == eventId && r.TenantId == tenantId)
            .Include(r => r.Event)
                .ThenInclude(e => e.Project)
            .Include(r => r.Event)
                .ThenInclude(e => e.Task)
            .Include(r => r.Event)
                .ThenInclude(e => e.EventCreator)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<RecurrencePattern>> GetActiveRecurrencesAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.RecurrencePatterns
            .Where(r => r.TenantId == tenantId &&
                       (r.EndDate == null || r.EndDate > DateTime.UtcNow) &&
                       r.Event.Status == Domain.Enums.EventStatus.Scheduled)
            .Include(r => r.Event)
                .ThenInclude(e => e.Project)
            .Include(r => r.Event)
                .ThenInclude(e => e.Task)
            .Include(r => r.Event)
                .ThenInclude(e => e.EventCreator)
            .Include(r => r.Event)
                .ThenInclude(e => e.Attendees)
            .OrderBy(r => r.Event.StartDateTime)
            .ToListAsync(cancellationToken);
    }
}
