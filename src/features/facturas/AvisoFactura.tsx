import { TriangleAlert } from "lucide-react";
import type { Factura } from "../../api/facturas";
import { avisosFactura } from "./avisos";

/** Avisos ámbar sobre la lista: factura con error, totales que no cuadran, líneas descartadas. */
export function AvisoFactura({ factura }: { factura: Factura }) {
  const avisos = avisosFactura(factura);
  if (avisos.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {avisos.map((aviso) => (
        <div
          key={aviso.clave}
          role="status"
          className="flex items-start gap-2.5 rounded-[10px] bg-soon-bg px-3.5 py-3 text-[14px] text-notice-text"
        >
          <TriangleAlert size={18} strokeWidth={1.8} aria-hidden="true" className="mt-px shrink-0" />
          {aviso.tipo === "texto" ? (
            <span>{aviso.texto}</span>
          ) : (
            <span>
              Descartamos <span className="font-mono font-semibold">{aviso.n}</span>{" "}
              {aviso.n === 1 ? "línea que no pudimos confirmar" : "líneas que no pudimos confirmar"} en la factura.
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
