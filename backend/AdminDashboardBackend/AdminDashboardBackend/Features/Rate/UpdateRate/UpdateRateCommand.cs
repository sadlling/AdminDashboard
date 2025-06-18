using MediatR;

namespace AdminDashboard.API.Features.Rate.UpdateRate;

public record UpdateRateCommand(decimal NewRate) : IRequest<RateDto>;
