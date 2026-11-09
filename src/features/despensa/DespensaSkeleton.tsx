const FILAS = [0, 1, 2, 3, 4];

export function DespensaSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-2">
      <span className="sr-only">Cargando tu despensa…</span>
      <div aria-hidden="true" className="h-4 w-28 animate-pulse rounded bg-sunken" />
      <ul aria-hidden="true" className="m-0 list-none overflow-hidden rounded-xl border border-line bg-surface p-0">
        {FILAS.map((i) => (
          <li key={i} className="flex items-center gap-3 border-b border-divider py-3 pr-3.5 pl-4 last:border-b-0">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="h-4 w-2/5 animate-pulse rounded bg-sunken" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-sunken" />
            </div>
            <div className="h-6 w-14 animate-pulse rounded-[6px] bg-sunken" />
          </li>
        ))}
      </ul>
    </div>
  );
}
