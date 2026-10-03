using Microsoft.AspNetCore.Mvc;
using FitPlanner.Application.Interfaces;
using FitPlanner.Domain.Entities;

namespace FitPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EjerciciosController : ControllerBase
{
    private readonly IEjercicioRepository _repository;

    // Inyección de Dependencias
    public EjerciciosController(IEjercicioRepository repository)
    {
        _repository = repository;
    }

    // GET: Solicitar lectura de datos
    [HttpGet]
    public async Task<IActionResult> GetEjercicios()
    {
        var ejercicios = await _repository.GetAllAsync();

        return Ok(ejercicios);
    }

    // POST: Solicitar creación de un recurso
    [HttpPost]
    public async Task<IActionResult> CrearEjercicio(
        [FromBody] Ejercicio ejercicio)
    {
        if (string.IsNullOrWhiteSpace(ejercicio.Nombre))
        {
            return BadRequest("El nombre del ejercicio es obligatorio.");
        }

        var nuevoEjercicio = await _repository.AddAsync(ejercicio);

        return CreatedAtAction(
            nameof(GetEjercicios),
            new { id = nuevoEjercicio.Id },
            nuevoEjercicio
        );
    }
}