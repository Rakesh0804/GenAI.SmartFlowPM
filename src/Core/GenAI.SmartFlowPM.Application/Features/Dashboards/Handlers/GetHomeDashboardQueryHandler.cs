using GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs;
using GenAI.SmartFlowPM.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using GenAI.SmartFlowPM.Persistence.Context;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GenAI.SmartFlowPM.Application.Features.Dashboards.Handlers
{
    public class GetHomeDashboardQueryHandler : IRequestHandler<GetHomeDashboardQuery, HomeDashboardDto>
    {
        private readonly ApplicationDbContext _db;
        public GetHomeDashboardQueryHandler(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<HomeDashboardDto> Handle(GetHomeDashboardQuery request, CancellationToken cancellationToken)
        {
            // Example queries, adjust as per your schema
            var totalProjects = await _db.Projects.CountAsync(cancellationToken);
            var activeTasks = await _db.Tasks.CountAsync(t => t.Status == "InProgress", cancellationToken);
            var teamMembers = await _db.Users.CountAsync(cancellationToken);
            var completed = await _db.Tasks.CountAsync(t => t.Status == "Completed", cancellationToken);

            // Task Status Pie
            var taskStatusData = new List<TaskStatusChartDto>
            {
                new TaskStatusChartDto { Name = "Open", Value = await _db.Tasks.CountAsync(t => t.Status == "Open", cancellationToken), Color = "#3B82F6" },
                new TaskStatusChartDto { Name = "In Progress", Value = await _db.Tasks.CountAsync(t => t.Status == "InProgress", cancellationToken), Color = "#F59E0B" },
                new TaskStatusChartDto { Name = "Completed", Value = await _db.Tasks.CountAsync(t => t.Status == "Completed", cancellationToken), Color = "#10B981" },
                new TaskStatusChartDto { Name = "Blocked", Value = await _db.Tasks.CountAsync(t => t.Status == "Blocked", cancellationToken), Color = "#EF4444" }
            };

            // Project Status Bar
            var projectStatusData = await _db.Projects
                .Select(p => new ProjectStatusChartDto
                {
                    Name = p.Name,
                    Open = _db.Tasks.Count(t => t.ProjectId == p.Id && t.Status == "Open"),
                    InProgress = _db.Tasks.Count(t => t.ProjectId == p.Id && t.Status == "InProgress"),
                    Completed = _db.Tasks.Count(t => t.ProjectId == p.Id && t.Status == "Completed"),
                    Total = _db.Tasks.Count(t => t.ProjectId == p.Id)
                })
                .Take(5)
                .ToListAsync(cancellationToken);

            // Task Type Bar
            var taskTypeData = new List<TaskTypeChartDto>
            {
                new TaskTypeChartDto { Name = "Task", Value = await _db.Tasks.CountAsync(t => t.Type == "Task", cancellationToken), Color = "#8B5CF6" },
                new TaskTypeChartDto { Name = "Bug", Value = await _db.Tasks.CountAsync(t => t.Type == "Bug", cancellationToken), Color = "#EF4444" },
                new TaskTypeChartDto { Name = "Spike", Value = await _db.Tasks.CountAsync(t => t.Type == "Spike", cancellationToken), Color = "#F59E0B" },
                new TaskTypeChartDto { Name = "Story", Value = await _db.Tasks.CountAsync(t => t.Type == "Story", cancellationToken), Color = "#10B981" },
                new TaskTypeChartDto { Name = "Epic", Value = await _db.Tasks.CountAsync(t => t.Type == "Epic", cancellationToken), Color = "#3B82F6" }
            };

            // Burndown Chart (dummy data for now)
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
                TotalProjects = totalProjects,
                ActiveTasks = activeTasks,
                TeamMembers = teamMembers,
                Completed = completed,
                TaskStatusData = taskStatusData,
                ProjectStatusData = projectStatusData,
                TaskTypeData = taskTypeData,
                BurndownData = burndownData
            };
        }
    }
}
