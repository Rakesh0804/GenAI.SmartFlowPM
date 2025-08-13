using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Tasks.Queries;
using GenAI.SmartFlowPM.Application.DTOs.Task;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;

namespace GenAI.SmartFlowPM.Application.Features.Tasks.Handlers;

public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, Result<TaskDto>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public GetTaskByIdQueryHandler(IProjectTaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<Result<TaskDto>> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (task == null)
            {
                return Result<TaskDto>.Failure($"Task with ID {request.Id} not found.");
            }

            var taskDto = _mapper.Map<TaskDto>(task);
            return Result<TaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            return Result<TaskDto>.Failure($"Error retrieving task: {ex.Message}");
        }
    }
}

public class GetAllTasksQueryHandler : IRequestHandler<GetAllTasksQuery, Result<PaginatedResult<TaskDto>>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public GetAllTasksQueryHandler(IProjectTaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedResult<TaskDto>>> Handle(GetAllTasksQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var allTasks = await _taskRepository.GetAllAsync(cancellationToken);
            var tasks = allTasks.ToList();

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(request.PagedQuery.SearchTerm))
            {
                var searchTerm = request.PagedQuery.SearchTerm.ToLower();
                tasks = tasks.Where(t => 
                    t.Title.ToLower().Contains(searchTerm) ||
                    (!string.IsNullOrEmpty(t.Description) && t.Description.ToLower().Contains(searchTerm)) ||
                    (t.Project?.Name != null && t.Project.Name.ToLower().Contains(searchTerm)) ||
                    (t.AssignedToUser?.FirstName != null && 
                     $"{t.AssignedToUser.FirstName} {t.AssignedToUser.LastName}".ToLower().Contains(searchTerm))).ToList();
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(request.PagedQuery.SortBy))
            {
                switch (request.PagedQuery.SortBy.ToLower())
                {
                    case "title":
                        tasks = request.PagedQuery.SortDescending 
                            ? tasks.OrderByDescending(t => t.Title).ToList()
                            : tasks.OrderBy(t => t.Title).ToList();
                        break;
                    case "duedate":
                        tasks = request.PagedQuery.SortDescending 
                            ? tasks.OrderByDescending(t => t.DueDate).ToList()
                            : tasks.OrderBy(t => t.DueDate).ToList();
                        break;
                    case "status":
                        tasks = request.PagedQuery.SortDescending 
                            ? tasks.OrderByDescending(t => t.Status).ToList()
                            : tasks.OrderBy(t => t.Status).ToList();
                        break;
                    case "priority":
                        tasks = request.PagedQuery.SortDescending 
                            ? tasks.OrderByDescending(t => t.Priority).ToList()
                            : tasks.OrderBy(t => t.Priority).ToList();
                        break;
                    case "project":
                        tasks = request.PagedQuery.SortDescending 
                            ? tasks.OrderByDescending(t => t.Project?.Name ?? "").ToList()
                            : tasks.OrderBy(t => t.Project?.Name ?? "").ToList();
                        break;
                    default:
                        tasks = tasks.OrderBy(t => t.Title).ToList();
                        break;
                }
            }
            else
            {
                tasks = tasks.OrderBy(t => t.Title).ToList();
            }

            // Apply pagination
            var totalCount = tasks.Count;
            var pagedTasks = tasks
                .Skip((request.PagedQuery.PageNumber - 1) * request.PagedQuery.PageSize)
                .Take(request.PagedQuery.PageSize)
                .ToList();

            var taskDtos = _mapper.Map<List<TaskDto>>(pagedTasks);

            var paginatedResult = new PaginatedResult<TaskDto>
            {
                Items = taskDtos,
                CurrentPage = request.PagedQuery.PageNumber,
                PageSize = request.PagedQuery.PageSize,
                TotalCount = totalCount
            };

            return Result<PaginatedResult<TaskDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<TaskDto>>.Failure($"Error retrieving tasks: {ex.Message}");
        }
    }
}

public class GetTasksByProjectIdQueryHandler : IRequestHandler<GetTasksByProjectIdQuery, Result<IEnumerable<TaskDto>>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public GetTasksByProjectIdQueryHandler(IProjectTaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TaskDto>>> Handle(GetTasksByProjectIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tasks = await _taskRepository.GetByProjectIdAsync(request.ProjectId, cancellationToken);
            var taskDtos = _mapper.Map<IEnumerable<TaskDto>>(tasks);
            
            return Result<IEnumerable<TaskDto>>.Success(taskDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TaskDto>>.Failure($"Error retrieving tasks for project: {ex.Message}");
        }
    }
}

public class GetTasksByUserIdQueryHandler : IRequestHandler<GetTasksByUserIdQuery, Result<IEnumerable<TaskDto>>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public GetTasksByUserIdQueryHandler(IProjectTaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TaskDto>>> Handle(GetTasksByUserIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tasks = await _taskRepository.GetByAssignedUserIdAsync(request.UserId, cancellationToken);
            var taskDtos = _mapper.Map<IEnumerable<TaskDto>>(tasks);
            
            return Result<IEnumerable<TaskDto>>.Success(taskDtos);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<TaskDto>>.Failure($"Error retrieving tasks for user: {ex.Message}");
        }
    }
}

public class GetUserTaskDashboardQueryHandler : IRequestHandler<GetUserTaskDashboardQuery, Result<UserTaskDashboardDto>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public GetUserTaskDashboardQueryHandler(
        IProjectTaskRepository taskRepository, 
        IUserRepository userRepository,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<Result<UserTaskDashboardDto>> Handle(GetUserTaskDashboardQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Get user information
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                return Result<UserTaskDashboardDto>.Failure($"User with ID {request.UserId} not found.");
            }

            // Get all tasks assigned to the user
            var userTasks = await _taskRepository.GetByAssignedUserIdAsync(request.UserId, cancellationToken);
            
            // Calculate statistics
            var totalTaskCount = userTasks.Count();
            var completedTaskCount = userTasks.Count(t => t.Status == Domain.Enums.TaskStatus.Done);
            var pendingTaskCount = totalTaskCount - completedTaskCount;
            
            // Get pending tasks (not completed)
            var pendingTasks = userTasks
                .Where(t => t.Status != Domain.Enums.TaskStatus.Done)
                .OrderBy(t => t.DueDate)
                .ThenByDescending(t => t.Priority);
            
            var pendingTaskDtos = _mapper.Map<IEnumerable<TaskDto>>(pendingTasks);

            var dashboardDto = new UserTaskDashboardDto
            {
                UserId = request.UserId,
                UserName = $"{user.FirstName} {user.LastName}",
                TotalTaskCount = totalTaskCount,
                CompletedTaskCount = completedTaskCount,
                PendingTaskCount = pendingTaskCount,
                PendingTasks = pendingTaskDtos
            };

            return Result<UserTaskDashboardDto>.Success(dashboardDto);
        }
        catch (Exception ex)
        {
            return Result<UserTaskDashboardDto>.Failure($"Error retrieving user task dashboard: {ex.Message}");
        }
    }
}
