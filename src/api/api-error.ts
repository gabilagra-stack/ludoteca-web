import { isAxiosError } from "axios";

export type ApiErrorResponse = {
  timestamp?: string;
  status?: number;
  error?: string;
  code?: string;
  message?: string;
  path?: string;
  traceId?: string | null;
  fieldErrors?: { field: string; message: string }[];
};

export type ParsedApiError = {
  message: string;
  code?: string;
  status?: number;
  fieldErrors?: { field: string; message: string }[];
};

/**
 * Normaliza los errores de la API expuestos por el handler global del backend.
 */
export function parseApiError(err: unknown, fallback: string): ParsedApiError {
  if (isAxiosError<ApiErrorResponse>(err)) {
    const data = err.response?.data;
    const status = data?.status ?? err.response?.status;
    const baseMessage = data?.message || fallback;

    if (data?.fieldErrors?.length) {
      const details = data.fieldErrors
        .map((f) => `${f.field}: ${f.message}`)
        .join(" | ");

      return {
        message: details ? `${baseMessage} (${details})` : baseMessage,
        code: data.code,
        status,
        fieldErrors: data.fieldErrors,
      };
    }

    return {
      message: baseMessage,
      code: data?.code,
      status,
      fieldErrors: data?.fieldErrors,
    };
  }

  if (err instanceof Error && err.message) {
    return { message: err.message };
  }

  return { message: fallback };
}
