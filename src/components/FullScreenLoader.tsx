export function FullScreenLoader({ label }: { label: string }) {
  return (
    <div role="status" className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-3 px-5 pt-7">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="h-3 w-32 animate-pulse rounded bg-sunken" />
      <div aria-hidden="true" className="h-8 w-48 animate-pulse rounded bg-sunken" />
      <div aria-hidden="true" className="mt-4 h-40 animate-pulse rounded-xl bg-sunken" />
    </div>
  );
}
