using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class OrganizationRepository : GenericRepository<Organization>, IOrganizationRepository
{
    public OrganizationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Organization?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Organizations
            .FirstOrDefaultAsync(o => o.Name.ToLower() == name.ToLower(), cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeOrganizationId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Organizations
            .Where(o => o.Name.ToLower() == name.ToLower());

        if (excludeOrganizationId.HasValue)
        {
            query = query.Where(o => o.Id != excludeOrganizationId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<Organization?> GetWithBranchesAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.Organizations
            .Include(o => o.Branches)
                .ThenInclude(b => b.Manager)
            .FirstOrDefaultAsync(o => o.Id == organizationId, cancellationToken);
    }

    public async Task<Organization?> GetWithPoliciesAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.Organizations
            .Include(o => o.Policies)
            .FirstOrDefaultAsync(o => o.Id == organizationId, cancellationToken);
    }

    public async Task<Organization?> GetWithHolidaysAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.Organizations
            .Include(o => o.Holidays)
            .FirstOrDefaultAsync(o => o.Id == organizationId, cancellationToken);
    }
}

public class BranchRepository : GenericRepository<Branch>, IBranchRepository
{
    public BranchRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Branch>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.Branches
            .Include(b => b.Manager)
            .Where(b => b.OrganizationId == organizationId)
            .OrderBy(b => b.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Branch?> GetByNameAsync(string name, Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.Branches
            .FirstOrDefaultAsync(b => b.Name.ToLower() == name.ToLower() && b.OrganizationId == organizationId, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid organizationId, Guid? excludeBranchId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Branches
            .Where(b => b.Name.ToLower() == name.ToLower() && b.OrganizationId == organizationId);

        if (excludeBranchId.HasValue)
        {
            query = query.Where(b => b.Id != excludeBranchId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<Branch?> GetWithManagerAsync(Guid branchId, CancellationToken cancellationToken = default)
    {
        return await _context.Branches
            .Include(b => b.Manager)
            .FirstOrDefaultAsync(b => b.Id == branchId, cancellationToken);
    }
}

public class OrganizationPolicyRepository : GenericRepository<OrganizationPolicy>, IOrganizationPolicyRepository
{
    public OrganizationPolicyRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<OrganizationPolicy>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.OrganizationPolicies
            .Where(p => p.OrganizationId == organizationId)
            .OrderBy(p => p.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<OrganizationPolicy?> GetByTitleAsync(string title, Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.OrganizationPolicies
            .FirstOrDefaultAsync(p => p.Title.ToLower() == title.ToLower() && p.OrganizationId == organizationId, cancellationToken);
    }

    public async Task<IEnumerable<OrganizationPolicy>> GetActivePoliciesAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        var currentDate = DateTime.UtcNow.Date;
        
        return await _context.OrganizationPolicies
            .Where(p => p.OrganizationId == organizationId && 
                       p.IsActive && 
                       p.EffectiveDate.Date <= currentDate &&
                       (p.ExpiryDate == null || p.ExpiryDate.Value.Date > currentDate))
            .OrderBy(p => p.Title)
            .ToListAsync(cancellationToken);
    }
}

public class CompanyHolidayRepository : GenericRepository<CompanyHoliday>, ICompanyHolidayRepository
{
    public CompanyHolidayRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CompanyHoliday>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.CompanyHolidays
            .Where(h => h.OrganizationId == organizationId)
            .OrderBy(h => h.Date)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CompanyHoliday>> GetByDateRangeAsync(Guid organizationId, DateOnly startDate, DateOnly endDate, CancellationToken cancellationToken = default)
    {
        return await _context.CompanyHolidays
            .Where(h => h.OrganizationId == organizationId && 
                       h.Date >= startDate && h.Date <= endDate &&
                       h.IsActive)
            .OrderBy(h => h.Date)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CompanyHoliday>> GetRecurringHolidaysAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.CompanyHolidays
            .Where(h => h.OrganizationId == organizationId && h.IsRecurring && h.IsActive)
            .OrderBy(h => h.Date)
            .ToListAsync(cancellationToken);
    }
}

public class OrganizationSettingRepository : GenericRepository<OrganizationSetting>, IOrganizationSettingRepository
{
    public OrganizationSettingRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<OrganizationSetting>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.OrganizationSettings
            .Where(s => s.OrganizationId == organizationId)
            .OrderBy(s => s.SettingKey)
            .ToListAsync(cancellationToken);
    }

    public async Task<OrganizationSetting?> GetByKeyAsync(string key, Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.OrganizationSettings
            .FirstOrDefaultAsync(s => s.SettingKey.ToLower() == key.ToLower() && s.OrganizationId == organizationId, cancellationToken);
    }

    public async Task<IEnumerable<OrganizationSetting>> GetEditableSettingsAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await _context.OrganizationSettings
            .Where(s => s.OrganizationId == organizationId && s.IsEditable)
            .OrderBy(s => s.SettingKey)
            .ToListAsync(cancellationToken);
    }
}
