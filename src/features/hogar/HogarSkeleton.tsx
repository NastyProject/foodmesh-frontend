const CAMPOS = [0, 1, 2, 3];

export function HogarSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Cargando tus preferencias…</span>
      {CAMPOS.map((i) => (
        <div key={i} aria-hidden="true" className="flex flex-col gap-2">
          <div className="h-4 w-24 animate-pulse rounded bg-sunken" />
          <div className="h-12 w-full animate-pulse rounded-[10px] bg-sunken" />
        </div>
      ))}
      <div aria-hidden="true" className="h-[52px] w-full animate-pulse rounded-xl bg-sunken" />
    </div>
  );
}
