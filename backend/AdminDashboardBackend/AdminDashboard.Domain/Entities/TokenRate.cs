using AdminDashboard.Domain.Common;

namespace AdminDashboard.Domain.Entities
{
    public class TokenRate:BaseEntity
    {
        public decimal CurrentRate { get; set; }
    }
}
