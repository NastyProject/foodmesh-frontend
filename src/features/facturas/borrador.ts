// Estado de edición de la revisión: vive en el cliente hasta confirmar.
import type { ItemFactura, ItemPropuesto } from "../../api/facturas";
import { cantidadAInput, parseCantidad } from "../../lib/cantidad";
import { esAlimentoCategoria, type Categoria } from "../../lib/categorias";

export interface Borrador {
  key: string;
  nombre: string;
  categoria: Categoria | "";
  /** Texto del stepper ("0,5"). */
  cantidad: string;
  unidad: string;
  /** "YYYY-MM-DD" o "". */
  fecha: string;
  /** Se devuelve tal como vino, para que el backend aprenda el producto. */
  codigo: string | null;
  precioTotal: number | null;
  precioUnitario: number | null;
  revisar: boolean;
  /** `es_alimento` del backend mientras no se toque la categoría; `null` si hay que deducirlo. */
  esAlimentoBackend: boolean | null;
  /** Los no alimentos se muestran colapsados hasta que el usuario los abre. */
  expandido: boolean;
}

let siguiente = 0;
const nuevaKey = () => `b${++siguiente}`;

function desdePropuesto(item: ItemPropuesto): Borrador {
  return {
    key: nuevaKey(),
    nombre: item.nombre,
    categoria: item.categoria,
    cantidad: cantidadAInput(item.cantidad),
    unidad: item.unidad || "unidad",
    fecha: "",
    codigo: item.codigo ?? null,
    precioTotal: item.precio_total ?? null,
    precioUnitario: item.precio_unitario ?? null,
    revisar: item.revisar,
    esAlimentoBackend: item.es_alimento,
    expandido: false,
  };
}

export function borradorVacio(): Borrador {
  return {
    key: nuevaKey(),
    nombre: "",
    categoria: "",
    cantidad: "1",
    unidad: "unidad",
    fecha: "",
    codigo: null,
    precioTotal: null,
    precioUnitario: null,
    revisar: false,
    esAlimentoBackend: null,
    expandido: true,
  };
}

/** Solo para agrupar en pantalla: al guardar, el backend recalcula es_alimento. */
export function esAlimento(b: Borrador): boolean {
  return b.esAlimentoBackend ?? esAlimentoCategoria(b.categoria || null);
}

/** Alimentos primero, luego los demás. El orden queda fijo mientras se edita. */
export function crearBorradores(items: readonly ItemPropuesto[]): Borrador[] {
  const todos = items.map(desdePropuesto);
  return [...todos.filter(esAlimento), ...todos.filter((b) => !esAlimento(b))];
}

/** Un agregado a mano va al final de los alimentos. */
export function insertarNuevo(lista: readonly Borrador[], nuevo: Borrador): Borrador[] {
  let pos = 0;
  lista.forEach((b, i) => {
    if (esAlimento(b)) pos = i + 1;
  });
  return [...lista.slice(0, pos), nuevo, ...lista.slice(pos)];
}

/** Primer problema que impide confirmar, o null. */
export function validar(lista: readonly Borrador[]): { key: string; campo: "nombre" | "cantidad"; mensaje: string } | null {
  for (const b of lista) {
    if (!b.nombre.trim()) return { key: b.key, campo: "nombre", mensaje: "Hay un producto sin nombre." };
    const n = parseCantidad(b.cantidad);
    if (n === null || n <= 0) {
      return {
        key: b.key,
        campo: "cantidad",
        mensaje: `Revisa la cantidad de ${b.nombre.trim()}: debe ser mayor que 0, por ejemplo 1 o 0,5.`,
      };
    }
  }
  return null;
}

/** Lo único que se manda al confirmar (ni precios, ni origen, ni revisar, ni es_alimento). Llamar tras validar(). */
export function aItemFactura(b: Borrador): ItemFactura {
  return {
    nombre: b.nombre.trim(),
    categoria: b.categoria || null,
    cantidad: parseCantidad(b.cantidad) ?? 0,
    unidad: b.unidad,
    fecha_vencimiento: b.fecha || null,
    codigo: b.codigo,
  };
}

/** id del input de un campo de una tarjeta, para poder enfocarlo desde la pantalla. */
export function idCampo(base: string, key: string, campo: "nombre" | "cantidad"): string {
  return `${base}-${key}-${campo}`;
}
