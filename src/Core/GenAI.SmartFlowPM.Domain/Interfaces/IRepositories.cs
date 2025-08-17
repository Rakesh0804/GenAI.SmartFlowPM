using System.Linq.Expressions;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Domain.Interfaces;

public interface ITenantRepository : IGenericRepository<Tenant>
{
    Task<Tenant?> GetBySubDomainAsync(string subDomain, CancellationToken cancellationToken = default);
    Task<bool> IsSubDomainExistsAsync(string subDomain, Guid? excludeTenantId = null, CancellationToken cancellationToken = default);
    Task<bool> IsContactEmailExistsAsync(string contactEmail, Guid? excludeTenantId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Tenant>> GetActiveTenantsAsync(CancellationToken cancellationToken = default);
}

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetByUserNameAsync(string userName, CancellationToken cancellationToken = default);
    Task<bool> IsEmailExistsAsync(string email, Guid? excludeUserId = null, CancellationToken cancellationToken = default);
    Task<bool> IsUserNameExistsAsync(string userName, Guid? excludeUserId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetUsersByManagerIdAsync(Guid managerId, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetUsersByManagerIdWithRolesAsync(Guid managerId, CancellationToken cancellationToken = default);
    Task<User?> GetUserWithRolesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetUserWithClaimsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<(IEnumerable<User> Items, int TotalCount)> GetPagedUsersWithRolesAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<User, bool>>? predicate = null,
        Expression<Func<User, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken cancellationToken = default);
}

public interface IRoleRepository : IGenericRepository<Role>
{
    Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeRoleId = null, CancellationToken cancellationToken = default);
}

public interface IClaimRepository : IGenericRepository<Claim>
{
    Task<Claim?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeClaimId = null, CancellationToken cancellationToken = default);
    Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> ExistsByNameAsync(string name, Guid excludeId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Claim>> GetActiveClaimsAsync(CancellationToken cancellationToken = default);
}

public interface IUserRoleRepository : IGenericRepository<UserRole>
{
    Task<IEnumerable<UserRole>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserRole>> GetByRoleIdAsync(Guid roleId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid userId, Guid roleId, CancellationToken cancellationToken = default);
}

public interface IUserClaimRepository : IGenericRepository<UserClaim>
{
    Task<IEnumerable<UserClaim>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserClaim>> GetByClaimIdAsync(Guid claimId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid userId, Guid claimId, CancellationToken cancellationToken = default);
}

public interface IProjectRepository : IGenericRepository<Project>
{
    Task<Project?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeProjectId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Project>> GetProjectsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Project?> GetProjectWithTasksAsync(Guid projectId, CancellationToken cancellationToken = default);
}

public interface IUserProjectRepository : IGenericRepository<UserProject>
{
    Task<IEnumerable<UserProject>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserProject>> GetByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid userId, Guid projectId, CancellationToken cancellationToken = default);
}

public interface IProjectTaskRepository : IGenericRepository<ProjectTask>
{
    Task<IEnumerable<ProjectTask>> GetByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetByAssignedUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProjectTask>> GetByParentTaskIdAsync(Guid parentTaskId, CancellationToken cancellationToken = default);
    Task<ProjectTask?> GetTaskWithSubTasksAsync(Guid taskId, CancellationToken cancellationToken = default);
}

public interface IOrganizationRepository : IGenericRepository<Organization>
{
    Task<Organization?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeOrganizationId = null, CancellationToken cancellationToken = default);
    Task<Organization?> GetWithBranchesAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<Organization?> GetWithPoliciesAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<Organization?> GetWithHolidaysAsync(Guid organizationId, CancellationToken cancellationToken = default);
}

public interface IBranchRepository : IGenericRepository<Branch>
{
    Task<IEnumerable<Branch>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<Branch?> GetByNameAsync(string name, Guid organizationId, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid organizationId, Guid? excludeBranchId = null, CancellationToken cancellationToken = default);
    Task<Branch?> GetWithManagerAsync(Guid branchId, CancellationToken cancellationToken = default);
}

public interface IOrganizationPolicyRepository : IGenericRepository<OrganizationPolicy>
{
    Task<IEnumerable<OrganizationPolicy>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<OrganizationPolicy?> GetByTitleAsync(string title, Guid organizationId, CancellationToken cancellationToken = default);
    Task<IEnumerable<OrganizationPolicy>> GetActivePoliciesAsync(Guid organizationId, CancellationToken cancellationToken = default);
}

