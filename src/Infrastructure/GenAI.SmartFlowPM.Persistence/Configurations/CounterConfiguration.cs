using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Persistence.Configurations;

public class CounterConfiguration : IEntityTypeConfiguration<Counter>
{
    public void Configure(EntityTypeBuilder<Counter> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Name)
               .IsRequired()
               .HasMaxLength(50);
               
        builder.Property(c => c.CurrentValue)
               .IsRequired()
               .HasDefaultValue(0);
               
        builder.Property(c => c.Description)
               .HasMaxLength(200);
               
        builder.HasIndex(c => c.Name)
               .IsUnique();
    }
}
