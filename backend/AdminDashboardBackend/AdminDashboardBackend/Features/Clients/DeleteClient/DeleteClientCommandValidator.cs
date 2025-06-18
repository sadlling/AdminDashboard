using FluentValidation;

namespace AdminDashboard.API.Features.Clients.DeleteClient;

public class DeleteClientCommandValidator : AbstractValidator<DeleteClientCommand>
{
    public DeleteClientCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
