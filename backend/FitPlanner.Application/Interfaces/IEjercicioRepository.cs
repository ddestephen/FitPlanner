using FitPlanner.Domain.Entities;

namespace FitPlanner.Application.Interfaces;

public interface IEjercicioRepository {
	Task<IEnumerable<Ejercicio>> GetAllAsync();
	Task<Ejercicio> AddAsync(Ejercicio ejercicio);
}
