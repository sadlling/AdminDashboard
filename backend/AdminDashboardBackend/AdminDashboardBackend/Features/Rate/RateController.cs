using AdminDashboard.API.Features.Rate.GetRate;
using AdminDashboard.API.Features.Rate.UpdateRate;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminDashboard.API.Features.Rate;

[Route("api/rate")]
[ApiController]
[Authorize] 
public class RateController : ControllerBase 
{
    private readonly ISender _mediator;

    public RateController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCurrentRate()
    {
        var query = new GetRateQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateCurrentRate([FromBody] UpdateRateRequestDto request)
    {
        var command = new UpdateRateCommand(request.NewRate);
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
