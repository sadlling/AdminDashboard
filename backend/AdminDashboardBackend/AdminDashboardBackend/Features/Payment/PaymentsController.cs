using AdminDashboard.API.Features.Payment.GetPayments;
using AdminDashboard.API.Shared.Pagination;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AdminDashboard.API.Features.Payment;

[Route("api/payments")]
[ApiController]
[Authorize] 
public class PaymentsController : ControllerBase 
{
    private readonly ISender _mediator;

    public PaymentsController(ISender mediator)
    {
        _mediator = mediator;
    }

    // GET: api/payments?pageNumber=1&pageSize=5
    [HttpGet]
    public async Task<IActionResult> GetPayments(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 1;
        if (pageSize > 20) pageSize = 20; 

        var query = new GetPaymentsQuery(pageNumber, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
