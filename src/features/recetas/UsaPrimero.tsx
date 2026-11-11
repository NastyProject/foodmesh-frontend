import { Timer } from "lucide-react";
import { Fragment } from "react";
import type { ProximoAVencer } from "../../api/recetas";
import { textoDiasParaVencer } from "../../lib/fechas";

interface UsaPrimeroProps {
  items: ProximoAVencer[];
  /** "franja": encabezado de la tarjeta abierta. "linea": texto en la tarjeta compacta. */
  variante: "franja" | "linea";
}

export function UsaPrimero({ items, variante }: UsaPrimeroProps) {
  if (items.length === 0) return null;

  const texto = (
    <span>
      <strong>Usa primero:</strong>{" "}
      {items.map((item, i) => (
        <Fragment key={item.item_id}>
          {i > 0 && ", "}
          {item.nombre} <span className="font-mono">({textoDiasParaVencer(item.dias_para_vencer)})</span>
        </Fragment>
      ))}
    </span>
  );

  if (variante === "linea") return <p className="m-0 text-[13px] text-urgent-text">{texto}</p>;

  return (
    <div className="flex items-center gap-2 bg-urgent-bg px-4 py-2.5 text-[13px] text-urgent-text">
      <Timer size={16} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
      {texto}
    </div>
  );
}
