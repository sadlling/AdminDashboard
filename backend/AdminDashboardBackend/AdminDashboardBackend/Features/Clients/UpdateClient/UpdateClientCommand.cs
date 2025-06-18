using MediatR;

namespace AdminDashboard.API.Features.Clients.UpdateClient;

public record UpdateClientCommand(Guid Id, string Name, string Email, decimal BalanceT) : IRequest<ClientDto>;
