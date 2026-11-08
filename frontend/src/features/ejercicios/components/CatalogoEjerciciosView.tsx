import { useState, useEffect } from 'react';

import type { Ejercicio } from '../types/ejercicio.types';

import {
    obtenerEjerciciosAsync,
    eliminarEjercicioAsync,
    extraerMensajeErrorBackend
} from '../api/ejerciciosApi';

import { EjercicioCard } from './EjercicioCard';
import { CrearEjercicioForm } from './CrearEjercicioForm';

export function CatalogoEjerciciosView() {

    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [errorRed, setErrorRed] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState<string>('');
    const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

    // Obtener ejercicios desde PostgreSQL
    useEffect(() => {
        obtenerEjerciciosAsync()
            .then((datosDesdeBackend) => {
                setEjercicios(datosDesdeBackend);
                setErrorRed(null);
            })
            .catch((error) => {
                console.error('Error en la petición HTTP:', error);
                setErrorRed(extraerMensajeErrorBackend(error));
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    // Agregar el ejercicio creado al catálogo
    const manejarEjercicioCreado = (nuevoEjercicio: Ejercicio) => {
        setEjercicios((ejerciciosActuales) => [
            ...ejerciciosActuales,
            nuevoEjercicio
        ]);

        setMostrarFormulario(false);
    };

    // Filtrar ejercicios
    const ejerciciosFiltrados = ejercicios.filter((ejercicio) =>
        ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const manejarEliminarEjercicio = async (id: number) => {
        try {
            await eliminarEjercicioAsync(id);

            setEjercicios((actuales) =>
                actuales.filter((ejercicio) => ejercicio.id !== id)
            );

        } catch (error) {
            console.error(
                'Error al eliminar el ejercicio:',
                error
            );

            setErrorRed(extraerMensajeErrorBackend(error));
        }
    };

    return (
        <div>

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Catálogo de ejercicios
                    </h1>

                    <p className="text-slate-400 text-sm mt-1">
                        Gestiona los ejercicios disponibles en FitPlanner.
                    </p>
                </div>

                {!mostrarFormulario && (
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                        + Nuevo ejercicio
                    </button>
                )}

            </div>

            {/* Formulario de creación */}
            {mostrarFormulario && (
                <CrearEjercicioForm
                    onEjercicioCreado={manejarEjercicioCreado}
                    onCancelar={() => setMostrarFormulario(false)}
                />
            )}

            {/* Buscador */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <input
                    type="text"
                    placeholder="Buscar ejercicios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <span className="text-xs text-slate-400">
                    Mostrando{' '}
                    <strong className="text-white">
                        {ejerciciosFiltrados.length}
                    </strong>{' '}
                    de {ejercicios.length} ejercicios
                </span>

            </div>

            {/* Estado de carga */}
            {cargando && (
                <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
                    <p className="text-indigo-400 font-semibold animate-pulse text-lg">
                        Consultando ejercicios...
                    </p>
                </div>
            )}

            {/* Error de comunicación */}
            {!cargando && errorRed && (
                <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-6 text-center">
                    <p className="text-red-400 font-bold text-base mb-1">
                        Error de comunicación Full-Stack
                    </p>

                    <p className="text-slate-300 text-sm">
                        {errorRed}
                    </p>
                </div>
            )}

            {/* Catálogo */}
            {!cargando && !errorRed && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {ejerciciosFiltrados.map((ejercicio) => (
                        <EjercicioCard
                            key={ejercicio.id}
                            id={ejercicio.id}
                            nombre={ejercicio.nombre}
                            onEliminar={manejarEliminarEjercicio}
                        />
                    ))}

                    {ejerciciosFiltrados.length === 0 && (
                        <p className="text-slate-400 text-sm col-span-full">
                            No se encontraron ejercicios.
                        </p>
                    )}

                </section>
            )}

        </div>
    );
}
