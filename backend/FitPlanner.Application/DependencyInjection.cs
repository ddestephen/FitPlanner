using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace FitPlanner.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        // Busca y registra automáticamente los validadores
        // que existan dentro de este ensamblado.
        services.AddValidatorsFromAssembly(
            typeof(DependencyInjection).Assembly);

        return services;
    }
}