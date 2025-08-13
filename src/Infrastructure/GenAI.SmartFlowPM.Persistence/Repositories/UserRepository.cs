using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.Manager)
            .Include(x => x.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<User?> GetByUserNameAsync(string userName, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.Manager)
            .Include(x => x.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(x => x.UserName == userName, cancellationToken);
    }

    public async Task<bool> IsEmailExistsAsync(string email, Guid? excludeUserId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(x => x.Email == email);
        
        if (excludeUserId.HasValue)
            query = query.Where(x => x.Id != excludeUserId.Value);
            
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> IsUserNameExistsAsync(string userName, Guid? excludeUserId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(x => x.UserName == userName);
        
        if (excludeUserId.HasValue)
            query = query.Where(x => x.Id != excludeUserId.Value);
            
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<User>> GetUsersByManagerIdAsync(Guid managerId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(x => x.ManagerId == managerId)
            .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetUserWithRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.Manager)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
    }

    public async Task<User?> GetUserWithClaimsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.UserClaims)
            .ThenInclude(x => x.Claim)
            .Include(x => x.Manager)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
    }
}
