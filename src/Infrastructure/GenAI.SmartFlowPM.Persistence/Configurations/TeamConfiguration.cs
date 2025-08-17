using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.ToTable("Teams");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.Location)
            .HasMaxLength(50);

        // Indexes
        builder.HasIndex(x => x.Name)
            .IsUnique()
            .HasDatabaseName("IX_Teams_Name");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Teams_Status");

        builder.HasIndex(x => x.LeaderId)
            .HasDatabaseName("IX_Teams_LeaderId");

        builder.HasIndex(x => x.Type)
            .HasDatabaseName("IX_Teams_Type");

        // Relationships
        builder.HasOne(x => x.Leader)
            .WithMany()
            .HasForeignKey(x => x.LeaderId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.TeamMembers)
            .WithOne(x => x.Team)
            .HasForeignKey(x => x.TeamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class TeamMemberConfiguration : IEntityTypeConfiguration<TeamMember>
{
    public void Configure(EntityTypeBuilder<TeamMember> builder)
    {
        builder.ToTable("TeamMembers");

        builder.HasKey(x => x.Id);

        // Composite unique index to prevent duplicate memberships
        builder.HasIndex(x => new { x.TeamId, x.UserId })
            .IsUnique()
            .HasDatabaseName("IX_TeamMembers_TeamId_UserId");

        builder.HasIndex(x => x.JoinedDate)
            .HasDatabaseName("IX_TeamMembers_JoinedDate");

        builder.HasIndex(x => x.Role)
            .HasDatabaseName("IX_TeamMembers_Role");

        // Relationships
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
