import type { Ejercicio } from '../types/ejercicio.types';

interface EjercicioCardProps extends Ejercicio {
    onEliminar: (id: number) => void;
}

export function EjercicioCard({
    id,
    nombre,
    onEliminar
}: EjercicioCardProps) {
    return (
        <article className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors shadow-sm">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-500/20">
                        ID Ejercicio #{id}
                    </span>

                    <span className="text-xs text-slate-400 font-medium">
                        Catálogo
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-5">
                    {nombre}
                </h3>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    disabled
                    className="w-full bg-slate-900/80 text-slate-400 text-sm font-medium py-2.5 px-4 rounded-lg cursor-not-allowed border border-slate-700"
                >
                    Agregar al plan (Próximamente)
                </button>

                <button
                    type="button"
                    onClick={() => onEliminar(id)}
                    className="w-full bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white text-sm font-medium py-2.5 px-4 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                >
                    Eliminar ejercicio
                </button>
            </div>
        </article>
    );
}