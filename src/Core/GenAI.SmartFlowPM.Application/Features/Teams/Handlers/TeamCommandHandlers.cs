using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Teams.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Team;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Application.Features.Teams.Handlers;

public class CreateTeamCommandHandler : IRequestHandler<CreateTeamCommand, Result<TeamDto>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateTeamCommandHandler(
        ITeamRepository teamRepository, 
        IUnitOfWork unitOfWork, 
        IMapper mapper)
    {
        _teamRepository = teamRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TeamDto>> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if team name already exists
            var existingTeam = await _teamRepository.GetByNameAsync(request.CreateTeamDto.Name, cancellationToken);
            if (existingTeam != null)
            {
                return Result<TeamDto>.Failure($"Team with name '{request.CreateTeamDto.Name}' already exists.");
            }

            var team = _mapper.Map<Team>(request.CreateTeamDto);
            team.Id = Guid.NewGuid();
            team.CreatedAt = DateTime.UtcNow;

            await _teamRepository.AddAsync(team, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var teamDto = _mapper.Map<TeamDto>(team);
            return Result<TeamDto>.Success(teamDto);
        }
        catch (Exception ex)
        {
            return Result<TeamDto>.Failure($"Failed to create team: {ex.Message}");
        }
    }
}

public class UpdateTeamCommandHandler : IRequestHandler<UpdateTeamCommand, Result<TeamDto>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateTeamCommandHandler(
        ITeamRepository teamRepository, 
        IUnitOfWork unitOfWork, 
        IMapper mapper)
    {
        _teamRepository = teamRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TeamDto>> Handle(UpdateTeamCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var existingTeam = await _teamRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (existingTeam == null)
            {
                return Result<TeamDto>.Failure($"Team with ID {request.Id} not found.");
            }

            // Check if new name conflicts with existing teams (excluding current team)
            if (existingTeam.Name != request.UpdateTeamDto.Name)
            {
                var nameExists = await _teamRepository.IsNameExistsAsync(request.UpdateTeamDto.Name, request.Id, cancellationToken);
                if (nameExists)
                {
                    return Result<TeamDto>.Failure($"Team with name '{request.UpdateTeamDto.Name}' already exists.");
                }
            }

            _mapper.Map(request.UpdateTeamDto, existingTeam);
            existingTeam.UpdatedAt = DateTime.UtcNow;

            await _teamRepository.UpdateAsync(existingTeam, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var teamDto = _mapper.Map<TeamDto>(existingTeam);
            return Result<TeamDto>.Success(teamDto);
        }
        catch (Exception ex)
        {
            return Result<TeamDto>.Failure($"Failed to update team: {ex.Message}");
        }
    }
}

public class DeleteTeamCommandHandler : IRequestHandler<DeleteTeamCommand, Result<bool>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly ITeamMemberRepository _teamMemberRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTeamCommandHandler(
        ITeamRepository teamRepository,
        ITeamMemberRepository teamMemberRepository,
        IUnitOfWork unitOfWork)
    {
        _teamRepository = teamRepository;
        _teamMemberRepository = teamMemberRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteTeamCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var team = await _teamRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (team == null)
            {
                return Result<bool>.Failure($"Team with ID {request.Id} not found.");
            }

            // Remove all team members first
            var teamMembers = await _teamMemberRepository.GetByTeamIdAsync(request.Id, cancellationToken);
            foreach (var member in teamMembers)
            {
                await _teamMemberRepository.DeleteAsync(member, cancellationToken);
            }

            await _teamRepository.DeleteAsync(team, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to delete team: {ex.Message}");
        }
    }
}

public class AddTeamMemberCommandHandler : IRequestHandler<AddTeamMemberCommand, Result<TeamMemberDto>>
{
    private readonly ITeamMemberRepository _teamMemberRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddTeamMemberCommandHandler(
        ITeamMemberRepository teamMemberRepository,
        ITeamRepository teamRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _teamMemberRepository = teamMemberRepository;
        _teamRepository = teamRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TeamMemberDto>> Handle(AddTeamMemberCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify team exists
            var team = await _teamRepository.GetByIdAsync(request.AddTeamMemberDto.TeamId, cancellationToken);
            if (team == null)
            {
                return Result<TeamMemberDto>.Failure($"Team with ID {request.AddTeamMemberDto.TeamId} not found.");
            }

            // Verify user exists
            var user = await _userRepository.GetByIdAsync(request.AddTeamMemberDto.UserId, cancellationToken);
            if (user == null)
            {
                return Result<TeamMemberDto>.Failure($"User with ID {request.AddTeamMemberDto.UserId} not found.");
            }

            // Check if user is already a member
            var existingMember = await _teamMemberRepository.ExistsAsync(
                request.AddTeamMemberDto.TeamId, 
                request.AddTeamMemberDto.UserId, 
                cancellationToken);
            
            if (existingMember)
            {
                return Result<TeamMemberDto>.Failure("User is already a member of this team.");
            }

            var teamMember = _mapper.Map<TeamMember>(request.AddTeamMemberDto);
            teamMember.Id = Guid.NewGuid();
            teamMember.CreatedAt = DateTime.UtcNow;
            teamMember.JoinedDate = DateTime.UtcNow;

            await _teamMemberRepository.AddAsync(teamMember, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var teamMemberDto = _mapper.Map<TeamMemberDto>(teamMember);
            return Result<TeamMemberDto>.Success(teamMemberDto);
        }
        catch (Exception ex)
        {
            return Result<TeamMemberDto>.Failure($"Failed to add team member: {ex.Message}");
        }
    }
}

public class UpdateTeamMemberCommandHandler : IRequestHandler<UpdateTeamMemberCommand, Result<TeamMemberDto>>
{
    private readonly ITeamMemberRepository _teamMemberRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateTeamMemberCommandHandler(
        ITeamMemberRepository teamMemberRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _teamMemberRepository = teamMemberRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TeamMemberDto>> Handle(UpdateTeamMemberCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var teamMember = await _teamMemberRepository.GetByTeamAndUserAsync(
                request.TeamId, 
                request.UserId, 
                cancellationToken);
            
            if (teamMember == null)
            {
                return Result<TeamMemberDto>.Failure("Team member not found.");
            }

            _mapper.Map(request.UpdateTeamMemberDto, teamMember);
            teamMember.UpdatedAt = DateTime.UtcNow;

            await _teamMemberRepository.UpdateAsync(teamMember, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var teamMemberDto = _mapper.Map<TeamMemberDto>(teamMember);
            return Result<TeamMemberDto>.Success(teamMemberDto);
        }
        catch (Exception ex)
        {
            return Result<TeamMemberDto>.Failure($"Failed to update team member: {ex.Message}");
        }
    }
}

public class RemoveTeamMemberCommandHandler : IRequestHandler<RemoveTeamMemberCommand, Result<bool>>
{
    private readonly ITeamMemberRepository _teamMemberRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveTeamMemberCommandHandler(
        ITeamMemberRepository teamMemberRepository,
        IUnitOfWork unitOfWork)
    {
        _teamMemberRepository = teamMemberRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(RemoveTeamMemberCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var teamMember = await _teamMemberRepository.GetByTeamAndUserAsync(
                request.TeamId, 
                request.UserId, 
                cancellationToken);
            
            if (teamMember == null)
            {
                return Result<bool>.Failure("Team member not found.");
            }

            await _teamMemberRepository.DeleteAsync(teamMember, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to remove team member: {ex.Message}");
        }
    }
}
