using AdminDashboard.API.Features.Clients.CreateClient;
using AdminDashboard.API.Features.Clients.DeleteClient;
using AdminDashboard.API.Features.Clients.GetClients;
using AdminDashboard.API.Features.Clients.UpdateClient;
using AdminDashboard.API.Shared.Pagination;
using AdminDashboard.Infrastructure.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AdminDashboard.API.Features.Clients;

[Route("api/clients")]
[ApiController]
[Authorize] 
public class ClientsController : ControllerBase
{
    private readonly ISender _mediator;

    public ClientsController(ISender mediator)
    {
        _mediator = mediator;
    }

    // GET: api/clients
    [HttpGet]
    public async Task<IActionResult> GetClients(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 1;
        if (pageSize > 20) pageSize = 20; 

        var query = new GetClientsQuery(pageNumber, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST: api/clients
    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientRequestDto request)
    {
        var command = new CreateClientCommand(request.Name, request.Email, request.BalanceT);
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(CreateClient), new { id = result.Id }, result);
        
    }

    // PUT: api/clients/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] UpdateClientRequestDto request)
    {
        var command = new UpdateClientCommand(id, request.Name, request.Email, request.BalanceT);
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (NotFoundException) 
        {
            return NotFound();
        }
        
    }

    // DELETE: api/clients/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var command = new DeleteClientCommand(id);
        try
        {
            await _mediator.Send(command);
            return NoContent(); 
        }
        catch (NotFoundException)
        {
            return NotFound();
        }
    }
}
