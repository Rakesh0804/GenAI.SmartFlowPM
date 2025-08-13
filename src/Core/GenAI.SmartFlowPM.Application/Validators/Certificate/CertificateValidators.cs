using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.Certificate;
using GenAI.SmartFlowPM.Application.Features.Certificates.Commands;
using GenAI.SmartFlowPM.Application.Features.Certificates.Queries;

namespace GenAI.SmartFlowPM.Application.Validators.Certificate;

// DTO Validators
public class CertificateDtoValidator : AbstractValidator<CertificateDto>
{
    public CertificateDtoValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.RecipientId)
            .NotEmpty().WithMessage("Recipient ID is required");

        RuleFor(x => x.RecipientName)
            .NotEmpty().WithMessage("Recipient name is required")
            .MaximumLength(200).WithMessage("Recipient name must not exceed 200 characters");

        RuleFor(x => x.RecipientEmail)
            .NotEmpty().WithMessage("Recipient email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid certificate status");

        RuleFor(x => x.CertificateTitle)
            .NotEmpty().WithMessage("Certificate title is required")
            .MaximumLength(200).WithMessage("Certificate title must not exceed 200 characters");

        RuleFor(x => x.IssuedDate)
            .NotEmpty().WithMessage("Issued date is required")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Issued date cannot be in the future");

        RuleFor(x => x.ExpiryDate)
            .GreaterThan(x => x.IssuedDate).WithMessage("Expiry date must be after issued date")
            .When(x => x.ExpiryDate.HasValue);

        RuleFor(x => x.VerificationToken)
            .NotEmpty().WithMessage("Verification token is required")
            .MaximumLength(100).WithMessage("Verification token must not exceed 100 characters");

        RuleFor(x => x.CustomMessage)
            .MaximumLength(2000).WithMessage("Custom message must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.CustomMessage));

        RuleFor(x => x.OrganizationName)
            .MaximumLength(200).WithMessage("Organization name must not exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.OrganizationName));
    }
}

public class CertificateTemplateDtoValidator : AbstractValidator<CertificateTemplateDto>
{
    public CertificateTemplateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Template name is required")
            .MaximumLength(200).WithMessage("Template name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.TemplateContent)
            .NotEmpty().WithMessage("Template content is required");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type");
    }
}

// Command Validators
public class GenerateCertificateCommandValidator : AbstractValidator<GenerateCertificateCommand>
{
    public GenerateCertificateCommandValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.ManagerId)
            .NotEmpty().WithMessage("Manager ID is required");

        RuleFor(x => x.CustomMessage)
            .MaximumLength(2000).WithMessage("Custom message must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.CustomMessage));
    }
}

public class RegenerateCertificateCommandValidator : AbstractValidator<RegenerateCertificateCommand>
{
    public RegenerateCertificateCommandValidator()
    {
        RuleFor(x => x.CertificateId)
            .NotEmpty().WithMessage("Certificate ID is required");

        RuleFor(x => x.CustomMessage)
            .MaximumLength(2000).WithMessage("Custom message must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.CustomMessage));
    }
}

public class UpdateCertificateCommandValidator : AbstractValidator<UpdateCertificateCommand>
{
    public UpdateCertificateCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Certificate ID is required");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid certificate status");

        RuleFor(x => x.CustomMessage)
            .MaximumLength(2000).WithMessage("Custom message must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.CustomMessage));

        RuleFor(x => x.AdminNotes)
            .MaximumLength(1000).WithMessage("Admin notes must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.AdminNotes));
    }
}

public class RevokeCertificateCommandValidator : AbstractValidator<RevokeCertificateCommand>
{
    public RevokeCertificateCommandValidator()
    {
        RuleFor(x => x.CertificateId)
            .NotEmpty().WithMessage("Certificate ID is required");

        RuleFor(x => x.RevocationReason)
            .NotEmpty().WithMessage("Revocation reason is required")
            .MaximumLength(500).WithMessage("Revocation reason must not exceed 500 characters");
    }
}

public class DeleteCertificateCommandValidator : AbstractValidator<DeleteCertificateCommand>
{
    public DeleteCertificateCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Certificate ID is required");
    }
}

public class SendCertificateCommandValidator : AbstractValidator<SendCertificateCommand>
{
    public SendCertificateCommandValidator()
    {
        RuleFor(x => x.CertificateId)
            .NotEmpty().WithMessage("Certificate ID is required");

        RuleFor(x => x.EmailAddress)
            .NotEmpty().WithMessage("Email address is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email address must not exceed 255 characters");

        RuleFor(x => x.EmailMessage)
            .MaximumLength(1000).WithMessage("Email message must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.EmailMessage));
    }
}

public class BatchGenerateCertificatesCommandValidator : AbstractValidator<BatchGenerateCertificatesCommand>
{
    public BatchGenerateCertificatesCommandValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.ManagerIds)
            .NotEmpty().WithMessage("At least one manager must be specified")
            .Must(x => x.Count > 0).WithMessage("At least one manager must be specified");

