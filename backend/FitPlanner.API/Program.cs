using DotNetEnv;
using FitPlanner.Application;
using FitPlanner.Infraestructure;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var connectionString = Environment.GetEnvironmentVariable(
    "ConnectionStrings__PostgresConnection"
) ?? throw new InvalidOperationException(
    "Falta la cadena de conexión a PostgreSQL."
);

// Leemos los orígenes permitidos desde el .env
var corsAllowedOrigins = Environment.GetEnvironmentVariable(
    "CORS_ALLOWED_ORIGINS"
) ?? throw new InvalidOperationException(
    "Falta la variable CORS_ALLOWED_ORIGINS en el archivo .env."
);

// Inyección de dependencias
builder.Services.AddInfraestructure(connectionString);
builder.Services.AddApplication();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCorsFitPlanner", policy =>
    {
        var origenes = corsAllowedOrigins.Split(
            ',',
            StringSplitOptions.RemoveEmptyEntries |
            StringSplitOptions.TrimEntries
        );

        policy.WithOrigins(origenes)
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Activamos la política CORS
app.UseCors("PoliticaCorsFitPlanner");

app.MapControllers();

app.Run();
