using AdminDashboard.API.Features.Auth.Login;
using AdminDashboard.Domain.Interfaces.Services;
using AdminDashboard.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Auth.Refresh;
public class RefreshCommandHandler : IRequestHandler<RefreshCommand, RefreshTokenApiResponse>
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private const string ACCESS_TOKEN_NAME = "JWT";
    private const string REFRESH_TOKEN_NAME = "Refresh";


    public RefreshCommandHandler(
        AppDbContext context,
        ITokenService tokenService,
        IHttpContextAccessor httpContextAccessor
        )
    {
        _context = context;
        _tokenService = tokenService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<RefreshTokenApiResponse> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        var httpContext = _httpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is not available.");

       
        var refreshTokenFromCookie = httpContext.Request.Cookies[REFRESH_TOKEN_NAME];

        if (string.IsNullOrEmpty(refreshTokenFromCookie))
        {
            throw new InvalidOperationException("Refresh token cookie not found.");
        }

        var storedRefreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenFromCookie, cancellationToken);

        if (storedRefreshToken == null || !storedRefreshToken.IsActive || storedRefreshToken.User == null)
        {
            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddDays(-1),
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Secure = true,
            };

            httpContext.Response.Cookies.Append(REFRESH_TOKEN_NAME,"", cookieOptions);
            httpContext.Response.Cookies.Append(ACCESS_TOKEN_NAME, "", cookieOptions);
            throw new InvalidOperationException("Invalid or expired refresh token.");
        }

        var newAccessToken = _tokenService.GenerateJwtToken(storedRefreshToken.User);
        var newRefreshTokenEntity = _tokenService.GenerateRefreshToken();
        newRefreshTokenEntity.UserId = storedRefreshToken.UserId;

        storedRefreshToken.Revoked = DateTime.UtcNow;
        _context.RefreshTokens.Add(newRefreshTokenEntity);
        await _context.SaveChangesAsync(cancellationToken);

        var newCookieOptions= new CookieOptions
        {
            Expires = DateTime.Now.AddDays(1),
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Secure = true,
        };

        httpContext.Response.Cookies.Append(ACCESS_TOKEN_NAME, newAccessToken, newCookieOptions);

        httpContext.Response.Cookies.Append(REFRESH_TOKEN_NAME, newRefreshTokenEntity.Token, newCookieOptions);

        var userInfo = new UserInfoDto(storedRefreshToken.User.Id, storedRefreshToken.User.Email);

        return new RefreshTokenApiResponse("Tokens refreshed", userInfo);
    }
}
