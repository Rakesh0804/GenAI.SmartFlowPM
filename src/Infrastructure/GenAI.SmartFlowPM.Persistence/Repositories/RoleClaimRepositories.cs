using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class RoleRepository : GenericRepository<Role>, IRoleRepository
{
    public RoleRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeRoleId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(x => x.Name == name);
        
        if (excludeRoleId.HasValue)
            query = query.Where(x => x.Id != excludeRoleId.Value);
            
        return await query.AnyAsync(cancellationToken);
    }
}

public class ClaimRepository : GenericRepository<Claim>, IClaimRepository
{
    public ClaimRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Claim?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeClaimId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(x => x.Name == name);
        
        if (excludeClaimId.HasValue)
            query = query.Where(x => x.Id != excludeClaimId.Value);
            
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(x => x.Name == name, cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, Guid excludeId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(x => x.Name == name && x.Id != excludeId, cancellationToken);
    }

    public async Task<IEnumerable<Claim>> GetActiveClaimsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }
}

public class UserRoleRepository : GenericRepository<UserRole>, IUserRoleRepository
{
    public UserRoleRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<UserRole>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.Role)
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserRole>> GetByRoleIdAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.User)
            .Where(x => x.RoleId == roleId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid roleId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(x => x.UserId == userId && x.RoleId == roleId, cancellationToken);
    }
}

public class UserClaimRepository : GenericRepository<UserClaim>, IUserClaimRepository
{
    public UserClaimRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<UserClaim>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.Claim)
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserClaim>> GetByClaimIdAsync(Guid claimId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(x => x.User)
            .Where(x => x.ClaimId == claimId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid claimId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(x => x.UserId == userId && x.ClaimId == claimId, cancellationToken);
    }
}
