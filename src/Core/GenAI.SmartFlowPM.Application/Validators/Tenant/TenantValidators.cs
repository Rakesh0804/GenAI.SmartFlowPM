using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Tenant;
using GenAI.SmartFlowPM.Application.Features.Tenants.Commands;
using GenAI.SmartFlowPM.Application.Features.Tenants.Queries;
using GenAI.SmartFlowPM.Application.Validators.Common;

namespace GenAI.SmartFlowPM.Application.Validators.Tenant;

public class CreateTenantDtoValidator : AbstractValidator<CreateTenantDto>
{
    public CreateTenantDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Tenant name is required")
            .MaximumLength(200).WithMessage("Tenant name must not exceed 200 characters");

        RuleFor(x => x.SubDomain)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Subdomain must not exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9-]+$").WithMessage("Subdomain can only contain letters, numbers, and hyphens")
            .When(x => !string.IsNullOrEmpty(x.SubDomain));

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ContactEmail)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Contact email is required")
            .EmailAddress().WithMessage("Contact email format is invalid")
            .MaximumLength(255).WithMessage("Contact email must not exceed 255 characters");

        RuleFor(x => x.ContactPhone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(15).WithMessage("Contact phone must not exceed 15 characters")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Contact phone format is invalid")
            .When(x => !string.IsNullOrEmpty(x.ContactPhone));

        RuleFor(x => x.Address)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Address));

        RuleFor(x => x.City)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("City must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.City));

        RuleFor(x => x.State)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("State must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.State));

        RuleFor(x => x.PostalCode)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.Country)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.SubscriptionPlan)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Subscription plan must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.SubscriptionPlan));

        RuleFor(x => x.MaxUsers)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Maximum users must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Maximum users cannot exceed 10,000");

        RuleFor(x => x.MaxProjects)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Maximum projects must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Maximum projects cannot exceed 1,000");

        RuleFor(x => x.TimeZone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(3).WithMessage("Timezone must not exceed 3 characters")
            .When(x => !string.IsNullOrEmpty(x.TimeZone));

        RuleFor(x => x.Currency)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(3).WithMessage("Currency must not exceed 3 characters")
            .When(x => !string.IsNullOrEmpty(x.Currency));

        RuleFor(x => x.LogoUrl)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.LogoUrl));

        RuleFor(x => x.SubscriptionEndDate)
            .GreaterThan(x => x.SubscriptionStartDate)
            .WithMessage("Subscription end date must be after start date")
            .When(x => x.SubscriptionStartDate.HasValue && x.SubscriptionEndDate.HasValue);
    }
}

public class UpdateTenantDtoValidator : AbstractValidator<UpdateTenantDto>
{
    public UpdateTenantDtoValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Tenant ID is required");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Tenant name is required")
            .MaximumLength(200).WithMessage("Tenant name must not exceed 200 characters");

        RuleFor(x => x.SubDomain)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Subdomain must not exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9-]+$").WithMessage("Subdomain can only contain letters, numbers, and hyphens")
            .When(x => !string.IsNullOrEmpty(x.SubDomain));

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ContactEmail)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Contact email is required")
            .EmailAddress().WithMessage("Contact email format is invalid")
            .MaximumLength(255).WithMessage("Contact email must not exceed 255 characters");

        RuleFor(x => x.ContactPhone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(15).WithMessage("Contact phone must not exceed 15 characters")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Contact phone format is invalid")
            .When(x => !string.IsNullOrEmpty(x.ContactPhone));

        RuleFor(x => x.Address)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Address));

        RuleFor(x => x.City)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("City must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.City));

        RuleFor(x => x.State)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("State must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.State));

        RuleFor(x => x.PostalCode)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.Country)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.SubscriptionPlan)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Subscription plan must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.SubscriptionPlan));

        RuleFor(x => x.MaxUsers)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Maximum users must be greater than 0")
            .LessThanOrEqualTo(10000).WithMessage("Maximum users cannot exceed 10,000");

        RuleFor(x => x.MaxProjects)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Maximum projects must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Maximum projects cannot exceed 1,000");

        RuleFor(x => x.TimeZone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(3).WithMessage("Timezone must not exceed 3 characters")
            .When(x => !string.IsNullOrEmpty(x.TimeZone));

        RuleFor(x => x.Currency)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(3).WithMessage("Currency must not exceed 3 characters")
            .When(x => !string.IsNullOrEmpty(x.Currency));

        RuleFor(x => x.LogoUrl)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.LogoUrl));

        RuleFor(x => x.SubscriptionEndDate)
            .GreaterThan(x => x.SubscriptionStartDate)
            .WithMessage("Subscription end date must be after start date")
            .When(x => x.SubscriptionStartDate.HasValue && x.SubscriptionEndDate.HasValue);
    }
}

// Command Validators
public class CreateTenantCommandValidator : AbstractValidator<CreateTenantCommand>
{
    public CreateTenantCommandValidator()
    {
        RuleFor(x => x.Tenant)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Tenant data is required")
            .SetValidator(new CreateTenantDtoValidator());
    }
}

public class UpdateTenantCommandValidator : AbstractValidator<UpdateTenantCommand>
{
    public UpdateTenantCommandValidator()
    {
        RuleFor(x => x.Tenant)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Tenant data is required")
            .SetValidator(new UpdateTenantDtoValidator());
    }
}

public class DeleteTenantCommandValidator : AbstractValidator<DeleteTenantCommand>
{
    public DeleteTenantCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Tenant ID is required");
    }
}

public class ActivateTenantCommandValidator : AbstractValidator<ActivateTenantCommand>
{
    public ActivateTenantCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Tenant ID is required");
    }
}

public class DeactivateTenantCommandValidator : AbstractValidator<DeactivateTenantCommand>
{
    public DeactivateTenantCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Tenant ID is required");
    }
}

// Query Validators
public class GetTenantByIdQueryValidator : AbstractValidator<GetTenantByIdQuery>
{
    public GetTenantByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Tenant ID is required");
    }
}

public class GetTenantBySubDomainQueryValidator : AbstractValidator<GetTenantBySubDomainQuery>
{
    public GetTenantBySubDomainQueryValidator()
    {
        RuleFor(x => x.SubDomain)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Subdomain is required")
            .MaximumLength(100).WithMessage("Subdomain must not exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9-]+$").WithMessage("Subdomain can only contain letters, numbers, and hyphens");
    }
}
