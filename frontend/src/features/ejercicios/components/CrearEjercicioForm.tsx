import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Ejercicio } from '../types/ejercicio.types';

import {
    crearEjercicioAsync,
    extraerMensajeErrorBackend
} from '../api/ejerciciosApi';

import {
    crearEjercicioSchema,
    type CrearEjercicioSchemaType
} from '../schemas/ejercicio.schema';

interface CrearEjercicioFormProps {
    onEjercicioCreado: (nuevoEjercicio: Ejercicio) => void;
    onCancelar: () => void;
}

export function CrearEjercicioForm({
    onEjercicioCreado,
    onCancelar
}: CrearEjercicioFormProps) {

    // Almacena los errores que devuelve el backend
    const [errorServidor, setErrorServidor] = useState<string | null>(null);

    // Configuración de React Hook Form + Zod
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CrearEjercicioSchemaType>({
        resolver: zodResolver(crearEjercicioSchema),
        mode: 'onChange',
        defaultValues: {
            nombre: '',
        },
    });

    // Se ejecuta únicamente cuando Zod considera válidos los datos
    const procesarEnvioLimpio = async (
        datosValidados: CrearEjercicioSchemaType
    ) => {

        try {
            setErrorServidor(null);

            const ejercicioCreadoEnBd =
                await crearEjercicioAsync(datosValidados);

            reset();

            onEjercicioCreado(ejercicioCreadoEnBd);

        } catch (error) {

            const mensajeExactoDeNet =
                extraerMensajeErrorBackend(error);

            console.error(
                'Rechazo reportado por el Backend .NET:',
                error
            );

            setErrorServidor(mensajeExactoDeNet);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(procesarEnvioLimpio)}
            className="bg-slate-800/90 border border-indigo-500/40 rounded-xl p-5 mb-8 shadow-lg"
        >

            {/* Encabezado */}
            <div className="flex items-center justify-between mb-4">

                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-400">✨</span>
                    Registrar nuevo ejercicio
                </h2>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                    Zod + FluentValidation .NET
                </span>

            </div>

            {/* Campo de entrada y botones */}
            <div className="flex flex-col sm:flex-row gap-3">

                <div className="flex-1">

                    <input
                        type="text"
                        placeholder="Ej. Flexiones..."
                        disabled={isSubmitting}
                        autoFocus
                        {...register('nombre', {
                            onChange: () => {
                                if (errorServidor) {
                                    setErrorServidor(null);
                                }
                            },
                        })}
                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.nombre
                                ? 'border-amber-500 focus:border-amber-400'
                                : errorServidor
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-slate-700 focus:border-indigo-500'
                        }`}
                    />

                </div>

                <div className="flex items-center gap-2 self-start">

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? 'Guardando en BD...'
                            : 'Guardar ejercicio'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={isSubmitting}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                </div>

            </div>

            {/* Validación instantánea de Zod */}
            {errors.nombre && (
                <p className="text-amber-400 text-xs mt-2.5 font-medium flex items-center gap-1.5">
                    <span>⚡</span>
                    <strong>Validación en vivo:</strong>
                    {' '}{errors.nombre.message}
                </p>
            )}

            {/* Errores devueltos por .NET */}
            {errorServidor && (
                <div className="mt-3 bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-center gap-2">

                    <span className="text-base">🛡️</span>

                    <span>
                        <strong>Respuesta del Backend (.NET):</strong>
                        {' '}{errorServidor}
                    </span>

                </div>
            )}

        </form>
    );
}
