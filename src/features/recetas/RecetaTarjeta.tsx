import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Receta } from "../../api/recetas";
import { FeedbackReceta } from "./FeedbackReceta";
import { metaReceta, textoIngrediente } from "./meta";
import { PasosReceta } from "./PasosReceta";
import { UsaPrimero } from "./UsaPrimero";

const etiqueta = "m-0 text-[12px] font-semibold tracking-[0.06em] text-muted uppercase";

interface RecetaTarjetaProps {
  receta: Receta;
  /** Mover el foco al título al abrirse (cuando la abrió el usuario, no al cargar). */
  enfocar: boolean;
  voto: boolean | undefined;
  onVotar: (util: boolean) => void;
  errorVoto: string | null;
  ocupado: boolean;
}

export function RecetaTarjeta({ receta, enfocar, voto, onVotar, errorVoto, ocupado }: RecetaTarjetaProps) {
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const tienes = receta.ingredientes.filter((i) => i.item_id !== null);

  useEffect(() => {
    if (enfocar) tituloRef.current?.focus();
  }, [enfocar]);

  return (
    <article className="overflow-hidden rounded-[14px] border border-line bg-surface">
      <UsaPrimero items={receta.usa_proximos_a_vencer} variante="franja" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <h2
            ref={tituloRef}
            tabIndex={-1}
            className="m-0 text-[20px] leading-[1.25] font-bold tracking-[-0.01em] outline-none"
          >
            {receta.titulo}
          </h2>
          <p className="m-0 text-[14px] leading-[1.45] text-ink-2">{receta.por_que}</p>
          <span className="font-mono text-[12px] tracking-[0.06em] text-muted">{metaReceta(receta)}</span>
        </div>

        <div className="border-t border-dashed border-line-strong" />

        <div className="flex flex-col gap-2">
          <h3 className={etiqueta}>Ingredientes</h3>
          {tienes.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[14px]">
              {tienes.map((ing, i) => {
                const cantidad = textoIngrediente(ing);
                return (
                  <li key={`${ing.item_id}-${i}`} className="flex items-center gap-2">
                    <Check
                      size={16}
                      strokeWidth={2.4}
                      role="img"
                      aria-label="Lo tienes"
                      className="shrink-0 text-brand"
                    />
                    <span className="flex-1">{ing.nombre}</span>
                    {cantidad && <span className="font-mono text-muted">{cantidad}</span>}
                  </li>
                );
              })}
            </ul>
          )}
          {receta.ingredientes_faltantes.length > 0 && (
            <div className="flex flex-col gap-1 rounded-lg bg-paper px-3 py-2.5">
              <span className={etiqueta}>Te falta</span>
              <span className="text-[14px]">{receta.ingredientes_faltantes.join(", ")}</span>
            </div>
          )}
        </div>

        <PasosReceta pasos={receta.pasos} />

        <FeedbackReceta voto={voto} onVotar={onVotar} error={errorVoto} disabled={ocupado} />
      </div>
    </article>
  );
}
