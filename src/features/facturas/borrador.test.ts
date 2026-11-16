import { describe, expect, it } from "vitest";
import type { ItemPropuesto } from "../../api/facturas";
import {
  aItemFactura,
  type Borrador,
  borradorVacio,
  crearBorradores,
  esAlimento,
  insertarNuevo,
  requiereAtencion,
  validar,
} from "./borrador";

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
  nombre_incierto: false,
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

  it("conserva descripcion_impresa y nombre_incierto solo para mostrar", () => {
    const b = primero(
      crearBorradores([{ ...base, nombre: "Huevos de c…", descripcion_impresa: " HUEVO COD X12 ", nombre_incierto: true }]),
    );
    expect(b.descripcionImpresa).toBe("HUEVO COD X12");
    expect(b.nombreIncierto).toBe(true);
    expect(requiereAtencion(b)).toBe(true);
    expect(aItemFactura({ ...b, nombre: "Huevos de codorniz" })).not.toHaveProperty("descripcion_impresa");
    expect(aItemFactura(b)).not.toHaveProperty("nombre_incierto");
  });

  it("descripción vacía o ausente queda en null", () => {
    expect(primero(crearBorradores([{ ...base, descripcion_impresa: "  " }])).descripcionImpresa).toBeNull();
    expect(primero(crearBorradores([base])).descripcionImpresa).toBeNull();
  });

  it("requiere atención si revisar o nombre incierto", () => {
    expect(requiereAtencion(borradorVacio())).toBe(false);
    expect(requiereAtencion({ ...borradorVacio(), revisar: true })).toBe(true);
  });
});
