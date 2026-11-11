import type { Ingrediente, Receta } from "../../api/recetas";
import { formatCantidad, textoCantidad } from "../../lib/cantidad";

/** "20 MIN · 2 PORCIONES". */
export function metaReceta(receta: Receta): string {
  const porciones = receta.porciones === 1 ? "1 PORCIÓN" : `${receta.porciones} PORCIONES`;
  return `${receta.tiempo_minutos} MIN · ${porciones}`;
}

/** "30 MIN · TIENES 5 DE 7": ingredientes que están en el inventario sobre el total. */
export function metaCompacta(receta: Receta): string {
  const tienes = receta.ingredientes.filter((i) => i.item_id !== null).length;
  return `${receta.tiempo_minutos} MIN · TIENES ${tienes} DE ${receta.ingredientes.length}`;
}

/** Cantidad del ingrediente para mostrar a la derecha, o null si la IA no la dio. */
export function textoIngrediente(ingrediente: Ingrediente): string | null {
  if (ingrediente.cantidad === null) return null;
  if (!ingrediente.unidad) return formatCantidad(ingrediente.cantidad);
  return textoCantidad(ingrediente.cantidad, ingrediente.unidad);
}
