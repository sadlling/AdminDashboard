using AdminDashboard.Domain.Common;

namespace AdminDashboard.Domain.Entities;

public class Payment:BaseEntity
{
    public Guid ClientId { get; set; }
    public virtual Client? Client { get; set; } 
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "Tokens"; 
    public string? Description { get; set; }
}
