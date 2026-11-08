import { z } from 'zod';

// Esquema de validación para la creación de ejercicios
export const crearEjercicioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, 'El nombre del ejercicio no puede estar vacío.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()-]+$/,
            'El nombre contiene caracteres especiales no permitidos.'
        ),
});

// Tipo TypeScript inferido automáticamente desde Zod
export type CrearEjercicioSchemaType = z.infer<
    typeof crearEjercicioSchema
>;
