using AdminDashboard.API.Features.Clients.CreateClient;
using AdminDashboard.API.Features.Clients.UpdateClient;
using AdminDashboard.Domain.Entities;
using AutoMapper;

namespace AdminDashboard.API.Features.Clients;

public class MappingProfile : Profile
{
    public MappingProfile()
    {

        CreateMap<Client, ClientDto>();

        CreateMap<CreateClientCommand, Client>();
        CreateMap<UpdateClientCommand, Client>()

            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
