using GenAI.SmartFlowPM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("Tenants");
        
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(t => t.SubDomain)
            .HasMaxLength(100);
            
        builder.Property(t => t.Description)
            .HasMaxLength(500);
            
        builder.Property(t => t.ContactEmail)
            .IsRequired()
            .HasMaxLength(255);
            
        builder.Property(t => t.ContactPhone)
            .HasMaxLength(15);
            
        builder.Property(t => t.Address)
            .HasMaxLength(500);
            
        builder.Property(t => t.City)
            .HasMaxLength(100);
            
        builder.Property(t => t.State)
            .HasMaxLength(100);
            
        builder.Property(t => t.PostalCode)
            .HasMaxLength(20);
            
        builder.Property(t => t.Country)
            .HasMaxLength(100);
            
        builder.Property(t => t.SubscriptionPlan)
            .HasMaxLength(50);
            
        builder.Property(t => t.TimeZone)
            .HasMaxLength(3);
            
        builder.Property(t => t.Currency)
            .HasMaxLength(3);
            
        builder.Property(t => t.LogoUrl)
            .HasMaxLength(500);

        // Indexes
        builder.HasIndex(t => t.SubDomain)
            .IsUnique()
            .HasFilter("\"SubDomain\" IS NOT NULL AND \"IsDeleted\" = false");
            
        builder.HasIndex(t => t.ContactEmail)
            .IsUnique()
            .HasFilter("\"IsDeleted\" = false");
            
        builder.HasIndex(t => t.IsActive);

        // Relationships
        builder.HasMany(t => t.Users)
            .WithOne(u => u.Tenant)
            .HasForeignKey(u => u.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasMany(t => t.Organizations)
            .WithOne(o => o.Tenant)
            .HasForeignKey(o => o.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasMany(t => t.Projects)
            .WithOne(p => p.Tenant)
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasMany(t => t.Roles)
            .WithOne(r => r.Tenant)
            .HasForeignKey(r => r.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasMany(t => t.Claims)
            .WithOne(c => c.Tenant)
            .HasForeignKey(c => c.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
