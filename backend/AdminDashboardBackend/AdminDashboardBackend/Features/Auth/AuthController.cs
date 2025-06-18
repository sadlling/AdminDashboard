using AdminDashboard.API.Features.Auth.Login;
using AdminDashboard.API.Features.Auth.Logout;
using AdminDashboard.API.Features.Auth.Refresh;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AdminDashboard.API.Features.Auth
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ISender _mediator;

        public AuthController(ISender mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request) 
        {
            var command = new LoginCommand(request.Email, request.Password);
            var result = await _mediator.Send(command);
            return Ok(result); 
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenApiRequest request) 
        {
            var command = new RefreshCommand();
            var result = await _mediator.Send(command);
            return Ok(result); 
        }

        [HttpPost("logout")]
        [AllowAnonymous] 
        public async Task<IActionResult> Logout()
        {
            var command = new LogoutCommand();
            await _mediator.Send(command); 
            return Ok(new { message = "Logged out successfully" });
        }

      
        [HttpGet("me")]
        [Authorize] 
        public IActionResult GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (userId == null) return Unauthorized();
            return Ok(new { UserId = userId, Email = email });
        }
    }
}
