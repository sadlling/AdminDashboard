using AdminDashboard.API.Shared.Pagination;
using AdminDashboard.Infrastructure.Context;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Clients.GetClients;
public class GetClientsQueryHandler : IRequestHandler<GetClientsQuery, PaginatedResponse<ClientDto>>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public GetClientsQueryHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedResponse<ClientDto>> Handle(GetClientsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Clients
            .OrderBy(c => c.Name) 
            .AsNoTracking();

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        var clients = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<ClientDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<ClientDto>(
            clients,
            request.PageNumber,
            request.PageSize,
            totalCount,
            totalPages
        );
    }
}
