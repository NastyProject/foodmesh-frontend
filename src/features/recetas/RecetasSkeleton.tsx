import { useEffect, useState } from "react";

const MS_TARDANDO = 10_000;
const RENGLONES = ["w-3/5", "w-1/2", "w-2/3"];

export function RecetasSkeleton() {
  const [tardando, setTardando] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setTardando(true), MS_TARDANDO);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div role="status" aria-live="polite" className="flex flex-col gap-0.5">
        <p className="m-0 text-[15px] font-semibold">Pensando recetas…</p>
        {tardando && <p className="m-0 text-[14px] text-muted">Esto puede tardar un poco más la primera vez.</p>}
      </div>
      <div aria-hidden="true" className="overflow-hidden rounded-[14px] border border-line bg-surface">
        <div className="h-10 bg-sunken" />
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-4/5 animate-pulse rounded bg-sunken" />
            <div className="h-3.5 w-full animate-pulse rounded bg-sunken" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-sunken" />
          </div>
          <div className="border-t border-dashed border-line-strong" />
          {RENGLONES.map((ancho) => (
            <div key={ancho} className="flex justify-between gap-6">
              <div className={`h-3.5 animate-pulse rounded bg-sunken ${ancho}`} />
              <div className="h-3.5 w-12 animate-pulse rounded bg-sunken" />
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="h-[88px] animate-pulse rounded-[14px] border border-line bg-surface" />
    </div>
  );
}
