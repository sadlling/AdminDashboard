using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Rate.GetRate;
public class GetRateQueryHandler : IRequestHandler<GetRateQuery, RateDto>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public GetRateQueryHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RateDto> Handle(GetRateQuery request, CancellationToken cancellationToken)
    {
        var rateSetting = await _context.TokenRates
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        if (rateSetting == null)
        {
            throw new NotFoundException("Запись не найдена");
        }

        return _mapper.Map<RateDto>(rateSetting);
    }
}
