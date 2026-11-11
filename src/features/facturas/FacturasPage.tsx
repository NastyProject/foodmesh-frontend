import { ScanLine } from "lucide-react";
import { useFacturas } from "../../api/facturas";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { EscanearFactura } from "./EscanearFactura";
import { FacturaFila } from "./FacturaFila";
import { FacturasSkeleton } from "./FacturasSkeleton";

const etiquetaSeccion = "m-0 text-[13px] font-semibold tracking-[0.06em] text-muted uppercase";

export function FacturasPage() {
  const facturas = useFacturas();
  const lista = facturas.data ?? [];
  const pendientes = lista.filter((f) => f.estado !== "confirmada").length;

  return (
    <EscanearFactura>
      {(escanear, subiendo) => (
        <>
          <header className="flex flex-col gap-1 px-5 pt-7 pb-4">
            <span className="flex h-11 items-center font-mono text-[12px] tracking-[0.08em] text-muted">
              FOODMESH · HOGAR
            </span>
            <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">Facturas</h1>
            {facturas.isSuccess && lista.length > 0 && (
              <p className="m-0 text-[14px] text-muted">
                <span className="font-mono">{lista.length}</span> {lista.length === 1 ? "factura" : "facturas"}
                {pendientes > 0 && (
                  <>
                    {" · "}
                    <span className="font-semibold text-soon-text">
                      <span className="font-mono">{pendientes}</span> por revisar
                    </span>
                  </>
                )}
              </p>
            )}
          </header>

          <div className="flex flex-col gap-[18px] px-5 pb-6">
            {!(facturas.isSuccess && lista.length === 0) && (
              <Button className="w-full" onClick={escanear} disabled={subiendo}>
                <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
                Escanear factura
              </Button>
            )}

            {facturas.isPending ? (
              <FacturasSkeleton />
            ) : facturas.isError ? (
              <ErrorState
                message={facturas.error.message}
                onRetry={() => void facturas.refetch()}
                retrying={facturas.isFetching}
              />
            ) : lista.length === 0 ? (
              <EmptyState
                title="Aún no has escaneado facturas"
                text="Tómale una foto a la factura del súper: leemos los productos y tú los revisas antes de que entren a la despensa."
              >
                <Button className="w-full" onClick={escanear} disabled={subiendo}>
                  <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
                  Escanear factura
                </Button>
              </EmptyState>
            ) : (
              <section className="flex flex-col gap-2" aria-labelledby="historial">
                <h2 id="historial" className={etiquetaSeccion}>
                  Historial
                </h2>
                <ul className="m-0 list-none overflow-hidden rounded-xl border border-line bg-surface p-0">
                  {lista.map((f) => (
                    <FacturaFila key={f.id} factura={f} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        </>
      )}
    </EscanearFactura>
  );
}
