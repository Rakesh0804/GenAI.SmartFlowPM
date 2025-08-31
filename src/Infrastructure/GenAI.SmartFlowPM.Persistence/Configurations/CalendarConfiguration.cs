using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class CalendarEventConfiguration : IEntityTypeConfiguration<CalendarEvent>
{
    public void Configure(EntityTypeBuilder<CalendarEvent> builder)
    {
        builder.ToTable("CalendarEvents");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(2000);

        builder.Property(x => x.Location)
            .HasMaxLength(500);

        builder.Property(x => x.StartDateTime)
            .IsRequired();

        builder.Property(x => x.EndDateTime)
            .IsRequired();

        builder.Property(x => x.EventType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.Priority)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.IsAllDay)
            .IsRequired();

        builder.Property(x => x.IsRecurring)
            .IsRequired();

        builder.Property(x => x.Color)
            .HasMaxLength(7); // Hex color code

        builder.Property(x => x.RecurrencePattern)
            .HasMaxLength(2000); // JSON serialized

        // Relationships
        builder.HasOne(x => x.Tenant)
            .WithMany()
            .HasForeignKey(x => x.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.EventCreator)
            .WithMany()
            .HasForeignKey(x => x.EventCreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Task)
            .WithMany()
            .HasForeignKey(x => x.TaskId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.Attendees)
            .WithOne(x => x.Event)
            .HasForeignKey(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Reminders)
            .WithOne(x => x.Event)
            .HasForeignKey(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Recurrence)
            .WithOne(x => x.Event)
            .HasForeignKey<RecurrencePattern>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_CalendarEvents_TenantId");

        builder.HasIndex(x => x.EventCreatedBy)
            .HasDatabaseName("IX_CalendarEvents_EventCreatedBy");

        builder.HasIndex(x => x.ProjectId)
            .HasDatabaseName("IX_CalendarEvents_ProjectId");

        builder.HasIndex(x => x.TaskId)
            .HasDatabaseName("IX_CalendarEvents_TaskId");

        builder.HasIndex(x => new { x.StartDateTime, x.EndDateTime })
            .HasDatabaseName("IX_CalendarEvents_DateRange");

        builder.HasIndex(x => new { x.TenantId, x.StartDateTime })
            .HasDatabaseName("IX_CalendarEvents_TenantId_StartDateTime");

        builder.HasIndex(x => new { x.TenantId, x.Status })
            .HasDatabaseName("IX_CalendarEvents_TenantId_Status");

        builder.HasIndex(x => new { x.TenantId, x.EventType })
            .HasDatabaseName("IX_CalendarEvents_TenantId_EventType");
    }
}

public class EventAttendeeConfiguration : IEntityTypeConfiguration<EventAttendee>
{
    public void Configure(EntityTypeBuilder<EventAttendee> builder)
    {
        builder.ToTable("EventAttendees");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Response)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.ResponseAt);

        builder.Property(x => x.Notes)
            .HasMaxLength(500);

        builder.Property(x => x.IsRequired)
            .IsRequired();

        builder.Property(x => x.IsOrganizer)
            .IsRequired();

        builder.Property(x => x.InvitedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(x => x.Tenant)
            .WithMany()
            .HasForeignKey(x => x.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Event)
            .WithMany(x => x.Attendees)
            .HasForeignKey(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_EventAttendees_TenantId");

        builder.HasIndex(x => x.EventId)
            .HasDatabaseName("IX_EventAttendees_EventId");

        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_EventAttendees_UserId");

        builder.HasIndex(x => new { x.EventId, x.UserId })
            .IsUnique()
            .HasDatabaseName("IX_EventAttendees_EventId_UserId");

        builder.HasIndex(x => new { x.TenantId, x.Response })
            .HasDatabaseName("IX_EventAttendees_TenantId_Response");
    }
}

public class EventReminderConfiguration : IEntityTypeConfiguration<EventReminder>
{
    public void Configure(EntityTypeBuilder<EventReminder> builder)
    {
        builder.ToTable("EventReminders");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ReminderType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.ReminderTime)
            .IsRequired();

        builder.Property(x => x.IsActive)
            .IsRequired();

        builder.Property(x => x.IsSent)
            .IsRequired();

        builder.Property(x => x.SentAt);

        // Relationships
        builder.HasOne(x => x.Tenant)
            .WithMany()
            .HasForeignKey(x => x.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Event)
            .WithMany(x => x.Reminders)
            .HasForeignKey(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_EventReminders_TenantId");

        builder.HasIndex(x => x.EventId)
            .HasDatabaseName("IX_EventReminders_EventId");

        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_EventReminders_UserId");

        builder.HasIndex(x => x.ReminderTime)
            .HasDatabaseName("IX_EventReminders_ReminderTime");

        builder.HasIndex(x => new { x.TenantId, x.IsActive, x.IsSent })
            .HasDatabaseName("IX_EventReminders_TenantId_IsActive_IsSent");

        builder.HasIndex(x => new { x.ReminderTime, x.IsActive, x.IsSent })
            .HasDatabaseName("IX_EventReminders_ReminderTime_IsActive_IsSent");
    }
}

public class RecurrencePatternConfiguration : IEntityTypeConfiguration<RecurrencePattern>
{
    public void Configure(EntityTypeBuilder<RecurrencePattern> builder)
    {
        builder.ToTable("RecurrencePatterns");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.RecurrenceType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.Interval)
            .IsRequired();

        builder.Property(x => x.DaysOfWeek)
            .HasMaxLength(50);

        builder.Property(x => x.DayOfMonth);

        builder.Property(x => x.MonthOfYear);

        builder.Property(x => x.EndDate);

        builder.Property(x => x.MaxOccurrences);

        // Relationships
        builder.HasOne(x => x.Tenant)
            .WithMany()
            .HasForeignKey(x => x.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Event)
            .WithOne(x => x.Recurrence)
            .HasForeignKey<RecurrencePattern>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(x => x.TenantId)
            .HasDatabaseName("IX_RecurrencePatterns_TenantId");

        builder.HasIndex(x => x.EventId)
            .IsUnique()
            .HasDatabaseName("IX_RecurrencePatterns_EventId");

        builder.HasIndex(x => new { x.TenantId, x.RecurrenceType })
            .HasDatabaseName("IX_RecurrencePatterns_TenantId_RecurrenceType");

        builder.HasIndex(x => new { x.EndDate })
            .HasDatabaseName("IX_RecurrencePatterns_EndDate");
    }
}
