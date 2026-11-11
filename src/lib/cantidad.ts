// Cantidades y unidades del inventario. En pantalla van en formato es-CO (coma decimal).

export const UNIDADES = ["unidad", "g", "kg", "ml", "l", "paquete"] as const;

const ABREVIATURAS: Record<string, string> = { unidad: "und", paquete: "paq" };

const formato = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });

export function formatCantidad(cantidad: number): string {
  return formato.format(cantidad);
}

/** "und", "paq", "kg". Quita espacios sobrantes (las unidades de facturas pueden traerlos). */
export function abreviarUnidad(unidad: string): string {
  const limpia = unidad.trim();
  return ABREVIATURAS[limpia] ?? limpia;
}

/** "200 g", "1 und", "0,8 kg". */
export function textoCantidad(cantidad: number, unidad: string): string {
  return `${formatCantidad(cantidad)} ${abreviarUnidad(unidad)}`;
}

/** Paso del stepper: de a 100 en gramos y mililitros, de a 1 en el resto. */
export function pasoCantidad(unidad: string): number {
  return unidad === "g" || unidad === "ml" ? 100 : 1;
}

/** Lee lo que escribió el usuario. Acepta coma o punto decimal. `null` si no es un número. */
export function parseCantidad(texto: string): number | null {
  const limpio = texto.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(limpio)) return null;
  return Number(limpio);
}

/** Número → texto para el input (coma decimal, sin separador de miles). */
export function cantidadAInput(cantidad: number): string {
  return String(redondear(cantidad)).replace(".", ",");
}

/** Evita 0.30000000000000004 al sumar pasos a decimales. */
export function redondear(cantidad: number): number {
  return Math.round(cantidad * 1000) / 1000;
}
