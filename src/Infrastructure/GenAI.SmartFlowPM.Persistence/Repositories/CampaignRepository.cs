using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GenAI.SmartFlowPM.Persistence.Repositories;

public class CampaignRepository : GenericRepository<Campaign>, ICampaignRepository
{
    public CampaignRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Campaign?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Campaigns
            .FirstOrDefaultAsync(c => c.Title == name, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeCampaignId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Campaigns.Where(c => c.Title == name);

        if (excludeCampaignId.HasValue)
        {
            query = query.Where(c => c.Id != excludeCampaignId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Campaign>> GetByManagerIdAsync(Guid managerId, CancellationToken cancellationToken = default)
    {
        return await _context.Campaigns
            .Where(c => c.AssignedManagers.Contains(managerId.ToString()))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Campaign>> GetByStatusAsync(CampaignStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Campaigns
            .Where(c => c.Status == (int)status)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Campaign>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Campaigns
            .Where(c => c.TargetUserIds.Contains(userId.ToString()))
            .ToListAsync(cancellationToken);
    }

    public async Task<Campaign?> GetWithEvaluationsAsync(Guid campaignId, CancellationToken cancellationToken = default)
    {
        return await _context.Campaigns
            .Include(c => c.Evaluations)
            .FirstOrDefaultAsync(c => c.Id == campaignId, cancellationToken);
    }

    public async Task<IEnumerable<Campaign>> GetActiveCampaignsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Campaigns
            .Where(c => c.Status == (int)CampaignStatus.Active)
            .ToListAsync(cancellationToken);
    }
}

public class CampaignGroupRepository : GenericRepository<CampaignGroup>, ICampaignGroupRepository
{
    public CampaignGroupRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CampaignGroup?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignGroups
            .FirstOrDefaultAsync(cg => cg.Name == name, cancellationToken);
    }

    public async Task<bool> IsNameExistsAsync(string name, Guid? excludeGroupId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.CampaignGroups.Where(cg => cg.Name == name);

        if (excludeGroupId.HasValue)
        {
            query = query.Where(cg => cg.Id != excludeGroupId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<CampaignGroup>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignGroups
            .Where(cg => cg.TargetUserIds.Contains(userId.ToString()))
            .ToListAsync(cancellationToken);
    }
}

public class CampaignEvaluationRepository : GenericRepository<CampaignEvaluation>, ICampaignEvaluationRepository
{
    public CampaignEvaluationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CampaignEvaluation>> GetByCampaignIdAsync(Guid campaignId, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignEvaluations
            .Where(ce => ce.CampaignId == campaignId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CampaignEvaluation>> GetByEvaluatorIdAsync(Guid evaluatorId, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignEvaluations
            .Where(ce => ce.EvaluatorId == evaluatorId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CampaignEvaluation>> GetByEvaluatedUserIdAsync(Guid evaluatedUserId, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignEvaluations
            .Where(ce => ce.EvaluatedUserId == evaluatedUserId)
            .ToListAsync(cancellationToken);
    }

    public async Task<CampaignEvaluation?> GetByEvaluatorAndUserAsync(Guid campaignId, Guid evaluatorId, Guid evaluatedUserId, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignEvaluations
            .FirstOrDefaultAsync(ce => ce.CampaignId == campaignId &&
                                     ce.EvaluatorId == evaluatorId &&
                                     ce.EvaluatedUserId == evaluatedUserId, cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid campaignId, Guid evaluatorId, Guid evaluatedUserId, CancellationToken cancellationToken = default)
    {
        return await _context.CampaignEvaluations
            .AnyAsync(ce => ce.CampaignId == campaignId &&
                           ce.EvaluatorId == evaluatorId &&
                           ce.EvaluatedUserId == evaluatedUserId, cancellationToken);
    }
}
