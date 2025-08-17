using FluentValidation;
using GenAI.SmartFlowPM.Application.DTOs.User;
using GenAI.SmartFlowPM.Application.Features.Users.Commands;
using GenAI.SmartFlowPM.Application.Features.Users.Queries;
using GenAI.SmartFlowPM.Application.Common.Models;
using GenAI.SmartFlowPM.Application.Validators.Common;
using GenAI.SmartFlowPM.Application.Common.Constants;

namespace GenAI.SmartFlowPM.Application.Validators.User;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name must not exceed 100 characters");

        RuleFor(x => x.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name must not exceed 100 characters");

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email format is invalid")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.UserName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Username is required")
            .MaximumLength(255).WithMessage("Username must not exceed 255 characters")
            .Matches(ValidationPatterns.USERNAME_OR_EMAIL).WithMessage(ValidationMessages.USERNAME_OR_EMAIL_INVALID);

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters")
            .MaximumLength(100).WithMessage("Password must not exceed 100 characters")
            .Matches(ValidationPatterns.STRONG_PASSWORD).WithMessage(ValidationMessages.PASSWORD_WEAK);

        RuleFor(x => x.PhoneNumber)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(15).WithMessage("Phone number must not exceed 15 characters")
            .Matches(ValidationPatterns.PHONE_NUMBER).WithMessage(ValidationMessages.PHONE_NUMBER_INVALID)
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

        RuleFor(x => x.ManagerId)
            .NotEqual(Guid.Empty).WithMessage("Manager ID must be a valid GUID")
            .When(x => x.ManagerId.HasValue);
    }
}

public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
{
    public UpdateUserDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name must not exceed 100 characters");

        RuleFor(x => x.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name must not exceed 100 characters");

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email format is invalid")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.PhoneNumber)
            .Cascade(CascadeMode.Stop)
            .MaximumLength(15).WithMessage("Phone number must not exceed 15 characters")
            .Matches(ValidationPatterns.PHONE_NUMBER).WithMessage(ValidationMessages.PHONE_NUMBER_INVALID)
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

        RuleFor(x => x.ManagerId)
            .NotEqual(Guid.Empty).WithMessage("Manager ID must be a valid GUID")
            .When(x => x.ManagerId.HasValue);
    }
}

public class UserLoginDtoValidator : AbstractValidator<UserLoginDto>
{
    public UserLoginDtoValidator()
    {
        RuleFor(x => x.UserNameOrEmail)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Username or email is required")
            .MaximumLength(255).WithMessage("Username or email must not exceed 255 characters");

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Password is required")
            .MaximumLength(100).WithMessage("Password must not exceed 100 characters");
    }
}

public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordDtoValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Current password is required")
            .MaximumLength(100).WithMessage("Current password must not exceed 100 characters");

        RuleFor(x => x.NewPassword)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("New password is required")
            .MinimumLength(6).WithMessage("New password must be at least 6 characters")
            .MaximumLength(100).WithMessage("New password must not exceed 100 characters")
            .Matches(ValidationPatterns.STRONG_PASSWORD).WithMessage(ValidationMessages.PASSWORD_WEAK);

        RuleFor(x => x.NewPassword)
            .NotEqual(x => x.CurrentPassword).WithMessage("New password must be different from current password")
            .When(x => !string.IsNullOrEmpty(x.CurrentPassword) && !string.IsNullOrEmpty(x.NewPassword));
    }
}

// Missing validator for RefreshTokenRequest
public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Refresh token is required")
            .MinimumLength(10).WithMessage("Invalid refresh token format");
    }
}

// Command Validators
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.CreateUserDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("User data is required")
            .SetValidator(new CreateUserDtoValidator());
    }
}

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.UpdateUserDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("User data is required")
            .SetValidator(new UpdateUserDtoValidator());
    }
}

public class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserCommandValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.UserId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");

        RuleFor(x => x.ChangePasswordDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Password data is required")
            .SetValidator(new ChangePasswordDtoValidator());
    }
}

public class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    public LoginUserCommandValidator()
    {
        RuleFor(x => x.LoginDto)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Login data is required")
            .SetValidator(new UserLoginDtoValidator());
    }
}

// Query Validators
public class GetUserByIdQueryValidator : AbstractValidator<GetUserByIdQuery>
{
    public GetUserByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("User ID is required");
    }
}

public class GetAllUsersQueryValidator : AbstractValidator<GetAllUsersQuery>
{
    public GetAllUsersQueryValidator()
    {
        RuleFor(x => x.PagedQuery)
            .Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Paged query is required")
            .SetValidator(new PagedQueryValidator());
    }
}

public class GetUsersByManagerIdQueryValidator : AbstractValidator<GetUsersByManagerIdQuery>
{
    public GetUsersByManagerIdQueryValidator()
    {
        RuleFor(x => x.ManagerId)
            .Cascade(CascadeMode.Stop)
            .NotEqual(Guid.Empty).WithMessage("Manager ID is required");
    }
}
