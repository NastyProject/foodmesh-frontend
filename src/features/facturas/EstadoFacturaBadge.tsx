import type { EstadoFactura } from "../../api/facturas";

const badge = "rounded-[6px] px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap";

export function EstadoFacturaBadge({ estado }: { estado: EstadoFactura }) {
  switch (estado) {
    case "pendiente_validacion":
      return <span className={`${badge} bg-soon-bg text-soon-text`}>Pendiente</span>;
    case "error":
      return <span className={`${badge} bg-urgent-bg text-urgent-text`}>Con error</span>;
    case "confirmada":
      return <span className="text-[12px] whitespace-nowrap text-muted">En tu despensa</span>;
  }
}
