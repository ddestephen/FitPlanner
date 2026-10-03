using Microsoft.EntityFrameworkCore;
using FitPlanner.Domain.Entities;

namespace FitPlanner.Infraestructure.Data;

public class FitPlannerDbContext : DbContext {
	public FitPlannerDbContext(DbContextOptions<FitPlannerDbContext> options) : base(options) {}

	public DbSet<Ejercicio> Ejercicios {get; set; } = null;
}
