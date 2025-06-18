using AutoMapper;

namespace AdminDashboard.API.Features.Payment
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
       
            CreateMap<AdminDashboard.Domain.Entities.Payment, PaymentDto>()
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Client != null ? src.Client.Name : null))
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.CreatedAt!= null ? src.CreatedAt: DateTime.UtcNow));
            
        }
    }
}
