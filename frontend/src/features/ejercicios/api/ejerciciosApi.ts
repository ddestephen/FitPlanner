import axios from 'axios';

import type {
    Ejercicio,
    CrearEjercicioDto,
    FluentValidationError
} from '../types/ejercicio.types';

// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error(
        'ERROR: No se detectó VITE_API_BASE_URL en frontend/.env'
    );
}

// Cliente HTTP
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. GET: Obtener todos los ejercicios
export const obtenerEjerciciosAsync = async (): Promise<Ejercicio[]> => {
    const respuesta = await apiClient.get<Ejercicio[]>('/ejercicios');

    if (!Array.isArray(respuesta.data)) {
        throw new Error(
            'La respuesta recibida no es un arreglo JSON válido.'
        );
    }

    return respuesta.data;
};

// 2. POST: Crear un ejercicio
export const crearEjercicioAsync = async (
    nuevoEjercicio: CrearEjercicioDto
): Promise<Ejercicio> => {

    const respuesta = await apiClient.post<Ejercicio>(
        '/ejercicios',
        nuevoEjercicio
    );

    return respuesta.data;
};

// 3. Extraer mensajes de error del backend
export const extraerMensajeErrorBackend = (
    error: unknown
): string => {

    if (axios.isAxiosError(error)) {

        // Caso A: No se recibió respuesta del servidor
        if (!error.response) {
            return 'Sin respuesta del servidor (.NET apagado o posible bloqueo CORS).';
        }

        const status = error.response.status;
        const data = error.response.data;

        // Caso B: Errores en formato de arreglo de FluentValidation
        if (Array.isArray(data)) {

            const erroresFluent = (
                data as FluentValidationError[]
            )
                .map((item) => item?.errorMessage)
                .filter(
                    (msg): msg is string =>
                        typeof msg === 'string' &&
                        msg.trim().length > 0
                );

            if (erroresFluent.length > 0) {
                return `[HTTP ${status}] ${erroresFluent.join(' | ')}`;
            }
        }

        // Caso C: El servidor devuelve un string
        if (typeof data === 'string' && data.trim().length > 0) {
            return `[HTTP ${status}] ${data}`;
        }

        // Caso D: El servidor devuelve un objeto JSON
        if (data && typeof data === 'object') {

            const obj = data as Record<string, unknown>;

            // ProblemDetails con errores de validación
            if (
                'errors' in obj &&
                obj.errors &&
                typeof obj.errors === 'object'
            ) {
                const listaErrores = Object.values(
                    obj.errors as Record<string, string[]>
                ).flat();

                if (listaErrores.length > 0) {
                    return `[HTTP ${status}] ${listaErrores.join(' | ')}`;
                }
            }

            // Mensajes de error explícitos
            const mensajeExplicito =
                obj.error ||
                obj.mensaje ||
                obj.message ||
                obj.detail ||
                obj.title;

            if (
                typeof mensajeExplicito === 'string' &&
                mensajeExplicito.trim().length > 0
            ) {
                return `[HTTP ${status}] ${mensajeExplicito}`;
            }
        }

        return `[HTTP ${status}] El servidor .NET rechazó la operación.`;
    }

    return error instanceof Error
        ? error.message
        : 'Error inesperado en la aplicación.';
};

// DELETE: Eliminar un ejercicio
export const eliminarEjercicioAsync = async (
    id: number
): Promise<void> => {

    await apiClient.delete(`/ejercicios/${id}`);

};