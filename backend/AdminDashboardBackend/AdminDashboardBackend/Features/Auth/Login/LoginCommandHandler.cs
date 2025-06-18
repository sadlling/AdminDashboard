using AdminDashboard.Domain.Interfaces.Services;
using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Auth.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IHttpContextAccessor _httpContextAccessor; 

    public LoginCommandHandler(
        AppDbContext context,
        ITokenService tokenService,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _tokenService = tokenService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidPasswordException("Invalid email or password.");
        }

        var accessToken = _tokenService.GenerateJwtToken(user);
        var refreshTokenEntity = _tokenService.GenerateRefreshToken();
        refreshTokenEntity.UserId = user.Id;

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync(cancellationToken);

        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(1),
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Secure = true,
        };

        _httpContextAccessor.HttpContext?.Response.Cookies.Append("JWT", accessToken, cookieOptions);
        _httpContextAccessor.HttpContext?.Response.Cookies.Append("Refresh", refreshTokenEntity.Token, cookieOptions);
        
        var userInfo = new UserInfoDto(user.Id, user.Email);

        return new LoginResponse("Login successful", userInfo);
    }
}

