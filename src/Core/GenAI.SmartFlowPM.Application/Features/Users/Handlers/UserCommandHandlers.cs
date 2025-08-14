using MediatR;
using AutoMapper;
using GenAI.SmartFlowPM.Application.Features.Users.Commands;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Domain.Entities;
using GenAI.SmartFlowPM.Domain.Interfaces;
using GenAI.SmartFlowPM.Domain.Interfaces.Services;

namespace GenAI.SmartFlowPM.Application.Features.Users.Handlers;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPasswordHashingService _passwordHashingService;

    public CreateUserCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IPasswordHashingService passwordHashingService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHashingService = passwordHashingService;
    }

    public async Task<Result<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        if (await _unitOfWork.Users.IsEmailExistsAsync(request.CreateUserDto.Email, cancellationToken: cancellationToken))
        {
            return Result<UserDto>.Failure("Email already exists");
        }

        // Check if username already exists
        if (await _unitOfWork.Users.IsUserNameExistsAsync(request.CreateUserDto.UserName, cancellationToken: cancellationToken))
        {
            return Result<UserDto>.Failure("Username already exists");
        }

        // Check if manager exists
        if (request.CreateUserDto.ManagerId.HasValue)
        {
            if (!await _unitOfWork.Users.ExistsAsync(request.CreateUserDto.ManagerId.Value, cancellationToken))
            {
                return Result<UserDto>.Failure("Manager not found");
            }
        }

        var user = _mapper.Map<User>(request.CreateUserDto);
        user.PasswordHash = _passwordHashingService.HashPassword(request.CreateUserDto.Password);

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var userDto = _mapper.Map<UserDto>(user);
        return Result<UserDto>.Success(userDto, "User created successfully");
    }
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateUserCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
        {
            return Result<UserDto>.Failure("User not found");
        }

        // Check if email already exists (excluding current user)
        if (await _unitOfWork.Users.IsEmailExistsAsync(request.UpdateUserDto.Email, request.Id, cancellationToken))
        {
            return Result<UserDto>.Failure("Email already exists");
        }

        // Check if manager exists
        if (request.UpdateUserDto.ManagerId.HasValue)
        {
            if (!await _unitOfWork.Users.ExistsAsync(request.UpdateUserDto.ManagerId.Value, cancellationToken))
            {
                return Result<UserDto>.Failure("Manager not found");
            }
        }

        _mapper.Map(request.UpdateUserDto, user);
        user.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var userDto = _mapper.Map<UserDto>(user);
        return Result<UserDto>.Success(userDto, "User updated successfully");
    }
}

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteUserCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
        {
            return Result.Failure("User not found");
        }

        await _unitOfWork.Users.DeleteAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success("User deleted successfully");
    }
}

public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, Result<LoginResponseDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly IJwtTokenService _jwtTokenService;

    public LoginUserCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IPasswordHashingService passwordHashingService,
        IJwtTokenService jwtTokenService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHashingService = passwordHashingService;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<Result<LoginResponseDto>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        // Try to find user by email or username
        User? user = null;

        if (request.LoginDto.UserNameOrEmail.Contains("@"))
        {
            user = await _unitOfWork.Users.GetByEmailAsync(request.LoginDto.UserNameOrEmail, cancellationToken);
        }
        else
        {
            user = await _unitOfWork.Users.GetByUserNameAsync(request.LoginDto.UserNameOrEmail, cancellationToken);
        }

        if (user == null || !user.IsActive)
        {
            return Result<LoginResponseDto>.Failure("Invalid credentials");
        }

        if (!_passwordHashingService.VerifyPassword(request.LoginDto.Password, user.PasswordHash))
        {
            return Result<LoginResponseDto>.Failure("Invalid credentials");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get user roles
        var roleNames = user.UserRoles.Select(ur => ur.Role.Name).ToList();

        var userDto = _mapper.Map<UserDto>(user);
        var token = _jwtTokenService.GenerateToken(user.Id.ToString(), user.TenantId.ToString(), user.Email, user.UserName, roleNames);
        var refreshToken = _jwtTokenService.GenerateRefreshToken(user.Id.ToString(), user.TenantId.ToString(), user.Email, user.UserName, roleNames);

        var response = new LoginResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            Expires = DateTime.UtcNow.AddHours(1), // Should match JWT expiration
            User = userDto
        };

        return Result<LoginResponseDto>.Success(response, "Login successful");
    }
}

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHashingService _passwordHashingService;

    public ChangePasswordCommandHandler(
        IUnitOfWork unitOfWork,
        IPasswordHashingService passwordHashingService)
    {
        _unitOfWork = unitOfWork;
        _passwordHashingService = passwordHashingService;
    }

    public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            return Result.Failure("User not found");
        }

        if (!_passwordHashingService.VerifyPassword(request.ChangePasswordDto.CurrentPassword, user.PasswordHash))
        {
            return Result.Failure("Current password is incorrect");
        }

        user.PasswordHash = _passwordHashingService.HashPassword(request.ChangePasswordDto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success("Password changed successfully");
    }
}
