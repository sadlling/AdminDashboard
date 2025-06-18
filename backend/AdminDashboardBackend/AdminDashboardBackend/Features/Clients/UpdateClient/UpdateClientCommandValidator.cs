using AdminDashboard.Infrastructure.Context;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.API.Features.Clients.UpdateClient;

public class UpdateClientCommandValidator : AbstractValidator<UpdateClientCommand>
{
    private readonly AppDbContext _context;
    public UpdateClientCommandValidator(AppDbContext context)
    {
        _context = context;

        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Имя клиента обязательно.")
            .MaximumLength(100).WithMessage("Имя клиента не должно превышать 100 символов.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обязателен.")
            .EmailAddress().WithMessage("Некорректный формат Email.")
            .MustAsync(async (command, email, cancellationToken) =>
                await BeUniqueEmailForExistingClient(command.Id, email, cancellationToken))
            .WithMessage("Клиент с таким Email уже существует.");

        RuleFor(x => x.BalanceT)
            .GreaterThanOrEqualTo(0).WithMessage("Баланс не может быть отрицательным.");
    }

    private async Task<bool> BeUniqueEmailForExistingClient(Guid clientId, string email, CancellationToken cancellationToken)
    {
        return !await _context.Clients.AnyAsync(c => c.Email == email && c.Id != clientId, cancellationToken);
    }
}
