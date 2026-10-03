using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FitPlanner.Application.Interfaces;
using FitPlanner.Infraestructure.Data;
using FitPlanner.Infraestructure.Repositories;

namespace FitPlanner.Infraestructure;

public static class DependencyInjection {
	public static IServiceCollection AddInfraestructure(
		this IServiceCollection services,
		string connectionString
	) {
		services.AddDbContext<FitPlannerDbContext>(options => 
			options.UseNpgsql(connectionString));

		services.AddScoped<IEjercicioRepository, EjercicioRepository>();

		return services;
	}
}
