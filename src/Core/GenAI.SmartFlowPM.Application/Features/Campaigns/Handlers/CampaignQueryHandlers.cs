using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Campaigns.Handlers;

public class GetCampaignsQueryHandler : IRequestHandler<GetCampaignsQuery, Result<List<CampaignDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CampaignDto>>> Handle(GetCampaignsQuery request, CancellationToken cancellationToken)
    {
        var campaigns = await _unitOfWork.Campaigns.GetAllAsync(cancellationToken);

        // Apply filters if specified
        if (request.Status.HasValue)
        {
            campaigns = campaigns.Where(c => c.Status == (int)request.Status.Value);
        }

        if (request.Type.HasValue)
        {
            campaigns = campaigns.Where(c => c.Type == (int)request.Type.Value);
        }

        if (request.StartDateFrom.HasValue)
        {
            campaigns = campaigns.Where(c => c.StartDate >= request.StartDateFrom.Value);
        }

        if (request.StartDateTo.HasValue)
        {
            campaigns = campaigns.Where(c => c.StartDate <= request.StartDateTo.Value);
        }

        if (!request.IncludeDeleted)
        {
            campaigns = campaigns.Where(c => !c.IsDeleted);
        }

        var campaignDtos = _mapper.Map<List<CampaignDto>>(campaigns.ToList());
        return Result<List<CampaignDto>>.Success(campaignDtos);
    }
}

public class GetCampaignByIdQueryHandler : IRequestHandler<GetCampaignByIdQuery, Result<CampaignDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CampaignDto>> Handle(GetCampaignByIdQuery request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.Id, cancellationToken);
        if (campaign == null)
        {
            return Result<CampaignDto>.Failure("Campaign not found");
        }

        var campaignDto = _mapper.Map<CampaignDto>(campaign);
        return Result<CampaignDto>.Success(campaignDto);
    }
}

public class GetMyCampaignsQueryHandler : IRequestHandler<GetMyCampaignsQuery, Result<List<CampaignDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetMyCampaignsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CampaignDto>>> Handle(GetMyCampaignsQuery request, CancellationToken cancellationToken)
    {
        // For now, using a placeholder manager ID - should come from current user context
        var currentManagerId = Guid.NewGuid();

        var campaigns = await _unitOfWork.Campaigns.GetByManagerIdAsync(currentManagerId, cancellationToken);

        if (request.Status.HasValue)
        {
            campaigns = campaigns.Where(c => c.Status == (int)request.Status.Value).ToList();
        }

        var campaignDtos = _mapper.Map<List<CampaignDto>>(campaigns);
        return Result<List<CampaignDto>>.Success(campaignDtos);
    }
}

public class GetMyCampaignTargetsQueryHandler : IRequestHandler<GetMyCampaignTargetsQuery, Result<List<CampaignDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetMyCampaignTargetsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CampaignDto>>> Handle(GetMyCampaignTargetsQuery request, CancellationToken cancellationToken)
    {
        // For now, using a placeholder user ID - should come from current user context
        var currentUserId = Guid.NewGuid();

        var allCampaigns = await _unitOfWork.Campaigns.GetAllAsync(cancellationToken);

        // Filter campaigns where current user is in target list
        var targetCampaigns = allCampaigns.Where(c =>
            c.GetTargetUserIds().Contains(currentUserId) && !c.IsDeleted).ToList();

        var campaignDtos = _mapper.Map<List<CampaignDto>>(targetCampaigns);
        return Result<List<CampaignDto>>.Success(campaignDtos);
    }
}

public class GetCampaignGroupsQueryHandler : IRequestHandler<GetCampaignGroupsQuery, Result<List<CampaignGroupDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignGroupsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CampaignGroupDto>>> Handle(GetCampaignGroupsQuery request, CancellationToken cancellationToken)
    {
        var groups = await _unitOfWork.CampaignGroups.GetAllAsync(cancellationToken);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            groups = groups.Where(g =>
                g.Name.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                (g.Description != null && g.Description.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)));
        }

        var groupDtos = _mapper.Map<List<CampaignGroupDto>>(groups.ToList());
        return Result<List<CampaignGroupDto>>.Success(groupDtos);
    }
}

public class GetCampaignGroupByIdQueryHandler : IRequestHandler<GetCampaignGroupByIdQuery, Result<CampaignGroupDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignGroupByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CampaignGroupDto>> Handle(GetCampaignGroupByIdQuery request, CancellationToken cancellationToken)
    {
        var group = await _unitOfWork.CampaignGroups.GetByIdAsync(request.Id, cancellationToken);
        if (group == null)
        {
            return Result<CampaignGroupDto>.Failure("Campaign group not found");
        }

        var groupDto = _mapper.Map<CampaignGroupDto>(group);
        return Result<CampaignGroupDto>.Success(groupDto);
    }
}