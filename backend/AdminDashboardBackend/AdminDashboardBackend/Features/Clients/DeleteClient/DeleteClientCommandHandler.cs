using AdminDashboard.Domain.Entities;
using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.Exceptions;
using MediatR;

namespace AdminDashboard.API.Features.Clients.DeleteClient;
public class DeleteClientCommandHandler : IRequestHandler<DeleteClientCommand,Unit>
{
    private readonly AppDbContext _context;

    public DeleteClientCommandHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteClientCommand request, CancellationToken cancellationToken)
    {
        var client = await _context.Clients.FindAsync(new object[] { request.Id }, cancellationToken);

        if (client == null)
        {
            throw new NotFoundException(nameof(Client));
        }

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value; 
    }
}
