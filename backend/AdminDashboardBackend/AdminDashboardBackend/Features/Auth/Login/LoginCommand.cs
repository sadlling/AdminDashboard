using MediatR;

namespace AdminDashboard.API.Features.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResponse>;

