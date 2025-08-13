using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Certificates.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Certificate;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using DomainEnums = GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.Certificates.Handlers;

public class GenerateCertificateCommandHandler : IRequestHandler<GenerateCertificateCommand, Result<CertificateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GenerateCertificateCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CertificateDto>> Handle(GenerateCertificateCommand request, CancellationToken cancellationToken)
    {
        // Validate campaign exists
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.CampaignId, cancellationToken);
        if (campaign == null)
        {
            return Result<CertificateDto>.Failure("Campaign not found");
        }

        // Validate manager exists
        var manager = await _unitOfWork.Users.GetByIdAsync(request.ManagerId, cancellationToken);
        if (manager == null)
        {
            return Result<CertificateDto>.Failure("Manager not found");
        }

        // Check if certificate already exists for this combination
        var existingCertificate = await _unitOfWork.Certificates.GetByCampaignAndUserAsync(request.CampaignId, request.ManagerId, cancellationToken);
        if (existingCertificate != null)
        {
            return Result<CertificateDto>.Failure("Certificate already exists for this manager and campaign");
        }

        // Get default template
        var defaultTemplate = await _unitOfWork.CertificateTemplates.GetDefaultTemplateAsync(DomainEnums.CertificateType.CampaignCompletion, cancellationToken);

        var certificate = new Certificate
        {
            Title = $"Campaign Completion Certificate - {campaign.Title}",
            Description = $"Certificate of completion for campaign: {campaign.Title}",
            RecipientId = request.ManagerId,
            RecipientName = $"{manager.FirstName} {manager.LastName}",
            RecipientEmail = manager.Email,
            CampaignId = request.CampaignId,
            Type = (int)DomainEnums.CertificateType.CampaignCompletion,
            Status = (int)DomainEnums.CertificateStatus.Generated,
            IssuedBy = Guid.TryParse(_currentUserService.UserId, out var currentUserId) ? currentUserId : Guid.Empty,
            IssuedDate = DateTime.UtcNow,
            VerificationToken = Guid.NewGuid().ToString("N")[..16].ToUpper(), // 16 character token
            TemplateId = defaultTemplate?.Id,
            CreatedBy = _currentUserService.UserId ?? "System"
        };

        // Set custom message if provided
        if (!string.IsNullOrEmpty(request.CustomMessage))
        {
            var metadata = new Dictionary<string, object>
            {
                ["customMessage"] = request.CustomMessage
            };
            certificate.SetMetaData(metadata);
        }

        await _unitOfWork.Certificates.AddAsync(certificate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var certificateDto = _mapper.Map<CertificateDto>(certificate);
        return Result<CertificateDto>.Success(certificateDto, "Certificate generated successfully");
    }
}

public class RegenerateCertificateCommandHandler : IRequestHandler<RegenerateCertificateCommand, Result<CertificateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RegenerateCertificateCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CertificateDto>> Handle(RegenerateCertificateCommand request, CancellationToken cancellationToken)
    {
        var certificate = await _unitOfWork.Certificates.GetByIdAsync(request.CertificateId, cancellationToken);
        if (certificate == null)
        {
            return Result<CertificateDto>.Failure("Certificate not found");
        }

        // Generate new verification token
        certificate.VerificationToken = Guid.NewGuid().ToString("N")[..16].ToUpper();
        certificate.IssuedDate = DateTime.UtcNow;
        certificate.UpdatedAt = DateTime.UtcNow;

        // Update custom message if provided
        if (!string.IsNullOrEmpty(request.CustomMessage))
        {
            var existingMetadata = certificate.GetMetaData();
            existingMetadata["customMessage"] = request.CustomMessage;
            certificate.SetMetaData(existingMetadata);
        }

        await _unitOfWork.Certificates.UpdateAsync(certificate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var certificateDto = _mapper.Map<CertificateDto>(certificate);
        return Result<CertificateDto>.Success(certificateDto, "Certificate regenerated successfully");
    }
}

public class UpdateCertificateCommandHandler : IRequestHandler<UpdateCertificateCommand, Result<CertificateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateCertificateCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CertificateDto>> Handle(UpdateCertificateCommand request, CancellationToken cancellationToken)
    {
        var certificate = await _unitOfWork.Certificates.GetByIdAsync(request.Id, cancellationToken);
        if (certificate == null)
        {
            return Result<CertificateDto>.Failure("Certificate not found");
        }

        certificate.Status = (int)request.Status;
        certificate.UpdatedAt = DateTime.UtcNow;

        // Update custom message and admin notes in metadata
        var metadata = certificate.GetMetaData();
        if (!string.IsNullOrEmpty(request.CustomMessage))
        {
            metadata["customMessage"] = request.CustomMessage;
        }
        if (!string.IsNullOrEmpty(request.AdminNotes))
        {
            metadata["adminNotes"] = request.AdminNotes;
        }
        certificate.SetMetaData(metadata);

        await _unitOfWork.Certificates.UpdateAsync(certificate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var certificateDto = _mapper.Map<CertificateDto>(certificate);
        return Result<CertificateDto>.Success(certificateDto, "Certificate updated successfully");
    }
}

