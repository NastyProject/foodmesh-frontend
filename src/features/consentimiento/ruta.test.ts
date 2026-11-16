import { describe, expect, it } from "vitest";
import { destinoSeguro, rutaConsentimiento } from "./ruta";

describe("destinoSeguro", () => {
  it.each(["/despensa", "/facturas/12", "/recetas?x=1", "/hogar#prefs"])("acepta ruta interna %s", (ruta) => {
    expect(destinoSeguro(ruta)).toBe(ruta);
  });

  it.each([
    null,
    undefined,
    "",
    "despensa",
    "//evil.com",
    "/\\evil.com",
    "https://evil.com",
    "/",
    "/consentimiento",
    "/consentimiento?volver=/x",
  ])("manda a la despensa con %s", (ruta) => {
    expect(destinoSeguro(ruta)).toBe("/despensa");
  });
});

describe("rutaConsentimiento", () => {
  it("codifica la ruta de vuelta", () => {
    expect(rutaConsentimiento("/facturas/3?a=1")).toBe("/consentimiento?volver=%2Ffacturas%2F3%3Fa%3D1");
  });
});
