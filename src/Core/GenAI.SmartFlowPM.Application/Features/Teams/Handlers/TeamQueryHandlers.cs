using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Teams.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Team;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Teams.Handlers;

public class GetTeamByIdQueryHandler : IRequestHandler<GetTeamByIdQuery, Result<TeamDto>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public GetTeamByIdQueryHandler(ITeamRepository teamRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    public async Task<Result<TeamDto>> Handle(GetTeamByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var team = await _teamRepository.GetTeamWithMembersAsync(request.Id, cancellationToken);
            
            if (team == null)
            {
                return Result<TeamDto>.Failure($"Team with ID {request.Id} not found.");
            }

            var teamDto = _mapper.Map<TeamDto>(team);
            return Result<TeamDto>.Success(teamDto);
        }
        catch (Exception ex)
        {
            return Result<TeamDto>.Failure($"Failed to retrieve team: {ex.Message}");
        }
    }
}

public class GetAllTeamsQueryHandler : IRequestHandler<GetAllTeamsQuery, Result<PaginatedResult<TeamDto>>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public GetAllTeamsQueryHandler(ITeamRepository teamRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<TeamDto>>> Handle(GetAllTeamsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var (teams, totalCount) = await _teamRepository.GetPagedTeamsWithIncludesAsync(
                request.PagedQuery.PageNumber,
                request.PagedQuery.PageSize,
                cancellationToken: cancellationToken);

            var teamDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);
            
            var paginatedResult = new PaginatedResult<TeamDto>
            {
                Items = teamDtos,
                TotalCount = totalCount,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize
            };

            return Result<PaginatedResult<TeamDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TeamDto>>.Failure($"Failed to retrieve teams: {ex.Message}");
        }
    }
}

public class GetTeamsByLeaderIdQueryHandler : IRequestHandler<GetTeamsByLeaderIdQuery, Result<IEnumerable<TeamDto>>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public GetTeamsByLeaderIdQueryHandler(ITeamRepository teamRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TeamDto>>> Handle(GetTeamsByLeaderIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var teams = await _teamRepository.GetTeamsByLeaderIdAsync(request.LeaderId, cancellationToken);
            var teamDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);
            
            return Result<IEnumerable<TeamDto>>.Success(teamDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TeamDto>>.Failure($"Failed to retrieve teams by leader: {ex.Message}");
        }
    }
}

public class GetTeamMembersQueryHandler : IRequestHandler<GetTeamMembersQuery, Result<IEnumerable<TeamMemberDto>>>
{
    private readonly ITeamMemberRepository _teamMemberRepository;
    private readonly IMapper _mapper;

    public GetTeamMembersQueryHandler(ITeamMemberRepository teamMemberRepository, IMapper mapper)
    {
        _teamMemberRepository = teamMemberRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TeamMemberDto>>> Handle(GetTeamMembersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var teamMembers = await _teamMemberRepository.GetByTeamIdAsync(request.TeamId, cancellationToken);
            var teamMemberDtos = _mapper.Map<IEnumerable<TeamMemberDto>>(teamMembers);
            
            return Result<IEnumerable<TeamMemberDto>>.Success(teamMemberDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TeamMemberDto>>.Failure($"Failed to retrieve team members: {ex.Message}");
        }
    }
}

public class GetUserTeamsQueryHandler : IRequestHandler<GetUserTeamsQuery, Result<IEnumerable<TeamDto>>>
{
    private readonly ITeamMemberRepository _teamMemberRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public GetUserTeamsQueryHandler(
        ITeamMemberRepository teamMemberRepository,
        ITeamRepository teamRepository,
        IMapper mapper)
    {
        _teamMemberRepository = teamMemberRepository;
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TeamDto>>> Handle(GetUserTeamsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var teamMembers = await _teamMemberRepository.GetByUserIdAsync(request.UserId, cancellationToken);
            var teamIds = teamMembers.Select(tm => tm.TeamId).ToList();
            
            var teams = new List<Domain.Entities.Team>();
            foreach (var teamId in teamIds)
            {
                var team = await _teamRepository.GetByIdAsync(teamId, cancellationToken);
                if (team != null)
                {
                    teams.Add(team);
                }
            }
            
            var teamDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);
            return Result<IEnumerable<TeamDto>>.Success(teamDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TeamDto>>.Failure($"Failed to retrieve user teams: {ex.Message}");
        }
    }
}

public class SearchTeamsQueryHandler : IRequestHandler<SearchTeamsQuery, Result<IEnumerable<TeamDto>>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public SearchTeamsQueryHandler(ITeamRepository teamRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TeamDto>>> Handle(SearchTeamsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var teams = await _teamRepository.SearchTeamsAsync(request.SearchTerm, cancellationToken);
            var teamDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);
            
            return Result<IEnumerable<TeamDto>>.Success(teamDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TeamDto>>.Failure($"Failed to search teams: {ex.Message}");
        }
    }
}

public class GetActiveTeamsQueryHandler : IRequestHandler<GetActiveTeamsQuery, Result<IEnumerable<TeamDto>>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public GetActiveTeamsQueryHandler(ITeamRepository teamRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TeamDto>>> Handle(GetActiveTeamsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var teams = await _teamRepository.GetActiveTeamsAsync(cancellationToken);
            var teamDtos = _mapper.Map<IEnumerable<TeamDto>>(teams);
            
            return Result<IEnumerable<TeamDto>>.Success(teamDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TeamDto>>.Failure($"Failed to retrieve active teams: {ex.Message}");
        }
    }
}
