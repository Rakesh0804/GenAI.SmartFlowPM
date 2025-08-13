using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class ProjectRepository : GenericRepository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Project?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .FirstOrDefaultAsync(p => p.Name == name && p.IsActive, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeProjectId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Projects.Where(p => p.Name == name && p.IsActive);
        
        if (excludeProjectId.HasValue)
        {
            query = query.Where(p => p.Id != excludeProjectId.Value);
        }
        
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetProjectsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Join(_context.UserProjects,
                project => project.Id,
                userProject => userProject.ProjectId,
                (project, userProject) => new { project, userProject })
            .Where(x => x.userProject.UserId == userId && x.userProject.IsActive && x.project.IsActive)
            .Select(x => x.project)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetProjectWithTasksAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.IsActive, cancellationToken);
    }

    public override async Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }

    public override async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive, cancellationToken);
    }
}
