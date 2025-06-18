using AdminDashboard.Domain.Common;


namespace AdminDashboard.Domain.Entities
{
    public class Client:BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public decimal BalanceT { get; set; } 
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
