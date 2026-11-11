const FILAS = [0, 1, 2, 3];

export function FacturasSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Cargando tus facturas…</span>
      <ul aria-hidden="true" className="m-0 list-none overflow-hidden rounded-xl border border-line bg-surface p-0">
        {FILAS.map((i) => (
          <li key={i} className="flex items-center gap-3 border-b border-divider py-3.5 pr-4 pl-4 last:border-b-0">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-sunken" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-sunken" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-4 w-16 animate-pulse rounded bg-sunken" />
              <div className="h-4 w-14 animate-pulse rounded-[6px] bg-sunken" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
