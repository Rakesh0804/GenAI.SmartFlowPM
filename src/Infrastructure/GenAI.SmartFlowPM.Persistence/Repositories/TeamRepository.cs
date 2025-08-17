using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;
using System.Linq.Expressions;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class TeamRepository : GenericRepository<Team>, ITeamRepository
{
    public TeamRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Team?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .FirstOrDefaultAsync(t => t.Name == name && !t.IsDeleted, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeTeamId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Teams.Where(t => t.Name == name && !t.IsDeleted);
        
        if (excludeTeamId.HasValue)
        {
            query = query.Where(t => t.Id != excludeTeamId.Value);
        }
        
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Team>> GetTeamsByLeaderIdAsync(Guid leaderId, CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .Include(t => t.Leader)
            .Include(t => t.TeamMembers.Where(tm => tm.IsActive && !tm.IsDeleted))
                .ThenInclude(tm => tm.User)
            .Where(t => t.LeaderId == leaderId && !t.IsDeleted)
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Team?> GetTeamWithMembersAsync(Guid teamId, CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .Include(t => t.TeamMembers)
                .ThenInclude(tm => tm.User)
            .Include(t => t.Leader)
            .FirstOrDefaultAsync(t => t.Id == teamId && !t.IsDeleted, cancellationToken);
    }

    public async Task<IEnumerable<Team>> GetActiveTeamsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .Include(t => t.Leader)
            .Include(t => t.TeamMembers.Where(tm => tm.IsActive && !tm.IsDeleted))
                .ThenInclude(tm => tm.User)
            .Where(t => !t.IsDeleted && t.IsActive && t.Status == Domain.Enums.TeamStatus.Active)
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Team>> SearchTeamsAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .Include(t => t.Leader)
            .Include(t => t.TeamMembers.Where(tm => tm.IsActive && !tm.IsDeleted))
                .ThenInclude(tm => tm.User)
            .Where(t => !t.IsDeleted && 
                       (t.Name.Contains(searchTerm) || 
                        (t.Description != null && t.Description.Contains(searchTerm))))
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);
    }

    public override async Task<IEnumerable<Team>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .Include(t => t.Leader)
            .Include(t => t.TeamMembers)
            .Where(t => !t.IsDeleted)
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);
    }

    public override async Task<Team?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Teams
            .Include(t => t.Leader)
            .Include(t => t.TeamMembers)
                .ThenInclude(tm => tm.User)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted, cancellationToken);
    }

    public async Task<(IEnumerable<Team> Items, int TotalCount)> GetPagedTeamsWithIncludesAsync(
        int pageNumber, 
        int pageSize, 
        Expression<Func<Team, bool>>? predicate = null,
        Expression<Func<Team, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Teams
            .Include(t => t.Leader)
            .Include(t => t.TeamMembers.Where(tm => tm.IsActive && !tm.IsDeleted))
                .ThenInclude(tm => tm.User)
            .Where(t => !t.IsDeleted); // Only filter by IsDeleted, not IsActive

        if (predicate != null)
            query = query.Where(predicate);

        var totalCount = await query.CountAsync(cancellationToken);

        if (orderBy != null)
        {
            query = ascending ? query.OrderBy(orderBy) : query.OrderByDescending(orderBy);
        }
        else
        {
            query = query.OrderBy(t => t.Name); // Default ordering by name
        }

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
}

public class TeamMemberRepository : GenericRepository<TeamMember>, ITeamMemberRepository
{
    public TeamMemberRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TeamMember>> GetByTeamIdAsync(Guid teamId, CancellationToken cancellationToken = default)
    {
        return await _context.TeamMembers
            .Include(tm => tm.User)
            .Where(tm => tm.TeamId == teamId && tm.IsActive)
            .OrderBy(tm => tm.JoinedDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<TeamMember>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.TeamMembers
            .Include(tm => tm.Team)
            .Where(tm => tm.UserId == userId && tm.IsActive)
            .OrderBy(tm => tm.JoinedDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid teamId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.TeamMembers
            .AnyAsync(tm => tm.TeamId == teamId && tm.UserId == userId && tm.IsActive, cancellationToken);
    }

    public async Task<TeamMember?> GetByTeamAndUserAsync(Guid teamId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.TeamMembers
            .Include(tm => tm.User)
            .Include(tm => tm.Team)
            .FirstOrDefaultAsync(tm => tm.TeamId == teamId && tm.UserId == userId && tm.IsActive, cancellationToken);
    }

    public async Task<IEnumerable<TeamMember>> GetActiveTeamMembersAsync(Guid teamId, CancellationToken cancellationToken = default)
    {
        return await _context.TeamMembers
            .Include(tm => tm.User)
            .Where(tm => tm.TeamId == teamId && tm.IsActive)
            .OrderBy(tm => tm.Role)
            .ThenBy(tm => tm.JoinedDate)
            .ToListAsync(cancellationToken);
    }
}
