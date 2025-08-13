using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Certificates.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Certificate;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Certificates.Handlers;

public class GetCertificatesQueryHandler : IRequestHandler<GetCertificatesQuery, Result<List<CertificateDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCertificatesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CertificateDto>>> Handle(GetCertificatesQuery request, CancellationToken cancellationToken)
    {
        var certificates = await _unitOfWork.Certificates.GetAllAsync(cancellationToken);

        // Apply filters if specified
        if (request.Status.HasValue)
        {
            certificates = certificates.Where(c => c.Status == (int)request.Status.Value);
        }

        if (request.Type.HasValue)
        {
            certificates = certificates.Where(c => c.Type == (int)request.Type.Value);
        }

        if (request.CampaignId.HasValue)
        {
            certificates = certificates.Where(c => c.CampaignId == request.CampaignId.Value);
        }

        if (request.ManagerId.HasValue)
        {
            certificates = certificates.Where(c => c.RecipientId == request.ManagerId.Value);
        }

        if (request.IssuedFrom.HasValue)
        {
            certificates = certificates.Where(c => c.IssuedDate >= request.IssuedFrom.Value);
        }

        if (request.IssuedTo.HasValue)
        {
            certificates = certificates.Where(c => c.IssuedDate <= request.IssuedTo.Value);
        }

        if (!request.IncludeRevoked)
        {
            certificates = certificates.Where(c => c.Status != (int)Domain.Enums.CertificateStatus.Revoked);
        }

        var certificateDtos = _mapper.Map<List<CertificateDto>>(certificates.ToList());
        return Result<List<CertificateDto>>.Success(certificateDtos);
    }
}

public class GetCertificateByIdQueryHandler : IRequestHandler<GetCertificateByIdQuery, Result<CertificateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCertificateByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CertificateDto>> Handle(GetCertificateByIdQuery request, CancellationToken cancellationToken)
    {
        var certificate = await _unitOfWork.Certificates.GetByIdAsync(request.Id, cancellationToken);
        if (certificate == null)
        {
            return Result<CertificateDto>.Failure("Certificate not found");
        }

        var certificateDto = _mapper.Map<CertificateDto>(certificate);
        return Result<CertificateDto>.Success(certificateDto);
    }
}

public class GetMyCertificatesQueryHandler : IRequestHandler<GetMyCertificatesQuery, Result<List<CertificateDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetMyCertificatesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CertificateDto>>> Handle(GetMyCertificatesQuery request, CancellationToken cancellationToken)
    {
        // For now, using a placeholder user ID - should come from current user context
        var currentUserId = Guid.NewGuid();

        var allCertificates = await _unitOfWork.Certificates.GetAllAsync(cancellationToken);

        // Filter certificates for current user
        var userCertificates = allCertificates.Where(c =>
            c.RecipientId == currentUserId && !c.IsDeleted);

        if (request.Status.HasValue)
        {
            userCertificates = userCertificates.Where(c => c.Status == (int)request.Status.Value);
        }

        var certificateDtos = _mapper.Map<List<CertificateDto>>(userCertificates.ToList());
        return Result<List<CertificateDto>>.Success(certificateDtos);
    }
}

public class VerifyCertificateQueryHandler : IRequestHandler<VerifyCertificateQuery, Result<CertificateVerificationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public VerifyCertificateQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CertificateVerificationDto>> Handle(VerifyCertificateQuery request, CancellationToken cancellationToken)
    {
        var certificate = await _unitOfWork.Certificates.GetByVerificationTokenAsync(request.VerificationToken, cancellationToken);
        if (certificate == null)
        {
            return Result<CertificateVerificationDto>.Failure("Invalid verification token");
        }

        // Update verification count and last verified time
        certificate.VerificationCount++;
        certificate.VerifiedAt = DateTime.UtcNow;

        await _unitOfWork.Certificates.UpdateAsync(certificate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var verificationDto = _mapper.Map<CertificateVerificationDto>(certificate);
        return Result<CertificateVerificationDto>.Success(verificationDto);
    }
}

public class GetCertificateTemplatesQueryHandler : IRequestHandler<GetCertificateTemplatesQuery, Result<List<CertificateTemplateDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCertificateTemplatesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CertificateTemplateDto>>> Handle(GetCertificateTemplatesQuery request, CancellationToken cancellationToken)
    {
        var templates = await _unitOfWork.CertificateTemplates.GetAllAsync(cancellationToken);

        if (request.Type.HasValue)
        {
            templates = templates.Where(t => t.Type == (int)request.Type.Value);
        }

        if (request.ActiveOnly)
        {
            templates = templates.Where(t => t.IsActive);
        }

        var templateDtos = _mapper.Map<List<CertificateTemplateDto>>(templates.ToList());
        return Result<List<CertificateTemplateDto>>.Success(templateDtos);
    }
}

public class GetCertificateTemplateByIdQueryHandler : IRequestHandler<GetCertificateTemplateByIdQuery, Result<CertificateTemplateDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCertificateTemplateByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CertificateTemplateDto>> Handle(GetCertificateTemplateByIdQuery request, CancellationToken cancellationToken)
    {
        var template = await _unitOfWork.CertificateTemplates.GetByIdAsync(request.Id, cancellationToken);
        if (template == null)
        {
            return Result<CertificateTemplateDto>.Failure("Certificate template not found");
        }

        var templateDto = _mapper.Map<CertificateTemplateDto>(template);
        return Result<CertificateTemplateDto>.Success(templateDto);
    }
}