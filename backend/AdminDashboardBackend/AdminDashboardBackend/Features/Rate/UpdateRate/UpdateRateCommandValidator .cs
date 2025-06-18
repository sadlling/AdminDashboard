using FluentValidation;

namespace AdminDashboard.API.Features.Rate.UpdateRate
{
    public class UpdateRateCommandValidator : AbstractValidator<UpdateRateCommand>
    {
        public UpdateRateCommandValidator()
        {
            RuleFor(x => x.NewRate)
                .GreaterThan(0).WithMessage("Курс должен быть положительным числом.");
            
        }
    }
}
