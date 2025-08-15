using GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs;
using GenAI.SmartFlowPM.Application.Features.Dashboards.Queries;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Common.Constants;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using TaskStatus = GenAI.SmartFlowPM.Domain.Enums.TaskStatus;

namespace GenAI.SmartFlowPM.Application.Features.Dashboards.Handlers
{
    public class GetHomeDashboardQueryHandler : IRequestHandler<GetHomeDashboardQuery, HomeDashboardDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetHomeDashboardQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<HomeDashboardDto> Handle(GetHomeDashboardQuery request, CancellationToken cancellationToken)
        {
            // Get all data from repositories
            var allProjects = await _unitOfWork.Projects.GetAllAsync(cancellationToken);
            var allTasks = await _unitOfWork.ProjectTasks.GetAllAsync(cancellationToken);
            var allUsers = await _unitOfWork.Users.GetAllAsync(cancellationToken);

            // Convert to lists for in-memory processing
            var projects = allProjects.ToList();
            var tasks = allTasks.ToList();
            var users = allUsers.ToList();

            // Calculate current date for overdue tasks
            var currentDate = DateTime.UtcNow;

            // Calculate basic statistics
            var totalProjects = projects.Count;
            var activeTasks = tasks.Count(t => t.Status == TaskStatus.InProgress);
            var teamMembers = users.Count;
            var completed = tasks.Count(t => t.Status == TaskStatus.Done);
            var overdueTasks = tasks.Count(t => t.DueDate.HasValue && t.DueDate < currentDate && t.Status != TaskStatus.Done);

            // Get user-specific data if UserId is provided
            var currentUser = request.UserId != Guid.Empty ? users.FirstOrDefault(u => u.Id == request.UserId) : null;
            var userTasks = currentUser != null ? tasks.Where(t => t.AssignedToUserId == request.UserId).ToList() : new List<ProjectTask>();

            // Debug logging for troubleshooting
            if (request.UserId != Guid.Empty)
            {
                Console.WriteLine($"Dashboard Query - Looking for user ID: {request.UserId}");
                Console.WriteLine($"Dashboard Query - Found user: {currentUser?.FirstName} {currentUser?.LastName}");
                Console.WriteLine($"Dashboard Query - User tasks count: {userTasks.Count}");
            }

            // User Summary
            var userSummary = currentUser != null ? new UserDashboardSummaryDto
            {
                UserId = currentUser.Id,
                UserName = $"{currentUser.FirstName} {currentUser.LastName}",
                MyTotalTasks = userTasks.Count,
                MyPendingTasksCount = userTasks.Count(t => t.Status != TaskStatus.Done),
                MyCompletedTasks = userTasks.Count(t => t.Status == TaskStatus.Done),
                MyOverdueTasks = userTasks.Count(t => t.DueDate.HasValue && t.DueDate < currentDate && t.Status != TaskStatus.Done)
            } : new UserDashboardSummaryDto();

            // My Pending Tasks (user-specific, top 5 prioritized)
            var myPendingTasks = currentUser != null ? userTasks
                .Where(t => t.Status != TaskStatus.Done)
                .OrderByDescending(t => t.Priority)
                .ThenBy(t => t.DueDate)
                .Take(5)
                .Select(t => new PendingTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    ProjectName = projects.FirstOrDefault(p => p.Id == t.ProjectId)?.Name ?? "Unknown Project",
                    Priority = GetPriorityLabel(t.Priority),
                    PriorityColor = GetPriorityColor(t.Priority),
                    DueDate = t.DueDate,
                    IsOverdue = t.DueDate.HasValue && t.DueDate < currentDate
                }).ToList() : new List<PendingTaskDto>();

            // Task Status Distribution for Pie Chart
            var taskStatusData = new List<TaskStatusChartDto>
            {
                new TaskStatusChartDto { Name = "Open", Value = tasks.Count(t => t.Status == TaskStatus.Todo), Color = "#3B82F6" },
                new TaskStatusChartDto { Name = "In Progress", Value = tasks.Count(t => t.Status == TaskStatus.InProgress), Color = "#F59E0B" },
                new TaskStatusChartDto { Name = "In Review", Value = tasks.Count(t => t.Status == TaskStatus.Review), Color = "#8B5CF6" },
                new TaskStatusChartDto { Name = "Testing", Value = tasks.Count(t => t.Status == TaskStatus.Testing), Color = "#06B6D4" },
                new TaskStatusChartDto { Name = "Completed", Value = tasks.Count(t => t.Status == TaskStatus.Done), Color = "#10B981" },
                new TaskStatusChartDto { Name = "Blocked", Value = tasks.Count(t => t.Status == TaskStatus.Blocked), Color = "#EF4444" }
            };

