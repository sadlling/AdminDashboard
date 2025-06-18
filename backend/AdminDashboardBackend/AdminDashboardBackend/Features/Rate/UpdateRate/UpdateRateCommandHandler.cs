using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Rate.UpdateRate;

public class UpdateRateCommandHandler : IRequestHandler<UpdateRateCommand, RateDto>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public UpdateRateCommandHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RateDto> Handle(UpdateRateCommand request, CancellationToken cancellationToken)
    {
        var rateSetting = await _context.TokenRates
            .FirstOrDefaultAsync(cancellationToken);

        if (rateSetting == null)
        {
            throw new NotFoundException("Запись не найдена");
        }

        rateSetting.CurrentRate = request.NewRate;
        rateSetting.ModifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<RateDto>(rateSetting);
    }
}