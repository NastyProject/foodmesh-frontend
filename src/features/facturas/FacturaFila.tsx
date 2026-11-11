import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { Factura } from "../../api/facturas";
import { formatPesos } from "../../lib/dinero";
import { formatFechaCorta } from "../../lib/fechas";
import { EstadoFacturaBadge } from "./EstadoFacturaBadge";

export function FacturaFila({ factura }: { factura: Factura }) {
  const total = factura.total_impreso ?? factura.total_calculado;
  const n = factura.items_detectados.length;

  return (
    <li className="border-b border-divider last:border-b-0">
      <Link
        to={`/facturas/${factura.id}`}
        className="flex min-h-[64px] items-center gap-3 py-3 pr-2 pl-4 text-ink no-underline hover:bg-paper hover:text-ink"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={`truncate text-[15px] font-semibold ${factura.supermercado ? "" : "text-ink-2"}`}>
            {factura.supermercado ?? "Supermercado sin detectar"}
          </span>
          <span className="text-[13px] text-muted">
            <span className="font-mono">{factura.fecha_compra ? formatFechaCorta(factura.fecha_compra) : "Sin fecha"}</span>
            {n > 0 && (
              <>
                {" · "}
                <span className="font-mono">{n}</span> {n === 1 ? "producto" : "productos"}
              </>
            )}
          </span>
        </span>
        <span className="flex flex-col items-end gap-1">
          {total !== null && <span className="font-mono text-[14px] font-medium">{formatPesos(total)}</span>}
          <EstadoFacturaBadge estado={factura.estado} />
        </span>
        <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-muted" />
      </Link>
    </li>
  );
}