public class RevokeCertificateCommandHandler : IRequestHandler<RevokeCertificateCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public RevokeCertificateCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(RevokeCertificateCommand request, CancellationToken cancellationToken)
    {
        var certificate = await _unitOfWork.Certificates.GetByIdAsync(request.CertificateId, cancellationToken);
        if (certificate == null)
        {
            return Result<bool>.Failure("Certificate not found");
        }

        if (certificate.Status == (int)DomainEnums.CertificateStatus.Revoked)
        {
            return Result<bool>.Failure("Certificate is already revoked");
        }

        certificate.Status = (int)DomainEnums.CertificateStatus.Revoked;
        certificate.RevokedAt = DateTime.UtcNow;
        certificate.UpdatedAt = DateTime.UtcNow;

        // Store revocation reason in metadata - RevokeCertificateCommand doesn't have a Reason property
        // so we'll just set a default revocation message
        var metadata = certificate.GetMetaData();
        metadata["revocationReason"] = "Certificate revoked by administrator";
        certificate.SetMetaData(metadata);

        await _unitOfWork.Certificates.UpdateAsync(certificate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true, "Certificate revoked successfully");
    }
}

public class DeleteCertificateCommandHandler : IRequestHandler<DeleteCertificateCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCertificateCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteCertificateCommand request, CancellationToken cancellationToken)
    {
        var certificate = await _unitOfWork.Certificates.GetByIdAsync(request.Id, cancellationToken);
        if (certificate == null)
        {
            return Result<bool>.Failure("Certificate not found");
        }

        // Soft delete
        certificate.IsDeleted = true;
        certificate.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Certificates.UpdateAsync(certificate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true, "Certificate deleted successfully");
    }
}

public class CreateCertificateTemplateCommandHandler : IRequestHandler<CreateCertificateTemplateCommand, Result<CertificateTemplateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateCertificateTemplateCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CertificateTemplateDto>> Handle(CreateCertificateTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = new CertificateTemplate
        {
            Name = request.Name,
            Description = request.Description,
            TemplateContent = request.TemplateContent,
            Type = (int)request.Type,
            IsDefault = request.IsDefault,
            CreatedBy = Guid.NewGuid().ToString() // Should come from current user context
        };

        // If this is set as default, ensure no other template is default
        if (request.IsDefault)
        {
            var existingDefault = await _unitOfWork.CertificateTemplates.GetDefaultTemplateAsync((DomainEnums.CertificateType)request.Type, cancellationToken);
            if (existingDefault != null)
            {
                existingDefault.IsDefault = false;
                await _unitOfWork.CertificateTemplates.UpdateAsync(existingDefault, cancellationToken);
            }
        }

        await _unitOfWork.CertificateTemplates.AddAsync(template, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var templateDto = _mapper.Map<CertificateTemplateDto>(template);
        return Result<CertificateTemplateDto>.Success(templateDto, "Certificate template created successfully");
    }
}

public class UpdateCertificateTemplateCommandHandler : IRequestHandler<UpdateCertificateTemplateCommand, Result<CertificateTemplateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCertificateTemplateCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CertificateTemplateDto>> Handle(UpdateCertificateTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _unitOfWork.CertificateTemplates.GetByIdAsync(request.Id, cancellationToken);
        if (template == null)
        {
            return Result<CertificateTemplateDto>.Failure("Certificate template not found");
        }

        // If this is set as default, ensure no other template is default
        if (request.IsDefault && !template.IsDefault)
        {
            var existingDefault = await _unitOfWork.CertificateTemplates.GetDefaultTemplateAsync((DomainEnums.CertificateType)request.Type, cancellationToken);
            if (existingDefault != null)
            {
                existingDefault.IsDefault = false;
                await _unitOfWork.CertificateTemplates.UpdateAsync(existingDefault, cancellationToken);
            }
        }

        template.Name = request.Name;
        template.Description = request.Description;
        template.TemplateContent = request.TemplateContent;
        template.Type = (int)request.Type;
        template.IsDefault = request.IsDefault;
        template.UpdatedAt = DateTime.UtcNow;
        template.UpdatedBy = _currentUserService.UserId ?? "System";

        await _unitOfWork.CertificateTemplates.UpdateAsync(template, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var templateDto = _mapper.Map<CertificateTemplateDto>(template);
        return Result<CertificateTemplateDto>.Success(templateDto, "Certificate template updated successfully");
    }
}