import { Link } from "react-router";
import { usePreferencias } from "../../api/preferencias";
import { ETIQUETAS_DIETA } from "../../lib/preferencias";

export function ResumenPreferencias() {
  const preferencias = usePreferencias();

  if (preferencias.isPending) {
    return (
      <div role="status" className="flex h-5 items-center">
        <span className="sr-only">Cargando tus preferencias…</span>
        <div aria-hidden="true" className="h-3.5 w-56 animate-pulse rounded bg-sunken" />
      </div>
    );
  }

  if (preferencias.isError) {
    return (
      <p className="m-0 text-[14px]">
        <Link to="/hogar" className="font-semibold">
          Editar preferencias
        </Link>
      </p>
    );
  }

  const { dieta, porciones, tiempo_max_minutos: tiempo } = preferencias.data;

  return (
    <p className="m-0 text-[14px] text-muted">
      {ETIQUETAS_DIETA[dieta]} · <span className="font-mono">{porciones}</span>{" "}
      {porciones === 1 ? "porción" : "porciones"} ·{" "}
      {tiempo == null ? (
        "sin límite de tiempo"
      ) : (
        <>
          máx. <span className="font-mono">{tiempo}</span> min
        </>
      )}{" "}
      ·{" "}
      <Link to="/hogar" className="font-semibold">
        Editar
      </Link>
    </p>
  );
}
