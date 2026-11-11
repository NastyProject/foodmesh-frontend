import { ChevronDown } from "lucide-react";
import type { Factura } from "../../api/facturas";
import { BordeDentado } from "../../components/BordeDentado";
import { formatPesos } from "../../lib/dinero";
import { formatFechaCorta } from "../../lib/fechas";

export function TiqueteResumen({ factura }: { factura: Factura }) {
  const { total_impreso: impreso, total_calculado: detectado } = factura;
  const difieren = impreso !== null && detectado !== null && impreso !== detectado;

  return (
    <section
      aria-label="Resumen de la factura"
      className="relative mb-2 flex flex-col gap-2.5 rounded-t-xl border border-line bg-surface px-4 pt-4 pb-3.5 font-mono"
    >
      <div className="flex justify-between gap-3 text-[14px]">
        <span className={`font-semibold ${factura.supermercado ? "" : "text-ink-2"}`}>
          {factura.supermercado ?? "Supermercado sin detectar"}
        </span>
        <span className="text-muted">{factura.fecha_compra ? formatFechaCorta(factura.fecha_compra) : "Sin fecha"}</span>
      </div>
      <div className="border-t border-dashed border-line-strong" />
      <div className="grid grid-cols-2 gap-2">
        {[
          { etiqueta: "TOTAL IMPRESO", valor: impreso, destacar: false },
          { etiqueta: "DETECTADO", valor: detectado, destacar: difieren },
        ].map(({ etiqueta, valor, destacar }) => (
          <div key={etiqueta} className="flex flex-col gap-0.5">
            <span className="text-[11px] tracking-[0.08em] text-muted">{etiqueta}</span>
            <span className={`text-[17px] font-semibold ${destacar ? "text-soon-text" : ""}`}>
              {valor === null ? "—" : formatPesos(valor)}
            </span>
          </div>
        ))}
      </div>
      {factura.texto_ocr && (
        <details className="group font-sans">
          <summary className="flex h-11 w-fit cursor-pointer list-none items-center gap-1 text-[13px] font-semibold text-brand hover:text-brand-strong [&::-webkit-details-marker]:hidden">
            Ver texto leído
            <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" className="transition-transform group-open:rotate-180" />
          </summary>
          <pre className="m-0 mt-1 max-h-72 overflow-auto rounded-[8px] bg-paper p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-ink-2">
            {factura.texto_ocr}
          </pre>
        </details>
      )}
      <BordeDentado />
    </section>
  );
}
