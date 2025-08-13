using GenAI.SmartFlowPM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.ToTable("Organizations");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(o => o.Description)
            .HasMaxLength(1000);

        builder.Property(o => o.Website)
            .HasMaxLength(200);

        builder.Property(o => o.Phone)
            .HasMaxLength(20);

        builder.Property(o => o.Email)
            .HasMaxLength(200);

        builder.Property(o => o.Address)
            .HasMaxLength(500);

        builder.Property(o => o.City)
            .HasMaxLength(100);

        builder.Property(o => o.State)
            .HasMaxLength(100);

        builder.Property(o => o.Country)
            .HasMaxLength(100);

        builder.Property(o => o.PostalCode)
            .HasMaxLength(20);

        builder.Property(o => o.Logo)
            .HasMaxLength(500);

        builder.Property(o => o.EstablishedDate)
            .HasColumnType("date");

        builder.Property(o => o.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(o => o.CreatedAt)
            .IsRequired();

        builder.Property(o => o.UpdatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(o => o.Name)
            .IsUnique();

        builder.HasIndex(o => o.Email);

        // Relationships
        builder.HasMany(o => o.Branches)
            .WithOne(b => b.Organization)
            .HasForeignKey(b => b.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Policies)
            .WithOne(p => p.Organization)
            .HasForeignKey(p => p.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Holidays)
            .WithOne(h => h.Organization)
            .HasForeignKey(h => h.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Settings)
            .WithOne(s => s.Organization)
            .HasForeignKey(s => s.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable("Branches");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(b => b.Code)
            .HasMaxLength(20);

        builder.Property(b => b.BranchType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(b => b.Description)
            .HasMaxLength(1000);

        builder.Property(b => b.Phone)
            .HasMaxLength(20);

        builder.Property(b => b.Email)
            .HasMaxLength(200);

        builder.Property(b => b.Address)
            .HasMaxLength(500);

        builder.Property(b => b.City)
            .HasMaxLength(100);

        builder.Property(b => b.State)
            .HasMaxLength(100);

        builder.Property(b => b.Country)
            .HasMaxLength(100);

        builder.Property(b => b.PostalCode)
            .HasMaxLength(20);

        builder.Property(b => b.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(b => b.CreatedAt)
            .IsRequired();

        builder.Property(b => b.UpdatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(b => new { b.Name, b.OrganizationId })
            .IsUnique();

        builder.HasIndex(b => new { b.Code, b.OrganizationId })
            .IsUnique()
            .HasFilter("\"Code\" IS NOT NULL");

        builder.HasIndex(b => b.ManagerId);

        // Relationships
        builder.HasOne(b => b.Organization)
            .WithMany(o => o.Branches)
            .HasForeignKey(b => b.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.Manager)
            .WithMany()
            .HasForeignKey(b => b.ManagerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class OrganizationPolicyConfiguration : IEntityTypeConfiguration<OrganizationPolicy>
{
    public void Configure(EntityTypeBuilder<OrganizationPolicy> builder)
    {
        builder.ToTable("OrganizationPolicies");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Content)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(p => p.PolicyType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(p => p.EffectiveDate)
            .IsRequired()
            .HasColumnType("date");

        builder.Property(p => p.ExpiryDate)
            .HasColumnType("date");

        builder.Property(p => p.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(p => new { p.Title, p.OrganizationId })
            .IsUnique();

        builder.HasIndex(p => p.PolicyType);

        builder.HasIndex(p => p.EffectiveDate);

        // Relationships
        builder.HasOne(p => p.Organization)
            .WithMany(o => o.Policies)
            .HasForeignKey(p => p.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CompanyHolidayConfiguration : IEntityTypeConfiguration<CompanyHoliday>
{
    public void Configure(EntityTypeBuilder<CompanyHoliday> builder)
    {
        builder.ToTable("CompanyHolidays");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(h => h.Date)
            .IsRequired()
            .HasColumnType("date");

        builder.Property(h => h.Description)
            .HasMaxLength(1000);

        builder.Property(h => h.IsRecurring)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(h => h.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(h => h.CreatedAt)
            .IsRequired();

        builder.Property(h => h.UpdatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(h => new { h.Date, h.OrganizationId });

        builder.HasIndex(h => h.IsRecurring);

        // Relationships
        builder.HasOne(h => h.Organization)
            .WithMany(o => o.Holidays)
            .HasForeignKey(h => h.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class OrganizationSettingConfiguration : IEntityTypeConfiguration<OrganizationSetting>
{
    public void Configure(EntityTypeBuilder<OrganizationSetting> builder)
    {
        builder.ToTable("OrganizationSettings");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.SettingKey)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.SettingValue)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(s => s.SettingType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(s => s.Description)
            .HasMaxLength(500);

        builder.Property(s => s.IsEditable)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(s => s.CreatedAt)
            .IsRequired();

        builder.Property(s => s.UpdatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(s => new { s.SettingKey, s.OrganizationId })
            .IsUnique();

        builder.HasIndex(s => s.IsEditable);

        // Relationships
        builder.HasOne(s => s.Organization)
            .WithMany(o => o.Settings)
            .HasForeignKey(s => s.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
