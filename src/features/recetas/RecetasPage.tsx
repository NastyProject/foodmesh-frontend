import { RefreshCw, ScanLine } from "lucide-react";
import { Link } from "react-router";
import { ApiError } from "../../api/client";
import { useOtrasRecetas, useRecetas } from "../../api/recetas";
import { Button } from "../../components/Button";
import { buttonClasses } from "../../components/buttonStyles";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { EscanearFactura } from "../facturas/EscanearFactura";
import { AvisoRecetas } from "./AvisoRecetas";
import { RecetasLista } from "./RecetasLista";
import { RecetasSkeleton } from "./RecetasSkeleton";
import { ResumenPreferencias } from "./ResumenPreferencias";

const icono = { size: 18, strokeWidth: 1.8, "aria-hidden": true } as const;

export function RecetasPage() {
  const recetas = useRecetas();
  const otras = useOtrasRecetas();

  // Reintentar tras un error puede tardar lo mismo que la primera vez: se muestra igual.
  const cargando = recetas.isPending || (recetas.isError && recetas.isFetching);
  // Con recetas en pantalla: "Otras recetas" o un refetch tras invalidar (cambió el inventario).
  const ocupado = otras.isPending || (recetas.isSuccess && recetas.isFetching);

  const botonOtras = (
    <Button variant="secondary" className="w-full" onClick={() => otras.mutate()} disabled={ocupado}>
      <RefreshCw {...icono} />
      {otras.isPending ? "Buscando otras…" : "Otras recetas"}
    </Button>
  );

  const errorOtras = otras.isError && !otras.isPending && (
    <p role="alert" className="m-0 text-[14px] text-urgent">
      {otras.error.message}
    </p>
  );

  function contenido(escanear: () => void, subiendo: boolean) {
    if (cargando) return <RecetasSkeleton />;

    if (recetas.isError) {
      const { error } = recetas;
      if (error instanceof ApiError && error.status === 409) {
        return (
          <EmptyState title="Aún no hay comida para cocinar" text={error.detail}>
            <Button className="w-full" onClick={escanear} disabled={subiendo}>
              <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
              Escanear factura
            </Button>
            <Link to="/despensa?nuevo=1" className={buttonClasses("secondary", "w-full")}>
              Agregar a mano
            </Link>
          </EmptyState>
        );
      }
      return (
        <ErrorState message={error.message} onRetry={() => void recetas.refetch()} retryLabel="Intentar de nuevo" />
      );
    }

    const { data } = recetas;
    return (
      <>
        <AvisoRecetas texto={data.aviso} />
        {data.recetas.length === 0 ? (
          <EmptyState title="Sin recetas por ahora" text={data.mensaje ?? undefined}>
            {errorOtras}
            {botonOtras}
            <Link to="/hogar" className={buttonClasses("secondary", "w-full")}>
              Editar preferencias
            </Link>
          </EmptyState>
        ) : (
          <>
            <RecetasLista key={data.recomendacion_id} recomendacion={data} ocupado={ocupado} />
            {errorOtras}
            {botonOtras}
          </>
        )}
      </>
    );
  }

  return (
    <EscanearFactura>
      {(escanear, subiendo) => (
        <>
          <header className="flex flex-col gap-1 px-5 pt-7 pb-3.5">
            <span className="font-mono text-[12px] tracking-[0.08em] text-muted">CON LO QUE TIENES</span>
            <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">Recetas</h1>
            <ResumenPreferencias />
          </header>
          <div className="flex flex-col gap-3 px-5 pb-6">{contenido(escanear, subiendo)}</div>
        </>
      )}
    </EscanearFactura>
  );
}
