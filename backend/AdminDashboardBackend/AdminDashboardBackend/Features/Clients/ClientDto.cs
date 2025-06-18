namespace AdminDashboard.API.Features.Clients;

public record ClientDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public decimal BalanceT { get; init; }
}

public record CreateClientRequestDto(string Name, string Email, decimal BalanceT);

public record UpdateClientRequestDto(string Name, string Email, decimal BalanceT);
