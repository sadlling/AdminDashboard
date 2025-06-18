using MediatR;

namespace AdminDashboard.API.Features.Clients.DeleteClient;

public record DeleteClientCommand(Guid Id) : IRequest<Unit>;
