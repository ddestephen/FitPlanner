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
    private readonly IValidator<CreateEjercicioRequestDto> _validator;

    // Inyección de Dependencias
    public EjerciciosController(
        IEjercicioRepository repository
        IValidator<CreateEjercicioRequestDto> validator)
    {
        _repository = repository;
        _validator = validator;
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

    // POST: Solicitar creación de un recurso
    [HttpPost]
    public async Task<IActionResult> CrearEjercicio(
        [FromBody] CreateEjercicioRequestDto request)
    {
        var validationResult = await _validator.ValidateAsync(request);

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
}