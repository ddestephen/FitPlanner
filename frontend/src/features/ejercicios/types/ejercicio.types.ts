export interface Ejercicio {
    id: number;
    nombre: string;
}

// 2. Contrato de escritura / entrada
export interface CrearEjercicioDto {
    nombre: string;
}

// 3. Contrato de errores de FluentValidation
export interface FluentValidationError {
    propertyName: string;
    errorMessage: string;
    attemptedValue?: unknown;
    errorCode?: string;
}
