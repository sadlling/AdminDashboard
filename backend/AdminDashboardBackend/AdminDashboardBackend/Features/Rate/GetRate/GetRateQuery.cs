using MediatR;

namespace AdminDashboard.API.Features.Rate.GetRate;

public record GetRateQuery() : IRequest<RateDto>;
