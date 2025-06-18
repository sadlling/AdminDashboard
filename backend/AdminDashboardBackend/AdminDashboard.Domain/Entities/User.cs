using AdminDashboard.Domain.Common;


namespace AdminDashboard.Domain.Entities
{
    public class User:BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
