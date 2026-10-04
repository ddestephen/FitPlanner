using FitPlanner.Domain.Entities;

namespace FitPlanner.Application.Interfaces;

public interface IEjercicioRepository {
	Task<IEnumerable<Ejercicio>> GetAllAsync();
	Task<Ejercicio> AddAsync(Ejercicio ejercicio);

	Task<Ejercicio?> GetByIdAsync(int id);
	Task UpdateAsync(Ejercicio ejercicio);
	Task DeleteAsync(Ejercicio ejercicio);
}
