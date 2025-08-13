using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using DomainEnums = GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.Campaigns.Handlers;

public class CreateCampaignCommandHandler : IRequestHandler<CreateCampaignCommand, Result<CampaignDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateCampaignCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CampaignDto>> Handle(CreateCampaignCommand request, CancellationToken cancellationToken)
    {
        // Check if campaign name already exists
        if (await _unitOfWork.Campaigns.IsNameExistsAsync(request.Name, cancellationToken: cancellationToken))
        {
            return Result<CampaignDto>.Failure("Campaign name already exists");
        }

        // Validate assigned managers exist
        foreach (var managerId in request.AssignedManagerIds)
        {
            if (!await _unitOfWork.Users.ExistsAsync(managerId, cancellationToken))
            {
                return Result<CampaignDto>.Failure($"Manager with ID {managerId} not found");
            }
        }

        var campaign = new Campaign
        {
            Title = request.Name,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Type = (int)request.Type,
            Status = (int)request.Status,
            CreatedBy = _currentUserService.UserId ?? "System"
        };

        campaign.SetAssignedManagers(request.AssignedManagerIds);
        campaign.SetTargetUserIds(request.TargetUserGroupIds); // For now, treating group IDs as user IDs

        await _unitOfWork.Campaigns.AddAsync(campaign, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var campaignDto = _mapper.Map<CampaignDto>(campaign);
        return Result<CampaignDto>.Success(campaignDto, "Campaign created successfully");
    }
}

public class UpdateCampaignCommandHandler : IRequestHandler<UpdateCampaignCommand, Result<CampaignDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCampaignCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CampaignDto>> Handle(UpdateCampaignCommand request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.Id, cancellationToken);
        if (campaign == null)
        {
            return Result<CampaignDto>.Failure("Campaign not found");
        }

        // Check if campaign name already exists (excluding current campaign)
        if (await _unitOfWork.Campaigns.IsNameExistsAsync(request.Name, request.Id, cancellationToken))
        {
            return Result<CampaignDto>.Failure("Campaign name already exists");
        }

        // Validate assigned managers exist
        foreach (var managerId in request.AssignedManagerIds)
        {
            if (!await _unitOfWork.Users.ExistsAsync(managerId, cancellationToken))
            {
                return Result<CampaignDto>.Failure($"Manager with ID {managerId} not found");
            }
        }

        campaign.Title = request.Name;
        campaign.Description = request.Description;
        campaign.StartDate = request.StartDate;
        campaign.EndDate = request.EndDate;
        campaign.Type = (int)request.Type;
        campaign.Status = (int)request.Status;
        campaign.UpdatedAt = DateTime.UtcNow;
        campaign.UpdatedBy = _currentUserService.UserId ?? "System";

        campaign.SetAssignedManagers(request.AssignedManagerIds);
        campaign.SetTargetUserIds(request.TargetUserGroupIds);

        await _unitOfWork.Campaigns.UpdateAsync(campaign, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var campaignDto = _mapper.Map<CampaignDto>(campaign);
        return Result<CampaignDto>.Success(campaignDto, "Campaign updated successfully");
    }
}

public class StartCampaignCommandHandler : IRequestHandler<StartCampaignCommand, Result<CampaignDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public StartCampaignCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CampaignDto>> Handle(StartCampaignCommand request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.CampaignId, cancellationToken);
        if (campaign == null)
        {
            return Result<CampaignDto>.Failure("Campaign not found");
        }

        if (campaign.Status != (int)DomainEnums.CampaignStatus.Draft)
        {
            return Result<CampaignDto>.Failure("Only draft campaigns can be started");
        }

        campaign.Status = (int)DomainEnums.CampaignStatus.Active;
        campaign.ActualStartDate = DateTime.UtcNow;
        campaign.UpdatedAt = DateTime.UtcNow;
        campaign.UpdatedBy = _currentUserService.UserId ?? "System";

        await _unitOfWork.Campaigns.UpdateAsync(campaign, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var campaignDto = _mapper.Map<CampaignDto>(campaign);
        return Result<CampaignDto>.Success(campaignDto, "Campaign started successfully");
    }
}

public class CompleteCampaignCommandHandler : IRequestHandler<CompleteCampaignCommand, Result<CampaignDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CompleteCampaignCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CampaignDto>> Handle(CompleteCampaignCommand request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.CampaignId, cancellationToken);
        if (campaign == null)
        {
            return Result<CampaignDto>.Failure("Campaign not found");
        }

        if (campaign.Status != (int)DomainEnums.CampaignStatus.Active)
        {
            return Result<CampaignDto>.Failure("Only active campaigns can be completed");
        }

        campaign.Status = (int)DomainEnums.CampaignStatus.Completed;
        campaign.ActualEndDate = DateTime.UtcNow;
        campaign.UpdatedAt = DateTime.UtcNow;
        campaign.UpdatedBy = _currentUserService.UserId ?? "System";
        // Store completion notes in a metadata field if needed

        await _unitOfWork.Campaigns.UpdateAsync(campaign, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var campaignDto = _mapper.Map<CampaignDto>(campaign);
        return Result<CampaignDto>.Success(campaignDto, "Campaign completed successfully");
    }
}

