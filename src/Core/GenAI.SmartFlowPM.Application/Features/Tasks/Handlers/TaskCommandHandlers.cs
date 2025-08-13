using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Tasks.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Task;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Application.Features.Tasks.Handlers;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Result<TaskDto>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICounterService _counterService;

    public CreateTaskCommandHandler(
        IProjectTaskRepository taskRepository, 
        IUnitOfWork unitOfWork, 
        IMapper mapper,
        ICounterService counterService)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _counterService = counterService;
    }

    public async Task<Result<TaskDto>> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var task = _mapper.Map<ProjectTask>(request.CreateTaskDto);
            task.Id = Guid.NewGuid();
            task.CreatedAt = DateTime.UtcNow;
            
            // Generate unique task number using the acronym
            task.TaskNumber = await _counterService.GenerateTaskNumberAsync(task.Acronym);

            await _taskRepository.AddAsync(task, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var taskDto = _mapper.Map<TaskDto>(task);
            return Result<TaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            return Result<TaskDto>.Failure($"Failed to create task: {ex.Message}");
        }
    }
}

public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand, Result<TaskDto>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateTaskCommandHandler(
        IProjectTaskRepository taskRepository, 
        IUnitOfWork unitOfWork, 
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TaskDto>> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var existingTask = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (existingTask == null)
            {
                return Result<TaskDto>.Failure($"Task with ID {request.Id} not found.");
            }

            _mapper.Map(request.UpdateTaskDto, existingTask);
            existingTask.UpdatedAt = DateTime.UtcNow;

            await _taskRepository.UpdateAsync(existingTask, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var taskDto = _mapper.Map<TaskDto>(existingTask);
            return Result<TaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            return Result<TaskDto>.Failure($"Failed to update task: {ex.Message}");
        }
    }
}

public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, Result<bool>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTaskCommandHandler(
        IProjectTaskRepository taskRepository, 
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (task == null)
            {
                return Result<bool>.Failure($"Task with ID {request.Id} not found.");
            }

            await _taskRepository.DeleteAsync(task, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to delete task: {ex.Message}");
        }
    }
}

public class AssignTaskCommandHandler : IRequestHandler<AssignTaskCommand, Result<TaskDto>>
{
    private readonly IProjectTaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AssignTaskCommandHandler(
        IProjectTaskRepository taskRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork, 
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<TaskDto>> Handle(AssignTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(request.TaskId, cancellationToken);
            if (task == null)
            {
                return Result<TaskDto>.Failure($"Task with ID {request.TaskId} not found.");
            }

            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                return Result<TaskDto>.Failure($"User with ID {request.UserId} not found.");
            }

            task.AssignedToUserId = request.UserId;
            task.UpdatedAt = DateTime.UtcNow;

            await _taskRepository.UpdateAsync(task, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var taskDto = _mapper.Map<TaskDto>(task);
            return Result<TaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            return Result<TaskDto>.Failure($"Failed to assign task: {ex.Message}");
        }
    }
}
