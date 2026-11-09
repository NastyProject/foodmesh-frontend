import type { EstadoVencimiento } from "../lib/fechas";

const badge = "rounded-[6px] px-2 py-1 font-mono text-[13px] font-semibold whitespace-nowrap";

export function ExpiryBadge({ estado }: { estado: EstadoVencimiento }) {
  switch (estado.tipo) {
    case "vencido":
    case "hoy":
      return <span className={`${badge} bg-urgent text-surface`}>{estado.etiqueta}</span>;
    case "pronto":
      return <span className={`${badge} bg-soon-bg text-soon-text`}>{estado.etiqueta}</span>;
    case "lejos":
      return <span className="font-mono text-[13px] whitespace-nowrap text-ink-2">{estado.etiqueta}</span>;
    case "sin_fecha":
      return null;
  }
}
