// src/features/ejercicios/components/CatalogoEjerciciosView.tsx

import { useState, useEffect } from 'react';

import type { Ejercicio } from '../types/ejercicio.types';
import { obtenerEjerciciosAsync } from '../api/ejerciciosApi';
import { EjercicioCard } from './EjercicioCard';

export function CatalogoEjerciciosView() {

    // --- ZONA 1: ESTADO DEL MÓDULO ---
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [busqueda, setBusqueda] = useState<string>('');

    // --- ZONA 2: CARGA DE DATOS ---
    useEffect(() => {
        obtenerEjerciciosAsync().then((datos) => {
            setEjercicios(datos);
            setCargando(false);
        });
    }, []);

    // --- ZONA 3: FILTRADO ---
    const ejerciciosFiltrados = ejercicios.filter((ejercicio) =>
        ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // --- ZONA 4: RENDERIZADO ---
    return (
        <div>
            {/* Encabezado del catálogo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Catálogo de Ejercicios
                    </h1>

                    <p className="text-slate-400 text-sm mt-1">
                        Explora los ejercicios disponibles para tus planes de entrenamiento.
                    </p>
                </div>

                <button
                    disabled
                    className="bg-indigo-600 text-white font-medium text-sm px-4 py-2.5 rounded-lg opacity-50 cursor-not-allowed self-start sm:self-auto"
                >
                    + Nuevo ejercicio
                </button>
            </div>

            {/* Buscador */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <input
                    type="text"
                    placeholder="🔍 Filtrar ejercicios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <span className="text-xs text-slate-400">
                    Mostrando{' '}
                    <strong className="text-white">
                        {ejerciciosFiltrados.length}
                    </strong>{' '}
                    de {ejercicios.length} registros
                </span>
            </div>

            {/* Resultados */}
            {cargando ? (
                <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
                    <p className="text-indigo-400 font-semibold animate-pulse text-lg">
                        ⏳ Consultando catálogo de ejercicios...
                    </p>
                </div>
            ) : ejerciciosFiltrados.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
                    <p className="text-slate-400">
                        No se encontraron ejercicios con ese nombre.
                    </p>
                </div>
            ) : (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ejerciciosFiltrados.map((ejercicio) => (
                        <EjercicioCard
                            key={ejercicio.id}
                            id={ejercicio.id}
                            nombre={ejercicio.nombre}
                        />
                    ))}
                </section>
            )}
        </div>
    );
}