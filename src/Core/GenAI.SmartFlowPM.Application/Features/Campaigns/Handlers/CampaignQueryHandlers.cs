using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Campaigns.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Campaign;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Entities;

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

public class GetCampaignStatisticsQueryHandler : IRequestHandler<GetCampaignStatisticsQuery, Result<CampaignStatisticsDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignStatisticsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CampaignStatisticsDto>> Handle(GetCampaignStatisticsQuery request, CancellationToken cancellationToken)
    {
        var campaigns = await _unitOfWork.Campaigns.GetAllAsync(cancellationToken);
        var evaluations = await _unitOfWork.CampaignEvaluations.GetAllAsync(cancellationToken);

        // Apply date filters if specified
        if (request.FromDate.HasValue)
        {
            campaigns = campaigns.Where(c => c.CreatedAt >= request.FromDate.Value);
            evaluations = evaluations.Where(e => e.CreatedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            campaigns = campaigns.Where(c => c.CreatedAt <= request.ToDate.Value);
            evaluations = evaluations.Where(e => e.CreatedAt <= request.ToDate.Value);
        }

        var campaignsList = campaigns.Where(c => !c.IsDeleted).ToList();
        var evaluationsList = evaluations.ToList();

        var statistics = new CampaignStatisticsDto
        {
            TotalCampaigns = campaignsList.Count,
            ActiveCampaigns = campaignsList.Count(c => c.Status == 1), // Active
            CompletedCampaigns = campaignsList.Count(c => c.Status == 2), // Completed
            DraftCampaigns = campaignsList.Count(c => c.Status == 0), // Draft
            TotalEvaluations = evaluationsList.Count,
            CompletedEvaluations = evaluationsList.Count(e => e.IsCompleted),
            PendingEvaluations = evaluationsList.Count(e => !e.IsCompleted),
            OverallProgressPercentage = evaluationsList.Count > 0 ? 
                (decimal)evaluationsList.Count(e => e.IsCompleted) / evaluationsList.Count * 100 : 0,
            AverageCompletionTime = CalculateAverageCompletionTime(campaignsList),
            MostActiveCampaignType = GetMostActiveCampaignType(campaignsList),
            RecentActivity = await GetRecentActivity(campaignsList, evaluationsList)
        };

        return Result<CampaignStatisticsDto>.Success(statistics);
    }

    private double CalculateAverageCompletionTime(List<Campaign> campaigns)
    {
        var completedCampaigns = campaigns.Where(c => c.Status == 2 && c.ActualEndDate.HasValue).ToList();
        if (!completedCampaigns.Any()) return 0;

        var totalDays = completedCampaigns.Sum(c => 
            (c.ActualEndDate!.Value - (c.ActualStartDate ?? c.StartDate)).TotalDays);
        return totalDays / completedCampaigns.Count;
    }

    private CampaignType GetMostActiveCampaignType(List<Campaign> campaigns)
    {
        if (!campaigns.Any()) return CampaignType.RoleEvaluation;

        var typeGroups = campaigns.GroupBy(c => c.Type);
        var mostActive = typeGroups.OrderByDescending(g => g.Count()).First();
        return (CampaignType)mostActive.Key;
    }

    private Task<List<CampaignActivityDto>> GetRecentActivity(List<Campaign> campaigns, List<CampaignEvaluation> evaluations)
    {
        var activities = new List<CampaignActivityDto>();

        // Recent campaign activities
        foreach (var campaign in campaigns.OrderByDescending(c => c.CreatedAt).Take(5))
        {
            activities.Add(new CampaignActivityDto
            {
                Id = Guid.NewGuid(),
                CampaignId = campaign.Id,
                CampaignTitle = campaign.Title,
                ActivityType = "Created",
                UserId = Guid.TryParse(campaign.CreatedBy, out var createdByGuid) ? createdByGuid : Guid.Empty,
                UserName = "System", // Would need to fetch from user service
                Description = $"Campaign '{campaign.Title}' was created",
                ActivityDate = campaign.CreatedAt
            });
        }

        // Recent evaluation activities
        foreach (var evaluation in evaluations.Where(e => e.IsCompleted).OrderByDescending(e => e.SubmittedAt).Take(5))
        {
            activities.Add(new CampaignActivityDto
            {
                Id = Guid.NewGuid(),
                CampaignId = evaluation.CampaignId,
                CampaignTitle = "Campaign", // Would need to fetch campaign title
                ActivityType = "EvaluationSubmitted",
                UserId = evaluation.EvaluatorId,
                UserName = "Evaluator", // Would need to fetch from user service
                Description = "Evaluation submitted",
                ActivityDate = evaluation.SubmittedAt ?? evaluation.UpdatedAt ?? DateTime.UtcNow
            });
        }

        return Task.FromResult(activities.OrderByDescending(a => a.ActivityDate).Take(10).ToList());
    }
}

public class GetCampaignEvaluationsQueryHandler : IRequestHandler<GetCampaignEvaluationsQuery, Result<List<CampaignEvaluationDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignEvaluationsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CampaignEvaluationDto>>> Handle(GetCampaignEvaluationsQuery request, CancellationToken cancellationToken)
    {
        var evaluations = await _unitOfWork.CampaignEvaluations.GetByCampaignIdAsync(request.CampaignId, cancellationToken);

        // Apply filters if specified
        if (request.EvaluatedUserId.HasValue)
        {
            evaluations = evaluations.Where(e => e.EvaluatedUserId == request.EvaluatedUserId.Value).ToList();
        }

        if (request.IsCompleted.HasValue)
        {
            evaluations = evaluations.Where(e => e.IsCompleted == request.IsCompleted.Value).ToList();
        }

        var evaluationDtos = _mapper.Map<List<CampaignEvaluationDto>>(evaluations);
        return Result<List<CampaignEvaluationDto>>.Success(evaluationDtos);
    }
}

