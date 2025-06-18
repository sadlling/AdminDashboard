using MediatR;

namespace AdminDashboard.API.Features.Clients.CreateClient;

public record CreateClientCommand(string Name, string Email, decimal BalanceT) : IRequest<ClientDto>;
