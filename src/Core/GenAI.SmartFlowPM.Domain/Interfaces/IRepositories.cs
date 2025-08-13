using GenAI.SmartFlowPM.Domain.Entities;

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
    Task<User?> GetUserWithRolesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetUserWithClaimsAsync(Guid userId, CancellationToken cancellationToken = default);
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
