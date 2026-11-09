import type { components } from "./schema";

type ValidationError = components["schemas"]["ValidationError"];

export class ApiError extends Error {
  readonly status: number;
  readonly detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
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

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

const MENSAJE_GENERICO = "Algo salió mal. Intenta de nuevo.";
const MENSAJE_SIN_CONEXION = "No pudimos conectarnos. Revisa tu conexión e intenta de nuevo.";

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function isValidationErrorList(value: unknown): value is ValidationError[] {
  return (
    Array.isArray(value) &&
    value.every((e) => typeof e === "object" && e !== null && typeof (e as { msg?: unknown }).msg === "string")
  );
}

// FastAPI manda `detail` como string (errores propios) o como lista (422 de validación).
function readDetail(payload: unknown): string {
  if (typeof payload !== "object" || payload === null || !("detail" in payload)) return MENSAJE_GENERICO;
  const { detail } = payload as { detail: unknown };
  if (typeof detail === "string" && detail.trim()) return detail;
  if (isValidationErrorList(detail) && detail.length > 0) return detail.map((e) => e.msg).join(". ");
  return MENSAJE_GENERICO;
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

  if (!response.ok) throw new ApiError(response.status, readDetail(payload));
  return payload as T;
}
