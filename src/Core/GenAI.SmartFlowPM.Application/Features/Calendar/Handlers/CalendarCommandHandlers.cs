using AutoMapper;
using MediatR;
using GenAI.SmartFlowPM.Application.Features.Calendar.Commands;
using GenAI.SmartFlowPM.Application.DTOs.Calendar;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;
using GenAI.SmartFlowPM.Domain.Enums;

namespace GenAI.SmartFlowPM.Application.Features.Calendar.Handlers;

// Calendar Event Command Handlers
public class CreateCalendarEventCommandHandler : IRequestHandler<CreateCalendarEventCommand, Result<CalendarEventDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateCalendarEventCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CalendarEventDto>> Handle(CreateCalendarEventCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId) ||
                string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var currentUserId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<CalendarEventDto>.Failure("User is not authenticated");
            }

            // Validate project access if specified
            if (request.CreateEventDto.ProjectId.HasValue)
            {
                var project = await _unitOfWork.Projects.GetByIdAsync(request.CreateEventDto.ProjectId.Value, cancellationToken);
                if (project == null || project.TenantId != currentTenantId)
                {
                    return Result<CalendarEventDto>.Failure("Project not found or access denied");
                }
            }

            // Validate task access if specified
            if (request.CreateEventDto.TaskId.HasValue)
            {
                var task = await _unitOfWork.ProjectTasks.GetByIdAsync(request.CreateEventDto.TaskId.Value, cancellationToken);
                if (task == null || task.Project.TenantId != currentTenantId)
                {
                    return Result<CalendarEventDto>.Failure("Task not found or access denied");
                }
            }

            // Map DTO to entity
            var calendarEvent = _mapper.Map<CalendarEvent>(request.CreateEventDto);
            calendarEvent.EventCreatedBy = currentUserId;
            calendarEvent.TenantId = currentTenantId;

            // Add event to repository
            var addedEvent = await _unitOfWork.CalendarEvents.AddAsync(calendarEvent, cancellationToken);

            // Handle attendees
            if (request.CreateEventDto.Attendees != null && request.CreateEventDto.Attendees.Any())
            {
                foreach (var attendeeDto in request.CreateEventDto.Attendees)
                {
                    var attendee = _mapper.Map<EventAttendee>(attendeeDto);
                    attendee.EventId = addedEvent.Id;
                    attendee.TenantId = currentTenantId;
                    await _unitOfWork.EventAttendees.AddAsync(attendee, cancellationToken);
                }
            }

            // Handle reminders
            if (request.CreateEventDto.Reminders != null && request.CreateEventDto.Reminders.Any())
            {
                foreach (var reminderDto in request.CreateEventDto.Reminders)
                {
                    var reminder = _mapper.Map<EventReminder>(reminderDto);
                    reminder.EventId = addedEvent.Id;
                    reminder.TenantId = currentTenantId;
                    await _unitOfWork.EventReminders.AddAsync(reminder, cancellationToken);
                }
            }

            // Handle recurrence pattern
            if (request.CreateEventDto.IsRecurring && request.CreateEventDto.RecurrencePattern != null)
            {
                var recurrence = _mapper.Map<RecurrencePattern>(request.CreateEventDto.RecurrencePattern);
                recurrence.EventId = addedEvent.Id;
                recurrence.TenantId = currentTenantId;
                await _unitOfWork.RecurrencePatterns.AddAsync(recurrence, cancellationToken);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Get the complete event with related data
            var eventWithIncludes = await _unitOfWork.CalendarEvents.GetWithAttendeesAsync(addedEvent.Id, currentTenantId, cancellationToken);
            var result = _mapper.Map<CalendarEventDto>(eventWithIncludes);

            return Result<CalendarEventDto>.Success(result);
        }
        catch (Exception)
        {
            return Result<CalendarEventDto>.Failure("Failed to create calendar event");
        }
    }
}

public class UpdateCalendarEventCommandHandler : IRequestHandler<UpdateCalendarEventCommand, Result<CalendarEventDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCalendarEventCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Result<CalendarEventDto>> Handle(UpdateCalendarEventCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId) ||
                string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var currentUserId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<CalendarEventDto>.Failure("User is not authenticated");
            }

            var existingEvent = await _unitOfWork.CalendarEvents.GetByIdAsync(request.Id, cancellationToken);
            if (existingEvent == null || existingEvent.TenantId != currentTenantId)
            {
                return Result<CalendarEventDto>.Failure("Calendar event not found");
            }

            // Check permissions - only creator or attendees can update
            var isCreator = existingEvent.EventCreatedBy == currentUserId;
            var isAttendee = await _unitOfWork.EventAttendees.ExistsAsync(request.Id, currentUserId, currentTenantId, cancellationToken);

            if (!isCreator && !isAttendee)
            {
                return Result<CalendarEventDto>.Failure("Access denied");
            }

            // Validate project access if specified
            if (request.UpdateEventDto.ProjectId.HasValue)
            {
                var project = await _unitOfWork.Projects.GetByIdAsync(request.UpdateEventDto.ProjectId.Value, cancellationToken);
                if (project == null || project.TenantId != currentTenantId)
                {
                    return Result<CalendarEventDto>.Failure("Project not found or access denied");
                }
            }

            // Map updates to existing entity
            _mapper.Map(request.UpdateEventDto, existingEvent);
            var updatedEvent = await _unitOfWork.CalendarEvents.UpdateAsync(existingEvent, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var result = _mapper.Map<CalendarEventDto>(updatedEvent);

            return Result<CalendarEventDto>.Success(result);
        }
        catch (Exception)
        {
            return Result<CalendarEventDto>.Failure("Failed to update calendar event");
        }
    }
}

public class DeleteCalendarEventCommandHandler : IRequestHandler<DeleteCalendarEventCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteCalendarEventCommandHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Result<bool>> Handle(DeleteCalendarEventCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId) ||
                string.IsNullOrEmpty(_currentUserService.TenantId) ||
                !Guid.TryParse(_currentUserService.UserId, out var currentUserId) ||
                !Guid.TryParse(_currentUserService.TenantId, out var currentTenantId))
            {
                return Result<bool>.Failure("User is not authenticated");
            }

            var existingEvent = await _unitOfWork.CalendarEvents.GetByIdAsync(request.Id, cancellationToken);
            if (existingEvent == null || existingEvent.TenantId != currentTenantId)
            {
                return Result<bool>.Failure("Calendar event not found");
            }

            // Only creator can delete events
            if (existingEvent.EventCreatedBy != currentUserId)
            {
                return Result<bool>.Failure("Only the event creator can delete this event");
            }

            await _unitOfWork.CalendarEvents.DeleteAsync(existingEvent, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception)
        {
            return Result<bool>.Failure("Failed to delete calendar event");
        }
    }
}
