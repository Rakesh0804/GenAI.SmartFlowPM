using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class CertificateRepository : GenericRepository<Certificate>, ICertificateRepository
{
    public CertificateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Certificate>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Certificates
            .Where(c => c.RecipientId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Certificate>> GetByCampaignIdAsync(Guid campaignId, CancellationToken cancellationToken = default)
    {
        return await _context.Certificates
            .Where(c => c.CampaignId == campaignId)
            .ToListAsync(cancellationToken);
    }

    public async Task<Certificate?> GetByVerificationTokenAsync(string verificationToken, CancellationToken cancellationToken = default)
    {
        return await _context.Certificates
            .FirstOrDefaultAsync(c => c.VerificationToken == verificationToken, cancellationToken);
    }

    public async Task<IEnumerable<Certificate>> GetByStatusAsync(CertificateStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Certificates
            .Where(c => c.Status == (int)status)
            .ToListAsync(cancellationToken);
    }

    public async Task<Certificate?> GetByCampaignAndUserAsync(Guid campaignId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Certificates
            .FirstOrDefaultAsync(c => c.CampaignId == campaignId && c.RecipientId == userId, cancellationToken);
    }
}

public class CertificateTemplateRepository : GenericRepository<CertificateTemplate>, ICertificateTemplateRepository
{
    public CertificateTemplateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CertificateTemplate?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.CertificateTemplates
            .FirstOrDefaultAsync(ct => ct.Name == name, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeTemplateId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.CertificateTemplates.Where(ct => ct.Name == name);

        if (excludeTemplateId.HasValue)
        {
            query = query.Where(ct => ct.Id != excludeTemplateId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<CertificateTemplate?> GetDefaultTemplateAsync(CertificateType type, CancellationToken cancellationToken = default)
    {
        return await _context.CertificateTemplates
            .FirstOrDefaultAsync(ct => ct.Type == (int)type && ct.IsDefault, cancellationToken);
    }

    public async Task<IEnumerable<CertificateTemplate>> GetByTypeAsync(CertificateType type, CancellationToken cancellationToken = default)
    {
        return await _context.CertificateTemplates
            .Where(ct => ct.Type == (int)type)
            .ToListAsync(cancellationToken);
    }
}