public interface ICompanyHolidayRepository : IGenericRepository<CompanyHoliday>
{
    Task<IEnumerable<CompanyHoliday>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyHoliday>> GetByDateRangeAsync(Guid organizationId, DateOnly startDate, DateOnly endDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyHoliday>> GetRecurringHolidaysAsync(Guid organizationId, CancellationToken cancellationToken = default);
}

public interface IOrganizationSettingRepository : IGenericRepository<OrganizationSetting>
{
    Task<IEnumerable<OrganizationSetting>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<OrganizationSetting?> GetByKeyAsync(string key, Guid organizationId, CancellationToken cancellationToken = default);
    Task<IEnumerable<OrganizationSetting>> GetEditableSettingsAsync(Guid organizationId, CancellationToken cancellationToken = default);
}

public interface ICampaignRepository : IGenericRepository<Campaign>
{
    Task<Campaign?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeCampaignId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Campaign>> GetByManagerIdAsync(Guid managerId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Campaign>> GetByStatusAsync(CampaignStatus status, CancellationToken cancellationToken = default);
    Task<IEnumerable<Campaign>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Campaign?> GetWithEvaluationsAsync(Guid campaignId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Campaign>> GetActiveCampaignsAsync(CancellationToken cancellationToken = default);
}

public interface ICampaignGroupRepository : IGenericRepository<CampaignGroup>
{
    Task<CampaignGroup?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeGroupId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<CampaignGroup>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}

public interface ICampaignEvaluationRepository : IGenericRepository<CampaignEvaluation>
{
    Task<IEnumerable<CampaignEvaluation>> GetByCampaignIdAsync(Guid campaignId, CancellationToken cancellationToken = default);
    Task<IEnumerable<CampaignEvaluation>> GetByEvaluatorIdAsync(Guid evaluatorId, CancellationToken cancellationToken = default);
    Task<IEnumerable<CampaignEvaluation>> GetByEvaluatedUserIdAsync(Guid evaluatedUserId, CancellationToken cancellationToken = default);
    Task<CampaignEvaluation?> GetByEvaluatorAndUserAsync(Guid campaignId, Guid evaluatorId, Guid evaluatedUserId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid campaignId, Guid evaluatorId, Guid evaluatedUserId, CancellationToken cancellationToken = default);
}

public interface ICertificateRepository : IGenericRepository<Certificate>
{
    Task<IEnumerable<Certificate>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Certificate>> GetByCampaignIdAsync(Guid campaignId, CancellationToken cancellationToken = default);
    Task<Certificate?> GetByVerificationTokenAsync(string verificationToken, CancellationToken cancellationToken = default);
    Task<IEnumerable<Certificate>> GetByStatusAsync(CertificateStatus status, CancellationToken cancellationToken = default);
    Task<Certificate?> GetByCampaignAndUserAsync(Guid campaignId, Guid userId, CancellationToken cancellationToken = default);
}

public interface ICertificateTemplateRepository : IGenericRepository<CertificateTemplate>
{
    Task<CertificateTemplate?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeTemplateId = null, CancellationToken cancellationToken = default);
    Task<CertificateTemplate?> GetDefaultTemplateAsync(CertificateType type, CancellationToken cancellationToken = default);
    Task<IEnumerable<CertificateTemplate>> GetByTypeAsync(CertificateType type, CancellationToken cancellationToken = default);
}

public interface ITeamRepository : IGenericRepository<Team>
{
    Task<Team?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> IsNameExistsAsync(string name, Guid? excludeTeamId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Team>> GetTeamsByLeaderIdAsync(Guid leaderId, CancellationToken cancellationToken = default);
    Task<Team?> GetTeamWithMembersAsync(Guid teamId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Team>> GetActiveTeamsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Team>> SearchTeamsAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Team> Items, int TotalCount)> GetPagedTeamsWithIncludesAsync(
        int pageNumber, 
        int pageSize, 
        System.Linq.Expressions.Expression<Func<Team, bool>>? predicate = null,
        System.Linq.Expressions.Expression<Func<Team, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken cancellationToken = default);
}

public interface ITeamMemberRepository : IGenericRepository<TeamMember>
{
    Task<IEnumerable<TeamMember>> GetByTeamIdAsync(Guid teamId, CancellationToken cancellationToken = default);
    Task<IEnumerable<TeamMember>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid teamId, Guid userId, CancellationToken cancellationToken = default);
    Task<TeamMember?> GetByTeamAndUserAsync(Guid teamId, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<TeamMember>> GetActiveTeamMembersAsync(Guid teamId, CancellationToken cancellationToken = default);
}
