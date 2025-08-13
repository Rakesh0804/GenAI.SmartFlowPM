using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class TenantRepository : GenericRepository<Tenant>, ITenantRepository
{
    public TenantRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tenant?> GetBySubDomainAsync(string subDomain, CancellationToken cancellationToken = default)
    {
        return await _context.Tenants
            .FirstOrDefaultAsync(t => t.SubDomain == subDomain && !t.IsDeleted, cancellationToken);
    }

    public async Task<bool> IsSubDomainExistsAsync(string subDomain, Guid? excludeTenantId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Tenants.Where(t => t.SubDomain == subDomain && !t.IsDeleted);
        
        if (excludeTenantId.HasValue)
        {
            query = query.Where(t => t.Id != excludeTenantId.Value);
        }
        
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> IsContactEmailExistsAsync(string contactEmail, Guid? excludeTenantId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Tenants.Where(t => t.ContactEmail == contactEmail && !t.IsDeleted);
        
        if (excludeTenantId.HasValue)
        {
            query = query.Where(t => t.Id != excludeTenantId.Value);
        }
        
        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Tenant>> GetActiveTenantsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Tenants
            .Where(t => t.IsActive && !t.IsDeleted)
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);
    }
}
