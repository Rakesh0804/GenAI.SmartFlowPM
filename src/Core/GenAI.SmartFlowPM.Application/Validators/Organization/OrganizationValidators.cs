using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Organization;
using GenAI.SmartFlowPM.Application.Features.Organizations.Commands;
using GenAI.SmartFlowPM.Application.Common.Constants;

namespace GenAI.SmartFlowPM.Application.Validators.Organization;

public class CreateOrganizationDtoValidator : AbstractValidator<CreateOrganizationDto>
{
    public CreateOrganizationDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Organization name is required")
            .MaximumLength(200).WithMessage("Organization name must not exceed 200 characters")
            .Matches(ValidationPatterns.ORGANIZATION_NAME).WithMessage(ValidationMessages.ORGANIZATION_NAME_INVALID);

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Website)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(255).WithMessage("Website must not exceed 255 characters")
            .Matches(@"^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$")
            .WithMessage("Website must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.Website));

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .Matches(ValidationPatterns.EMAIL).WithMessage(ValidationMessages.EMAIL_INVALID)
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.Phone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Phone must not exceed 50 characters")
            .Matches(ValidationPatterns.PHONE_NUMBER).WithMessage(ValidationMessages.PHONE_NUMBER_INVALID)
            .When(x => !string.IsNullOrEmpty(x.Phone));

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

        RuleFor(x => x.Country)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.PostalCode)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.Logo)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Logo));

        RuleFor(x => x.EstablishedDate)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Established date cannot be in the future")
            .When(x => x.EstablishedDate.HasValue);

        RuleFor(x => x.EmployeeCount)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(0).WithMessage("Employee count must be greater than or equal to 0")
            .LessThanOrEqualTo(1000000).WithMessage("Employee count cannot exceed 1,000,000");
    }
}

public class UpdateOrganizationDtoValidator : AbstractValidator<UpdateOrganizationDto>
{
    public UpdateOrganizationDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Organization name is required")
            .MaximumLength(200).WithMessage("Organization name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Website)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(255).WithMessage("Website must not exceed 255 characters")
            .Matches(@"^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$")
            .WithMessage("Website must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.Website));

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .EmailAddress().WithMessage("Email format is invalid")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.Phone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Phone must not exceed 50 characters")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone format is invalid")
            .When(x => !string.IsNullOrEmpty(x.Phone));

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

        RuleFor(x => x.Country)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.PostalCode)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.Logo)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Logo));

        RuleFor(x => x.EstablishedDate)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Established date cannot be in the future")
            .When(x => x.EstablishedDate.HasValue);

        RuleFor(x => x.EmployeeCount)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(0).WithMessage("Employee count must be greater than or equal to 0")
            .LessThanOrEqualTo(1000000).WithMessage("Employee count cannot exceed 1,000,000");
    }
}

public class CreateBranchDtoValidator : AbstractValidator<CreateBranchDto>
{
    public CreateBranchDtoValidator()
    {
        RuleFor(x => x.OrganizationId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Organization ID is required");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Branch name is required")
            .MaximumLength(200).WithMessage("Branch name must not exceed 200 characters");

        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Branch code must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Code));

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Phone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Phone must not exceed 50 characters")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone format is invalid")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .EmailAddress().WithMessage("Email format is invalid")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Email));

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

        RuleFor(x => x.Country)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.PostalCode)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.ManagerId)
            .NotEqual(Guid.Empty).WithMessage("Manager ID must be a valid GUID")
            .When(x => x.ManagerId.HasValue);
    }
}

public class UpdateBranchDtoValidator : AbstractValidator<UpdateBranchDto>
{
    public UpdateBranchDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Branch name is required")
            .MaximumLength(200).WithMessage("Branch name must not exceed 200 characters");

        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Branch code must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Code));

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Phone)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Phone must not exceed 50 characters")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone format is invalid")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .EmailAddress().WithMessage("Email format is invalid")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Email));

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

        RuleFor(x => x.Country)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.PostalCode)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.ManagerId)
            .NotEqual(Guid.Empty).WithMessage("Manager ID must be a valid GUID")
            .When(x => x.ManagerId.HasValue);
    }
}

// Command Validators
public class CreateOrganizationCommandValidator : AbstractValidator<CreateOrganizationCommand>
{
    public CreateOrganizationCommandValidator()
    {
        RuleFor(x => x.CreateOrganizationDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Organization data is required")
            .SetValidator(new CreateOrganizationDtoValidator());
    }
}

public class UpdateOrganizationCommandValidator : AbstractValidator<UpdateOrganizationCommand>
{
    public UpdateOrganizationCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Organization ID is required");

        RuleFor(x => x.UpdateOrganizationDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Organization data is required")
            .SetValidator(new UpdateOrganizationDtoValidator());
    }
}

public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
{
    public CreateBranchCommandValidator()
    {
        RuleFor(x => x.CreateBranchDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Branch data is required")
            .SetValidator(new CreateBranchDtoValidator());
    }
}

public class UpdateBranchCommandValidator : AbstractValidator<UpdateBranchCommand>
{
    public UpdateBranchCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Branch ID is required");

        RuleFor(x => x.UpdateBranchDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Branch data is required")
            .SetValidator(new UpdateBranchDtoValidator());
    }
}

public class DeleteBranchCommandValidator : AbstractValidator<DeleteBranchCommand>
{
    public DeleteBranchCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Branch ID is required");
    }
}
