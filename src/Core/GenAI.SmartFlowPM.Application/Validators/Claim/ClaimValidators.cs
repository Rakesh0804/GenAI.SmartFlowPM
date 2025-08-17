using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Claim;
using GenAI.SmartFlowPM.Application.Features.Claims.Commands;
using GenAI.SmartFlowPM.Application.Features.Claims.Queries;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.Validators.Common;

namespace GenAI.SmartFlowPM.Application.Validators.Claim;

public class CreateClaimDtoValidator : AbstractValidator<CreateClaimDto>
{
    public CreateClaimDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Claim name is required")
            .MaximumLength(100).WithMessage("Claim name must not exceed 100 characters");

        RuleFor(x => x.Type)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Claim type is required")
            .MaximumLength(100).WithMessage("Claim type must not exceed 100 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

public class UpdateClaimDtoValidator : AbstractValidator<UpdateClaimDto>
{
    public UpdateClaimDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Claim name is required")
            .MaximumLength(100).WithMessage("Claim name must not exceed 100 characters");

        RuleFor(x => x.Type)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Claim type is required")
            .MaximumLength(100).WithMessage("Claim type must not exceed 100 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

// Command Validators
public class CreateClaimCommandValidator : AbstractValidator<CreateClaimCommand>
{
    public CreateClaimCommandValidator()
    {
        RuleFor(x => x.CreateClaimDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Claim data is required")
            .SetValidator(new CreateClaimDtoValidator());
    }
}

public class UpdateClaimCommandValidator : AbstractValidator<UpdateClaimCommand>
{
    public UpdateClaimCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Claim ID is required");

        RuleFor(x => x.UpdateClaimDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Claim data is required")
            .SetValidator(new UpdateClaimDtoValidator());
    }
}

public class DeleteClaimCommandValidator : AbstractValidator<DeleteClaimCommand>
{
    public DeleteClaimCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Claim ID is required");
    }
}

// Query Validators  
public class GetAllClaimsQueryValidator : AbstractValidator<GetAllClaimsQuery>
{
    public GetAllClaimsQueryValidator()
    {
        RuleFor(x => x.PagedQuery)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Paged query is required")
            .SetValidator(new PagedQueryValidator());
    }
}

public class GetClaimByIdQueryValidator : AbstractValidator<GetClaimByIdQuery>
{
    public GetClaimByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Claim ID is required");
    }
}

public class GetClaimByNameQueryValidator : AbstractValidator<GetClaimByNameQuery>
{
    public GetClaimByNameQueryValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Claim name is required")
            .MaximumLength(100).WithMessage("Claim name must not exceed 100 characters");
    }
}
