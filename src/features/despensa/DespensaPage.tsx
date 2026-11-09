import { Plus, ScanLine } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useInventario, type Item } from "../../api/inventario";
import { Button } from "../../components/Button";
import { buttonClasses } from "../../components/buttonStyles";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { esUsaloPrimero } from "../../lib/fechas";
import { DespensaSkeleton } from "./DespensaSkeleton";
import { InventarioLista } from "./InventarioLista";
import { ItemSheet } from "./ItemSheet";
import { PestanaBoton } from "./PestanaBoton";

type Pestana = "comida" | "otros";

type SheetAbierto = { modo: "crear" } | { modo: "editar"; item: Item; enfocarFecha: boolean };

const etiquetaSeccion = "m-0 text-[13px] font-semibold tracking-[0.06em] uppercase";

export function DespensaPage() {
  const inventario = useInventario();
  const [pestana, setPestana] = useState<Pestana>("comida");
  const [sheet, setSheet] = useState<SheetAbierto | null>(null);

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
    <>
      <header className="flex flex-col gap-1 px-5 pt-7 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12px] tracking-[0.08em] text-muted">FOODMESH · HOGAR</span>
          <button
            type="button"
            aria-label="Agregar producto a mano"
            onClick={abrirCrear}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink hover:bg-sunken"
          >
            <Plus size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">Despensa</h1>
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
      </header>

      {hayItems && (
        <div className="flex gap-2 px-5 pb-2.5">
          <PestanaBoton activa={pestana === "comida"} onClick={() => setPestana("comida")} label="Comida" n={comida.length} />
          <PestanaBoton activa={pestana === "otros"} onClick={() => setPestana("otros")} label="Otros" n={otros.length} />
        </div>
      )}

      <div className={`flex flex-col gap-[18px] px-5 ${hayItems ? "pb-[76px]" : "pb-6"}`}>
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
            <Link to="/facturas" className={buttonClasses("primary", "w-full")}>
              <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
              Escanear factura
            </Link>
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
                  <h2 id="usalo-primero" className={`${etiquetaSeccion} text-urgent-heading`}>
                    Úsalo primero
                  </h2>
                  {pestana === "comida" && (
                    <Link to="/recetas" className="py-2 text-[14px] font-semibold no-underline">
                      Ver recetas →
                    </Link>
                  )}
                </div>
                <InventarioLista items={usaloPrimero} hoy={hoy} onEditar={abrirEditar} />
              </section>
            )}
            {masAdelante.length > 0 && (
              <section className="flex flex-col gap-2" aria-labelledby="mas-adelante">
                <h2 id="mas-adelante" className={`${etiquetaSeccion} text-muted`}>
                  Más adelante
                </h2>
                <InventarioLista items={masAdelante} hoy={hoy} onEditar={abrirEditar} />
              </section>
            )}
          </>
        )}
      </div>

      {hayItems && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(104px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-[480px] justify-end px-5">
          <Link
            to="/facturas"
            className={buttonClasses("primary", "pointer-events-auto text-[15px] shadow-[0_2px_0_var(--color-brand-strong)]")}
          >
            <ScanLine size={20} strokeWidth={1.8} aria-hidden="true" />
            Escanear factura
          </Link>
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
  );
}
