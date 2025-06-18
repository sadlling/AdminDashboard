
namespace AdminDashboard.API.Features.Payment;

public record PaymentDto
{
    public Guid Id { get; init; }
    public Guid ClientId { get; init; }
    public string? ClientName { get; init; } 
    public decimal Amount { get; init; }
    public DateTime Timestamp { get; init; }
    public string Currency { get; init; } = string.Empty;
    public string? Description { get; init; }
}
