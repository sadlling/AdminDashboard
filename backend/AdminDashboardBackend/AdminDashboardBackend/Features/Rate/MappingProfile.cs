using AdminDashboard.Domain.Entities;
using AutoMapper;

namespace AdminDashboard.API.Features.Rate;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TokenRate, RateDto>()
            .ConstructUsing(src => new RateDto(src.CurrentRate, src.ModifiedAt?? DateTimeOffset.Now)); // Явно вызываем конструктор RateDto
    }
}
