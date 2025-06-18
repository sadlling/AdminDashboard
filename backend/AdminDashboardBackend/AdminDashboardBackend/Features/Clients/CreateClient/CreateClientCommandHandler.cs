using AdminDashboard.Domain.Entities;
using AdminDashboard.Infrastructure.Context;
using AutoMapper;
using MediatR;

namespace AdminDashboard.API.Features.Clients.CreateClient;

public class CreateClientCommandHandler : IRequestHandler<CreateClientCommand, ClientDto>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public CreateClientCommandHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ClientDto> Handle(CreateClientCommand request, CancellationToken cancellationToken)
    {
         var client = _mapper.Map<Client>(request);

        _context.Clients.Add(client);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ClientDto>(client);
    }
}
