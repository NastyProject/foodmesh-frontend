import type { components } from "../api/schema";

export type Categoria = NonNullable<components["schemas"]["ItemOut"]["categoria"]>;

// Lista cerrada del backend (avisos, sección 4). El Record obliga a cubrir todas.
const ETIQUETAS: Record<Categoria, string> = {
  lacteos: "Lácteos",
  carnes_pescados: "Carnes y pescados",
  frutas_verduras: "Frutas y verduras",
  granos_cereales: "Granos y cereales",
  enlatados_conservas: "Enlatados y conservas",
  panaderia: "Panadería",
  bebidas: "Bebidas",
  condimentos_especias: "Condimentos y especias",
  frutos_secos: "Frutos secos",
  snacks_dulces: "Snacks y dulces",
  congelados: "Congelados",
  aseo_hogar: "Aseo del hogar",
  cuidado_personal: "Cuidado personal",
  mascotas: "Mascotas",
  otros: "Otros",
};

export const CATEGORIAS: readonly { valor: Categoria; etiqueta: string }[] = (
  Object.keys(ETIQUETAS) as Categoria[]
).map((valor) => ({ valor, etiqueta: ETIQUETAS[valor] }));

export function esCategoria(valor: string): valor is Categoria {
  return Object.hasOwn(ETIQUETAS, valor);
}

export function etiquetaCategoria(categoria: Categoria | null | undefined): string | null {
  return categoria ? ETIQUETAS[categoria] : null;
}
