import { describe, expect, it } from "vitest";
import { CATEGORIAS, esCategoria, etiquetaCategoria } from "./categorias";

describe("categorias", () => {
  it("tiene las 15 de la lista cerrada, en orden", () => {
    expect(CATEGORIAS).toHaveLength(15);
    expect(CATEGORIAS[0]).toEqual({ valor: "lacteos", etiqueta: "Lácteos" });
    expect(CATEGORIAS.at(-1)).toEqual({ valor: "otros", etiqueta: "Otros" });
  });

  it("etiqueta y validación", () => {
    expect(etiquetaCategoria("carnes_pescados")).toBe("Carnes y pescados");
    expect(etiquetaCategoria(null)).toBeNull();
    expect(esCategoria("aseo_hogar")).toBe(true);
    expect(esCategoria("aseo")).toBe(false);
  });
});
