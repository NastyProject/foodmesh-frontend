import type { components } from "./schema";

type ValidationError = components["schemas"]["ValidationError"];

/**
 * `detail` con código que manda el backend en errores propios (403 de consentimiento,
 * 422 de foto ilegible…). No está en el OpenAPI: FastAPI no documenta el cuerpo de las
 * HTTPException, así que se tipa aquí con lo que dicen los avisos.
 */
export interface DetalleConCodigo {
  codigo: string;
  mensaje: string;
  consejo?: string;
  [extra: string]: unknown;
}

/** Lo que puede venir en `detail`: texto, lista de validación (422 de FastAPI) u objeto con código. */
export type DetalleError = string | ValidationError[] | DetalleConCodigo | null;

export class ApiError extends Error {
  readonly status: number;
  /** `detail` tal como llegó. Para mostrar, usar `message`. */
  readonly detail: DetalleError;
  readonly codigo: string | null;
  readonly consejo: string | null;

  /** `message` es siempre un texto listo para el usuario. */
  constructor(status: number, message: string, detail: DetalleError = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    const conCodigo = esDetalleConCodigo(detail) ? detail : null;
    this.codigo = conCodigo?.codigo ?? null;
    this.consejo = conCodigo?.consejo ?? null;
  }
}

export const CODIGO_CONSENTIMIENTO = "consentimiento_requerido";

export function esConsentimientoRequerido(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 403 && error.codigo === CODIGO_CONSENTIMIENTO;
}

export type GetToken = () => Promise<string>;

type Query = Record<string, string | number | boolean | null | undefined>;

export interface ApiFetchOptions {
  getToken: GetToken;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

export const MENSAJE_GENERICO = "Algo salió mal. Intenta de nuevo.";
export const MENSAJE_SIN_CONEXION = "No pudimos conectarnos. Revisa tu conexión e intenta de nuevo.";

function apiUrl(): string {
  return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${apiUrl()}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function texto(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function esDetalleConCodigo(value: unknown): value is DetalleConCodigo {
  return esObjeto(value) && texto(value.codigo) !== null && typeof value.mensaje === "string";
}

function isValidationErrorList(value: unknown): value is ValidationError[] {
  return Array.isArray(value) && value.every((e) => esObjeto(e) && typeof e.msg === "string");
}

/** Convierte la respuesta de error del backend en un `ApiError`. Pura, para poder probarla. */
export function leerError(status: number, payload: unknown): ApiError {
  const detail = esObjeto(payload) ? payload.detail : undefined;

  if (typeof detail === "string") return new ApiError(status, texto(detail) ?? MENSAJE_GENERICO, detail);
  if (isValidationErrorList(detail)) {
    const mensaje = detail.map((e) => e.msg).join(". ");
    return new ApiError(status, texto(mensaje) ?? MENSAJE_GENERICO, detail);
  }
  if (esDetalleConCodigo(detail)) return new ApiError(status, texto(detail.mensaje) ?? MENSAJE_GENERICO, detail);
  return new ApiError(status, MENSAJE_GENERICO);
}

async function readToken(getToken: GetToken): Promise<string> {
  try {
    return await getToken();
  } catch {
    // login_required, consent_required, refresh token vencido…: hay que volver a entrar.
    throw new ApiError(401, "Tu sesión terminó. Vuelve a entrar.");
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions): Promise<T> {
  const { getToken, method = "GET", body, query, signal } = options;
  const token = await readToken(getToken);

  const headers = new Headers({ Authorization: `Bearer ${token}`, Accept: "application/json" });
  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    // Sin Content-Type: el navegador lo arma con el boundary.
    requestBody = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), { method, headers, body: requestBody, signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, MENSAJE_SIN_CONEXION);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) throw leerError(response.status, payload);
  return payload as T;
}
