using MediatR;

namespace AdminDashboard.API.Features.Auth.Logout;

public record LogoutCommand() : IRequest<Unit>;
