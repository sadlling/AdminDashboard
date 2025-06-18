using AdminDashboard.Domain.Entities;
using System.Security.Claims;

namespace AdminDashboard.Domain.Interfaces.Services
{
    public interface ITokenService
    {
        public string GenerateJwtToken(User user);
        public RefreshToken GenerateRefreshToken();
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
