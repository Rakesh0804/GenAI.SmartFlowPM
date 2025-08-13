using Bogus;
using GenAI.SmartFlowPM.Domain.Common.Constants;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Enums;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Persistence.Context;

namespace GenAI.SmartFlowPM.Persistence.Seeders;

public class DataSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly ICounterService _counterService;

    public DataSeeder(ApplicationDbContext context, IPasswordHashingService passwordHashingService, ICounterService counterService)
    {
        _context = context;
        _passwordHashingService = passwordHashingService;
        _counterService = counterService;
    }

    public async Task SeedAsync(bool forceReseed = false)
    {
        Console.WriteLine("Starting data seeding...");
        
        if (forceReseed)
        {
            Console.WriteLine("Force reseed requested - clearing existing data...");
            await ClearDataAsync();
        }
        
        if (_context.Users.Any() && !forceReseed)
        {
            Console.WriteLine("Users already exist, skipping seeding.");
            return; // Data already seeded
        }

        Console.WriteLine("Seeding roles...");
        await SeedRolesAsync();
        await _context.SaveChangesAsync(); // Save roles first
        Console.WriteLine($"Seeded {_context.Roles.Count()} roles.");
        
        Console.WriteLine("Seeding claims...");
        await SeedClaimsAsync();
        await _context.SaveChangesAsync(); // Save claims
        Console.WriteLine($"Seeded {_context.Claims.Count()} claims.");
        
        Console.WriteLine("Seeding users...");
        await SeedUsersAsync();
        await _context.SaveChangesAsync(); // Save users
        Console.WriteLine($"Seeded {_context.Users.Count()} users.");
        
        Console.WriteLine("Seeding user roles and claims...");
        await SeedUserRolesAsync();
        await SeedUserClaimsAsync();
        await _context.SaveChangesAsync(); // Save user relationships
        Console.WriteLine($"Seeded user roles and claims.");
        
        Console.WriteLine("Seeding projects...");
        await SeedProjectsAsync();
        await _context.SaveChangesAsync(); // Save projects
        Console.WriteLine($"Seeded {_context.Projects.Count()} projects.");
        
        Console.WriteLine("Seeding organizations...");
        await SeedOrganizationsAsync();
        await _context.SaveChangesAsync(); // Save organizations
        Console.WriteLine($"Seeded {_context.Organizations.Count()} organizations.");
        
        Console.WriteLine("Seeding branches...");
        await SeedBranchesAsync();
        await _context.SaveChangesAsync(); // Save branches
        Console.WriteLine($"Seeded {_context.Branches.Count()} branches.");
        
        Console.WriteLine("Seeding organization policies and settings...");
        await SeedOrganizationPoliciesAsync();
        await SeedCompanyHolidaysAsync();
        await SeedOrganizationSettingsAsync();
        await _context.SaveChangesAsync(); // Save organization data
        Console.WriteLine($"Seeded organization policies, holidays, and settings.");
        
        Console.WriteLine("Seeding user projects and tasks...");
        await SeedUserProjectsAsync();
        await SeedTasksAsync();
        await _context.SaveChangesAsync(); // Save final relationships
        Console.WriteLine($"Seeded {_context.UserProjects.Count()} user-project relationships and {_context.ProjectTasks.Count()} tasks.");
        
        Console.WriteLine("Data seeding completed successfully!");
    }

    private async Task ClearDataAsync()
    {
        try
        {
            // Clear in reverse dependency order
            _context.ProjectTasks.RemoveRange(_context.ProjectTasks);
            _context.UserProjects.RemoveRange(_context.UserProjects);
            _context.Projects.RemoveRange(_context.Projects);
            _context.UserClaims.RemoveRange(_context.UserClaims);
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
            
            _context.Users.RemoveRange(_context.Users);
            _context.Claims.RemoveRange(_context.Claims);
            _context.Roles.RemoveRange(_context.Roles);
            
            // Only clear Counters if the table exists (migration applied)
            if (_context.Counters != null)
            {
                _context.Counters.RemoveRange(_context.Counters);
            }
            
            await _context.SaveChangesAsync();
            Console.WriteLine("Existing data cleared.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning during data clearing: {ex.Message}");
            // Continue with seeding even if clearing fails
        }
    }

    private async Task SeedRolesAsync()
    {
        var roles = new[]
        {
            new Role { Id = Guid.NewGuid(), Name = "Admin", Description = "System Administrator", IsActive = true },
            new Role { Id = Guid.NewGuid(), Name = "ProjectManager", Description = "Project Manager", IsActive = true },
            new Role { Id = Guid.NewGuid(), Name = "TeamLead", Description = "Team Lead", IsActive = true },
            new Role { Id = Guid.NewGuid(), Name = "Developer", Description = "Software Developer", IsActive = true },
            new Role { Id = Guid.NewGuid(), Name = "Tester", Description = "Quality Assurance Tester", IsActive = true },
            new Role { Id = Guid.NewGuid(), Name = "Viewer", Description = "Read-only Access", IsActive = true }
        };

        await _context.Roles.AddRangeAsync(roles);
    }

    private async Task SeedClaimsAsync()
    {
        var claims = new[]
        {
            // User permissions
            new Claim { Id = Guid.NewGuid(), Name = "users.create", Type = "permission", Description = "Create users", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "users.read", Type = "permission", Description = "Read users", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "users.update", Type = "permission", Description = "Update users", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "users.delete", Type = "permission", Description = "Delete users", IsActive = true },
            
            // Project permissions
            new Claim { Id = Guid.NewGuid(), Name = "projects.create", Type = "permission", Description = "Create projects", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "projects.read", Type = "permission", Description = "Read projects", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "projects.update", Type = "permission", Description = "Update projects", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "projects.delete", Type = "permission", Description = "Delete projects", IsActive = true },
            
            // Task permissions
            new Claim { Id = Guid.NewGuid(), Name = "tasks.create", Type = "permission", Description = "Create tasks", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "tasks.read", Type = "permission", Description = "Read tasks", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "tasks.update", Type = "permission", Description = "Update tasks", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "tasks.delete", Type = "permission", Description = "Delete tasks", IsActive = true },
            
            // Organization permissions
            new Claim { Id = Guid.NewGuid(), Name = "organizations.create", Type = "permission", Description = "Create organizations", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "organizations.read", Type = "permission", Description = "Read organizations", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "organizations.update", Type = "permission", Description = "Update organizations", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "organizations.delete", Type = "permission", Description = "Delete organizations", IsActive = true },
            
            // Branch permissions
            new Claim { Id = Guid.NewGuid(), Name = "branches.create", Type = "permission", Description = "Create branches", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "branches.read", Type = "permission", Description = "Read branches", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "branches.update", Type = "permission", Description = "Update branches", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "branches.delete", Type = "permission", Description = "Delete branches", IsActive = true },
            
            // General permissions
            new Claim { Id = Guid.NewGuid(), Name = "reports.view", Type = "permission", Description = "View reports", IsActive = true },
            new Claim { Id = Guid.NewGuid(), Name = "admin.access", Type = "permission", Description = "Admin panel access", IsActive = true }
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
                Email = "admin@projectmanagement.com",
                UserName = "admin",
                PasswordHash = _passwordHashingService.HashPassword("Admin123!"),
                PhoneNumber = "+1234567890",
                IsActive = true
            },
            new User
            {
                Id = managerId,
                FirstName = "John",
                LastName = "Manager",
                Email = "john.manager@projectmanagement.com",
                UserName = "jmanager",
                PasswordHash = _passwordHashingService.HashPassword("Manager123!"),
                PhoneNumber = "+1234567891",
                IsActive = true
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Jane",
                LastName = "Developer",
                Email = "jane.developer@projectmanagement.com",
                UserName = "jdeveloper",
                PasswordHash = _passwordHashingService.HashPassword("Developer123!"),
                PhoneNumber = "+1234567892",
                ManagerId = managerId,
                IsActive = true
            },
            new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Bob",
                LastName = "Tester",
                Email = "bob.tester@projectmanagement.com",
                UserName = "btester",
                PasswordHash = _passwordHashingService.HashPassword("Tester123!"),
                PhoneNumber = "+1234567893",
                ManagerId = managerId,
                IsActive = true
            }
        };

        await _context.Users.AddRangeAsync(users);
    }

    private async Task SeedUserRolesAsync()
    {
        var adminRole = _context.Roles.First(r => r.Name == "Admin");
        var pmRole = _context.Roles.First(r => r.Name == "ProjectManager");
        var devRole = _context.Roles.First(r => r.Name == "Developer");
        var testerRole = _context.Roles.First(r => r.Name == "Tester");

        var admin = _context.Users.First(u => u.UserName == "admin");
        var manager = _context.Users.First(u => u.UserName == "jmanager");
        var developer = _context.Users.First(u => u.UserName == "jdeveloper");
        var tester = _context.Users.First(u => u.UserName == "btester");

        var userRoles = new[]
        {
            new UserRole { Id = Guid.NewGuid(), UserId = admin.Id, RoleId = adminRole.Id },
            new UserRole { Id = Guid.NewGuid(), UserId = manager.Id, RoleId = pmRole.Id },
            new UserRole { Id = Guid.NewGuid(), UserId = developer.Id, RoleId = devRole.Id },
            new UserRole { Id = Guid.NewGuid(), UserId = tester.Id, RoleId = testerRole.Id }
        };

        await _context.UserRoles.AddRangeAsync(userRoles);
    }

    private async Task SeedUserClaimsAsync()
    {
        var adminUser = _context.Users.First(u => u.UserName == "admin");
        var allClaims = _context.Claims.ToList();

        var userClaims = allClaims.Select(claim => new UserClaim
        {
            Id = Guid.NewGuid(),
            UserId = adminUser.Id,
            ClaimId = claim.Id,
            ClaimValue = "true"
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
            .RuleFor(p => p.CreatedBy, f => "System");

        var projects = projectFaker.Generate(5);
        
        Console.WriteLine($"Generated {projects.Count} projects");
        foreach (var project in projects)
        {
            Console.WriteLine($"Project: {project.Name}, Status: {project.Status}, Budget: {project.Budget:C}");
        }
        
        await _context.Projects.AddRangeAsync(projects);
    }

    private async Task SeedUserProjectsAsync()
    {
        var users = _context.Users.ToList();
        var projects = _context.Projects.ToList();

        Console.WriteLine($"Seeding user-project relationships for {projects.Count} projects and {users.Count} users");

        var userProjects = new List<UserProject>();

        foreach (var project in projects)
        {
            // Assign 2-3 users per project
            var assignedUsers = users.OrderBy(x => Guid.NewGuid()).Take(3);
            var roles = new[] { ProjectRole.ProjectManager, ProjectRole.TeamLead, ProjectRole.TeamMember };

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
                    CreatedBy = "System"
                });
                index++;
            }
            Console.WriteLine($"Assigned {assignedUsers.Count()} users to project {project.Name}");
        }

        Console.WriteLine($"Total user-project relationships to seed: {userProjects.Count}");
        await _context.UserProjects.AddRangeAsync(userProjects);
    }

    private async Task SeedTasksAsync()
    {
        var projects = _context.Projects.ToList();
        var users = _context.Users.ToList();

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
            .RuleFor(t => t.CreatedBy, f => "System");

        var allTasks = new List<ProjectTask>();
        var taskAcronyms = TaskTypeConstants.ValidAcronyms;

        foreach (var project in projects)
        {
            var tasks = taskFaker.Generate(8);
            foreach (var task in tasks)
            {
                task.ProjectId = project.Id;
                task.AssignedToUserId = users[Random.Shared.Next(users.Count)].Id;
                
                // Assign random acronym from valid constants and generate task number
                task.Acronym = taskAcronyms[Random.Shared.Next(taskAcronyms.Length)];
                task.TaskNumber = await _counterService.GenerateTaskNumberAsync(task.Acronym);
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
                CreatedBy = "System"
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
                CreatedBy = "System"
            }
        };

        await _context.Organizations.AddRangeAsync(organizations);
    }

    private async Task SeedBranchesAsync()
    {
        var organizations = _context.Organizations.ToList();
        var users = _context.Users.ToList();
        var manager = users.FirstOrDefault(u => u.UserName == "jmanager");

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
                    CreatedBy = "System"
                },
                new Branch
                {
                    Id = Guid.NewGuid(),
                    OrganizationId = org.Id,
                    Name = $"{org.Name} - West Coast",
                    Code = "WC",
                    BranchType = BranchType.Regional,
                    Description = "West Coast operations center",
                    Address = "789 Pacific Avenue",
                    City = "Los Angeles",
                    State = "CA",
                    PostalCode = "90210",
                    Country = "United States",
                    Phone = "+1-555-0789",
                    Email = $"westcoast@{org.Email?.Split('@').LastOrDefault() ?? "company.com"}",
                    ManagerId = manager?.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };
            branches.AddRange(orgBranches);
        }

        await _context.Branches.AddRangeAsync(branches);
    }

    private async Task SeedOrganizationPoliciesAsync()
    {
        var organizations = _context.Organizations.ToList();
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
                    CreatedBy = "System"
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
                    CreatedBy = "System"
                }
            };
            policies.AddRange(orgPolicies);
        }

        await _context.OrganizationPolicies.AddRangeAsync(policies);
    }

    private async Task SeedCompanyHolidaysAsync()
    {
        var organizations = _context.Organizations.ToList();
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
                    CreatedBy = "System"
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
                    CreatedBy = "System"
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
                    CreatedBy = "System"
                }
            };
            holidays.AddRange(orgHolidays);
        }

        await _context.CompanyHolidays.AddRangeAsync(holidays);
    }

    private async Task SeedOrganizationSettingsAsync()
    {
        var organizations = _context.Organizations.ToList();
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
                    CreatedBy = "System"
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
                    CreatedBy = "System"
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
                    CreatedBy = "System"
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
                    CreatedBy = "System"
                }
            };
            settings.AddRange(orgSettings);
        }

        await _context.OrganizationSettings.AddRangeAsync(settings);
    }
}
