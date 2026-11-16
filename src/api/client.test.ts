import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiFetch,
  esConsentimientoRequerido,
  leerError,
  MENSAJE_GENERICO,
  MENSAJE_SIN_CONEXION,
} from "./client";

describe("leerError", () => {
  it("detail como texto", () => {
    const e = leerError(409, { detail: "Esta factura ya está en tu inventario." });
    expect(e).toBeInstanceOf(ApiError);
    expect(e.status).toBe(409);
    expect(e.message).toBe("Esta factura ya está en tu inventario.");
    expect(e.detail).toBe("Esta factura ya está en tu inventario.");
    expect(e.codigo).toBeNull();
    expect(e.consejo).toBeNull();
  });

  it("detail como lista de validación de FastAPI", () => {
    const detail = [
      { loc: ["body", "cantidad"], msg: "La cantidad debe ser mayor que 0", type: "value_error" },
      { loc: ["body", "categoria"], msg: "Categoría inválida", type: "enum" },
    ];
    const e = leerError(422, { detail });
    expect(e.message).toBe("La cantidad debe ser mayor que 0. Categoría inválida");
    expect(e.detail).toEqual(detail);
    expect(e.codigo).toBeNull();
  });

  it("detail como objeto con código, mensaje y consejo", () => {
    const detail = {
      codigo: "imagen_borrosa",
      mensaje: "La foto está borrosa y no se puede leer bien.",
      consejo: "Tómala de nuevo con buena luz.",
    };
    const e = leerError(422, { detail });
    expect(e.message).toBe(detail.mensaje);
    expect(e.codigo).toBe("imagen_borrosa");
    expect(e.consejo).toBe("Tómala de nuevo con buena luz.");
    expect(e.detail).toEqual(detail);
  });

  it("objeto con código sin consejo, con campos extra", () => {
    const e = leerError(403, {
      detail: {
        codigo: "consentimiento_requerido",
        mensaje: "Debes aceptar la política de tratamiento de datos para usar FoodMesh.",
        version_politica_vigente: "1.0",
      },
    });
    expect(e.codigo).toBe("consentimiento_requerido");
    expect(e.consejo).toBeNull();
    expect(esConsentimientoRequerido(e)).toBe(true);
  });

  it("solo es consentimiento con 403 y el código exacto", () => {
    expect(esConsentimientoRequerido(leerError(403, { detail: "Prohibido" }))).toBe(false);
    expect(
      esConsentimientoRequerido(leerError(422, { detail: { codigo: "consentimiento_requerido", mensaje: "x" } })),
    ).toBe(false);
    expect(esConsentimientoRequerido(new Error("x"))).toBe(false);
  });

  it.each([
    ["sin payload", null],
    ["sin detail", { error: "x" }],
    ["detail vacío", { detail: "  " }],
    ["lista vacía", { detail: [] }],
    ["objeto sin código", { detail: { mensaje: "Hola" } }],
    ["detail numérico", { detail: 42 }],
  ])("mensaje genérico: %s", (_, payload) => {
    const e = leerError(500, payload);
    expect(e.message).toBe(MENSAJE_GENERICO);
    expect(e.codigo).toBeNull();
  });
});

describe("apiFetch", () => {
  const getToken = () => Promise.resolve("tok");
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://api.test/");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("pone el token, arma la URL y parsea JSON", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }));
    const data = await apiFetch<{ id: number }[]>("/inventario", { getToken, query: { solo_alimentos: true, x: null } });
    expect(data).toEqual([{ id: 1 }]);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("http://api.test/inventario?solo_alimentos=true");
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer tok");
  });

  it("no pone Content-Type con FormData", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    await apiFetch("/facturas", { getToken, method: "POST", body: new FormData() });
    const init = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(init?.headers).has("Content-Type")).toBe(false);
  });

  it("204 devuelve undefined", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(apiFetch("/inventario/1", { getToken, method: "DELETE" })).resolves.toBeUndefined();
  });

  it("lanza ApiError con el detail del backend", async () => {
    const detail = { codigo: "imagen_pequena", mensaje: "La foto es muy pequeña.", consejo: "Usa la cámara." };
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ detail }), { status: 422 }));
    const error = await apiFetch("/facturas", { getToken, method: "POST", body: new FormData() }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 422, codigo: "imagen_pequena", consejo: "Usa la cámara." });
  });

  it("respuesta de error que no es JSON → mensaje genérico", async () => {
    fetchMock.mockResolvedValue(new Response("<html>502</html>", { status: 502 }));
    await expect(apiFetch("/x", { getToken })).rejects.toMatchObject({ status: 502, message: MENSAJE_GENERICO });
  });

  it("error de red → status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(apiFetch("/x", { getToken })).rejects.toMatchObject({ status: 0, message: MENSAJE_SIN_CONEXION });
  });

  it("sin token → 401 sin llamar al backend", async () => {
    await expect(apiFetch("/x", { getToken: () => Promise.reject(new Error("login_required")) })).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
