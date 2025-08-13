using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class CertificateConfiguration : IEntityTypeConfiguration<Certificate>
{
    public void Configure(EntityTypeBuilder<Certificate> builder)
    {
        builder.ToTable("Certificates");

        // Primary Key
        builder.HasKey(x => x.Id);

        // Required Properties with Max Length
        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.RecipientId)
            .IsRequired();

        builder.Property(x => x.RecipientName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.RecipientEmail)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.IssuedBy)
            .IsRequired();

        builder.Property(x => x.IssuerName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.IssuedDate)
            .IsRequired();

        builder.Property(x => x.VerificationToken)
            .IsRequired()
            .HasMaxLength(100);

        // Optional Properties with Max Length
        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.ExpiryDate);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasDefaultValue(1); // Default: Valid

        builder.Property(x => x.Type)
            .IsRequired()
            .HasDefaultValue(1); // Default: CampaignCompletion

        builder.Property(x => x.CampaignId);

        builder.Property(x => x.TemplateId);

        builder.Property(x => x.CertificateUrl)
            .HasMaxLength(500);

        builder.Property(x => x.CustomMessage)
            .HasMaxLength(2000);

        builder.Property(x => x.MetaData)
            .HasMaxLength(4000);

        builder.Property(x => x.RevokedAt);

        builder.Property(x => x.RevokedReason)
            .HasMaxLength(500);

        builder.Property(x => x.RevokedBy);

        builder.Property(x => x.VerifiedAt);

        builder.Property(x => x.VerificationCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes for better query performance
        builder.HasIndex(x => x.RecipientId)
            .HasDatabaseName("IX_Certificates_RecipientId");

        builder.HasIndex(x => x.IssuedBy)
            .HasDatabaseName("IX_Certificates_IssuedBy");

        builder.HasIndex(x => x.VerificationToken)
            .IsUnique()
            .HasDatabaseName("IX_Certificates_VerificationToken");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Certificates_Status");

        builder.HasIndex(x => new { x.TenantId, x.RecipientId })
            .HasDatabaseName("IX_Certificates_TenantId_RecipientId");

        builder.HasIndex(x => new { x.TenantId, x.Status })
            .HasDatabaseName("IX_Certificates_TenantId_Status");

        builder.HasIndex(x => x.CampaignId)
            .HasDatabaseName("IX_Certificates_CampaignId");

        builder.HasIndex(x => x.TemplateId)
            .HasDatabaseName("IX_Certificates_TemplateId");

        // Relationships
        builder.HasOne(x => x.Recipient)
            .WithMany()
            .HasForeignKey(x => x.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Issuer)
            .WithMany()
            .HasForeignKey(x => x.IssuedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Campaign)
            .WithMany(c => c.Certificates)
            .HasForeignKey(x => x.CampaignId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Template)
            .WithMany(t => t.Certificates)
            .HasForeignKey(x => x.TemplateId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.RevokedByUser)
            .WithMany()
            .HasForeignKey(x => x.RevokedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class CertificateTemplateConfiguration : IEntityTypeConfiguration<CertificateTemplate>
{
    public void Configure(EntityTypeBuilder<CertificateTemplate> builder)
    {
        builder.ToTable("CertificateTemplates");

        // Primary Key
        builder.HasKey(x => x.Id);

        // Required Properties with Max Length
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.TemplateContent)
            .IsRequired()
            .HasMaxLength(4000);

        // Optional Properties with Max Length
        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.Variables)
            .HasMaxLength(4000);

        builder.Property(x => x.StyleConfig)
            .HasMaxLength(4000);

        builder.Property(x => x.PreviewImageUrl)
            .HasMaxLength(500);

        builder.Property(x => x.Type)
            .IsRequired()
            .HasDefaultValue(1); // Default: CampaignCompletion

        builder.Property(x => x.IsDefault)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes for better query performance
        builder.HasIndex(x => x.Name)
            .HasDatabaseName("IX_CertificateTemplates_Name");

        builder.HasIndex(x => x.Type)
            .HasDatabaseName("IX_CertificateTemplates_Type");

        builder.HasIndex(x => new { x.TenantId, x.IsDefault })
            .HasDatabaseName("IX_CertificateTemplates_TenantId_IsDefault");

        builder.HasIndex(x => new { x.TenantId, x.IsActive })
            .HasDatabaseName("IX_CertificateTemplates_TenantId_IsActive");
    }
}
