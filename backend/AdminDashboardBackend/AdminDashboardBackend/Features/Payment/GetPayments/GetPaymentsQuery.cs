using AdminDashboard.API.Shared.Pagination;
using MediatR;

namespace AdminDashboard.API.Features.Payment.GetPayments;

public record GetPaymentsQuery(int PageNumber = 1, int PageSize = 5) : IRequest<PaginatedResponse<PaymentDto>>;
