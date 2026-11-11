import { Link } from "react-router";
import { PageHeader } from "../components/PageHeader";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col">
      <PageHeader title="No encontramos esta página">
        <p className="m-0 text-ink-2">Puede que el enlace esté mal escrito.</p>
      </PageHeader>
      <div className="px-5">
        <Link to="/despensa" className="flex min-h-11 items-center font-semibold">
          Ir a la despensa
        </Link>
      </div>
    </div>
  );
}
