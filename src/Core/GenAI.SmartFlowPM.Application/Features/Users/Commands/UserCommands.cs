using MediatR;
using System.Text.Json.Serialization;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Common.Models;

namespace GenAI.SmartFlowPM.Application.Features.Users.Commands;

public class CreateUserCommand : IRequest<Result<UserDto>>
{
    [JsonPropertyName("createUserDto")]
    public CreateUserDto CreateUserDto { get; set; } = null!;
}

public class UpdateUserCommand : IRequest<Result<UserDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateUserDto")]
    public UpdateUserDto UpdateUserDto { get; set; } = null!;
}

public class DeleteUserCommand : IRequest<Result>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class ChangePasswordCommand : IRequest<Result>
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    
    [JsonPropertyName("changePasswordDto")]
    public ChangePasswordDto ChangePasswordDto { get; set; } = null!;
}

public class LoginUserCommand : IRequest<Result<LoginResponseDto>>
{
    [JsonPropertyName("loginDto")]
    public UserLoginDto LoginDto { get; set; } = null!;
}
