import { describe, expect, it } from "vitest";
import type { ItemPropuesto } from "../../api/facturas";
import { aItemFactura, type Borrador, borradorVacio, crearBorradores, esAlimento, insertarNuevo, validar } from "./borrador";

const base: ItemPropuesto = {
  codigo: "7700304928750",
  nombre: "Arándanos 125 g",
  cantidad: 1,
  unidad: "unidad",
  precio_unitario: 6500,
  precio_total: 6500,
  categoria: "frutas_verduras",
  origen: "ia",
  revisar: false,
  es_alimento: true,
};
function primero(lista: Borrador[]): Borrador {
  const b = lista[0];
  if (!b) throw new Error("lista vacía");
  return b;
}

const varsol: ItemPropuesto = { ...base, codigo: null, nombre: "Varsol", categoria: "aseo_hogar", es_alimento: false };

describe("borrador de la revisión", () => {
  it("pone los alimentos primero y respeta es_alimento del backend", () => {
    const lista = crearBorradores([varsol, base]);
    expect(lista.map((b) => b.nombre)).toEqual(["Arándanos 125 g", "Varsol"]);
    expect(lista.map(esAlimento)).toEqual([true, false]);
  });

  it("deduce de la categoría si el usuario la cambió o lo agregó a mano", () => {
    const arandanos = primero(crearBorradores([base]));
    expect(esAlimento({ ...arandanos, categoria: "mascotas", esAlimentoBackend: null })).toBe(false);
    expect(esAlimento(borradorVacio())).toBe(true);
  });

  it("inserta lo agregado a mano al final de los alimentos", () => {
    const lista = insertarNuevo(crearBorradores([base, varsol]), { ...borradorVacio(), nombre: "Pan" });
    expect(lista.map((b) => b.nombre)).toEqual(["Arándanos 125 g", "Pan", "Varsol"]);
  });

  it("valida nombre y cantidad", () => {
    expect(validar([{ ...borradorVacio(), nombre: " " }])?.campo).toBe("nombre");
    expect(validar([{ ...borradorVacio(), nombre: "Pan", cantidad: "0" }])?.campo).toBe("cantidad");
    expect(validar([{ ...borradorVacio(), nombre: "Pan", cantidad: "0,5" }])).toBeNull();
  });

  it("manda solo los campos del contrato, con el código tal como vino", () => {
    const b = primero(crearBorradores([{ ...base, cantidad: 0.5, unidad: "kg" }]));
    expect(aItemFactura({ ...b, fecha: "2026-11-12" })).toEqual({
      nombre: "Arándanos 125 g",
      categoria: "frutas_verduras",
      cantidad: 0.5,
      unidad: "kg",
      fecha_vencimiento: "2026-11-12",
      codigo: "7700304928750",
    });
    expect(aItemFactura({ ...borradorVacio(), nombre: "Pan" })).toMatchObject({ categoria: null, fecha_vencimiento: null, codigo: null });
  });
});
