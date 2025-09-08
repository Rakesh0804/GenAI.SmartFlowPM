using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class CampaignConfiguration : IEntityTypeConfiguration<Campaign>
{
    public void Configure(EntityTypeBuilder<Campaign> builder)
    {
        builder.ToTable("Campaigns");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.Type)
            .IsRequired();

        builder.Property(x => x.Status)
            .IsRequired()
            .HasDefaultValue(1); // Default: Draft

        builder.Property(x => x.StartDate)
            .IsRequired();

        builder.Property(x => x.EndDate)
            .IsRequired();

        builder.Property(x => x.AssignedManagers)
            .IsRequired()
            .HasMaxLength(4000)
            .HasDefaultValue("[]");

        builder.Property(x => x.TargetUserIds)
            .IsRequired()
            .HasMaxLength(4000)
            .HasDefaultValue("[]");

        builder.Property(x => x.ActualStartDate);

        builder.Property(x => x.ActualEndDate);

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(x => x.CreatedByUserId)
            .IsRequired();

        // Indexes for better query performance
        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Campaigns_Status");

        builder.HasIndex(x => new { x.TenantId, x.Status })
            .HasDatabaseName("IX_Campaigns_TenantId_Status");

        builder.HasIndex(x => new { x.StartDate, x.EndDate })
            .HasDatabaseName("IX_Campaigns_DateRange");

        builder.HasIndex(x => x.CreatedByUserId)
            .HasDatabaseName("IX_Campaigns_CreatedByUserId");

        // Configure relationships
        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Groups)
            .WithOne(x => x.Campaign)
            .HasForeignKey(x => x.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Evaluations)
            .WithOne(x => x.Campaign)
            .HasForeignKey(x => x.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CampaignGroupConfiguration : IEntityTypeConfiguration<CampaignGroup>
{
    public void Configure(EntityTypeBuilder<CampaignGroup> builder)
    {
        builder.ToTable("CampaignGroups");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CampaignId); // Nullable for standalone groups

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.ManagerId)
            .IsRequired();

        builder.Property(x => x.TargetUserIds)
            .IsRequired()
            .HasMaxLength(4000)
            .HasDefaultValue("[]");

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes
        builder.HasIndex(x => x.CampaignId)
            .HasDatabaseName("IX_CampaignGroups_CampaignId");

        builder.HasIndex(x => x.ManagerId)
            .HasDatabaseName("IX_CampaignGroups_ManagerId");

        builder.HasIndex(x => new { x.TenantId, x.CampaignId })
            .HasDatabaseName("IX_CampaignGroups_TenantId_CampaignId");

        // Configure relationships
        builder.HasMany<CampaignEvaluation>()
            .WithOne()
            .HasForeignKey(x => x.GroupId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class CampaignEvaluationConfiguration : IEntityTypeConfiguration<CampaignEvaluation>
{
    public void Configure(EntityTypeBuilder<CampaignEvaluation> builder)
    {
        builder.ToTable("CampaignEvaluations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CampaignId)
            .IsRequired();

        builder.Property(x => x.GroupId);

        builder.Property(x => x.EvaluatedUserId)
            .IsRequired();

        builder.Property(x => x.EvaluatorId)
            .IsRequired();

        builder.Property(x => x.RoleEvaluations)
            .HasMaxLength(4000);

        builder.Property(x => x.ClaimEvaluations)
            .HasMaxLength(4000);

        builder.Property(x => x.Feedback)
            .HasMaxLength(2000);

        builder.Property(x => x.IsCompleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.SubmittedAt);

        // Indexes
        builder.HasIndex(x => x.CampaignId)
            .HasDatabaseName("IX_CampaignEvaluations_CampaignId");

        builder.HasIndex(x => x.EvaluatedUserId)
            .HasDatabaseName("IX_CampaignEvaluations_EvaluatedUserId");

        builder.HasIndex(x => x.EvaluatorId)
            .HasDatabaseName("IX_CampaignEvaluations_EvaluatorId");

        builder.HasIndex(x => new { x.TenantId, x.CampaignId, x.EvaluatedUserId })
            .HasDatabaseName("IX_CampaignEvaluations_TenantId_CampaignId_EvaluatedUserId");

        // Unique constraint to prevent duplicate evaluations
        builder.HasIndex(x => new { x.CampaignId, x.EvaluatedUserId, x.EvaluatorId })
            .IsUnique()
            .HasDatabaseName("IX_CampaignEvaluations_Unique_Evaluation");
    }
}