            // Project Status Overview for Stacked Bar Chart
            var projectStatusData = projects.Take(5).Select(p => new ProjectStatusChartDto
            {
                Name = p.Name,
                Open = tasks.Count(t => t.ProjectId == p.Id && t.Status == TaskStatus.Todo),
                InProgress = tasks.Count(t => t.ProjectId == p.Id && t.Status == TaskStatus.InProgress),
                Completed = tasks.Count(t => t.ProjectId == p.Id && t.Status == TaskStatus.Done),
                Total = tasks.Count(t => t.ProjectId == p.Id)
            }).ToList();

            // Task Type Distribution for Bar Chart using TaskTypeConstants
            var taskTypeData = new List<TaskTypeChartDto>
            {
                new TaskTypeChartDto { Name = TaskTypeConstants.Labels.Task, Value = tasks.Count(t => t.Acronym == TaskTypeConstants.Acronyms.Task), Color = "#8B5CF6" },
                new TaskTypeChartDto { Name = TaskTypeConstants.Labels.Bug, Value = tasks.Count(t => t.Acronym == TaskTypeConstants.Acronyms.Bug), Color = "#EF4444" },
                new TaskTypeChartDto { Name = TaskTypeConstants.Labels.Spike, Value = tasks.Count(t => t.Acronym == TaskTypeConstants.Acronyms.Spike), Color = "#F59E0B" },
                new TaskTypeChartDto { Name = TaskTypeConstants.Labels.Story, Value = tasks.Count(t => t.Acronym == TaskTypeConstants.Acronyms.Story), Color = "#10B981" }
            };

            // Recent Activities (mock data for now - can be enhanced with audit trail)
            var recentActivities = GenerateRecentActivities(users, tasks, currentDate);

            // Upcoming Holidays (mock data for now - can be enhanced with organization holidays)
            var upcomingHolidays = GenerateUpcomingHolidays(currentDate);

            // Latest Announcements (mock data for now - can be enhanced with actual announcements system)
            var latestAnnouncements = GenerateLatestAnnouncements(currentDate);

            // Leave Balance (mock data for now - can be enhanced with actual leave management)
            var leaveBalance = new LeaveBalanceDto();

            // Burndown Chart (using dummy data for now - can be enhanced to use real sprint data)
            var burndownData = new List<BurndownChartDto>
            {
                new BurndownChartDto { Day = "Day 1", Planned = 100, Actual = 100 },
                new BurndownChartDto { Day = "Day 2", Planned = 90, Actual = 95 },
                new BurndownChartDto { Day = "Day 3", Planned = 80, Actual = 88 },
                new BurndownChartDto { Day = "Day 4", Planned = 70, Actual = 78 },
                new BurndownChartDto { Day = "Day 5", Planned = 60, Actual = 65 },
                new BurndownChartDto { Day = "Day 6", Planned = 50, Actual = 52 },
                new BurndownChartDto { Day = "Day 7", Planned = 40, Actual = 45 },
                new BurndownChartDto { Day = "Day 8", Planned = 30, Actual = 35 },
                new BurndownChartDto { Day = "Day 9", Planned = 20, Actual = 22 },
                new BurndownChartDto { Day = "Day 10", Planned = 10, Actual = 15 },
                new BurndownChartDto { Day = "Day 11", Planned = 0, Actual = 8 }
            };

