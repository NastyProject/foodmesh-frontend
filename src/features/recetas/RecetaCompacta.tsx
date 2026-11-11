import type { Receta } from "../../api/recetas";
import { metaCompacta } from "./meta";
import { UsaPrimero } from "./UsaPrimero";

interface RecetaCompactaProps {
  receta: Receta;
  onAbrir: () => void;
  ocupado: boolean;
}

export function RecetaCompacta({ receta, onAbrir, ocupado }: RecetaCompactaProps) {
  return (
    // El clic en toda la tarjeta es un atajo para el dedo; el botón es el control accesible.
    <article
      onClick={ocupado ? undefined : onAbrir}
      className={`flex flex-col gap-1.5 rounded-[14px] border border-line bg-surface px-4 py-3.5 ${
        ocupado ? "" : "cursor-pointer"
      }`}
    >
      <UsaPrimero items={receta.usa_proximos_a_vencer} variante="linea" />
      <h2 className="m-0 text-[17px] leading-[1.3] font-bold">{receta.titulo}</h2>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[12px] tracking-[0.06em] text-muted">{metaCompacta(receta)}</span>
        <button
          type="button"
          aria-expanded={false}
          disabled={ocupado}
          onClick={(e) => {
            e.stopPropagation();
            onAbrir();
          }}
          className="h-11 shrink-0 border-none bg-transparent px-1 text-[14px] font-semibold text-brand hover:text-brand-strong disabled:cursor-not-allowed"
        >
          Ver receta
        </button>
      </div>
    </article>
  );
}
