namespace AdminDashboard.API.Features.Rate;

public record RateDto(decimal Rate, DateTimeOffset LastUpdated);

public record UpdateRateRequestDto(decimal NewRate);
