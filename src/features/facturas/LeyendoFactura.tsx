import { ReceiptText } from "lucide-react";

const RENGLONES = ["w-4/5", "w-3/5", "w-2/3", "w-1/2"];

/** Pantalla completa mientras sube la foto: el OCR y la IA corren dentro de la misma petición. */
export function LeyendoFactura() {
  return (
    <div className="fixed inset-0 z-30 bg-paper">
      <div
        role="status"
        aria-live="polite"
        className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-6 px-5 py-10"
      >
        <div className="flex flex-col gap-2">
          <ReceiptText size={28} strokeWidth={1.8} aria-hidden="true" className="text-ink-2" />
          <h2 className="m-0 text-[22px] font-bold tracking-tight">Leyendo tu factura…</h2>
          <p className="m-0 text-[15px] text-muted">Puede tardar unos segundos. No cierres esta pantalla.</p>
        </div>
        <div aria-hidden="true" className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
          <div className="flex justify-between">
            <div className="h-4 w-16 animate-pulse rounded bg-sunken" />
            <div className="h-4 w-24 animate-pulse rounded bg-sunken" />
          </div>
          <div className="border-t border-dashed border-line-strong" />
          {RENGLONES.map((ancho) => (
            <div key={ancho} className="flex justify-between gap-6">
              <div className={`h-3.5 animate-pulse rounded bg-sunken ${ancho}`} />
              <div className="h-3.5 w-14 animate-pulse rounded bg-sunken" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
