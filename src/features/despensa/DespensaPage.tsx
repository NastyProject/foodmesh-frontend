import { Plus, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useInventario, type Item } from "../../api/inventario";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { SectionLabel } from "../../components/SectionLabel";
import { esUsaloPrimero } from "../../lib/fechas";
import { EscanearFactura } from "../facturas/EscanearFactura";
import { DespensaSkeleton } from "./DespensaSkeleton";
import { InventarioLista } from "./InventarioLista";
import { ItemSheet } from "./ItemSheet";
import { PestanaBoton } from "./PestanaBoton";

type Pestana = "comida" | "otros";

type SheetAbierto = { modo: "crear" } | { modo: "editar"; item: Item; enfocarFecha: boolean };

export function DespensaPage() {
  const inventario = useInventario();
  const [pestana, setPestana] = useState<Pestana>("comida");
  const [searchParams, setSearchParams] = useSearchParams();
  // "?nuevo=1" (desde Recetas sin alimentos): abrir directo el sheet de crear.
  const [sheet, setSheet] = useState<SheetAbierto | null>(() =>
    searchParams.get("nuevo") === "1" ? { modo: "crear" } : null,
  );

  useEffect(() => {
    // Quitar el parámetro para que recargar o volver atrás no reabra el sheet.
    if (searchParams.has("nuevo")) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const hoy = new Date();
  const items = inventario.data ?? [];
  const comida = items.filter((i) => i.es_alimento);
  const otros = items.filter((i) => !i.es_alimento);
  const visibles = pestana === "comida" ? comida : otros;
  // La API ya los entrega ordenados por vencimiento (sin fecha al final).
  const usaloPrimero = visibles.filter((i) => esUsaloPrimero(i.fecha_vencimiento ?? null, hoy));
  const masAdelante = visibles.filter((i) => !esUsaloPrimero(i.fecha_vencimiento ?? null, hoy));
  const porVencer = items.filter((i) => esUsaloPrimero(i.fecha_vencimiento ?? null, hoy)).length;

  const abrirCrear = () => setSheet({ modo: "crear" });
  const abrirEditar = (item: Item, enfocarFecha: boolean) => setSheet({ modo: "editar", item, enfocarFecha });
  const hayItems = inventario.isSuccess && items.length > 0;

  return (
    <EscanearFactura>
      {(escanear, subiendo) => (
        <>
          <PageHeader
            title="Despensa"
            action={
              <button
                type="button"
                aria-label="Agregar producto a mano"
                onClick={abrirCrear}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink hover:bg-sunken"
              >
                <Plus size={20} strokeWidth={1.8} aria-hidden="true" />
              </button>
            }
          >
            {hayItems && (
              <p className="m-0 text-[14px] text-muted">
                <span className="font-mono">{items.length}</span> {items.length === 1 ? "producto" : "productos"}
                {porVencer > 0 && (
                  <>
                    {" · "}
                    <span className="font-semibold text-urgent-heading">
                      <span className="font-mono">{porVencer}</span> por vencer
                    </span>
                  </>
                )}
              </p>
            )}
          </PageHeader>

          {hayItems && (
            <div className="flex gap-2 px-5 pb-2.5">
              <PestanaBoton activa={pestana === "comida"} onClick={() => setPestana("comida")} label="Comida" n={comida.length} />
              <PestanaBoton activa={pestana === "otros"} onClick={() => setPestana("otros")} label="Otros" n={otros.length} />
            </div>
          )}

          {/* 96px: alto del botón flotante (52) + su separación de la barra (24) + 20 de aire. */}
          <div className={`flex flex-col gap-[18px] px-5 ${hayItems ? "pb-[96px]" : "pb-6"}`}>
            {inventario.isPending ? (
              <DespensaSkeleton />
            ) : inventario.isError ? (
              <ErrorState
                message={inventario.error.message}
                onRetry={() => void inventario.refetch()}
                retrying={inventario.isFetching}
              />
            ) : items.length === 0 ? (
              <EmptyState
                title="Tu despensa está vacía"
                text="Escanea una factura y tus productos entran solos, o agrégalos uno por uno."
              >
                <Button className="w-full" onClick={escanear} disabled={subiendo}>
                  <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
                  Escanear factura
                </Button>
                <Button variant="secondary" className="w-full" onClick={abrirCrear}>
                  Agregar a mano
                </Button>
              </EmptyState>
            ) : visibles.length === 0 ? (
              <p className="m-0 rounded-xl border border-line bg-surface px-4 py-5 text-[14px] text-muted">
                {pestana === "comida"
                  ? "No tienes comida en la despensa."
                  : "Aquí aparecen el aseo, el cuidado personal y lo de mascotas. Por ahora no tienes nada."}
              </p>
            ) : (
              <>
                {usaloPrimero.length > 0 && (
                  <section className="flex flex-col gap-2" aria-labelledby="usalo-primero">
                    <div className="flex items-baseline justify-between">
                      <SectionLabel id="usalo-primero" tone="urgent">
                        Úsalo primero
                      </SectionLabel>
                      {pestana === "comida" && (
                        <Link to="/recetas" className="-my-2 flex min-h-11 items-center text-[14px] font-semibold no-underline">
                          Ver recetas →
                        </Link>
                      )}
                    </div>
                    <InventarioLista items={usaloPrimero} hoy={hoy} onEditar={abrirEditar} />
                  </section>
                )}
                {masAdelante.length > 0 && (
                  <section className="flex flex-col gap-2" aria-labelledby="mas-adelante">
                    <SectionLabel id="mas-adelante">Más adelante</SectionLabel>
                    <InventarioLista items={masAdelante} hoy={hoy} onEditar={abrirEditar} />
                  </section>
                )}
              </>
            )}
          </div>

          {hayItems && (
            <div className="pointer-events-none fixed inset-x-0 bottom-[calc(104px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-[480px] justify-end px-5">
              <Button
                onClick={escanear}
                disabled={subiendo}
                className="pointer-events-auto text-[15px] shadow-[0_2px_0_var(--color-brand-strong)]"
              >
                <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
                Escanear factura
              </Button>
            </div>
          )}

          {sheet && (
            <ItemSheet
              key={sheet.modo === "crear" ? "nuevo" : `${sheet.item.id}-${sheet.enfocarFecha}`}
              item={sheet.modo === "editar" ? sheet.item : undefined}
              enfocarFecha={sheet.modo === "editar" && sheet.enfocarFecha}
              onClose={() => setSheet(null)}
            />
          )}
        </>
      )}
    </EscanearFactura>
  );
}
