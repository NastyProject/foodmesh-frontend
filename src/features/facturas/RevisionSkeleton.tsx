const TARJETAS = [0, 1, 2];

export function RevisionSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-3.5 px-5 pb-6">
      <span className="sr-only">Cargando la factura…</span>
      <div aria-hidden="true" className="flex flex-col gap-3 rounded-t-xl border border-line bg-surface p-4">
        <div className="flex justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-sunken" />
          <div className="h-4 w-24 animate-pulse rounded bg-sunken" />
        </div>
        <div className="border-t border-dashed border-line-strong" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 w-24 animate-pulse rounded bg-sunken" />
          <div className="h-9 w-24 animate-pulse rounded bg-sunken" />
        </div>
      </div>
      {TARJETAS.map((i) => (
        <div key={i} aria-hidden="true" className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-3.5">
          <div className="h-12 w-full animate-pulse rounded-[10px] bg-sunken" />
          <div className="grid grid-cols-2 gap-2.5">
            <div className="h-12 animate-pulse rounded-[10px] bg-sunken" />
            <div className="h-12 animate-pulse rounded-[10px] bg-sunken" />
          </div>
        </div>
      ))}
    </div>
  );
}
