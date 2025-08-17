using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class TimeCategoryRepository : GenericRepository<TimeCategory>, ITimeCategoryRepository
{
    public TimeCategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<TimeCategory?> GetByNameAsync(string name, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(tc => tc.Name == name && tc.TenantId == tenantId, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid tenantId, Guid? excludeCategoryId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(tc => tc.Name == name && tc.TenantId == tenantId);

        if (excludeCategoryId.HasValue)
            query = query.Where(tc => tc.Id != excludeCategoryId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<TimeCategory>> GetActiveAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(tc => tc.IsActive && tc.TenantId == tenantId)
            .OrderBy(tc => tc.Name)
            .ToListAsync(cancellationToken);
    }
}

public class TimeEntryRepository : GenericRepository<TimeEntry>, ITimeEntryRepository
{
    public TimeEntryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TimeEntry>> GetByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(te => te.TimeCategory)
            .Include(te => te.Project)
            .Include(te => te.Task)
            .Where(te => te.UserId == userId && te.TenantId == tenantId && te.IsActive)
            .OrderByDescending(te => te.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TimeEntry>> GetByProjectIdAsync(Guid projectId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(te => te.TimeCategory)
            .Include(te => te.User)
            .Include(te => te.Task)
            .Where(te => te.ProjectId == projectId && te.TenantId == tenantId && te.IsActive)
            .OrderByDescending(te => te.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TimeEntry>> GetByTaskIdAsync(Guid taskId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(te => te.TimeCategory)
            .Include(te => te.User)
            .Include(te => te.Project)
            .Where(te => te.TaskId == taskId && te.TenantId == tenantId && te.IsActive)
            .OrderByDescending(te => te.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TimeEntry>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(te => te.TimeCategory)
            .Include(te => te.Project)
            .Include(te => te.Task)
            .Where(te => te.UserId == userId && 
                        te.TenantId == tenantId && 
                        te.IsActive &&
                        te.StartTime >= startDate && 
                        te.StartTime <= endDate)
            .OrderByDescending(te => te.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TimeEntry>> GetByTimesheetIdAsync(Guid timesheetId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(te => te.TimeCategory)
            .Include(te => te.Project)
            .Include(te => te.Task)
            .Where(te => te.TimesheetId == timesheetId && te.TenantId == tenantId && te.IsActive)
            .OrderByDescending(te => te.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetTotalHoursByUserAsync(Guid userId, DateTime startDate, DateTime endDate, Guid tenantId, CancellationToken cancellationToken = default)
    {
        var totalMinutes = await _dbSet
            .Where(te => te.UserId == userId && 
                        te.TenantId == tenantId && 
                        te.IsActive &&
                        te.StartTime >= startDate && 
                        te.StartTime <= endDate)
            .SumAsync(te => te.Duration, cancellationToken);

        return (decimal)totalMinutes / 60; // Convert minutes to hours
    }

    public async Task<decimal> GetBillableHoursByUserAsync(Guid userId, DateTime startDate, DateTime endDate, Guid tenantId, CancellationToken cancellationToken = default)
    {
        var totalMinutes = await _dbSet
            .Where(te => te.UserId == userId && 
                        te.TenantId == tenantId && 
                        te.IsActive &&
                        te.BillableStatus == BillableStatus.Billable &&
                        te.StartTime >= startDate && 
                        te.StartTime <= endDate)
            .SumAsync(te => te.Duration, cancellationToken);

        return (decimal)totalMinutes / 60; // Convert minutes to hours
    }
}

public class TimesheetRepository : GenericRepository<Timesheet>, ITimesheetRepository
{
    public TimesheetRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Timesheet>> GetByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ts => ts.TimeEntries)
            .Where(ts => ts.UserId == userId && ts.TenantId == tenantId)
            .OrderByDescending(ts => ts.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Timesheet?> GetByUserAndDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ts => ts.TimeEntries)
            .FirstOrDefaultAsync(ts => ts.UserId == userId && 
                                     ts.TenantId == tenantId &&
                                     ts.StartDate == startDate && 
                                     ts.EndDate == endDate, cancellationToken);
    }

    public async Task<IEnumerable<Timesheet>> GetPendingApprovalsAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ts => ts.User)
            .Include(ts => ts.TimeEntries)
            .Where(ts => ts.TenantId == tenantId && ts.Status == TimesheetStatus.Submitted)
            .OrderBy(ts => ts.SubmittedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Timesheet>> GetByStatusAsync(TimesheetStatus status, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ts => ts.User)
            .Include(ts => ts.TimeEntries)
            .Where(ts => ts.TenantId == tenantId && ts.Status == status)
            .OrderByDescending(ts => ts.StartDate)
            .ToListAsync(cancellationToken);
    }
}

public class ActiveTrackingSessionRepository : GenericRepository<ActiveTrackingSession>, IActiveTrackingSessionRepository
{
    public ActiveTrackingSessionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ActiveTrackingSession?> GetActiveByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ats => ats.TimeCategory)
            .Include(ats => ats.Project)
            .Include(ats => ats.Task)
            .FirstOrDefaultAsync(ats => ats.UserId == userId && 
                                       ats.TenantId == tenantId && 
                                       ats.IsActive &&
                                       ats.Status == TrackingStatus.Running, cancellationToken);
    }

    public async Task<IEnumerable<ActiveTrackingSession>> GetByUserIdAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ats => ats.TimeCategory)
            .Include(ats => ats.Project)
            .Include(ats => ats.Task)
            .Where(ats => ats.UserId == userId && ats.TenantId == tenantId)
            .OrderByDescending(ats => ats.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task StopAllActiveSessionsAsync(Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        var activeSessions = await _dbSet
            .Where(ats => ats.UserId == userId && 
                         ats.TenantId == tenantId && 
                         ats.IsActive &&
                         ats.Status == TrackingStatus.Running)
            .ToListAsync(cancellationToken);

        foreach (var session in activeSessions)
        {
            session.Status = TrackingStatus.Stopped;
            session.IsActive = false;
        }

        _context.UpdateRange(activeSessions);
    }
}
