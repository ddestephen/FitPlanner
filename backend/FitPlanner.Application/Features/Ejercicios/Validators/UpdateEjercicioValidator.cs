using FluentValidation;
using FitPlanner.Application.Features.Ejercicios.DTOs;

namespace FitPlanner.Application.Features.Ejercicios.Validators;

public class UpdateEjercicioValidator
    : AbstractValidator<UpdateEjercicioRequestDto>
{
    public UpdateEjercicioValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty()
            .WithMessage("El nombre del ejercicio no puede estar vacío.")

            .MinimumLength(3)
            .WithMessage("El ejercicio debe tener al menos 3 caracteres.")

            .MaximumLength(100)
            .WithMessage("El ejercicio es demasiado largo.");
    }
}
