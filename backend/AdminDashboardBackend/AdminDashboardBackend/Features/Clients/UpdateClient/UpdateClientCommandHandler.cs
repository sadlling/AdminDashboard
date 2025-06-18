using AdminDashboard.Domain.Entities;
using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.Exceptions;
using AutoMapper;
using MediatR;

namespace AdminDashboard.API.Features.Clients.UpdateClient;
public class UpdateClientCommandHandler : IRequestHandler<UpdateClientCommand, ClientDto>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public UpdateClientCommandHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ClientDto> Handle(UpdateClientCommand request, CancellationToken cancellationToken)
    {
        var client = await _context.Clients.FindAsync(new object[] { request.Id }, cancellationToken);

        if (client == null)
        {
            throw new NotFoundException(nameof(Client));
        }

        _mapper.Map(request, client);

        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ClientDto>(client);
    }
}
