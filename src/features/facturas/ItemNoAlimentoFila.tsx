import { Pencil } from "lucide-react";
import { etiquetaCategoria } from "../../lib/categorias";
import { formatPesos } from "../../lib/dinero";
import type { Borrador } from "./borrador";

interface ItemNoAlimentoFilaProps {
  borrador: Borrador;
  disabled: boolean;
  onEditar: () => void;
}

/** No alimento colapsado: entra a la despensa (pestaña Otros), pero no se usa en recetas. */
export function ItemNoAlimentoFila({ borrador: b, disabled, onEditar }: ItemNoAlimentoFilaProps) {
  return (
    <article
      aria-label={b.nombre}
      className={`flex items-center gap-2.5 rounded-xl bg-sunken py-3 pr-1.5 pl-3.5 ${
        b.revisar ? "border-2 border-soon-stripe" : "border border-line"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[15px] font-semibold">{b.nombre}</span>
        <span className="text-[13px] text-muted">{etiquetaCategoria(b.categoria || null)} · no se usa en recetas</span>
        {b.revisar && <span className="text-[12px] font-semibold text-notice-text">Revisa cantidad × precio</span>}
      </div>
      {b.precioTotal !== null && <span className="font-mono text-[14px]">{formatPesos(b.precioTotal)}</span>}
      <button
        type="button"
        aria-label={`Editar ${b.nombre}`}
        disabled={disabled}
        onClick={onEditar}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-ink-2 hover:bg-line disabled:opacity-40"
      >
        <Pencil size={18} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </article>
  );
}
