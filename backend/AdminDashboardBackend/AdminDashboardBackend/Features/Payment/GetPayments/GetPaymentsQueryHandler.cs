using AdminDashboard.API.Shared.Pagination;
using AdminDashboard.Infrastructure.Context;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Payment.GetPayments;
public class GetPaymentsQueryHandler : IRequestHandler<GetPaymentsQuery, PaginatedResponse<PaymentDto>>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public GetPaymentsQueryHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedResponse<PaymentDto>> Handle(GetPaymentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Payments
            .Include(p => p.Client) 
            .OrderByDescending(p => p.CreatedAt) 
            .AsNoTracking();

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        var payments = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<PaymentDto>(_mapper.ConfigurationProvider) 
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<PaymentDto>(
            payments,
            request.PageNumber,
            request.PageSize,
            totalCount,
            totalPages
        );
    }
}
