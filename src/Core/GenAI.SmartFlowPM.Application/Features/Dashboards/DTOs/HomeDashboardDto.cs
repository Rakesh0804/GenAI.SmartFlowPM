using System.Collections.Generic;

namespace GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs
{
    public class HomeDashboardDto
    {
        public int TotalProjects { get; set; }
        public int ActiveTasks { get; set; }
        public int TeamMembers { get; set; }
        public int Completed { get; set; }
        public List<TaskStatusChartDto> TaskStatusData { get; set; } = new();
        public List<ProjectStatusChartDto> ProjectStatusData { get; set; } = new();
        public List<TaskTypeChartDto> TaskTypeData { get; set; } = new();
        public List<BurndownChartDto> BurndownData { get; set; } = new();
    }

    public class TaskStatusChartDto
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class ProjectStatusChartDto
    {
        public string Name { get; set; } = string.Empty;
        public int Open { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
        public int Total { get; set; }
    }

    public class TaskTypeChartDto
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class BurndownChartDto
    {
        public string Day { get; set; } = string.Empty;
        public int Planned { get; set; }
        public int Actual { get; set; }
    }
}
