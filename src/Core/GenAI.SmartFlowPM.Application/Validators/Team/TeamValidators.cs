using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Team;
using GenAI.SmartFlowPM.Application.Features.Teams.Commands;
using GenAI.SmartFlowPM.Application.Features.Teams.Queries;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.Validators.Common;
using GenAI.SmartFlowPM.Application.Common.Constants;

namespace GenAI.SmartFlowPM.Application.Validators.Team;

public class CreateTeamDtoValidator : AbstractValidator<CreateTeamDto>
{
    public CreateTeamDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Team name is required")
            .MaximumLength(200).WithMessage("Team name must not exceed 200 characters")
            .Matches(ValidationPatterns.TEAM_NAME).WithMessage(ValidationMessages.TEAM_NAME_INVALID);

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.LeaderId)
            .NotEqual(Guid.Empty).WithMessage("Leader ID must be a valid GUID")
            .When(x => x.LeaderId.HasValue);

        RuleFor(x => x.Location)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Location must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.MaxMembers)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Maximum members must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Maximum members cannot exceed 1000");
    }
}

public class UpdateTeamDtoValidator : AbstractValidator<UpdateTeamDto>
{
    public UpdateTeamDtoValidator()
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Team name is required")
            .MaximumLength(200).WithMessage("Team name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.LeaderId)
            .NotEqual(Guid.Empty).WithMessage("Leader ID must be a valid GUID")
            .When(x => x.LeaderId.HasValue);

        RuleFor(x => x.Location)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(50).WithMessage("Location must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.MaxMembers)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Maximum members must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Maximum members cannot exceed 1000");
    }
}

public class AddTeamMemberDtoValidator : AbstractValidator<AddTeamMemberDto>
{
    public AddTeamMemberDtoValidator()
    {
        RuleFor(x => x.TeamId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class UpdateTeamMemberDtoValidator : AbstractValidator<UpdateTeamMemberDto>
{
    public UpdateTeamMemberDtoValidator()
    {
        // No specific validation needed for team member role update as it's an enum
        // Enum validation is handled by model binding
    }
}

// Command Validators
public class CreateTeamCommandValidator : AbstractValidator<CreateTeamCommand>
{
    public CreateTeamCommandValidator()
    {
        RuleFor(x => x.CreateTeamDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Team data is required")
            .SetValidator(new CreateTeamDtoValidator());
    }
}

public class UpdateTeamCommandValidator : AbstractValidator<UpdateTeamCommand>
{
    public UpdateTeamCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");

        RuleFor(x => x.UpdateTeamDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Team data is required")
            .SetValidator(new UpdateTeamDtoValidator());
    }
}

public class DeleteTeamCommandValidator : AbstractValidator<DeleteTeamCommand>
{
    public DeleteTeamCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");
    }
}

public class AddTeamMemberCommandValidator : AbstractValidator<AddTeamMemberCommand>
{
    public AddTeamMemberCommandValidator()
    {
        RuleFor(x => x.AddTeamMemberDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Team member data is required")
            .SetValidator(new AddTeamMemberDtoValidator());
    }
}

public class UpdateTeamMemberCommandValidator : AbstractValidator<UpdateTeamMemberCommand>
{
    public UpdateTeamMemberCommandValidator()
    {
        RuleFor(x => x.TeamId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.UpdateTeamMemberDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Team member data is required")
            .SetValidator(new UpdateTeamMemberDtoValidator());
    }
}

public class RemoveTeamMemberCommandValidator : AbstractValidator<RemoveTeamMemberCommand>
{
    public RemoveTeamMemberCommandValidator()
    {
        RuleFor(x => x.TeamId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");

        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

// Query Validators
public class GetTeamByIdQueryValidator : AbstractValidator<GetTeamByIdQuery>
{
    public GetTeamByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");
    }
}

public class GetAllTeamsQueryValidator : AbstractValidator<GetAllTeamsQuery>
{
    public GetAllTeamsQueryValidator()
    {
        RuleFor(x => x.PagedQuery)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Paged query is required")
            .SetValidator(new PagedQueryValidator());
    }
}

public class GetTeamsByLeaderIdQueryValidator : AbstractValidator<GetTeamsByLeaderIdQuery>
{
    public GetTeamsByLeaderIdQueryValidator()
    {
        RuleFor(x => x.LeaderId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Leader ID is required");
    }
}

public class GetTeamMembersQueryValidator : AbstractValidator<GetTeamMembersQuery>
{
    public GetTeamMembersQueryValidator()
    {
        RuleFor(x => x.TeamId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Team ID is required");
    }
}

public class GetUserTeamsQueryValidator : AbstractValidator<GetUserTeamsQuery>
{
    public GetUserTeamsQueryValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class SearchTeamsQueryValidator : AbstractValidator<SearchTeamsQuery>
{
    public SearchTeamsQueryValidator()
    {
        RuleFor(x => x.SearchTerm)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Search term is required")
            .MaximumLength(100).WithMessage("Search term must not exceed 100 characters");
    }
}
