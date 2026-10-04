using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using FitPlanner.Application.Interfaces;
using FitPlanner.Domain.Entities;
using FitPlanner.Application.Features.Ejercicios.DTOs;

namespace FitPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EjerciciosController : ControllerBase
{
    private readonly IEjercicioRepository _repository;
    private readonly IValidator<CreateEjercicioRequestDto> _createValidator;
    private readonly IValidator<UpdateEjercicioRequestDto> _updateValidator;

    // Inyección de Dependencias
    public EjerciciosController(
        IEjercicioRepository repository,
        IValidator<CreateEjercicioRequestDto> createValidator,
        IValidator<UpdateEjercicioRequestDto> updateValidator)
    {
        _repository = repository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    // GET: Solicitar lectura de datos
    [HttpGet]
    public async Task<IActionResult> GetEjercicios()
    {
        var ejercicios = await _repository.GetAllAsync();

        var response = ejercicios.Select(e => new EjercicioResponseDto {
            Id = e.Id,
            Nombre = e.Nombre
        });

        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEjercicio(int id) {
        var ejercicio = await _repository.GetByIdAsync(id);

        if (ejercicio is null) {
            return NotFound();
        }

        var response = new EjercicioResponseDto {
            Id = ejercicio.Id,
            Nombre = ejercicio.Nombre
        };

        return Ok(response);
    }

    // POST: Solicitar creación de un recurso
    [HttpPost]
    public async Task<IActionResult> CrearEjercicio(
        [FromBody] CreateEjercicioRequestDto request)
    {
        var validationResult = await _createValidator.ValidateAsync(request);

        if (!validationResult.IsValid) {
            return BadRequest(validationResult.Errors);
        }

        var nuevoEjercicio = new Ejercicio {
            Nombre = request.Nombre
        };

        var ejercicioCreado = await _repository.AddAsync(nuevoEjercicio);

        var response = new EjercicioResponseDto {
            Id = ejercicioCreado.Id,
            Nombre = ejercicioCreado.Nombre
        };

        return CreatedAtAction(
            nameof(GetEjercicios),
            new { id = response.Id },
            response
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarEjercicio(
        int id,
        [FromBody] UpdateEjercicioRequestDto request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var ejercicio = await _repository.GetByIdAsync(id);

        if (ejercicio is null)
        {
            return NotFound();
        }

        ejercicio.Nombre = request.Nombre;

        await _repository.UpdateAsync(ejercicio);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarEjercicio(int id)
    {
        var ejercicio = await _repository.GetByIdAsync(id);

        if (ejercicio is null)
        {
            return NotFound();
        }

        await _repository.DeleteAsync(ejercicio);

        return NoContent();
    }
}
