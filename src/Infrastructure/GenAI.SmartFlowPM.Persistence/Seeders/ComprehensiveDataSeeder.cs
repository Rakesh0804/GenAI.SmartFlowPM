using Bogus;
using GenAI.SmartFlowPM.Domain.Common.Constants;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace GenAI.SmartFlowPM.Persistence.Seeders;

public class ComprehensiveDataSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly ICounterService _counterService;
    private Guid _defaultTenantId;

    public ComprehensiveDataSeeder(ApplicationDbContext context, IPasswordHashingService passwordHashingService, ICounterService counterService)
    {
        _context = context;
        _passwordHashingService = passwordHashingService;
        _counterService = counterService;
    }

    public async Task SeedAllEntitiesAsync(bool forceReseed = false)
    {
        Console.WriteLine("Starting comprehensive data seeding...");
        
        if (forceReseed)
        {
            Console.WriteLine("Force reseed requested - clearing existing data...");
            await ClearAllDataAsync();
        }

        // Always ensure we have a default tenant
        await EnsureDefaultTenantAsync();
        
        // Seed each entity type independently
        await SeedEntityIfEmpty<Role>("Roles", SeedRolesAsync);
        await SeedEntityIfEmpty<Claim>("Claims", SeedClaimsAsync);
        await SeedEntityIfEmpty<User>("Users", SeedUsersAsync);
        await SeedEntityIfEmpty<Organization>("Organizations", SeedOrganizationsAsync);
        
        // These depend on users and organizations
        await SeedUserRolesAndClaimsIfNeeded();
        await SeedEntityIfEmpty<Branch>("Branches", SeedBranchesAsync);
        await SeedEntityIfEmpty<OrganizationPolicy>("Organization Policies", SeedOrganizationPoliciesAsync);
        await SeedEntityIfEmpty<CompanyHoliday>("Company Holidays", SeedCompanyHolidaysAsync);
        await SeedEntityIfEmpty<OrganizationSetting>("Organization Settings", SeedOrganizationSettingsAsync);
        
        // Projects and related entities
        await SeedEntityIfEmpty<Project>("Projects", SeedProjectsAsync);
        await SeedUserProjectsIfNeeded();
        await SeedTasksIfNeeded();
        
        // Teams and related entities
        await SeedEntityIfEmpty<Team>("Teams", SeedTeamsAsync);
        await SeedTeamMembersIfNeeded();

        // TimeTracker entities
        await SeedEntityIfEmpty<TimeCategory>("Time Categories", SeedTimeCategoriesAsync);
        await SeedEntityIfEmpty<Timesheet>("Timesheets", SeedTimesheetsAsync);
        await SeedEntityIfEmpty<TimeEntry>("Time Entries", SeedTimeEntriesAsync);
        await SeedEntityIfEmpty<ActiveTrackingSession>("Active Tracking Sessions", SeedActiveTrackingSessionsAsync);

        // Calendar entities
        await SeedEntityIfEmpty<CalendarEvent>("Calendar Events", SeedCalendarEventsAsync);
        await SeedCalendarAttendeesIfNeeded();
        await SeedCalendarRemindersIfNeeded();

        // Campaign entities
        await SeedEntityIfEmpty<Campaign>("Campaigns", SeedCampaignsAsync);
        await SeedEntityIfEmpty<CampaignGroup>("Campaign Groups", SeedCampaignGroupsAsync);
        await SeedEntityIfEmpty<CampaignEvaluation>("Campaign Evaluations", SeedCampaignEvaluationsAsync);

        Console.WriteLine("Comprehensive data seeding completed successfully!");
    }

    private async Task<bool> SeedEntityIfEmpty<T>(string entityName, Func<Task> seedAction) where T : class
    {
        var dbSet = _context.Set<T>();
        var count = await dbSet.CountAsync();
        
        if (count == 0)
        {
            Console.WriteLine($"Seeding {entityName}...");
            await seedAction();
            await _context.SaveChangesAsync();
            
            var newCount = await dbSet.CountAsync();
            Console.WriteLine($"Seeded {newCount} {entityName}.");
            return true;
        }
        else
        {
            Console.WriteLine($"{entityName} already exist ({count} records), skipping.");
            return false;
        }
    }

    private async Task EnsureDefaultTenantAsync()
    {
        var existingTenant = await _context.Tenants.FirstOrDefaultAsync();
        if (existingTenant != null)
        {
            _defaultTenantId = existingTenant.Id;
            Console.WriteLine($"Using existing tenant: {existingTenant.Name} (ID: {_defaultTenantId})");
        }
        else
        {
            Console.WriteLine("Creating default tenant...");
            _defaultTenantId = Guid.NewGuid();
            
            var defaultTenant = new Tenant
            {
                Id = _defaultTenantId,
                Name = "Default Organization",
                Description = "Default tenant for SmartFlowPM",
                ContactEmail = "admin@smartflowpm.com",
                ContactPhone = "+1-555-0100",
                Address = "123 Business Center",
                City = "San Francisco",
                State = "CA",
                PostalCode = "94105",
                Country = "United States",
                TimeZone = "PST",
                Currency = "USD",
                MaxUsers = 100,
                MaxProjects = 50,
                SubscriptionPlan = "Enterprise",
                SubscriptionStartDate = DateTime.UtcNow,
                SubscriptionEndDate = DateTime.UtcNow.AddYears(1),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            await _context.Tenants.AddAsync(defaultTenant);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Created default tenant with ID: {_defaultTenantId}");
        }
    }

    private async Task SeedRolesAsync()
    {
        var roles = new[]
        {
            new Role { Id = Guid.NewGuid(), Name = "Admin", Description = "System Administrator", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Role { Id = Guid.NewGuid(), Name = "ProjectManager", Description = "Project Manager", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Role { Id = Guid.NewGuid(), Name = "TeamLead", Description = "Team Lead", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Role { Id = Guid.NewGuid(), Name = "Developer", Description = "Software Developer", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Role { Id = Guid.NewGuid(), Name = "Tester", Description = "Quality Assurance Tester", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Role { Id = Guid.NewGuid(), Name = "Viewer", Description = "Read-only Access", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" }
        };

        await _context.Roles.AddRangeAsync(roles);
    }

    private async Task SeedClaimsAsync()
    {
        var claims = new[]
        {
            // User permissions
            new Claim { Id = Guid.NewGuid(), Name = "users.create", Type = "permission", Description = "Create users", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "users.read", Type = "permission", Description = "Read users", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "users.update", Type = "permission", Description = "Update users", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "users.delete", Type = "permission", Description = "Delete users", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            
            // Project permissions
            new Claim { Id = Guid.NewGuid(), Name = "projects.create", Type = "permission", Description = "Create projects", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "projects.read", Type = "permission", Description = "Read projects", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "projects.update", Type = "permission", Description = "Update projects", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "projects.delete", Type = "permission", Description = "Delete projects", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            
            // Task permissions
            new Claim { Id = Guid.NewGuid(), Name = "tasks.create", Type = "permission", Description = "Create tasks", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "tasks.read", Type = "permission", Description = "Read tasks", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "tasks.update", Type = "permission", Description = "Update tasks", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "tasks.delete", Type = "permission", Description = "Delete tasks", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            
            // Organization permissions
            new Claim { Id = Guid.NewGuid(), Name = "organizations.create", Type = "permission", Description = "Create organizations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "organizations.read", Type = "permission", Description = "Read organizations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "organizations.update", Type = "permission", Description = "Update organizations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "organizations.delete", Type = "permission", Description = "Delete organizations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            
            // Branch permissions
            new Claim { Id = Guid.NewGuid(), Name = "branches.create", Type = "permission", Description = "Create branches", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "branches.read", Type = "permission", Description = "Read branches", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "branches.update", Type = "permission", Description = "Update branches", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "branches.delete", Type = "permission", Description = "Delete branches", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            
            // Campaign permissions
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.create", Type = "permission", Description = "Create campaigns", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.read", Type = "permission", Description = "Read campaigns", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.update", Type = "permission", Description = "Update campaigns", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.delete", Type = "permission", Description = "Delete campaigns", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.groups.create", Type = "permission", Description = "Create campaign groups", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.groups.read", Type = "permission", Description = "Read campaign groups", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.groups.update", Type = "permission", Description = "Update campaign groups", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.groups.delete", Type = "permission", Description = "Delete campaign groups", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.evaluations.create", Type = "permission", Description = "Create campaign evaluations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.evaluations.read", Type = "permission", Description = "Read campaign evaluations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.evaluations.update", Type = "permission", Description = "Update campaign evaluations", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "campaigns.dashboard.view", Type = "permission", Description = "View campaign dashboard", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            
            // General permissions
            new Claim { Id = Guid.NewGuid(), Name = "reports.view", Type = "permission", Description = "View reports", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new Claim { Id = Guid.NewGuid(), Name = "admin.access", Type = "permission", Description = "Admin panel access", IsActive = true, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" }
        };

        await _context.Claims.AddRangeAsync(claims);
    }

    private async Task SeedUsersAsync()
    {
        var adminId = Guid.NewGuid();
        var managerId = Guid.NewGuid();

        var users = new[]
        {
            new User
            {
                Id = adminId,
                FirstName = "System",
                LastName = "Administrator",
                Email = "admin@smartflowpm.com",
                UserName = "admin",
                PasswordHash = _passwordHashingService.HashPassword("Admin123!"),
                PhoneNumber = "+1234567890",
                IsActive = true,
                TenantId = _defaultTenantId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new User
            {
                Id = managerId,
                FirstName = "John",
                LastName = "Manager",
                Email = "john.manager@smartflowpm.com",
                UserName = "jmanager",
                PasswordHash = _passwordHashingService.HashPassword("Manager123!"),
                PhoneNumber = "+1234567891",
                IsActive = true,
                TenantId = _defaultTenantId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Jane",
                LastName = "Developer",
                Email = "jane.developer@smartflowpm.com",
                UserName = "jdeveloper",
                PasswordHash = _passwordHashingService.HashPassword("Developer123!"),
                PhoneNumber = "+1234567892",
                ManagerId = managerId,
                IsActive = true,
                TenantId = _defaultTenantId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Bob",
                LastName = "Tester",
                Email = "bob.tester@smartflowpm.com",
                UserName = "btester",
                PasswordHash = _passwordHashingService.HashPassword("Tester123!"),
                PhoneNumber = "+1234567893",
                ManagerId = managerId,
                IsActive = true,
                TenantId = _defaultTenantId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Alice",
                LastName = "Designer",
                Email = "alice.designer@smartflowpm.com",
                UserName = "adesigner",
                PasswordHash = _passwordHashingService.HashPassword("Designer123!"),
                PhoneNumber = "+1234567894",
                ManagerId = managerId,
                IsActive = true,
                TenantId = _defaultTenantId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }
        };

        await _context.Users.AddRangeAsync(users);
    }

    private async Task SeedUserRolesAndClaimsIfNeeded()
    {
        var userRoleCount = await _context.UserRoles.CountAsync();
        var userClaimCount = await _context.UserClaims.CountAsync();

        if (userRoleCount == 0)
        {
            Console.WriteLine("Seeding user roles...");
            await SeedUserRolesAsync();
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {await _context.UserRoles.CountAsync()} user roles.");
        }

        if (userClaimCount == 0)
        {
            Console.WriteLine("Seeding user claims...");
            await SeedUserClaimsAsync();
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {await _context.UserClaims.CountAsync()} user claims.");
        }
    }

    private async Task SeedUserRolesAsync()
    {
        var roles = await _context.Roles.Where(r => !r.IsDeleted).ToListAsync();
        var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();

        if (!roles.Any() || !users.Any())
        {
            Console.WriteLine("Cannot seed user roles - missing roles or users");
            return;
        }

        var userRoles = new List<UserRole>();

        // Assign specific roles to specific users
        var adminRole = roles.FirstOrDefault(r => r.Name == "Admin");
        var pmRole = roles.FirstOrDefault(r => r.Name == "ProjectManager");
        var devRole = roles.FirstOrDefault(r => r.Name == "Developer");
        var testerRole = roles.FirstOrDefault(r => r.Name == "Tester");

        var admin = users.FirstOrDefault(u => u.UserName == "admin");
        var manager = users.FirstOrDefault(u => u.UserName == "jmanager");
        var developer = users.FirstOrDefault(u => u.UserName == "jdeveloper");
        var tester = users.FirstOrDefault(u => u.UserName == "btester");
        var designer = users.FirstOrDefault(u => u.UserName == "adesigner");

        if (admin != null && adminRole != null)
            userRoles.Add(new UserRole { Id = Guid.NewGuid(), UserId = admin.Id, RoleId = adminRole.Id, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" });

        if (manager != null && pmRole != null)
            userRoles.Add(new UserRole { Id = Guid.NewGuid(), UserId = manager.Id, RoleId = pmRole.Id, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" });

        if (developer != null && devRole != null)
            userRoles.Add(new UserRole { Id = Guid.NewGuid(), UserId = developer.Id, RoleId = devRole.Id, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" });

        if (tester != null && testerRole != null)
            userRoles.Add(new UserRole { Id = Guid.NewGuid(), UserId = tester.Id, RoleId = testerRole.Id, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" });

        if (designer != null && devRole != null)
            userRoles.Add(new UserRole { Id = Guid.NewGuid(), UserId = designer.Id, RoleId = devRole.Id, TenantId = _defaultTenantId, CreatedAt = DateTime.UtcNow, CreatedBy = "System" });

        await _context.UserRoles.AddRangeAsync(userRoles);
    }

    private async Task SeedUserClaimsAsync()
    {
        var adminUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == "admin" && !u.IsDeleted);
        var allClaims = await _context.Claims.Where(c => !c.IsDeleted).ToListAsync();

        if (adminUser == null || !allClaims.Any())
        {
            Console.WriteLine("Cannot seed user claims - missing admin user or claims");
            return;
        }

        var userClaims = allClaims.Select(claim => new UserClaim
        {
            Id = Guid.NewGuid(),
            UserId = adminUser.Id,
            ClaimId = claim.Id,
            ClaimValue = "true",
            TenantId = _defaultTenantId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        }).ToArray();

        await _context.UserClaims.AddRangeAsync(userClaims);
    }

    private async Task SeedProjectsAsync()
    {
        var projectFaker = new Faker<Project>()
            .RuleFor(p => p.Id, f => Guid.NewGuid())
            .RuleFor(p => p.Name, f => f.Company.CompanyName() + " " + f.Hacker.Noun())
            .RuleFor(p => p.Description, f => f.Lorem.Paragraph())
            .RuleFor(p => p.StartDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-6), DateTime.UtcNow))
            .RuleFor(p => p.EndDate, f => f.Date.Between(DateTime.UtcNow, DateTime.UtcNow.AddMonths(6)))
            .RuleFor(p => p.Status, f => f.PickRandom<ProjectStatus>())
            .RuleFor(p => p.Priority, f => f.PickRandom<ProjectPriority>())
            .RuleFor(p => p.Budget, f => f.Random.Decimal(10000, 500000))
            .RuleFor(p => p.ClientName, f => f.Company.CompanyName())
            .RuleFor(p => p.IsActive, f => true)
            .RuleFor(p => p.CreatedAt, f => DateTime.UtcNow)
            .RuleFor(p => p.CreatedBy, f => "System")
            .RuleFor(p => p.TenantId, f => _defaultTenantId);

        var projects = projectFaker.Generate(8);
        
        Console.WriteLine($"Generated {projects.Count} projects");
        foreach (var project in projects)
        {
            Console.WriteLine($"Project: {project.Name}, Status: {project.Status}, Budget: {project.Budget:C}");
        }
        
        await _context.Projects.AddRangeAsync(projects);
    }

    private async Task SeedUserProjectsIfNeeded()
    {
        var userProjectCount = await _context.UserProjects.CountAsync();
        
        if (userProjectCount == 0)
        {
            Console.WriteLine("Seeding user-project relationships...");
            await SeedUserProjectsAsync();
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {await _context.UserProjects.CountAsync()} user-project relationships.");
        }
        else
        {
            Console.WriteLine($"User-project relationships already exist ({userProjectCount} records), skipping.");
        }
    }

    private async Task SeedUserProjectsAsync()
    {
        var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();
        var projects = await _context.Projects.Where(p => !p.IsDeleted).ToListAsync();

        if (!users.Any() || !projects.Any())
        {
            Console.WriteLine("Cannot seed user-project relationships - missing users or projects");
            return;
        }

        Console.WriteLine($"Seeding user-project relationships for {projects.Count} projects and {users.Count} users");

        var userProjects = new List<UserProject>();
        var roles = new[] { ProjectRole.ProjectManager, ProjectRole.TeamLead, ProjectRole.TeamMember };

        foreach (var project in projects)
        {
            // Assign 2-4 users per project
            var assignedUsers = users.OrderBy(x => Guid.NewGuid()).Take(4);

            var index = 0;
            foreach (var user in assignedUsers)
            {
                userProjects.Add(new UserProject
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    ProjectId = project.Id,
                    Role = roles[index % roles.Length],
                    AssignedDate = DateTime.UtcNow.AddDays(-30),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                });
                index++;
            }
            Console.WriteLine($"Assigned {assignedUsers.Count()} users to project {project.Name}");
        }

        Console.WriteLine($"Total user-project relationships to seed: {userProjects.Count}");
        await _context.UserProjects.AddRangeAsync(userProjects);
    }

    private async Task SeedTasksIfNeeded()
    {
        var taskCount = await _context.ProjectTasks.CountAsync();
        
        if (taskCount == 0)
        {
            Console.WriteLine("Seeding project tasks...");
            await SeedTasksAsync();
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {await _context.ProjectTasks.CountAsync()} project tasks.");
        }
        else
        {
            Console.WriteLine($"Project tasks already exist ({taskCount} records), skipping.");
        }
    }

    private async Task SeedTasksAsync()
    {
        var projects = await _context.Projects.Where(p => !p.IsDeleted).ToListAsync();
        var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();

        if (!projects.Any() || !users.Any())
        {
            Console.WriteLine("Cannot seed tasks - missing projects or users");
            return;
        }

        Console.WriteLine($"Seeding tasks for {projects.Count} projects with {users.Count} users");
        Console.WriteLine($"Using task acronyms: {string.Join(", ", TaskTypeConstants.ValidAcronyms)}");

        var taskFaker = new Faker<ProjectTask>()
            .RuleFor(t => t.Id, f => Guid.NewGuid())
            .RuleFor(t => t.Title, f => f.Hacker.Phrase())
            .RuleFor(t => t.Description, f => f.Lorem.Sentences(2))
            .RuleFor(t => t.Status, f => f.PickRandom<Domain.Enums.TaskStatus>())
            .RuleFor(t => t.Priority, f => f.PickRandom<TaskPriority>())
            .RuleFor(t => t.DueDate, f => f.Date.Between(DateTime.UtcNow, DateTime.UtcNow.AddDays(30)))
            .RuleFor(t => t.EstimatedHours, f => f.Random.Int(1, 40))
            .RuleFor(t => t.ActualHours, f => f.Random.Int(0, 35))
            .RuleFor(t => t.IsActive, f => true)
            .RuleFor(t => t.CreatedAt, f => DateTime.UtcNow)
            .RuleFor(t => t.CreatedBy, f => "System")
            .RuleFor(t => t.TenantId, f => _defaultTenantId);

        var allTasks = new List<ProjectTask>();
        var taskAcronyms = TaskTypeConstants.ValidAcronyms;

        foreach (var project in projects)
        {
            var tasks = taskFaker.Generate(12); // More tasks per project
            foreach (var task in tasks)
            {
                task.ProjectId = project.Id;
                task.AssignedToUserId = users[Random.Shared.Next(users.Count)].Id;
                
                // Assign random acronym from valid constants and generate task number
                task.Acronym = taskAcronyms[Random.Shared.Next(taskAcronyms.Length)];
                try
                {
                    task.TaskNumber = await _counterService.GenerateTaskNumberAsync(task.Acronym, _defaultTenantId);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Could not generate task number for {task.Acronym}: {ex.Message}");
                    task.TaskNumber = $"{task.Acronym}-{Random.Shared.Next(1000, 9999)}";
                }
            }
            allTasks.AddRange(tasks);
            Console.WriteLine($"Generated {tasks.Count} tasks for project {project.Name}");
        }

        Console.WriteLine($"Total tasks to seed: {allTasks.Count}");
        await _context.ProjectTasks.AddRangeAsync(allTasks);
    }

    private async Task SeedOrganizationsAsync()
    {
        var organizations = new[]
        {
            new Organization
            {
                Id = Guid.NewGuid(),
                Name = "TechCorp Solutions",
                Description = "Leading technology solutions provider specializing in enterprise software development",
                Address = "123 Innovation Drive",
                City = "San Francisco",
                State = "CA",
                PostalCode = "94105",
                Country = "United States",
                Phone = "+1-555-0123",
                Email = "info@techcorp.com",
                Website = "https://www.techcorp.com",
                EmployeeCount = 250,
                EstablishedDate = new DateTime(2010, 3, 15),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                TenantId = _defaultTenantId
            },
            new Organization
            {
                Id = Guid.NewGuid(),
                Name = "Global Dynamics Inc",
                Description = "International consulting firm providing strategic business solutions",
                Address = "456 Business Plaza",
                City = "New York",
                State = "NY",
                PostalCode = "10001",
                Country = "United States",
                Phone = "+1-555-0456",
                Email = "contact@globaldynamics.com",
                Website = "https://www.globaldynamics.com",
                EmployeeCount = 180,
                EstablishedDate = new DateTime(2008, 7, 22),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                TenantId = _defaultTenantId
            },
            new Organization
            {
                Id = Guid.NewGuid(),
                Name = "SmartFlow Technologies",
                Description = "Innovative project management and workflow automation solutions",
                Address = "789 Tech Park Boulevard",
                City = "Austin",
                State = "TX",
                PostalCode = "78701",
                Country = "United States",
                Phone = "+1-555-0789",
                Email = "hello@smartflow.tech",
                Website = "https://www.smartflow.tech",
                EmployeeCount = 95,
                EstablishedDate = new DateTime(2018, 9, 1),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                TenantId = _defaultTenantId
            }
        };

        await _context.Organizations.AddRangeAsync(organizations);
    }

    private async Task SeedBranchesAsync()
    {
        var organizations = await _context.Organizations.Where(o => !o.IsDeleted).ToListAsync();
        var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();
        var manager = users.FirstOrDefault(u => u.UserName == "jmanager");

        if (!organizations.Any())
        {
            Console.WriteLine("Cannot seed branches - no organizations found");
            return;
        }

        var branches = new List<Branch>();

        foreach (var org in organizations)
        {
            var orgBranches = new[]
            {
                new Branch
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = $"{org.Name} - Headquarters",
                    Code = "HQ",
                    BranchType = BranchType.Headquarters,
                    Description = "Main headquarters location",
                    Address = org.Address ?? "123 Main Street",
                    City = org.City ?? "Default City",
                    State = org.State ?? "Default State",
                    PostalCode = org.PostalCode,
                    Country = org.Country ?? "United States",
                    Phone = org.Phone,
                    Email = $"hq@{org.Email?.Split('@').LastOrDefault() ?? "company.com"}",
                    ManagerId = manager?.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new Branch
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = $"{org.Name} - Regional Office",
                    Code = "REG",
                    BranchType = BranchType.Regional,
                    Description = "Regional operations center",
                    Address = "456 Regional Avenue",
                    City = "Dallas",
                    State = "TX",
                    PostalCode = "75201",
                    Country = "United States",
                    Phone = "+1-555-0456",
                    Email = $"regional@{org.Email?.Split('@').LastOrDefault() ?? "company.com"}",
                    ManagerId = manager?.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                }
            };
            branches.AddRange(orgBranches);
        }

        await _context.Branches.AddRangeAsync(branches);
    }

    private async Task SeedOrganizationPoliciesAsync()
    {
        var organizations = await _context.Organizations.Where(o => !o.IsDeleted).ToListAsync();
        
        if (!organizations.Any())
        {
            Console.WriteLine("Cannot seed organization policies - no organizations found");
            return;
        }

        var policies = new List<OrganizationPolicy>();

        foreach (var org in organizations)
        {
            var orgPolicies = new[]
            {
                new OrganizationPolicy
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Title = "Remote Work Policy",
                    PolicyType = PolicyType.HR,
                    Description = "Guidelines for remote work arrangements and expectations",
                    Content = "Remote work is allowed up to 3 days per week with manager approval. Employees must maintain productivity standards and be available during core business hours.",
                    Version = "1.0",
                    EffectiveDate = DateTime.UtcNow.AddDays(-30),
                    ExpiryDate = DateTime.UtcNow.AddYears(1),
                    RequiresAcknowledgment = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new OrganizationPolicy
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Title = "Data Security Policy",
                    PolicyType = PolicyType.Security,
                    Description = "Data protection and security guidelines for all employees",
                    Content = "All sensitive data must be encrypted and access logged. Employees must use strong passwords and enable two-factor authentication.",
                    Version = "2.1",
                    EffectiveDate = DateTime.UtcNow.AddDays(-60),
                    ExpiryDate = DateTime.UtcNow.AddYears(2),
                    RequiresAcknowledgment = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new OrganizationPolicy
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Title = "Code of Conduct",
                    PolicyType = PolicyType.Compliance,
                    Description = "Professional behavior and ethical guidelines",
                    Content = "All employees must maintain professional conduct, treat colleagues with respect, and adhere to company values and ethical standards.",
                    Version = "1.5",
                    EffectiveDate = DateTime.UtcNow.AddDays(-90),
                    ExpiryDate = DateTime.UtcNow.AddYears(3),
                    RequiresAcknowledgment = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                }
            };
            policies.AddRange(orgPolicies);
        }

        await _context.OrganizationPolicies.AddRangeAsync(policies);
    }

    private async Task SeedCompanyHolidaysAsync()
    {
        var organizations = await _context.Organizations.Where(o => !o.IsDeleted).ToListAsync();
        
        if (!organizations.Any())
        {
            Console.WriteLine("Cannot seed company holidays - no organizations found");
            return;
        }

        var holidays = new List<CompanyHoliday>();

        foreach (var org in organizations)
        {
            var currentYear = DateTime.UtcNow.Year;
            var orgHolidays = new[]
            {
                new CompanyHoliday
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = "New Year's Day",
                    Date = new DateOnly(currentYear, 1, 1),
                    Description = "Celebration of the new year",
                    HolidayType = "National",
                    IsRecurring = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new CompanyHoliday
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = "Independence Day",
                    Date = new DateOnly(currentYear, 7, 4),
                    Description = "US Independence Day celebration",
                    HolidayType = "National",
                    IsRecurring = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new CompanyHoliday
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = "Labor Day",
                    Date = new DateOnly(currentYear, 9, 2),
                    Description = "Labor Day holiday",
                    HolidayType = "National",
                    IsRecurring = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new CompanyHoliday
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = "Thanksgiving Day",
                    Date = new DateOnly(currentYear, 11, 28),
                    Description = "Thanksgiving celebration",
                    HolidayType = "National",
                    IsRecurring = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new CompanyHoliday
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = "Christmas Day",
                    Date = new DateOnly(currentYear, 12, 25),
                    Description = "Christmas celebration",
                    HolidayType = "National",
                    IsRecurring = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                }
            };
            holidays.AddRange(orgHolidays);
        }

        await _context.CompanyHolidays.AddRangeAsync(holidays);
    }

    private async Task SeedOrganizationSettingsAsync()
    {
        var organizations = await _context.Organizations.Where(o => !o.IsDeleted).ToListAsync();
        
        if (!organizations.Any())
        {
            Console.WriteLine("Cannot seed organization settings - no organizations found");
            return;
        }

        var settings = new List<OrganizationSetting>();

        foreach (var org in organizations)
        {
            var orgSettings = new[]
            {
                new OrganizationSetting
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    SettingKey = "WorkingHoursStart",
                    SettingValue = "09:00",
                    SettingType = "Time",
                    Description = "Standard working hours start time",
                    IsEditable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new OrganizationSetting
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    SettingKey = "WorkingHoursEnd",
                    SettingValue = "17:00",
                    SettingType = "Time",
                    Description = "Standard working hours end time",
                    IsEditable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new OrganizationSetting
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    SettingKey = "TimeZone",
                    SettingValue = "America/New_York",
                    SettingType = "String",
                    Description = "Organization default timezone",
                    IsEditable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new OrganizationSetting
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    SettingKey = "MaxVacationDays",
                    SettingValue = "25",
                    SettingType = "Integer",
                    Description = "Maximum vacation days per year",
                    IsEditable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                },
                new OrganizationSetting
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    SettingKey = "ProjectsPerUser",
                    SettingValue = "5",
                    SettingType = "Integer",
                    Description = "Maximum projects per user",
                    IsEditable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    TenantId = _defaultTenantId
                }
            };
            settings.AddRange(orgSettings);
        }

        await _context.OrganizationSettings.AddRangeAsync(settings);
    }

    private async Task ClearAllDataAsync()
    {
        try
        {
            Console.WriteLine("Clearing all existing data...");
            
            // Clear in reverse dependency order
            if (_context.ProjectTasks != null)
                _context.ProjectTasks.RemoveRange(_context.ProjectTasks);
            if (_context.UserProjects != null)
                _context.UserProjects.RemoveRange(_context.UserProjects);
            if (_context.Projects != null)
                _context.Projects.RemoveRange(_context.Projects);
            
            // Clear Team entities
            if (_context.TeamMembers != null)
                _context.TeamMembers.RemoveRange(_context.TeamMembers);
            if (_context.Teams != null)
                _context.Teams.RemoveRange(_context.Teams);

            // Clear TimeTracker entities
            if (_context.TimeEntries != null)
                _context.TimeEntries.RemoveRange(_context.TimeEntries);
            if (_context.ActiveTrackingSessions != null)
                _context.ActiveTrackingSessions.RemoveRange(_context.ActiveTrackingSessions);
            if (_context.Timesheets != null)
                _context.Timesheets.RemoveRange(_context.Timesheets);
            if (_context.TimeCategories != null)
                _context.TimeCategories.RemoveRange(_context.TimeCategories);

            // Clear Calendar entities
            if (_context.EventReminders != null)
                _context.EventReminders.RemoveRange(_context.EventReminders);
            if (_context.EventAttendees != null)
                _context.EventAttendees.RemoveRange(_context.EventAttendees);
            if (_context.CalendarEvents != null)
                _context.CalendarEvents.RemoveRange(_context.CalendarEvents);

            // Clear Campaign entities
            if (_context.CampaignEvaluations != null)
                _context.CampaignEvaluations.RemoveRange(_context.CampaignEvaluations);
            if (_context.CampaignGroups != null)
                _context.CampaignGroups.RemoveRange(_context.CampaignGroups);
            if (_context.Campaigns != null)
                _context.Campaigns.RemoveRange(_context.Campaigns);
                
            if (_context.UserClaims != null)
                _context.UserClaims.RemoveRange(_context.UserClaims);
            if (_context.UserRoles != null)
                _context.UserRoles.RemoveRange(_context.UserRoles);
            
            // Clear Organization entities
            if (_context.OrganizationSettings != null)
                _context.OrganizationSettings.RemoveRange(_context.OrganizationSettings);
            if (_context.CompanyHolidays != null)
                _context.CompanyHolidays.RemoveRange(_context.CompanyHolidays);
            if (_context.OrganizationPolicies != null)
                _context.OrganizationPolicies.RemoveRange(_context.OrganizationPolicies);
            if (_context.Branches != null)
                _context.Branches.RemoveRange(_context.Branches);
            if (_context.Organizations != null)
                _context.Organizations.RemoveRange(_context.Organizations);
            
            if (_context.Users != null)
                _context.Users.RemoveRange(_context.Users);
            if (_context.Claims != null)
                _context.Claims.RemoveRange(_context.Claims);
            if (_context.Roles != null)
                _context.Roles.RemoveRange(_context.Roles);
            
            // Clear Tenants last since everything depends on them
            if (_context.Tenants != null)
                _context.Tenants.RemoveRange(_context.Tenants);
            
            // Only clear Counters if the table exists (migration applied)
            if (_context.Counters != null)
            {
                _context.Counters.RemoveRange(_context.Counters);
            }
            
            await _context.SaveChangesAsync();
            Console.WriteLine("All existing data cleared successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning during data clearing: {ex.Message}");
            // Continue with seeding even if clearing fails
        }
    }

    #region Teams Seeding

    private async Task SeedTeamsAsync()
    {
        Console.WriteLine("Seeding Teams...");

        try
        {
            var tenants = await _context.Tenants.ToListAsync();
            var users = await _context.Users.ToListAsync();
            var allTeams = new List<Team>();

            foreach (var tenant in tenants)
            {
                var tenantUsers = users.Where(u => u.TenantId == tenant.Id).ToList();
                if (!tenantUsers.Any()) continue;

                var faker = new Faker<Team>()
                    .RuleFor(t => t.Id, f => Guid.NewGuid())
                    .RuleFor(t => t.Name, f => f.PickRandom(new[]
                    {
                        "Development Team Alpha",
                        "Quality Assurance Team",
                        "UI/UX Design Team",
                        "DevOps Engineering Team",
                        "Product Management Team",
                        "Backend Development Team",
                        "Frontend Development Team",
                        "Data Analytics Team",
                        "Security Team",
                        "Mobile Development Team",
                        "Infrastructure Team",
                        "Research & Development Team"
                    }))
                    .RuleFor(t => t.Description, (f, t) => f.Lorem.Sentence(10, 15))
                    .RuleFor(t => t.Type, f => f.PickRandom<TeamType>())
                    .RuleFor(t => t.Status, f => f.PickRandom<TeamStatus>())
                    .RuleFor(t => t.LeaderId, f => f.PickRandom(tenantUsers).Id)
                    .RuleFor(t => t.MaxMembers, f => f.Random.Int(5, 15))
                    .RuleFor(t => t.CreatedAt, f => f.Date.Past(1))
                    .RuleFor(t => t.TenantId, tenant.Id)
                    .RuleFor(t => t.CreatedBy, f => f.PickRandom(tenantUsers).Id.ToString())
                    .RuleFor(t => t.IsActive, f => f.Random.Bool(0.9f)); // 90% active

                var teamFaker = new Faker();
                var teams = faker.Generate(teamFaker.Random.Int(3, 6)); // 3-6 teams per tenant

                // Ensure no duplicate team names within a tenant
                var usedNames = new HashSet<string>();
                foreach (var team in teams)
                {
                    var originalName = team.Name;
                    var counter = 1;
                    while (usedNames.Contains(team.Name))
                    {
                        team.Name = $"{originalName} {counter}";
                        counter++;
                    }
                    usedNames.Add(team.Name);
                }

                allTeams.AddRange(teams);
            }

            await _context.Teams.AddRangeAsync(allTeams);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Successfully seeded {allTeams.Count} teams");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding teams: {ex.Message}");
            throw;
        }
    }

    private async Task SeedTeamMembersIfNeeded()
    {
        Console.WriteLine("Checking if Team Members seeding is needed...");

        var existingTeamMembers = await _context.TeamMembers.CountAsync();
        if (existingTeamMembers > 0)
        {
            Console.WriteLine($"Team Members already exist ({existingTeamMembers}). Skipping seeding.");
            return;
        }

        await SeedTeamMembersAsync();
    }

    private async Task SeedTeamMembersAsync()
    {
        Console.WriteLine("Seeding Team Members...");

        try
        {
            var teams = await _context.Teams
                .Include(t => t.Leader)
                .ToListAsync();
            var users = await _context.Users.ToListAsync();
            var allTeamMembers = new List<TeamMember>();

            foreach (var team in teams)
            {
                var tenantUsers = users.Where(u => u.TenantId == team.TenantId && u.Id != team.LeaderId).ToList();
                
                // Add the team leader as a member (if LeaderId is not null)
                if (team.LeaderId.HasValue)
                {
                    var leaderMember = new TeamMember
                    {
                        Id = Guid.NewGuid(),
                        TeamId = team.Id,
                        UserId = team.LeaderId.Value,
                        Role = TeamMemberRole.Leader,
                        JoinedDate = team.CreatedAt.AddDays(-1),
                        IsActive = true,
                        TenantId = team.TenantId,
                        CreatedBy = team.CreatedBy,
                        CreatedAt = team.CreatedAt
                    };
                    allTeamMembers.Add(leaderMember);
                }

                // Add random team members
                if (tenantUsers.Any())
                {
                    var faker = new Faker();
                    var numberOfMembers = faker.Random.Int(2, Math.Min(team.MaxMembers - 1, tenantUsers.Count));
                    var selectedUsers = faker.PickRandom(tenantUsers, Math.Max(0, numberOfMembers)).ToList();

                    foreach (var user in selectedUsers)
                    {
                        var member = new TeamMember
                        {
                            Id = Guid.NewGuid(),
                            TeamId = team.Id,
                            UserId = user.Id,
                            Role = faker.PickRandom<TeamMemberRole>(TeamMemberRole.Member, TeamMemberRole.CoLeader),
                            JoinedDate = faker.Date.Between(team.CreatedAt, DateTime.UtcNow),
                            IsActive = faker.Random.Bool(0.95f), // 95% active
                            TenantId = team.TenantId,
                            CreatedBy = team.CreatedBy,
                            CreatedAt = faker.Date.Between(team.CreatedAt, DateTime.UtcNow)
                        };
                        allTeamMembers.Add(member);
                    }
                }
            }

            await _context.TeamMembers.AddRangeAsync(allTeamMembers);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Successfully seeded {allTeamMembers.Count} team members");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding team members: {ex.Message}");
            throw;
        }
    }

    #endregion

    #region TimeTracker Seeding

    private async Task SeedTimeCategoriesAsync()
    {
        try
        {
            var faker = new Faker();
            var categories = new List<TimeCategory>
            {
                new TimeCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Development",
                    Description = "Software development activities",
                    Color = "#3B82F6",
                    DefaultBillableStatus = BillableStatus.Billable,
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow
                },
                new TimeCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Testing",
                    Description = "Quality assurance and testing activities",
                    Color = "#10B981",
                    DefaultBillableStatus = BillableStatus.Billable,
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow
                },
                new TimeCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Meeting",
                    Description = "Team meetings and client calls",
                    Color = "#F59E0B",
                    DefaultBillableStatus = BillableStatus.NonBillable,
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow
                },
                new TimeCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Research",
                    Description = "Research and learning activities",
                    Color = "#8B5CF6",
                    DefaultBillableStatus = BillableStatus.Billable,
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow
                },
                new TimeCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Documentation",
                    Description = "Writing documentation and specs",
                    Color = "#EF4444",
                    DefaultBillableStatus = BillableStatus.Billable,
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow
                },
                new TimeCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Break",
                    Description = "Lunch and coffee breaks",
                    Color = "#6B7280",
                    DefaultBillableStatus = BillableStatus.NonBillable,
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _context.TimeCategories.AddRangeAsync(categories);
            Console.WriteLine($"Successfully seeded {categories.Count} time categories");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding time categories: {ex.Message}");
            throw;
        }
    }

    private async Task SeedTimesheetsAsync()
    {
        try
        {
            var users = await _context.Users.ToListAsync();
            var faker = new Faker();
            var timesheets = new List<Timesheet>();

            foreach (var user in users.Take(5)) // Create timesheets for first 5 users
            {
                // Create timesheets for the last 8 weeks
                for (int week = 0; week < 8; week++)
                {
                    var startOfWeek = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek).AddDays(-7 * week);
                    var endOfWeek = startOfWeek.AddDays(6);

                    var timesheet = new Timesheet
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        StartDate = startOfWeek,
                        EndDate = endOfWeek,
                        Status = week < 2 ? TimesheetStatus.Draft : faker.PickRandom<TimesheetStatus>(),
                        TotalHours = 0, // Will be calculated when time entries are added
                        BillableHours = 0,
                        SubmittedAt = week >= 2 ? faker.Date.Between(endOfWeek, endOfWeek.AddDays(3)) : null,
                        SubmittedBy = week >= 2 ? user.Id : null,
                        ApprovedAt = week >= 4 ? faker.Date.Between(endOfWeek.AddDays(1), endOfWeek.AddDays(5)) : null,
                        ApprovedBy = week >= 4 ? users.First(u => u.Id != user.Id).Id : null,
                        ApprovalNotes = faker.Random.Bool(0.3f) ? faker.Lorem.Sentence() : null,
                        TenantId = user.TenantId,
                        CreatedBy = user.Id.ToString(),
                        CreatedAt = startOfWeek.AddDays(-1)
                    };

                    timesheets.Add(timesheet);
                }
            }

            await _context.Timesheets.AddRangeAsync(timesheets);
            Console.WriteLine($"Successfully seeded {timesheets.Count} timesheets");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding timesheets: {ex.Message}");
            throw;
        }
    }

    private async Task SeedTimeEntriesAsync()
    {
        try
        {
            var timesheets = await _context.Timesheets.Include(t => t.User).ToListAsync();
            var projects = await _context.Projects.ToListAsync();
            var projectTasks = await _context.ProjectTasks.ToListAsync();
            var categories = await _context.TimeCategories.ToListAsync();
            var faker = new Faker();
            var timeEntries = new List<TimeEntry>();

            foreach (var timesheet in timesheets.Where(t => t.Status != TimesheetStatus.Draft))
            {
                var userProjects = projects.Where(p => p.TenantId == timesheet.TenantId).ToList();
                var workingDays = 5; // Monday to Friday
                
                for (int day = 0; day < workingDays; day++)
                {
                    var date = timesheet.StartDate.AddDays(day);
                    var entriesForDay = faker.Random.Int(2, 4); // 2-4 entries per day

                    for (int entry = 0; entry < entriesForDay; entry++)
                    {
                        var project = faker.PickRandom(userProjects);
                        var tasksForProject = projectTasks.Where(t => t.ProjectId == project.Id).ToList();
                        var task = tasksForProject.Any() ? faker.PickRandom(tasksForProject) : null;
                        var category = faker.PickRandom(categories);
                        
                        var startTime = faker.Date.Between(
                            date.AddHours(8), 
                            date.AddHours(16)
                        );
                        var duration = faker.Random.Int(30, 240); // 30 minutes to 4 hours
                        var endTime = startTime.AddMinutes(duration);

                        var timeEntry = new TimeEntry
                        {
                            Id = Guid.NewGuid(),
                            TimesheetId = timesheet.Id,
                            UserId = timesheet.UserId,
                            ProjectId = project.Id,
                            TaskId = task?.Id,
                            TimeCategoryId = category.Id,
                            StartTime = startTime,
                            EndTime = endTime,
                            Duration = duration,
                            Description = faker.Lorem.Sentence(),
                            EntryType = faker.PickRandom<TimeEntryType>(),
                            BillableStatus = category.DefaultBillableStatus,
                            HourlyRate = faker.Random.Decimal(50, 150),
                            IsManualEntry = faker.Random.Bool(0.7f),
                            TenantId = timesheet.TenantId,
                            CreatedBy = timesheet.UserId.ToString(),
                            CreatedAt = date.AddMinutes(duration + 10)
                        };

                        timeEntries.Add(timeEntry);
                    }
                }
            }

            await _context.TimeEntries.AddRangeAsync(timeEntries);

            // Update timesheet totals
            var timesheetTotals = timeEntries
                .GroupBy(te => te.TimesheetId)
                .Select(g => new { 
                    TimesheetId = g.Key, 
                    TotalHours = g.Sum(te => te.Duration) / 60.0m,
                    BillableHours = g.Where(te => te.BillableStatus == BillableStatus.Billable).Sum(te => te.Duration) / 60.0m
                })
                .ToList();

            foreach (var total in timesheetTotals)
            {
                var timesheet = timesheets.First(t => t.Id == total.TimesheetId);
                timesheet.TotalHours = total.TotalHours;
                timesheet.BillableHours = total.BillableHours;
            }

            Console.WriteLine($"Successfully seeded {timeEntries.Count} time entries");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding time entries: {ex.Message}");
            throw;
        }
    }

    private async Task SeedActiveTrackingSessionsAsync()
    {
        try
        {
            var users = await _context.Users.ToListAsync();
            var projects = await _context.Projects.ToListAsync();
            var categories = await _context.TimeCategories.ToListAsync();
            var faker = new Faker();
            var activeSessions = new List<ActiveTrackingSession>();

            // Create 1-2 active sessions for demonstration
            var activeUsers = users.Take(2).ToList();

            foreach (var user in activeUsers)
            {
                var userProjects = projects.Where(p => p.TenantId == user.TenantId).ToList();
                if (!userProjects.Any()) continue;

                var project = faker.PickRandom(userProjects);
                var category = faker.PickRandom(categories);
                
                var startTime = DateTime.UtcNow.AddMinutes(-faker.Random.Int(15, 120)); // Started 15 min to 2 hours ago
                
                var session = new ActiveTrackingSession
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    ProjectId = project.Id,
                    TimeCategoryId = category.Id,
                    StartTime = startTime,
                    LastActivityTime = DateTime.UtcNow.AddMinutes(-faker.Random.Int(1, 10)), // Last activity 1-10 min ago
                    Description = faker.Lorem.Sentence(),
                    Status = TrackingStatus.Running,
                    TenantId = user.TenantId,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = startTime
                };

                activeSessions.Add(session);
            }

            await _context.ActiveTrackingSessions.AddRangeAsync(activeSessions);
            Console.WriteLine($"Successfully seeded {activeSessions.Count} active tracking sessions");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding active tracking sessions: {ex.Message}");
            throw;
        }
    }

    #endregion

    #region Calendar Entities Seeding

    private async Task SeedCalendarEventsAsync()
    {
        try
        {
            Console.WriteLine("Seeding Calendar Events...");
            
            var users = await _context.Users.Take(10).ToListAsync();
            var projects = await _context.Projects.Take(5).ToListAsync();
            var tasks = await _context.ProjectTasks.Take(10).ToListAsync();
            
            if (!users.Any())
            {
                Console.WriteLine("No users found. Skipping calendar events seeding.");
                return;
            }

            var faker = new Faker();
            var events = new List<CalendarEvent>();

            var eventTypes = Enum.GetValues<EventType>();
            var priorities = Enum.GetValues<EventPriority>();
            var statuses = Enum.GetValues<EventStatus>();
            var colors = new[] { "#33364d", "#109e92", "#f39c12", "#e74c3c", "#9b59b6", "#3498db", "#2ecc71", "#f1c40f" };

            for (int i = 0; i < 50; i++)
            {
                var user = faker.PickRandom(users);
                var startDate = faker.Date.Between(DateTime.UtcNow.AddDays(-30), DateTime.UtcNow.AddDays(60));
                var duration = faker.Random.Int(30, 480); // 30 minutes to 8 hours
                var endDate = startDate.AddMinutes(duration);
                var isAllDay = faker.Random.Bool(0.2f); // 20% chance of all-day events

                if (isAllDay)
                {
                    startDate = startDate.Date;
                    endDate = startDate.AddDays(1).AddSeconds(-1);
                }

                var calendarEvent = new CalendarEvent
                {
                    Id = Guid.NewGuid(),
                    Title = faker.PickRandom(new[]
                    {
                        "Team Standup", "Project Review", "Client Meeting", "Sprint Planning",
                        "Code Review", "Training Session", "One-on-One", "Product Demo",
                        "Architecture Discussion", "Bug Triage", "Release Planning",
                        "Team Building", "Performance Review", "Requirements Gathering"
                    }),
                    Description = faker.Lorem.Paragraph(),
                    EventType = faker.PickRandom(eventTypes),
                    StartDateTime = startDate,
                    EndDateTime = endDate,
                    IsAllDay = isAllDay,
                    Location = faker.Random.Bool(0.7f) ? faker.PickRandom(new[]
                    {
                        "Conference Room A", "Conference Room B", "Main Office",
                        "Google Meet", "Zoom", "Microsoft Teams", "Remote",
                        "Client Office", "Training Room", "Executive Boardroom"
                    }) : null,
                    Priority = faker.PickRandom(priorities),
                    Status = faker.PickRandom(statuses),
                    EventCreatedBy = user.Id,
                    ProjectId = projects.Any() && faker.Random.Bool(0.4f) ? faker.PickRandom(projects).Id : null,
                    TaskId = tasks.Any() && faker.Random.Bool(0.3f) ? faker.PickRandom(tasks).Id : null,
                    IsRecurring = faker.Random.Bool(0.3f),
                    IsPrivate = faker.Random.Bool(0.1f), // 10% private events
                    Color = faker.PickRandom(colors),
                    TenantId = user.TenantId,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-faker.Random.Int(1, 30)),
                    UpdatedBy = user.Id.ToString(),
                    UpdatedAt = DateTime.UtcNow
                };

                events.Add(calendarEvent);
            }

            await _context.CalendarEvents.AddRangeAsync(events);
            Console.WriteLine($"Successfully seeded {events.Count} calendar events");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding calendar events: {ex.Message}");
            throw;
        }
    }

    private async Task SeedCalendarAttendeesIfNeeded()
    {
        try
        {
            var existingAttendees = await _context.EventAttendees.CountAsync();
            if (existingAttendees > 0)
            {
                Console.WriteLine($"Event attendees already exist ({existingAttendees} records), skipping.");
                return;
            }

            Console.WriteLine("Seeding Event Attendees...");
            
            var events = await _context.CalendarEvents.Take(30).ToListAsync();
            var users = await _context.Users.Take(10).ToListAsync();
            
            if (!events.Any() || !users.Any())
            {
                Console.WriteLine("No events or users found. Skipping attendees seeding.");
                return;
            }

            var faker = new Faker();
            var attendees = new List<EventAttendee>();
            var responses = Enum.GetValues<AttendeeResponse>();

            foreach (var eventItem in events)
            {
                // Add the event creator as organizer
                var organizer = users.FirstOrDefault(u => u.Id == eventItem.EventCreatedBy);
                if (organizer != null)
                {
                    attendees.Add(new EventAttendee
                    {
                        Id = Guid.NewGuid(),
                        EventId = eventItem.Id,
                        UserId = organizer.Id,
                        Response = AttendeeResponse.Accepted,
                        IsRequired = true,
                        IsOrganizer = true,
                        InvitedAt = eventItem.CreatedAt,
                        ResponseAt = eventItem.CreatedAt,
                        TenantId = organizer.TenantId,
                        CreatedBy = organizer.Id.ToString(),
                        CreatedAt = eventItem.CreatedAt
                    });
                }

                // Add 1-5 additional attendees for non-private events
                if (!eventItem.IsPrivate)
                {
                    var availableUsers = users.Where(u => u.Id != eventItem.EventCreatedBy).ToList();
                    if (availableUsers.Any())
                    {
                        var maxAttendees = Math.Min(5, availableUsers.Count);
                        var attendeeCount = faker.Random.Int(1, maxAttendees);
                        var eventUsers = faker.PickRandom(availableUsers, attendeeCount);
                    
                    foreach (var user in eventUsers)
                    {
                        var invitedAt = eventItem.CreatedAt.AddMinutes(faker.Random.Int(1, 60));
                        var hasResponded = faker.Random.Bool(0.8f); // 80% response rate
                        
                        attendees.Add(new EventAttendee
                        {
                            Id = Guid.NewGuid(),
                            EventId = eventItem.Id,
                            UserId = user.Id,
                            Response = hasResponded ? faker.PickRandom(responses) : AttendeeResponse.Pending,
                            IsRequired = faker.Random.Bool(0.7f), // 70% required attendees
                            IsOrganizer = false,
                            InvitedAt = invitedAt,
                            ResponseAt = hasResponded ? invitedAt.AddMinutes(faker.Random.Int(5, 1440)) : null, // Response within 24 hours
                            Notes = faker.Random.Bool(0.3f) ? faker.Lorem.Sentence() : null,
                            TenantId = user.TenantId,
                            CreatedBy = eventItem.EventCreatedBy.ToString(),
                            CreatedAt = invitedAt
                        });
                    }
                    }
                }
            }

            await _context.EventAttendees.AddRangeAsync(attendees);
            Console.WriteLine($"Successfully seeded {attendees.Count} event attendees");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding event attendees: {ex.Message}");
            throw;
        }
    }

    private async Task SeedCalendarRemindersIfNeeded()
    {
        try
        {
            var existingReminders = await _context.EventReminders.CountAsync();
            if (existingReminders > 0)
            {
                Console.WriteLine($"Event reminders already exist ({existingReminders} records), skipping.");
                return;
            }

            Console.WriteLine("Seeding Event Reminders...");
            
            var attendees = await _context.EventAttendees
                .Include(a => a.Event)
                .Include(a => a.User)
                .Take(100)
                .ToListAsync();
            
            if (!attendees.Any())
            {
                Console.WriteLine("No event attendees found. Skipping reminders seeding.");
                return;
            }

            var faker = new Faker();
            var reminders = new List<EventReminder>();
            var reminderTypes = Enum.GetValues<ReminderType>();
            var reminderTimes = new[] { 5, 10, 15, 30, 60, 120, 1440 }; // Minutes before event

            foreach (var attendee in attendees)
            {
                // Skip reminders for past events
                if (attendee.Event.StartDateTime < DateTime.UtcNow)
                    continue;

                // 70% chance of having a reminder
                if (!faker.Random.Bool(0.7f))
                    continue;

                // Some users might have multiple reminders
                var reminderCount = faker.Random.Int(1, faker.Random.Bool(0.3f) ? 2 : 1);
                
                for (int i = 0; i < reminderCount; i++)
                {
                    var reminderTime = faker.PickRandom(reminderTimes);
                    
                    // Don't create duplicate reminder times for the same user/event
                    if (reminders.Any(r => r.EventId == attendee.EventId && 
                                          r.UserId == attendee.UserId && 
                                          r.ReminderTime == reminderTime))
                        continue;

                    var reminder = new EventReminder
                    {
                        Id = Guid.NewGuid(),
                        EventId = attendee.EventId,
                        UserId = attendee.UserId,
                        ReminderType = faker.PickRandom(reminderTypes),
                        ReminderTime = reminderTime,
                        IsSent = false,
                        SentAt = null,
                        IsActive = true,
                        TenantId = attendee.TenantId,
                        CreatedBy = attendee.UserId.ToString(),
                        CreatedAt = attendee.CreatedAt.AddMinutes(faker.Random.Int(1, 30))
                    };

                    reminders.Add(reminder);
                }
            }

            await _context.EventReminders.AddRangeAsync(reminders);
            Console.WriteLine($"Successfully seeded {reminders.Count} event reminders");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding event reminders: {ex.Message}");
            throw;
        }
    }

    #endregion

    #region Campaign Entities Seeding

    private async Task SeedCampaignsAsync()
    {
        try
        {
            Console.WriteLine("Seeding Campaigns...");
            
            var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();
            var managers = users.Where(u => u.UserName == "admin" || u.UserName == "jmanager").ToList();
            var allUsers = users.Take(10).ToList();
            
            if (!users.Any())
            {
                Console.WriteLine("No users found. Skipping campaigns seeding.");
                return;
            }

            var faker = new Faker();
            var campaigns = new List<Campaign>();

            // Create different types of campaigns
            var campaignTypes = new[] { 0, 1, 2, 3, 4 }; // RoleEvaluation, ClaimsAudit, ComplianceReview, SecurityAssessment, PerformanceReview
            var campaignStatuses = new[] { 1, 2, 3 }; // Active, Completed, Cancelled (skip Draft for demo)

            for (int i = 0; i < 8; i++)
            {
                var startDate = faker.Date.Between(DateTime.UtcNow.AddDays(-90), DateTime.UtcNow.AddDays(30));
                var endDate = startDate.AddDays(faker.Random.Int(14, 60)); // 2 weeks to 2 months duration
                var assignedManagersList = managers.Take(faker.Random.Int(1, managers.Count)).Select(m => m.Id).ToList();
                var targetUsersList = allUsers.Take(faker.Random.Int(3, 6)).Select(u => u.Id).ToList();

                var campaign = new Campaign
                {
                    Id = Guid.NewGuid(),
                    Title = faker.PickRandom(new[]
                    {
                        "Q4 Role Evaluation Campaign",
                        "Annual Claims Audit Review",
                        "Security Access Assessment",
                        "Compliance Review - SOX",
                        "Performance & Access Review",
                        "Department Access Audit",
                        "Quarterly Permission Review",
                        "Role Validation Campaign",
                        "User Access Compliance Check",
                        "Annual Security Assessment"
                    }),
                    Description = faker.Lorem.Paragraph(2),
                    Type = faker.PickRandom(campaignTypes),
                    Status = faker.PickRandom(campaignStatuses),
                    StartDate = startDate,
                    EndDate = endDate,
                    ActualStartDate = startDate.AddDays(-faker.Random.Int(0, 5)),
                    ActualEndDate = faker.Random.Bool(0.4f) ? endDate.AddDays(faker.Random.Int(-10, 10)) : null,
                    AssignedManagers = "[]", // Will be set using helper method
                    TargetUserIds = "[]", // Will be set using helper method
                    IsActive = true,
                    TenantId = _defaultTenantId,
                    CreatedByUserId = managers.First().Id,
                    CreatedAt = startDate.AddDays(-faker.Random.Int(5, 15))
                };

                // Set JSON properties using helper methods
                campaign.SetAssignedManagers(assignedManagersList);
                campaign.SetTargetUserIds(targetUsersList);

                campaigns.Add(campaign);
            }

            await _context.Campaigns.AddRangeAsync(campaigns);
            Console.WriteLine($"Successfully seeded {campaigns.Count} campaigns");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding campaigns: {ex.Message}");
            throw;
        }
    }

    private async Task SeedCampaignGroupsAsync()
    {
        try
        {
            Console.WriteLine("Seeding Campaign Groups...");
            
            var campaigns = await _context.Campaigns.Where(c => !c.IsDeleted).ToListAsync();
            var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();
            var managers = users.Where(u => u.UserName == "admin" || u.UserName == "jmanager").ToList();
            
            if (!campaigns.Any() || !users.Any())
            {
                Console.WriteLine("No campaigns or users found. Skipping campaign groups seeding.");
                return;
            }

            var faker = new Faker();
            var campaignGroups = new List<CampaignGroup>();

            foreach (var campaign in campaigns)
            {
                // Create 2-4 groups per campaign
                var groupCount = faker.Random.Int(2, 4);
                
                for (int i = 0; i < groupCount; i++)
                {
                    var manager = faker.PickRandom(managers);
                    var targetUsers = users.Where(u => u.Id != manager.Id)
                                          .OrderBy(x => Guid.NewGuid())
                                          .Take(faker.Random.Int(2, 5))
                                          .Select(u => u.Id)
                                          .ToList();

                    var group = new CampaignGroup
                    {
                        Id = Guid.NewGuid(),
                        CampaignId = campaign.Id,
                        Name = faker.PickRandom(new[]
                        {
                            $"Development Team - Group {i + 1}",
                            $"QA Team - Group {i + 1}",
                            $"Management Group {i + 1}",
                            $"Support Team - Group {i + 1}",
                            $"Operations Group {i + 1}",
                            $"Security Team - Group {i + 1}",
                            $"Admin Group {i + 1}",
                            $"Regional Team {i + 1}"
                        }),
                        Description = faker.Lorem.Sentence(8),
                        ManagerId = manager.Id,
                        TargetUserIds = "[]", // Will be set using helper method
                        IsActive = true,
                        TenantId = _defaultTenantId,
                        CreatedBy = manager.Id.ToString(),
                        CreatedAt = campaign.CreatedAt.AddDays(faker.Random.Int(1, 3))
                    };

                    // Set target users using helper method
                    group.SetTargetUserIds(targetUsers);

                    campaignGroups.Add(group);
                }
            }

            await _context.CampaignGroups.AddRangeAsync(campaignGroups);
            Console.WriteLine($"Successfully seeded {campaignGroups.Count} campaign groups");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding campaign groups: {ex.Message}");
            throw;
        }
    }

    private async Task SeedCampaignEvaluationsAsync()
    {
        try
        {
            Console.WriteLine("Seeding Campaign Evaluations...");
            
            var campaignGroups = await _context.CampaignGroups
                .Include(cg => cg.Campaign)
                .Where(cg => !cg.IsDeleted && cg.CampaignId != null) // Only groups with campaigns
                .ToListAsync();
            var users = await _context.Users.Where(u => !u.IsDeleted).ToListAsync();
            
            if (!campaignGroups.Any() || !users.Any())
            {
                Console.WriteLine("No campaign groups or users found. Skipping campaign evaluations seeding.");
                return;
            }

            // Get existing evaluations to avoid duplicates
            var existingEvaluations = await _context.CampaignEvaluations
                .Select(ce => new { ce.CampaignId, ce.EvaluatedUserId, ce.EvaluatorId })
                .ToHashSetAsync();

            var faker = new Faker();
            var evaluations = new List<CampaignEvaluation>();

            foreach (var group in campaignGroups.Take(10)) // Limit to first 10 groups for demo
            {
                var targetUsers = group.GetTargetUserIds();
                var manager = users.FirstOrDefault(u => u.Id == group.ManagerId);
                
                if (manager == null) continue;

                foreach (var targetUserId in targetUsers.Take(3)) // Limit to 3 evaluations per group
                {
                    var targetUser = users.FirstOrDefault(u => u.Id == targetUserId);
                    if (targetUser == null) continue;

                    // Check if this combination already exists
                    var combination = new { CampaignId = group.CampaignId!.Value, EvaluatedUserId = targetUserId, EvaluatorId = manager.Id };
                    if (existingEvaluations.Contains(combination))
                    {
                        Console.WriteLine($"Skipping duplicate evaluation: Campaign {combination.CampaignId}, User {combination.EvaluatedUserId}, Evaluator {combination.EvaluatorId}");
                        continue;
                    }

                    var isCompleted = faker.Random.Bool(0.7f); // 70% completion rate
                    var submittedAt = isCompleted ? (DateTime?)group.CreatedAt.AddDays(faker.Random.Int(1, 14)) : null;

                    var evaluation = new CampaignEvaluation
                    {
                        Id = Guid.NewGuid(),
                        CampaignId = group.CampaignId!.Value, // Safe to use ! since we filtered for non-null
                        GroupId = group.Id,
                        EvaluatedUserId = targetUserId,
                        EvaluatorId = manager.Id,
                        RoleEvaluations = GenerateSampleRoleEvaluations(faker),
                        ClaimEvaluations = GenerateSampleClaimEvaluations(faker),
                        Feedback = isCompleted ? faker.Lorem.Paragraph() : null,
                        IsCompleted = isCompleted,
                        SubmittedAt = submittedAt,
                        TenantId = _defaultTenantId,
                        CreatedBy = manager.Id.ToString(),
                        CreatedAt = group.CreatedAt.AddDays(faker.Random.Int(0, 5))
                    };

                    evaluations.Add(evaluation);
                    
                    // Add to existing set to prevent duplicates within this batch
                    existingEvaluations.Add(combination);
                }
            }

            if (evaluations.Any())
            {
                await _context.CampaignEvaluations.AddRangeAsync(evaluations);
                Console.WriteLine($"Successfully seeded {evaluations.Count} campaign evaluations");
            }
            else
            {
                Console.WriteLine("No new campaign evaluations to seed (all combinations already exist)");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding campaign evaluations: {ex.Message}");
            throw;
        }
    }

    private string GenerateSampleRoleEvaluations(Faker faker)
    {
        var roleEvaluations = new Dictionary<string, object>
        {
            { "Admin", new { approved = faker.Random.Bool(0.8f), comments = faker.Lorem.Sentence() } },
            { "ProjectManager", new { approved = faker.Random.Bool(0.9f), comments = faker.Lorem.Sentence() } },
            { "Developer", new { approved = faker.Random.Bool(0.95f), comments = faker.Lorem.Sentence() } },
            { "Tester", new { approved = faker.Random.Bool(0.9f), comments = faker.Lorem.Sentence() } }
        };
        
        return JsonSerializer.Serialize(roleEvaluations);
    }

    private string GenerateSampleClaimEvaluations(Faker faker)
    {
        var claimEvaluations = new Dictionary<string, object>
        {
            { "users.read", new { approved = faker.Random.Bool(0.95f), comments = "Standard access required" } },
            { "users.update", new { approved = faker.Random.Bool(0.8f), comments = faker.Lorem.Sentence() } },
            { "projects.read", new { approved = faker.Random.Bool(0.9f), comments = "Necessary for daily work" } },
            { "projects.update", new { approved = faker.Random.Bool(0.7f), comments = faker.Lorem.Sentence() } },
            { "admin.access", new { approved = faker.Random.Bool(0.3f), comments = "Requires justification" } }
        };
        
        return JsonSerializer.Serialize(claimEvaluations);
    }

    #endregion
}