        RuleFor(x => x.CustomMessage)
            .MaximumLength(2000).WithMessage("Custom message must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.CustomMessage));
    }
}

public class CreateCertificateTemplateCommandValidator : AbstractValidator<CreateCertificateTemplateCommand>
{
    public CreateCertificateTemplateCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Template name is required")
            .MaximumLength(200).WithMessage("Template name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.TemplateContent)
            .NotEmpty().WithMessage("Template content is required");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type");
    }
}

public class UpdateCertificateTemplateCommandValidator : AbstractValidator<UpdateCertificateTemplateCommand>
{
    public UpdateCertificateTemplateCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Template ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Template name is required")
            .MaximumLength(200).WithMessage("Template name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.TemplateContent)
            .NotEmpty().WithMessage("Template content is required");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type");
    }
}

// Query Validators
public class GetCertificatesQueryValidator : AbstractValidator<GetCertificatesQuery>
{
    public GetCertificatesQueryValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid certificate status")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type")
            .When(x => x.Type.HasValue);

        RuleFor(x => x.IssuedTo)
            .GreaterThan(x => x.IssuedFrom).WithMessage("End date must be after start date")
            .When(x => x.IssuedFrom.HasValue && x.IssuedTo.HasValue);
    }
}

public class GetCertificateByIdQueryValidator : AbstractValidator<GetCertificateByIdQuery>
{
    public GetCertificateByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Certificate ID is required");
    }
}

public class GetCertificateByTokenQueryValidator : AbstractValidator<GetCertificateByTokenQuery>
{
    public GetCertificateByTokenQueryValidator()
    {
        RuleFor(x => x.VerificationToken)
            .NotEmpty().WithMessage("Verification token is required")
            .MaximumLength(100).WithMessage("Verification token must not exceed 100 characters");
    }
}

public class GetMyCertificatesQueryValidator : AbstractValidator<GetMyCertificatesQuery>
{
    public GetMyCertificatesQueryValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid certificate status")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type")
            .When(x => x.Type.HasValue);
    }
}

public class GetCampaignCertificatesQueryValidator : AbstractValidator<GetCampaignCertificatesQuery>
{
    public GetCampaignCertificatesQueryValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid certificate status")
            .When(x => x.Status.HasValue);
    }
}

public class GetCertificateStatisticsQueryValidator : AbstractValidator<GetCertificateStatisticsQuery>
{
    public GetCertificateStatisticsQueryValidator()
    {
        RuleFor(x => x.ToDate)
            .GreaterThan(x => x.FromDate).WithMessage("End date must be after start date")
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue);
    }
}

public class VerifyCertificateQueryValidator : AbstractValidator<VerifyCertificateQuery>
{
    public VerifyCertificateQueryValidator()
    {
        RuleFor(x => x.VerificationToken)
            .NotEmpty().WithMessage("Verification token is required")
            .MaximumLength(100).WithMessage("Verification token must not exceed 100 characters");
    }
}

public class GetCertificateTemplatesQueryValidator : AbstractValidator<GetCertificateTemplatesQuery>
{
    public GetCertificateTemplatesQueryValidator()
    {
        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type")
            .When(x => x.Type.HasValue);
    }
}

public class GetCertificateTemplateByIdQueryValidator : AbstractValidator<GetCertificateTemplateByIdQuery>
{
    public GetCertificateTemplateByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Template ID is required");
    }
}

public class GetDefaultCertificateTemplateQueryValidator : AbstractValidator<GetDefaultCertificateTemplateQuery>
{
    public GetDefaultCertificateTemplateQueryValidator()
    {
        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid certificate type");
    }
}

public class PreviewCertificateQueryValidator : AbstractValidator<PreviewCertificateQuery>
{
    public PreviewCertificateQueryValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");

        RuleFor(x => x.ManagerId)
            .NotEmpty().WithMessage("Manager ID is required");

        RuleFor(x => x.CustomMessage)
            .MaximumLength(2000).WithMessage("Custom message must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.CustomMessage));
    }
}

public class GetEligibleManagersForCertificateQueryValidator : AbstractValidator<GetEligibleManagersForCertificateQuery>
{
    public GetEligibleManagersForCertificateQueryValidator()
    {
        RuleFor(x => x.CampaignId)
            .NotEmpty().WithMessage("Campaign ID is required");
    }
}

public class ExportCertificateQueryValidator : AbstractValidator<ExportCertificateQuery>
{
    public ExportCertificateQueryValidator()
    {
        RuleFor(x => x.CertificateId)
            .NotEmpty().WithMessage("Certificate ID is required");

        RuleFor(x => x.Format)
            .NotEmpty().WithMessage("Export format is required")
            .Must(x => new[] { "PDF", "PNG", "JPEG" }.Contains(x.ToUpper()))
            .WithMessage("Format must be PDF, PNG, or JPEG");
    }
}
