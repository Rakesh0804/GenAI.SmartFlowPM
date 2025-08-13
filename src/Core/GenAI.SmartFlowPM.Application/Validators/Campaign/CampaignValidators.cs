using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Commands;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Queries;

namespace GenAI.SmartFlowPM.Application.Validators.Campaign;

// DTO Validators
public class CampaignDtoValidator : AbstractValidator<CampaignDto>
{
    public CampaignDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Campaign title is required")
            .MaximumLength(200).WithMessage("Campaign title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required")
            .GreaterThan(DateTime.Today.AddDays(-1)).WithMessage("Start date cannot be in the past");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid campaign type");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid campaign status");

        RuleFor(x => x.AssignedManagers)
            .NotEmpty().WithMessage("At least one manager must be assigned")
            .Must(x => x.Count > 0).WithMessage("At least one manager must be assigned");

        RuleFor(x => x.TargetUserIds)
            .NotEmpty().WithMessage("At least one target user must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one target user must be specified");
    }
}

public class CampaignGroupDtoValidator : AbstractValidator<CampaignGroupDto>
{
    public CampaignGroupDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Group name is required")
            .MaximumLength(200).WithMessage("Group name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.ManagerId)
            .NotEmpty().WithMessage("Manager ID is required");

        RuleFor(x => x.TargetUserIds)
            .NotEmpty().WithMessage("At least one target user must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one target user must be specified");
    }
}

public class CampaignEvaluationDtoValidator : AbstractValidator<CampaignEvaluationDto>
{
    public CampaignEvaluationDtoValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.EvaluatedUserId)
            .NotEmpty().WithMessage("Evaluated user ID is required");

        RuleFor(x => x.EvaluatorId)
            .NotEmpty().WithMessage("Evaluator ID is required");
    }
}

// Command Validators
public class CreateCampaignCommandValidator : AbstractValidator<CreateCampaignCommand>
{
    public CreateCampaignCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Campaign name is required")
            .MaximumLength(200).WithMessage("Campaign name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required")
            .GreaterThan(DateTime.Today.AddDays(-1)).WithMessage("Start date cannot be in the past");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid campaign type");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid campaign status");

        RuleFor(x => x.AssignedManagerIds)
            .NotEmpty().WithMessage("At least one manager must be assigned")
            .Must(x => x.Count > 0).WithMessage("At least one manager must be assigned");

        RuleFor(x => x.TargetUserGroupIds)
            .NotEmpty().WithMessage("At least one target user group must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one target user group must be specified");

        RuleFor(x => x.Instructions)
            .MaximumLength(2000).WithMessage("Instructions must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Instructions));
    }
}

public class UpdateCampaignCommandValidator : AbstractValidator<UpdateCampaignCommand>
{
    public UpdateCampaignCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Campaign name is required")
            .MaximumLength(200).WithMessage("Campaign name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid campaign type");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid campaign status");

        RuleFor(x => x.AssignedManagerIds)
            .NotEmpty().WithMessage("At least one manager must be assigned")
            .Must(x => x.Count > 0).WithMessage("At least one manager must be assigned");

        RuleFor(x => x.TargetUserGroupIds)
            .NotEmpty().WithMessage("At least one target user group must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one target user group must be specified");

        RuleFor(x => x.Instructions)
            .MaximumLength(2000).WithMessage("Instructions must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Instructions));
    }
}

public class StartCampaignCommandValidator : AbstractValidator<StartCampaignCommand>
{
    public StartCampaignCommandValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");
    }
}

public class CompleteCampaignCommandValidator : AbstractValidator<CompleteCampaignCommand>
{
    public CompleteCampaignCommandValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.CompletionNotes)
            .MaximumLength(1000).WithMessage("Completion notes must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.CompletionNotes));
    }
}

public class CancelCampaignCommandValidator : AbstractValidator<CancelCampaignCommand>
{
    public CancelCampaignCommandValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.CancellationReason)
            .MaximumLength(500).WithMessage("Cancellation reason must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.CancellationReason));
    }
}

public class DeleteCampaignCommandValidator : AbstractValidator<DeleteCampaignCommand>
{
    public DeleteCampaignCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Campaign ID is required");
    }
}

public class CreateCampaignGroupCommandValidator : AbstractValidator<CreateCampaignGroupCommand>
{
    public CreateCampaignGroupCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Group name is required")
            .MaximumLength(200).WithMessage("Group name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.UserIds)
            .NotEmpty().WithMessage("At least one user must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one user must be specified");
    }
}

public class UpdateCampaignGroupCommandValidator : AbstractValidator<UpdateCampaignGroupCommand>
{
    public UpdateCampaignGroupCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Group ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Group name is required")
            .MaximumLength(200).WithMessage("Group name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.UserIds)
            .NotEmpty().WithMessage("At least one user must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one user must be specified");
    }
}

// Query Validators
public class GetCampaignsQueryValidator : AbstractValidator<GetCampaignsQuery>
{
    public GetCampaignsQueryValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid campaign status")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid campaign type")
            .When(x => x.Type.HasValue);

        RuleFor(x => x.StartDateTo)
            .GreaterThan(x => x.StartDateFrom).WithMessage("End date must be after start date")
            .When(x => x.StartDateFrom.HasValue && x.StartDateTo.HasValue);
    }
}

public class GetCampaignByIdQueryValidator : AbstractValidator<GetCampaignByIdQuery>
{
    public GetCampaignByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Campaign ID is required");
    }
}

public class GetMyCampaignsQueryValidator : AbstractValidator<GetMyCampaignsQuery>
{
    public GetMyCampaignsQueryValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid campaign status")
            .When(x => x.Status.HasValue);
    }
}

public class GetMyCampaignTargetsQueryValidator : AbstractValidator<GetMyCampaignTargetsQuery>
{
    public GetMyCampaignTargetsQueryValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid campaign status")
            .When(x => x.Status.HasValue);
    }
}

public class GetCampaignStatisticsQueryValidator : AbstractValidator<GetCampaignStatisticsQuery>
{
    public GetCampaignStatisticsQueryValidator()
    {
        RuleFor(x => x.ToDate)
            .GreaterThan(x => x.FromDate).WithMessage("End date must be after start date")
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue);
    }
}

public class GetCampaignGroupByIdQueryValidator : AbstractValidator<GetCampaignGroupByIdQuery>
{
    public GetCampaignGroupByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Group ID is required");
    }
}

public class GetCampaignEvaluationsQueryValidator : AbstractValidator<GetCampaignEvaluationsQuery>
{
    public GetCampaignEvaluationsQueryValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");
    }
}

public class GetCampaignEvaluationByIdQueryValidator : AbstractValidator<GetCampaignEvaluationByIdQuery>
{
    public GetCampaignEvaluationByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Evaluation ID is required");
    }
}

public class GetCampaignProgressQueryValidator : AbstractValidator<GetCampaignProgressQuery>
{
    public GetCampaignProgressQueryValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");
    }
}
