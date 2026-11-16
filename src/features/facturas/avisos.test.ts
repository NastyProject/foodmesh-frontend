import { describe, expect, it } from "vitest";
import type { Factura } from "../../api/facturas";
import { avisosFactura, puedeReprocesar } from "./avisos";

const base: Factura = {
  id: 1,
  estado: "pendiente_validacion",
  supermercado: "D1",
  fecha_compra: "2026-11-01",
  total_impreso: 130690,
  total_calculado: 130690,
  requiere_revision: false,
  texto_ocr: null,
  metodo: "texto",
  items_descartados: 0,
  items_detectados: [],
  error: null,
  creado_en: "2026-11-02T19:30:00Z",
};

describe("avisosFactura", () => {
  it("sin avisos si todo cuadra", () => {
    expect(avisosFactura(base)).toEqual([]);
  });

  it("totales que no cuadran", () => {
    const [aviso] = avisosFactura({ ...base, requiere_revision: true, total_calculado: 118000 });
    expect(aviso).toMatchObject({ tipo: "texto" });
    expect(aviso?.tipo === "texto" && aviso.texto).toMatch(/impreso \$\s?130\.690, detectado \$\s?118\.000/);
  });

  it("líneas descartadas, después del aviso principal", () => {
    const avisos = avisosFactura({ ...base, requiere_revision: true, total_impreso: null, items_descartados: 2 });
    expect(avisos.map((a) => a.tipo)).toEqual(["texto", "descartados"]);
    expect(avisos[1]).toMatchObject({ n: 2 });
  });

  it("estado error usa el mensaje del backend", () => {
    const [aviso] = avisosFactura({ ...base, estado: "error", error: "No encontramos los productos." });
    expect(aviso?.tipo === "texto" && aviso.texto).toBe("No encontramos los productos. Agrega los productos a mano y confirma.");
  });
});

describe("puedeReprocesar", () => {
  it.each([
    [{}, false],
    [{ requiere_revision: true }, true],
    [{ estado: "error" as const }, true],
    [{ estado: "confirmada" as const, requiere_revision: true }, false],
  ])("%o → %s", (cambios, esperado) => {
    expect(puedeReprocesar({ ...base, ...cambios })).toBe(esperado);
  });
});
