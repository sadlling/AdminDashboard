using AdminDashboard.API.Shared.Pagination;
using MediatR;

namespace AdminDashboard.API.Features.Clients.GetClients;

public record GetClientsQuery(int PageNumber = 1, int PageSize = 5) : IRequest<PaginatedResponse<ClientDto>>;
