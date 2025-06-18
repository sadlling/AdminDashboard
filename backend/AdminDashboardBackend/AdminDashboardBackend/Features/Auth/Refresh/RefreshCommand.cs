using MediatR;

namespace AdminDashboard.API.Features.Auth.Refresh;

public record RefreshCommand() : IRequest<RefreshTokenApiResponse>;
