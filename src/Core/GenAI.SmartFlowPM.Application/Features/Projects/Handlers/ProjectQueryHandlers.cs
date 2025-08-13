using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Projects.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Project;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Projects.Handlers;

public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, Result<ProjectDto>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;

    public GetProjectByIdQueryHandler(IProjectRepository projectRepository, IMapper mapper)
    {
        _projectRepository = projectRepository;
        _mapper = mapper;
    }

    public async Task<Result<ProjectDto>> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

            if (project == null)
            {
                return Result<ProjectDto>.Failure($"Project with ID {request.Id} not found.");
            }

            var projectDto = _mapper.Map<ProjectDto>(project);
            return Result<ProjectDto>.Success(projectDto);
        }
        catch (Exception ex)
        {
            return Result<ProjectDto>.Failure($"Error retrieving project: {ex.Message}");
        }
    }
}

public class GetAllProjectsQueryHandler : IRequestHandler<GetAllProjectsQuery, Result<PaginatedResult<ProjectDto>>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;

    public GetAllProjectsQueryHandler(IProjectRepository projectRepository, IMapper mapper)
    {
        _projectRepository = projectRepository;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<ProjectDto>>> Handle(GetAllProjectsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var allProjects = await _projectRepository.GetAllAsync(cancellationToken);
            var projects = allProjects.ToList();

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(request.PagedQuery.SearchTerm))
            {
                var searchTerm = request.PagedQuery.SearchTerm.ToLower();
                projects = projects.Where(p =>
                    p.Name.ToLower().Contains(searchTerm) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm)) ||
                    (p.ClientName != null && p.ClientName.ToLower().Contains(searchTerm))).ToList();
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(request.PagedQuery.SortBy))
            {
                switch (request.PagedQuery.SortBy.ToLower())
                {
                    case "name":
                        projects = request.PagedQuery.SortDescending
                            ? projects.OrderByDescending(p => p.Name).ToList()
                            : projects.OrderBy(p => p.Name).ToList();
                        break;
                    case "startdate":
                        projects = request.PagedQuery.SortDescending
                            ? projects.OrderByDescending(p => p.StartDate).ToList()
                            : projects.OrderBy(p => p.StartDate).ToList();
                        break;
                    case "enddate":
                        projects = request.PagedQuery.SortDescending
                            ? projects.OrderByDescending(p => p.EndDate).ToList()
                            : projects.OrderBy(p => p.EndDate).ToList();
                        break;
                    case "status":
                        projects = request.PagedQuery.SortDescending
                            ? projects.OrderByDescending(p => p.Status).ToList()
                            : projects.OrderBy(p => p.Status).ToList();
                        break;
                    case "priority":
                        projects = request.PagedQuery.SortDescending
                            ? projects.OrderByDescending(p => p.Priority).ToList()
                            : projects.OrderBy(p => p.Priority).ToList();
                        break;
                    default:
                        projects = projects.OrderBy(p => p.Name).ToList();
                        break;
                }
            }
            else
            {
                projects = projects.OrderBy(p => p.Name).ToList();
            }

            // Apply pagination
            var totalCount = projects.Count;
            var pagedProjects = projects
                .Skip((request.PagedQuery.PageNumber - 1) * request.PagedQuery.PageSize)
                .Take(request.PagedQuery.PageSize)
                .ToList();

            var projectDtos = _mapper.Map<List<ProjectDto>>(pagedProjects);

            var paginatedResult = new PaginatedResult<ProjectDto>
            {
                Items = projectDtos,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize,
                TotalCount = totalCount
            };

            return Result<PaginatedResult<ProjectDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<ProjectDto>>.Failure($"Error retrieving projects: {ex.Message}");
        }
    }
}

public class GetProjectsByUserIdQueryHandler : IRequestHandler<GetProjectsByUserIdQuery, Result<IEnumerable<ProjectDto>>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;

    public GetProjectsByUserIdQueryHandler(IProjectRepository projectRepository, IMapper mapper)
    {
        _projectRepository = projectRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<ProjectDto>>> Handle(GetProjectsByUserIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var projects = await _projectRepository.GetProjectsByUserIdAsync(request.UserId, cancellationToken);
            var projectDtos = _mapper.Map<IEnumerable<ProjectDto>>(projects);

            return Result<IEnumerable<ProjectDto>>.Success(projectDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<ProjectDto>>.Failure($"Error retrieving projects for user: {ex.Message}");
        }
    }
}