public class GetCampaignEvaluationByIdQueryHandler : IRequestHandler<GetCampaignEvaluationByIdQuery, Result<CampaignEvaluationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignEvaluationByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CampaignEvaluationDto>> Handle(GetCampaignEvaluationByIdQuery request, CancellationToken cancellationToken)
    {
        var evaluation = await _unitOfWork.CampaignEvaluations.GetByIdAsync(request.Id, cancellationToken);
        if (evaluation == null)
        {
            return Result<CampaignEvaluationDto>.Failure("Campaign evaluation not found");
        }

        var evaluationDto = _mapper.Map<CampaignEvaluationDto>(evaluation);
        return Result<CampaignEvaluationDto>.Success(evaluationDto);
    }
}

public class GetCampaignEligibleUsersQueryHandler : IRequestHandler<GetCampaignEligibleUsersQuery, Result<List<CampaignTargetUserDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignEligibleUsersQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<CampaignTargetUserDto>>> Handle(GetCampaignEligibleUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);

        // Filter users who have reportees (managers)
        var eligibleUsers = users.Where(u => u.IsActive && !u.IsDeleted);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            eligibleUsers = eligibleUsers.Where(u =>
                u.FirstName.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                u.LastName.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                u.Email.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase));
        }

        var userDtos = _mapper.Map<List<CampaignTargetUserDto>>(eligibleUsers.ToList());
        return Result<List<CampaignTargetUserDto>>.Success(userDtos);
    }
}

public class GetCampaignProgressQueryHandler : IRequestHandler<GetCampaignProgressQuery, Result<CampaignProgressDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCampaignProgressQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CampaignProgressDto>> Handle(GetCampaignProgressQuery request, CancellationToken cancellationToken)
    {
        var campaign = await _unitOfWork.Campaigns.GetByIdAsync(request.CampaignId, cancellationToken);
        if (campaign == null)
        {
            return Result<CampaignProgressDto>.Failure("Campaign not found");
        }

        var evaluations = await _unitOfWork.CampaignEvaluations.GetByCampaignIdAsync(request.CampaignId, cancellationToken);
        var allGroups = await _unitOfWork.CampaignGroups.GetAllAsync(cancellationToken);
        var groups = allGroups.Where(g => g.CampaignId == request.CampaignId).ToList();

        var totalTargets = campaign.GetTargetUserIds().Count;
        var completedEvaluations = evaluations.Count(e => e.IsCompleted);
        var pendingEvaluations = totalTargets - completedEvaluations;

        var progressDto = new CampaignProgressDto
        {
            CampaignId = campaign.Id,
            CampaignTitle = campaign.Title,
            TotalTargets = totalTargets,
            CompletedEvaluations = completedEvaluations,
            PendingEvaluations = pendingEvaluations,
            ProgressPercentage = totalTargets > 0 ? (decimal)completedEvaluations / totalTargets * 100 : 0,
            DaysRemaining = (int)(campaign.EndDate - DateTime.UtcNow).TotalDays,
            GroupProgress = CalculateGroupProgress(groups, evaluations.ToList()),
            ManagerProgress = CalculateManagerProgress(groups, evaluations.ToList())
        };

        return Result<CampaignProgressDto>.Success(progressDto);
    }

    private List<CampaignGroupProgressDto> CalculateGroupProgress(List<CampaignGroup> groups, List<CampaignEvaluation> evaluations)
    {
        return groups.Select(group =>
        {
            var groupTargets = group.GetTargetUserIds().Count;
            var groupCompleted = evaluations.Count(e => e.GroupId == group.Id && e.IsCompleted);
            
            return new CampaignGroupProgressDto
            {
                GroupId = group.Id,
                GroupName = group.Name,
                ManagerId = group.ManagerId,
                ManagerName = "Manager", // Would need to fetch from user service
                TotalTargets = groupTargets,
                CompletedEvaluations = groupCompleted,
                PendingEvaluations = groupTargets - groupCompleted,
                ProgressPercentage = groupTargets > 0 ? (decimal)groupCompleted / groupTargets * 100 : 0
            };
        }).ToList();
    }

    private List<CampaignManagerProgressDto> CalculateManagerProgress(List<CampaignGroup> groups, List<CampaignEvaluation> evaluations)
    {
        return groups.GroupBy(g => g.ManagerId).Select(managerGroup =>
        {
            var managerGroups = managerGroup.ToList();
            var totalTargets = managerGroups.Sum(g => g.GetTargetUserIds().Count);
            var completedEvaluations = evaluations.Count(e => 
                managerGroups.Any(g => g.Id == e.GroupId) && e.IsCompleted);

            return new CampaignManagerProgressDto
            {
                ManagerId = managerGroup.Key,
                ManagerName = "Manager", // Would need to fetch from user service
                TotalAssignedTargets = totalTargets,
                CompletedEvaluations = completedEvaluations,
                PendingEvaluations = totalTargets - completedEvaluations,
                ProgressPercentage = totalTargets > 0 ? (decimal)completedEvaluations / totalTargets * 100 : 0,
                GroupsAssigned = managerGroups.Count
            };
        }).ToList();
    }
}