            return new HomeDashboardDto
            {
                // Basic Statistics
                TotalProjects = totalProjects,
                ActiveTasks = activeTasks,
                TeamMembers = teamMembers,
                Completed = completed,
                OverdueTasks = overdueTasks,

                // Chart Data
                TaskStatusData = taskStatusData,
                ProjectStatusData = projectStatusData,
                TaskTypeData = taskTypeData,
                BurndownData = burndownData,

                // User-specific Data
                UserSummary = userSummary,
                MyPendingTasks = myPendingTasks,
                LeaveBalance = leaveBalance,

                // Activity & Announcements
                RecentActivities = recentActivities,
                UpcomingHolidays = upcomingHolidays,
                LatestAnnouncements = latestAnnouncements
            };
        }

        private static string GetPriorityLabel(Domain.Enums.TaskPriority priority)
        {
            return priority switch
            {
                Domain.Enums.TaskPriority.Low => "Low",
                Domain.Enums.TaskPriority.Medium => "Medium",
                Domain.Enums.TaskPriority.High => "High",
                Domain.Enums.TaskPriority.Critical => "Critical",
                _ => "Medium"
            };
        }

        private static string GetPriorityColor(Domain.Enums.TaskPriority priority)
        {
            return priority switch
            {
                Domain.Enums.TaskPriority.Low => "green",
                Domain.Enums.TaskPriority.Medium => "yellow",
                Domain.Enums.TaskPriority.High => "red",
                Domain.Enums.TaskPriority.Critical => "purple",
                _ => "yellow"
            };
        }

        private static List<RecentActivityDto> GenerateRecentActivities(List<User> users, List<ProjectTask> tasks, DateTime currentDate)
        {
            var activities = new List<RecentActivityDto>();
            var random = new Random();
            var colors = new[] { "primary", "green", "blue", "purple", "indigo" };

            // Get recently completed tasks
            var recentTasks = tasks.Where(t => t.Status == TaskStatus.Done && t.UpdatedAt.HasValue)
                .OrderByDescending(t => t.UpdatedAt)
                .Take(3)
                .ToList();

            foreach (var task in recentTasks)
            {
                var user = users.FirstOrDefault(u => u.Id == task.AssignedToUserId);
                if (user != null)
                {
                    activities.Add(new RecentActivityDto
                    {
                        UserName = $"{user.FirstName} {user.LastName}",
                        UserInitials = $"{user.FirstName.Substring(0, 1)}{user.LastName.Substring(0, 1)}",
                        Action = $"completed task \"{task.Title}\"",
                        Timestamp = task.UpdatedAt ?? currentDate,
                        TimeAgo = GetTimeAgo(task.UpdatedAt ?? currentDate, currentDate),
                        AvatarColor = colors[random.Next(colors.Length)]
                    });
                }
            }

            // Add some mock recent activities if we don't have enough real data
            if (activities.Count < 3)
            {
                var sampleUsers = users.Take(3).ToList();
                var sampleActivities = new[]
                {
                    "created new project",
                    "updated project timeline",
                    "assigned new task",
                    "completed code review",
                    "deployed to staging"
                };

                for (int i = activities.Count; i < 3 && i < sampleUsers.Count; i++)
                {
                    var user = sampleUsers[i];
                    activities.Add(new RecentActivityDto
                    {
                        UserName = $"{user.FirstName} {user.LastName}",
                        UserInitials = $"{user.FirstName.Substring(0, 1)}{user.LastName.Substring(0, 1)}",
                        Action = sampleActivities[random.Next(sampleActivities.Length)],
                        Timestamp = currentDate.AddHours(-(i + 2)),
                        TimeAgo = $"{i + 2} hours ago",
                        AvatarColor = colors[random.Next(colors.Length)]
                    });
                }
            }

            return activities.OrderByDescending(a => a.Timestamp).ToList();
        }

        private static List<UpcomingHolidayDto> GenerateUpcomingHolidays(DateTime currentDate)
        {
            return new List<UpcomingHolidayDto>
            {
                new UpcomingHolidayDto
                {
                    Name = "Labor Day",
                    Date = new DateTime(currentDate.Year, 9, 2),
                    Description = "Federal Holiday - Office Closed",
                    DayOfWeek = "Monday",
                    FormattedDate = "Sep 2"
                },
                new UpcomingHolidayDto
                {
                    Name = "Thanksgiving Day",
                    Date = new DateTime(currentDate.Year, 11, 28),
                    Description = "Federal Holiday - Office Closed",
                    DayOfWeek = "Thursday",
                    FormattedDate = "Nov 28"
                },
                new UpcomingHolidayDto
                {
                    Name = "Christmas Day",
                    Date = new DateTime(currentDate.Year, 12, 25),
                    Description = "Federal Holiday - Office Closed",
                    DayOfWeek = "Wednesday",
                    FormattedDate = "Dec 25"
                }
            }.Where(h => h.Date > currentDate).Take(2).ToList();
        }

        private static List<AnnouncementDto> GenerateLatestAnnouncements(DateTime currentDate)
        {
            return new List<AnnouncementDto>
            {
                new AnnouncementDto
                {
                    Id = Guid.NewGuid(),
                    Title = "New Project Management Guidelines",
                    Content = "Updated project workflow and approval process",
                    CreatedAt = currentDate.AddDays(-2),
                    TimeAgo = "2 days ago"
                },
                new AnnouncementDto
                {
                    Id = Guid.NewGuid(),
                    Title = "Team Building Event",
                    Content = "Join us for the quarterly team building activity",
                    CreatedAt = currentDate.AddDays(-7),
                    TimeAgo = "1 week ago"
                }
            };
        }

        private static string GetTimeAgo(DateTime timestamp, DateTime currentDate)
        {
            var timeSpan = currentDate - timestamp;

            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} minutes ago";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} hours ago";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays} days ago";

            return timestamp.ToString("MMM dd");
        }
    }
}
