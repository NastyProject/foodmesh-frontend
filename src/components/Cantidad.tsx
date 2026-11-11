import { abreviarUnidad, formatCantidad } from "../lib/cantidad";

interface CantidadProps {
  cantidad: number;
  /** Sin unidad (ej. ingredientes de la IA): solo el número. */
  unidad?: string | null;
}

/**
 * "1 und": el número en mono y la unidad en el texto normal.
 * Todo en mono, el espacio ocupa un carácter entero y se lee como doble.
 */
export function Cantidad({ cantidad, unidad }: CantidadProps) {
  const texto = unidad ? abreviarUnidad(unidad) : "";
  return (
    <span className="whitespace-nowrap">
      <span className="font-mono">{formatCantidad(cantidad)}</span>
      {texto && ` ${texto}`}
    </span>
  );
}
