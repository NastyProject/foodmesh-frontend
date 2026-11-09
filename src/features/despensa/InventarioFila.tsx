import type { Item } from "../../api/inventario";
import { ExpiryBadge } from "../../components/ExpiryBadge";
import { textoCantidad } from "../../lib/cantidad";
import { etiquetaCategoria } from "../../lib/categorias";
import { estadoVencimiento, type EstadoVencimiento } from "../../lib/fechas";

const FRANJA: Record<EstadoVencimiento["tipo"], string> = {
  vencido: "bg-urgent-stripe",
  hoy: "bg-urgent-stripe",
  pronto: "bg-soon-stripe",
  lejos: "bg-brand",
  sin_fecha: "bg-nodate-stripe",
};

interface InventarioFilaProps {
  item: Item;
  hoy: Date;
  onEditar: (item: Item, enfocarFecha: boolean) => void;
}

export function InventarioFila({ item, hoy, onEditar }: InventarioFilaProps) {
  const fecha = item.fecha_vencimiento ?? null;
  const estado = estadoVencimiento(fecha, hoy);
  const categoria = etiquetaCategoria(item.categoria);

  return (
    <li className="flex items-stretch border-b border-divider last:border-b-0">
      <span aria-hidden="true" className={`w-1 shrink-0 rounded-r-[2px] ${FRANJA[estado.tipo]}`} />
      <button
        type="button"
        onClick={() => onEditar(item, false)}
        className="flex min-h-[60px] min-w-0 flex-1 items-center gap-3 py-3 pr-3.5 pl-3 text-left hover:bg-paper"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[15px] font-semibold">{item.nombre}</span>
          <span className="text-[13px] text-muted">
            {categoria && <>{categoria} · </>}
            <span className="font-mono">{textoCantidad(item.cantidad, item.unidad)}</span>
          </span>
        </span>
        <ExpiryBadge estado={estado} />
      </button>
      {estado.tipo === "sin_fecha" && (
        <div className="flex items-center pr-3.5">
          <button
            type="button"
            onClick={() => onEditar(item, true)}
            aria-label={`Agregar fecha de vencimiento a ${item.nombre}`}
            className="h-11 rounded-[6px] border border-dashed border-dashed-line bg-transparent px-2.5 text-[13px] text-ink-2 hover:bg-sunken"
          >
            + Fecha
          </button>
        </div>
      )}
    </li>
  );
}
