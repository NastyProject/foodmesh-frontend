import { ApiError } from "./client";

const MAX_REINTENTOS = 2;

/** Solo se reintentan errores de red (status 0) y del servidor (5xx). Un 4xx no cambia al repetirlo. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  const reintentable = error.status === 0 || error.status >= 500;
  return reintentable && failureCount < MAX_REINTENTOS;
}
