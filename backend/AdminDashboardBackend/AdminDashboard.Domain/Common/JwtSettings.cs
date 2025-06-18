namespace AdminDashboard.Domain.Common
{
    public class JwtSettings
    {
        public const string SectionName = "JWTKey"; 

        public string Secret { get; init; } = null!;
        public string ValidIssuer { get; init; } = null!;
        public string ValidAudience { get; init; } = null!;
    }
}
