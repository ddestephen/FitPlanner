using DotNetEnv;
using FitPlanner.Infraestructure;
using Scalar.AspNetCore;
using FitPlanner.Application;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var connectionString = 
    Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection")
    ?? throw new InvalidOperationException(
        "Falta la cadena de conexión"
    );

builder.Services.AddInfraestructure(connectionString);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapControllers();

app.Run();
