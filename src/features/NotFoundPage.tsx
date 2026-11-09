import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-2 px-5 pt-7">
      <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">No encontramos esta página</h1>
      <p className="m-0 text-ink-2">Puede que el enlace esté mal escrito.</p>
      <Link to="/despensa" className="flex min-h-11 items-center font-semibold">
        Ir a la despensa
      </Link>
    </div>
  );
}
