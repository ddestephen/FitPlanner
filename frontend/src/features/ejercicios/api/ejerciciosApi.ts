import type { Ejercicio } from '../types/ejercicio.types';

// Función asíncrona que simula obtener los ejercicios
export const obtenerEjerciciosAsync = (): Promise<Ejercicio[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const datosCatalogo: Ejercicio[] = [
                { id: 1, nombre: 'Flexiones' },
                { id: 2, nombre: 'Sentadillas' },
                { id: 3, nombre: 'Plancha abdominal' },
                { id: 4, nombre: 'Dominadas' },
                { id: 5, nombre: 'Zancadas' },
                { id: 6, nombre: 'Elevaciones de pantorrillas' },
            ];

            resolve(datosCatalogo);
        }, 1000);
    });
};