public class CancelCampaignCommandHandler : IRequestHandler<CancelCampaignCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public CancelCampaignCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(CancelCampaignCommand request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.CampaignId, cancellationToken);
        if (campaign == null)
        {
            return Result<bool>.Failure("Campaign not found");
        }

        if (campaign.Status == (int)DomainEnums.CampaignStatus.Completed || campaign.Status == (int)DomainEnums.CampaignStatus.Cancelled)
        {
            return Result<bool>.Failure("Cannot cancel completed or already cancelled campaigns");
        }

        campaign.Status = (int)DomainEnums.CampaignStatus.Cancelled;
        campaign.UpdatedAt = DateTime.UtcNow;
        // Store cancellation reason in a metadata field if needed

        await _unitOfWork.Campaigns.UpdateAsync(campaign, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true, "Campaign cancelled successfully");
    }
}

public class DeleteCampaignCommandHandler : IRequestHandler<DeleteCampaignCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCampaignCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteCampaignCommand request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.Id, cancellationToken);
        if (campaign == null)
        {
            return Result<bool>.Failure("Campaign not found");
        }

        // Soft delete
        campaign.IsDeleted = true;
        campaign.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Campaigns.UpdateAsync(campaign, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true, "Campaign deleted successfully");
    }
}

public class CreateCampaignGroupCommandHandler : IRequestHandler<CreateCampaignGroupCommand, Result<CampaignGroupDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateCampaignGroupCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CampaignGroupDto>> Handle(CreateCampaignGroupCommand request, CancellationToken cancellationToken)
    {
        // Check if group name already exists
        if (await _unitOfWork.CampaignGroups.IsNameExistsAsync(request.Name, cancellationToken: cancellationToken))
        {
            return Result<CampaignGroupDto>.Failure("Campaign group name already exists");
        }

        // Validate users exist
        foreach (var userId in request.UserIds)
        {
            if (!await _unitOfWork.Users.ExistsAsync(userId, cancellationToken))
            {
                return Result<CampaignGroupDto>.Failure($"User with ID {userId} not found");
            }
        }

        var campaignGroup = new CampaignGroup
        {
            Name = request.Name,
            Description = request.Description,
            ManagerId = Guid.TryParse(_currentUserService.UserId, out var currentUserId) ? currentUserId : Guid.Empty,
            CreatedBy = _currentUserService.UserId ?? "System"
        };

        campaignGroup.SetTargetUserIds(request.UserIds);

        await _unitOfWork.CampaignGroups.AddAsync(campaignGroup, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var campaignGroupDto = _mapper.Map<CampaignGroupDto>(campaignGroup);
        return Result<CampaignGroupDto>.Success(campaignGroupDto, "Campaign group created successfully");
    }
}

public class UpdateCampaignGroupCommandHandler : IRequestHandler<UpdateCampaignGroupCommand, Result<CampaignGroupDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCampaignGroupCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CampaignGroupDto>> Handle(UpdateCampaignGroupCommand request, CancellationToken cancellationToken)
    {
        var campaignGroup = await _unitOfWork.CampaignGroups.GetByIdAsync(request.Id, cancellationToken);
        if (campaignGroup == null)
        {
            return Result<CampaignGroupDto>.Failure("Campaign group not found");
        }

        // Check if group name already exists (excluding current group)
        if (await _unitOfWork.CampaignGroups.IsNameExistsAsync(request.Name, request.Id, cancellationToken))
        {
            return Result<CampaignGroupDto>.Failure("Campaign group name already exists");
        }

        // Validate users exist
        foreach (var userId in request.UserIds)
        {
            if (!await _unitOfWork.Users.ExistsAsync(userId, cancellationToken))
            {
                return Result<CampaignGroupDto>.Failure($"User with ID {userId} not found");
            }
        }

        campaignGroup.Name = request.Name;
        campaignGroup.Description = request.Description;
        campaignGroup.UpdatedAt = DateTime.UtcNow;
        campaignGroup.UpdatedBy = _currentUserService.UserId ?? "System";

        campaignGroup.SetTargetUserIds(request.UserIds);

        await _unitOfWork.CampaignGroups.UpdateAsync(campaignGroup, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var campaignGroupDto = _mapper.Map<CampaignGroupDto>(campaignGroup);
        return Result<CampaignGroupDto>.Success(campaignGroupDto, "Campaign group updated successfully");
    }
}