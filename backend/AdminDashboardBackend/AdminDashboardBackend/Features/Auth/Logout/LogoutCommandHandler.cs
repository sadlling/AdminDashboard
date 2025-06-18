using AdminDashboard.Domain.Common;
using AdminDashboard.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AdminDashboard.API.Features.Auth.Logout;
public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Unit>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private const string ACCESS_TOKEN_NAME = "JWT";
    private const string REFRESH_TOKEN_NAME = "Refresh";


    public LogoutCommandHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var httpContext = _httpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is not available.");
        var refreshTokenFromCookie = httpContext.Request.Cookies[REFRESH_TOKEN_NAME];

        if (!string.IsNullOrEmpty(refreshTokenFromCookie))
        {
            var refreshToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshTokenFromCookie, cancellationToken);

            if (refreshToken != null && refreshToken.IsActive)
            {
                refreshToken.Revoked = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(-1),
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Secure = true,
        };

        httpContext.Response.Cookies.Append(REFRESH_TOKEN_NAME, "", cookieOptions);
        httpContext.Response.Cookies.Append(ACCESS_TOKEN_NAME, "", cookieOptions);

        return Unit.Value;
    }
}