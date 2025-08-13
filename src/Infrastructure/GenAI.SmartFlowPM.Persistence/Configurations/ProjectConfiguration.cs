using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.ClientName)
            .HasMaxLength(100);

        builder.Property(x => x.Budget)
            .HasColumnType("decimal(18,2)");

        // Indexes
        builder.HasIndex(x => x.Name)
            .IsUnique()
            .HasDatabaseName("IX_Projects_Name");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Projects_Status");

        builder.HasIndex(x => x.StartDate)
            .HasDatabaseName("IX_Projects_StartDate");

        // Relationships
        builder.HasMany(x => x.UserProjects)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Tasks)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class UserProjectConfiguration : IEntityTypeConfiguration<UserProject>
{
    public void Configure(EntityTypeBuilder<UserProject> builder)
    {
        builder.ToTable("UserProjects");

        builder.HasKey(x => x.Id);

        // Composite unique index
        builder.HasIndex(x => new { x.UserId, x.ProjectId })
            .IsUnique()
            .HasDatabaseName("IX_UserProjects_UserId_ProjectId");

        builder.HasIndex(x => x.AssignedDate)
            .HasDatabaseName("IX_UserProjects_AssignedDate");
    }
}

public class ProjectTaskConfiguration : IEntityTypeConfiguration<ProjectTask>
{
    public void Configure(EntityTypeBuilder<ProjectTask> builder)
    {
        builder.ToTable("ProjectTasks");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);
            
        builder.Property(x => x.Acronym)
            .IsRequired()
            .HasMaxLength(10);
            
        builder.Property(x => x.TaskNumber)
            .IsRequired()
            .HasMaxLength(20);

        // Indexes
        builder.HasIndex(x => x.ProjectId)
            .HasDatabaseName("IX_ProjectTasks_ProjectId");

        builder.HasIndex(x => x.AssignedToUserId)
            .HasDatabaseName("IX_ProjectTasks_AssignedToUserId");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_ProjectTasks_Status");

        builder.HasIndex(x => x.DueDate)
            .HasDatabaseName("IX_ProjectTasks_DueDate");
            
        builder.HasIndex(x => x.TaskNumber)
            .IsUnique()
            .HasDatabaseName("IX_ProjectTasks_TaskNumber");

        // Self-referencing relationship for parent-child tasks
        builder.HasOne(x => x.ParentTask)
            .WithMany(x => x.SubTasks)
            .HasForeignKey(x => x.ParentTaskId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
