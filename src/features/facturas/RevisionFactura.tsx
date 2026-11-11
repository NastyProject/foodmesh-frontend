import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router";
import { ApiError } from "../../api/client";
import { useConfirmarFactura, type Factura } from "../../api/facturas";
import { useOcultarBarraInferior } from "../../components/barraInferior";
import { Button } from "../../components/Button";
import { AvisoFactura } from "./AvisoFactura";
import {
  aItemFactura,
  borradorVacio,
  crearBorradores,
  esAlimento,
  idCampo,
  insertarNuevo,
  validar,
  type Borrador,
} from "./borrador";
import { ItemNoAlimentoFila } from "./ItemNoAlimentoFila";
import { ItemRevisionTarjeta } from "./ItemRevisionTarjeta";
import { TiqueteResumen } from "./TiqueteResumen";

interface ErrorConfirmar {
  mensaje: string;
  yaConfirmada: boolean;
}

const etiquetaSeccion = "m-0 text-[13px] font-semibold tracking-[0.06em] text-muted uppercase";

/**
 * Revisión de una factura pendiente o con error. Lo editado vive aquí hasta confirmar
 * (el padre la monta con key={factura.id}: un refetch no pisa el borrador).
 */
export function RevisionFactura({ factura }: { factura: Factura }) {
  useOcultarBarraInferior();
  const idBase = useId();
  const navigate = useNavigate();
  const confirmar = useConfirmarFactura(factura.id);
  const [borradores, setBorradores] = useState(() => crearBorradores(factura.items_detectados));
  const [error, setError] = useState<ErrorConfirmar | null>(null);
  const ocupado = confirmar.isPending;

  const alimentos = borradores.filter(esAlimento);
  const sinFecha = alimentos.filter((b) => !b.fecha).length;
  const n = borradores.length;

  function cambiar(key: string, cambios: Partial<Borrador>) {
    setBorradores((lista) => lista.map((b) => (b.key === key ? { ...b, ...cambios } : b)));
  }

  function quitar(key: string) {
    setBorradores((lista) => lista.filter((b) => b.key !== key));
  }

  function enfocar(key: string, campo: "nombre" | "cantidad") {
    const el = document.getElementById(idCampo(idBase, key, campo));
    // Centrado, para que el pie fijo no lo tape.
    el?.scrollIntoView({ block: "center" });
    el?.focus({ preventScroll: true });
  }

  function agregar() {
    const nuevo = borradorVacio();
    flushSync(() => setBorradores((lista) => insertarNuevo(lista, nuevo)));
    enfocar(nuevo.key, "nombre");
  }

  function enviar() {
    setError(null);
    const problema = validar(borradores);
    if (problema) {
      // Abrir la tarjeta (si era un no alimento colapsado) antes de enfocar el campo.
      flushSync(() => {
        cambiar(problema.key, { expandido: true });
        setError({ mensaje: problema.mensaje, yaConfirmada: false });
      });
      enfocar(problema.key, problema.campo);
      return;
    }

    // Todo o nada: si el backend responde 422, no se creó nada y el borrador sigue intacto.
    confirmar.mutate(borradores.map(aItemFactura), {
      onSuccess: () => navigate("/despensa"),
      onError: (e) => {
        const yaConfirmada = e instanceof ApiError && e.status === 409;
        setError({ mensaje: yaConfirmada ? "Esta factura ya está en tu despensa." : e.message, yaConfirmada });
      },
    });
  }

  return (
    <>
      <div className="flex flex-col gap-3.5 px-5 pb-[calc(190px+env(safe-area-inset-bottom))]">
        <TiqueteResumen factura={factura} />
        <AvisoFactura factura={factura} />

        <section className="mt-1 flex flex-col gap-3.5" aria-labelledby={`${idBase}-productos`}>
          <div className="flex items-baseline justify-between">
            <h2 id={`${idBase}-productos`} className={etiquetaSeccion}>
              {factura.estado === "error" ? "Productos" : "Productos detectados"}
            </h2>
            <span className="font-mono text-[13px] text-muted">{n}</span>
          </div>

          {n === 0 && (
            <p className="m-0 rounded-xl border border-line bg-surface px-4 py-5 text-[14px] text-muted">
              {factura.items_detectados.length === 0
                ? "No detectamos productos en esta factura. Agrégalos a mano para pasarlos a tu despensa."
                : "Quitaste todos los productos. Agrega alguno para poder confirmar."}
            </p>
          )}

          {borradores.map((b) =>
            !esAlimento(b) && !b.expandido ? (
              <ItemNoAlimentoFila
                key={b.key}
                borrador={b}
                disabled={ocupado}
                onEditar={() => cambiar(b.key, { expandido: true })}
              />
            ) : (
              <ItemRevisionTarjeta
                key={b.key}
                borrador={b}
                idBase={idBase}
                disabled={ocupado}
                onCambiar={(cambios) => cambiar(b.key, cambios)}
                onQuitar={() => quitar(b.key)}
                onPlegar={() => cambiar(b.key, { expandido: false })}
              />
            ),
          )}

          <Button variant="dashed" className="h-12 w-full rounded-[10px] text-[15px]" disabled={ocupado} onClick={agregar}>
            <Plus size={18} strokeWidth={1.8} aria-hidden="true" />
            Agregar producto que falta
          </Button>
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-[480px] flex-col gap-2 border-t border-line bg-surface px-5 pt-3.5 pb-[max(24px,env(safe-area-inset-bottom))]">
        {error && (
          <div role="alert" className="flex flex-col gap-1 rounded-[10px] bg-soon-bg px-3.5 py-3 text-[14px] text-notice-text">
            <span>{error.mensaje}</span>
            {error.yaConfirmada && (
              <Link to="/despensa" className="font-semibold">
                Ir a la despensa
              </Link>
            )}
          </div>
        )}
        {sinFecha > 0 && (
          <span className="text-center text-[13px] text-muted">
            <span className="font-mono">{sinFecha}</span> de <span className="font-mono">{alimentos.length}</span>{" "}
            {alimentos.length === 1 ? "alimento" : "alimentos"} sin fecha de vencimiento
          </span>
        )}
        <Button className="w-full" disabled={n === 0 || ocupado} onClick={enviar}>
          {ocupado ? "Confirmando…" : `Confirmar ${n} ${n === 1 ? "producto" : "productos"}`}
        </Button>
      </footer>
    </>
  );
}
