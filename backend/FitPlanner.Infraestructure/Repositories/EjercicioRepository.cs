using Microsoft.EntityFrameworkCore;
using FitPlanner.Application.Interfaces;
using FitPlanner.Domain.Entities;
using FitPlanner.Infraestructure.Data;

namespace FitPlanner.Infraestructure.Repositories;

// La implementacion cumple el contrato
public class EjercicioRepository : IEjercicioRepository {
	private readonly FitPlannerDbContext _context;

	public EjercicioRepository(FitPlannerDbContext context) {
		_context = context;
	}

	public async Task<IEnumerable<Ejercicio>> GetAllAsync() {
		return await _context.Ejercicios.ToListAsync();
	}

	public async Task<Ejercicio> AddAsync(Ejercicio ejercicio) {
		await _context.Ejercicios.AddAsync(ejercicio);
		await _context.SaveChangesAsync();

		return ejercicio;
	}
}
