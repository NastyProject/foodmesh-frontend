import type { Factura } from "../../api/facturas";
import { formatPesos } from "../../lib/dinero";

export type AvisoFacturaDato =
  | { tipo: "texto"; clave: string; texto: string }
  /** El número va aparte para pintarlo en mono. */
  | { tipo: "descartados"; clave: string; n: number };

function textoPrincipal(factura: Factura): string | null {
  if (factura.estado === "error") {
    const motivo = factura.error?.trim() || "No pudimos leer los productos de esta factura.";
    return `${motivo} Agrega los productos a mano y confirma.`;
  }
  if (!factura.requiere_revision) return null;
  const { total_impreso: impreso, total_calculado: detectado } = factura;
  if (impreso === null || detectado === null) {
    return "No pudimos comparar los totales: revisa que no falte ningún producto.";
  }
  return `El total no coincide (impreso ${formatPesos(impreso)}, detectado ${formatPesos(detectado)}): revisa que no falte ningún producto.`;
}

/** Avisos ámbar sobre la lista de productos, en orden de importancia. */
export function avisosFactura(factura: Factura): AvisoFacturaDato[] {
  const avisos: AvisoFacturaDato[] = [];
  const principal = textoPrincipal(factura);
  if (principal) avisos.push({ tipo: "texto", clave: "principal", texto: principal });
  if (factura.items_descartados > 0) {
    avisos.push({ tipo: "descartados", clave: "descartados", n: factura.items_descartados });
  }
  return avisos;
}

/** Reintentar con la imagen solo tiene sentido si el texto no alcanzó (avisos, sección 5). */
export function puedeReprocesar(factura: Factura): boolean {
  return factura.estado !== "confirmada" && (factura.requiere_revision || factura.estado === "error");
}
