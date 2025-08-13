using System.Collections.Generic;
using System;

namespace GenAI.SmartFlowPM.Application.Features.Dashboards.DTOs
{
    public class HomeDashboardDto
    {
        // Basic Statistics
        public int TotalProjects { get; set; }
        public int ActiveTasks { get; set; }
        public int TeamMembers { get; set; }
        public int Completed { get; set; }
        public int OverdueTasks { get; set; }

        // Chart Data
        public List<TaskStatusChartDto> TaskStatusData { get; set; } = new();
        public List<ProjectStatusChartDto> ProjectStatusData { get; set; } = new();
        public List<TaskTypeChartDto> TaskTypeData { get; set; } = new();
        public List<BurndownChartDto> BurndownData { get; set; } = new();

        // User-specific Data
        public UserDashboardSummaryDto UserSummary { get; set; } = new();
        public List<PendingTaskDto> MyPendingTasks { get; set; } = new();
        public LeaveBalanceDto LeaveBalance { get; set; } = new();

        // Activity & Announcements
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
        public List<UpcomingHolidayDto> UpcomingHolidays { get; set; } = new();
        public List<AnnouncementDto> LatestAnnouncements { get; set; } = new();
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

    public class UserDashboardSummaryDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int MyTotalTasks { get; set; }
        public int MyPendingTasksCount { get; set; }
        public int MyCompletedTasks { get; set; }
        public int MyOverdueTasks { get; set; }
    }

    public class PendingTaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ProjectName { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string PriorityColor { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsOverdue { get; set; }
    }

    public class LeaveBalanceDto
    {
        public int CompensatoryOff { get; set; } = 15;
        public int EarnedLeave { get; set; } = 12;
        public int LeaveWithoutPay { get; set; } = 4;
        public int TotalAvailable => CompensatoryOff + EarnedLeave;
        public int TotalUsed => LeaveWithoutPay;
    }

    public class RecentActivityDto
    {
        public string UserName { get; set; } = string.Empty;
        public string UserInitials { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string TimeAgo { get; set; } = string.Empty;
        public string AvatarColor { get; set; } = string.Empty;
    }

    public class UpcomingHolidayDto
    {
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public string DayOfWeek { get; set; } = string.Empty;
        public string FormattedDate { get; set; } = string.Empty;
    }

    public class AnnouncementDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string TimeAgo { get; set; } = string.Empty;
    }
}
