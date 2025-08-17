using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class TimeCategoryConfiguration : IEntityTypeConfiguration<TimeCategory>
{
    public void Configure(EntityTypeBuilder<TimeCategory> builder)
    {
        builder.ToTable("TimeCategories");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.Color)
            .HasMaxLength(7); // Hex color code #FFFFFF

        // Indexes
        builder.HasIndex(x => new { x.Name, x.TenantId })
            .IsUnique()
            .HasDatabaseName("IX_TimeCategories_Name_TenantId");

        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_TimeCategories_TenantId");

        builder.HasIndex(x => x.IsActive)
            .HasDatabaseName("IX_TimeCategories_IsActive");

        // Relationships
        builder.HasMany(x => x.TimeEntries)
            .WithOne(x => x.TimeCategory)
            .HasForeignKey(x => x.TimeCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.ActiveTrackingSessions)
            .WithOne(x => x.TimeCategory)
            .HasForeignKey(x => x.TimeCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class TimeEntryConfiguration : IEntityTypeConfiguration<TimeEntry>
{
    public void Configure(EntityTypeBuilder<TimeEntry> builder)
    {
        builder.ToTable("TimeEntries");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.HourlyRate)
            .HasColumnType("decimal(18,2)");

        // Indexes
        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_TimeEntries_UserId");

        builder.HasIndex(x => x.ProjectId)
            .HasDatabaseName("IX_TimeEntries_ProjectId");

        builder.HasIndex(x => x.TaskId)
            .HasDatabaseName("IX_TimeEntries_TaskId");

        builder.HasIndex(x => x.TimeCategoryId)
            .HasDatabaseName("IX_TimeEntries_TimeCategoryId");

        builder.HasIndex(x => x.TimesheetId)
            .HasDatabaseName("IX_TimeEntries_TimesheetId");

        builder.HasIndex(x => x.StartTime)
            .HasDatabaseName("IX_TimeEntries_StartTime");

        builder.HasIndex(x => x.EntryType)
            .HasDatabaseName("IX_TimeEntries_EntryType");

        builder.HasIndex(x => x.BillableStatus)
            .HasDatabaseName("IX_TimeEntries_BillableStatus");

        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_TimeEntries_TenantId");

        // Relationships
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Task)
            .WithMany()
            .HasForeignKey(x => x.TaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Timesheet)
            .WithMany(x => x.TimeEntries)
            .HasForeignKey(x => x.TimesheetId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class TimesheetConfiguration : IEntityTypeConfiguration<Timesheet>
{
    public void Configure(EntityTypeBuilder<Timesheet> builder)
    {
        builder.ToTable("Timesheets");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TotalHours)
            .HasColumnType("decimal(18,2)");

        builder.Property(x => x.BillableHours)
            .HasColumnType("decimal(18,2)");

        builder.Property(x => x.ApprovalNotes)
            .HasMaxLength(1000);

        // Indexes
        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_Timesheets_UserId");

        builder.HasIndex(x => x.StartDate)
            .HasDatabaseName("IX_Timesheets_StartDate");

        builder.HasIndex(x => x.EndDate)
            .HasDatabaseName("IX_Timesheets_EndDate");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Timesheets_Status");

        builder.HasIndex(x => x.SubmittedAt)
            .HasDatabaseName("IX_Timesheets_SubmittedAt");

        builder.HasIndex(x => x.ApprovedAt)
            .HasDatabaseName("IX_Timesheets_ApprovedAt");

        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_Timesheets_TenantId");

        // Unique constraint for user and date range
        builder.HasIndex(x => new { x.UserId, x.StartDate, x.EndDate })
            .IsUnique()
            .HasDatabaseName("IX_Timesheets_UserId_DateRange");

        // Relationships
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.SubmittedByUser)
            .WithMany()
            .HasForeignKey(x => x.SubmittedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ApprovedByUser)
            .WithMany()
            .HasForeignKey(x => x.ApprovedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.RejectedByUser)
            .WithMany()
            .HasForeignKey(x => x.RejectedBy)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ActiveTrackingSessionConfiguration : IEntityTypeConfiguration<ActiveTrackingSession>
{
    public void Configure(EntityTypeBuilder<ActiveTrackingSession> builder)
    {
        builder.ToTable("ActiveTrackingSessions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        // Indexes
        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_ActiveTrackingSessions_UserId");

        builder.HasIndex(x => x.ProjectId)
            .HasDatabaseName("IX_ActiveTrackingSessions_ProjectId");

        builder.HasIndex(x => x.TaskId)
            .HasDatabaseName("IX_ActiveTrackingSessions_TaskId");

        builder.HasIndex(x => x.TimeCategoryId)
            .HasDatabaseName("IX_ActiveTrackingSessions_TimeCategoryId");

        builder.HasIndex(x => x.StartTime)
            .HasDatabaseName("IX_ActiveTrackingSessions_StartTime");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_ActiveTrackingSessions_Status");

        builder.HasIndex(x => x.IsActive)
            .HasDatabaseName("IX_ActiveTrackingSessions_IsActive");

        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_ActiveTrackingSessions_TenantId");

        // Ensure only one active session per user
        builder.HasIndex(x => new { x.UserId, x.IsActive })
            .IsUnique()
            .HasFilter("\"IsActive\" = true")
            .HasDatabaseName("IX_ActiveTrackingSessions_UserId_IsActive");

        // Relationships
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Task)
            .WithMany()
            .HasForeignKey(x => x.TaskId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
