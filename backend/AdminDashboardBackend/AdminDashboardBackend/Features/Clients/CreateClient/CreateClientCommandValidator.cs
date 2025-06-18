using AdminDashboard.Infrastructure.Context;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Clients.CreateClient;

public class CreateClientCommandValidator : AbstractValidator<CreateClientCommand>
{
    private readonly AppDbContext _context;

    public CreateClientCommandValidator(AppDbContext context) 
    {
        _context = context;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Имя клиента обязательно.")
            .MaximumLength(100).WithMessage("Имя клиента не должно превышать 100 символов.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обязателен.")
            .EmailAddress().WithMessage("Некорректный формат Email.")
            .MustAsync(BeUniqueEmail).WithMessage("Клиент с таким Email уже существует.");

        RuleFor(x => x.BalanceT)
            .GreaterThanOrEqualTo(0).WithMessage("Баланс не может быть отрицательным.");
    }

    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        return !await _context.Clients.AnyAsync(c => c.Email == email, cancellationToken);
    }
}