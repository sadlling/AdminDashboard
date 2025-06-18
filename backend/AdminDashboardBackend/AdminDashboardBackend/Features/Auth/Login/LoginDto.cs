namespace AdminDashboard.API.Features.Auth.Login;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Message, UserInfoDto User);
public record UserInfoDto(Guid Id, string Email);