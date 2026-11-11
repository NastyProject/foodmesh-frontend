import { TriangleAlert } from "lucide-react";
import type { Factura } from "../../api/facturas";
import { formatPesos } from "../../lib/dinero";

function texto(factura: Factura): string | null {
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

/** Aviso ámbar sobre la lista: factura con error o totales que no cuadran. */
export function AvisoFactura({ factura }: { factura: Factura }) {
  const mensaje = texto(factura);
  if (!mensaje) return null;
  return (
    <div role="status" className="flex items-start gap-2.5 rounded-[10px] bg-soon-bg px-3.5 py-3 text-[14px] text-notice-text">
      <TriangleAlert size={18} strokeWidth={1.8} aria-hidden="true" className="mt-px shrink-0" />
      <span>{mensaje}</span>
    </div>
  );
}
