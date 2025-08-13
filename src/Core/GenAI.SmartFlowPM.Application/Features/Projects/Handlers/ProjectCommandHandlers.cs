using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Projects.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Project;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Entities;

namespace GenAI.SmartFlowPM.Application.Features.Projects.Handlers;

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, Result<ProjectDto>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateProjectCommandHandler(
        IProjectRepository projectRepository, 
        IUnitOfWork unitOfWork, 
        IMapper mapper)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var project = _mapper.Map<Project>(request.CreateProjectDto);
            project.Id = Guid.NewGuid();
            project.CreatedAt = DateTime.UtcNow;

            await _projectRepository.AddAsync(project, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var projectDto = _mapper.Map<ProjectDto>(project);
            return Result<ProjectDto>.Success(projectDto);
        }
        catch (Exception ex)
        {
            return Result<ProjectDto>.Failure($"Failed to create project: {ex.Message}");
        }
    }
}

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, Result<ProjectDto>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateProjectCommandHandler(
        IProjectRepository projectRepository, 
        IUnitOfWork unitOfWork, 
        IMapper mapper)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ProjectDto>> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var existingProject = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (existingProject == null)
            {
                return Result<ProjectDto>.Failure($"Project with ID {request.Id} not found.");
            }

            _mapper.Map(request.UpdateProjectDto, existingProject);
            existingProject.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.UpdateAsync(existingProject, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var projectDto = _mapper.Map<ProjectDto>(existingProject);
            return Result<ProjectDto>.Success(projectDto);
        }
        catch (Exception ex)
        {
            return Result<ProjectDto>.Failure($"Failed to update project: {ex.Message}");
        }
    }
}

public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand, Result<bool>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProjectCommandHandler(
        IProjectRepository projectRepository, 
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (project == null)
            {
                return Result<bool>.Failure($"Project with ID {request.Id} not found.");
            }

            await _projectRepository.DeleteAsync(project, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to delete project: {ex.Message}");
        }
    }
}
