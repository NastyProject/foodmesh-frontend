import { CircleCheck } from "lucide-react";
import { Link } from "react-router";
import type { Factura } from "../../api/facturas";
import { buttonClasses } from "../../components/buttonStyles";
import { Cantidad } from "../../components/Cantidad";
import { SectionLabel } from "../../components/SectionLabel";
import { etiquetaCategoria } from "../../lib/categorias";
import { formatPesos } from "../../lib/dinero";
import { TiqueteResumen } from "./TiqueteResumen";

/** Solo lectura: lo que se confirmó ya vive en la despensa y se edita allá. */
export function FacturaConfirmada({ factura }: { factura: Factura }) {
  const items = factura.items_detectados;

  return (
    <div className="flex flex-col gap-3.5 px-5 pb-6">
      <TiqueteResumen factura={factura} />

      <div role="status" className="flex flex-col gap-3 rounded-xl border border-line bg-surface px-4 py-4">
        <p className="m-0 flex items-center gap-2 text-[15px] font-semibold">
          <CircleCheck size={20} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-brand" />
          Esta factura ya está en tu despensa
        </p>
        <Link to="/despensa" className={buttonClasses("primary", "w-full")}>
          Ir a la despensa
        </Link>
      </div>

      {items.length > 0 && (
        <section className="mt-1 flex flex-col gap-2" aria-labelledby="leidos">
          <SectionLabel id="leidos">Productos que se leyeron</SectionLabel>
          <ul className="m-0 list-none overflow-hidden rounded-xl border border-line bg-surface p-0">
            {items.map((item, i) => {
              const categoria = etiquetaCategoria(item.categoria);
              return (
                <li key={`${item.codigo ?? item.nombre}-${i}`} className="flex items-center gap-3 border-b border-divider px-4 py-3 last:border-b-0">
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[15px] font-semibold">{item.nombre}</span>
                    <span className="text-[13px] text-muted">
                      {categoria && <>{categoria} · </>}
                      <Cantidad cantidad={item.cantidad} unidad={item.unidad} />
                    </span>
                  </span>
                  {item.precio_total != null && (
                    <span className="font-mono text-[14px]">{formatPesos(item.precio_total)}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
