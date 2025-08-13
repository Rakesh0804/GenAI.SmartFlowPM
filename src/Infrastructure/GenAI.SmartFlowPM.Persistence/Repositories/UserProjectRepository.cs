using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class UserProjectRepository : GenericRepository<UserProject>, IUserProjectRepository
{
    public UserProjectRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<UserProject>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserProjects
            .Include(up => up.User)
            .Include(up => up.Project)
            .Where(up => up.UserId == userId && up.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserProject>> GetByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await _context.UserProjects
            .Include(up => up.User)
            .Include(up => up.Project)
            .Where(up => up.ProjectId == projectId && up.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid projectId, CancellationToken cancellationToken = default)
    {
        return await _context.UserProjects
            .AnyAsync(up => up.UserId == userId && up.ProjectId == projectId && up.IsActive, cancellationToken);
    }
}
