export function PagePlaceholder({ title }: { title: string }) {
  return (
    <header className="px-5 pt-7 pb-4">
      <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">{title}</h1>
    </header>
  );
}
