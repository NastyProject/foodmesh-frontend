import { Trash2 } from "lucide-react";
import { Select } from "../../components/Select";
import { Stepper } from "../../components/Stepper";
import { formatCantidad, parseCantidad, pasoCantidad, UNIDADES } from "../../lib/cantidad";
import { CATEGORIAS, esCategoria, etiquetaCategoria } from "../../lib/categorias";
import { formatPesos } from "../../lib/dinero";
import { esAlimento, idCampo, type Borrador } from "./borrador";

interface ItemRevisionTarjetaProps {
  borrador: Borrador;
  idBase: string;
  disabled: boolean;
  onCambiar: (cambios: Partial<Borrador>) => void;
  onQuitar: () => void;
  onPlegar: () => void;
}

// Mismas medidas que inputClasses, con los colores aparte (la fecha vacía va punteada).
const campo =
  "h-12 w-full rounded-[10px] border px-3 text-[15px] text-ink " +
  "focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand " +
  "disabled:opacity-60";
const etiqueta = "text-[12px] text-muted";

export function ItemRevisionTarjeta({ borrador: b, idBase, disabled, onCambiar, onQuitar, onPlegar }: ItemRevisionTarjetaProps) {
  const alimento = esAlimento(b);
  const idNombre = idCampo(idBase, b.key, "nombre");
  const idCantidad = idCampo(idBase, b.key, "cantidad");
  const idCategoria = `${idBase}-${b.key}-categoria`;
  const idFecha = `${idBase}-${b.key}-fecha`;
  const cantidadActual = parseCantidad(b.cantidad);

  // Unidades que vienen de la factura y no están en la lista: se conservan como opción.
  const unidades: readonly string[] = UNIDADES.includes(b.unidad as (typeof UNIDADES)[number])
    ? UNIDADES
    : [...UNIDADES, b.unidad];

  const marco = b.revisar ? "border-2 border-soon-stripe p-[13px]" : "border border-line p-3.5";

  return (
    <article
      aria-label={b.nombre.trim() || "Producto nuevo"}
      className={`flex flex-col gap-2.5 rounded-xl ${alimento ? "bg-surface" : "bg-sunken"} ${marco}`}
    >
      {b.revisar && (
        <span className="self-start rounded-[6px] bg-soon-bg px-2 py-[3px] text-[12px] font-semibold text-notice-text">
          Revisa cantidad × precio
        </span>
      )}
      {!alimento && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] text-muted">{etiquetaCategoria(b.categoria || null)} · no se usa en recetas</span>
          <button
            type="button"
            onClick={onPlegar}
            className="-my-2 h-11 px-1 text-[14px] font-semibold text-brand hover:text-brand-strong"
          >
            Listo
          </button>
        </div>
      )}

      <div className="flex items-start gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label htmlFor={idNombre} className={etiqueta}>
            Producto
          </label>
          <input
            id={idNombre}
            type="text"
            autoComplete="off"
            maxLength={120}
            placeholder="Ej. Leche entera"
            className={`${campo} border-line-strong bg-surface font-semibold placeholder:font-normal placeholder:text-muted`}
            value={b.nombre}
            disabled={disabled}
            onChange={(e) => onCambiar({ nombre: e.target.value })}
          />
        </div>
        {b.precioTotal !== null && (
          // Solo de referencia: el precio no se guarda ni se edita, por eso va apagado.
          <div className="flex flex-col items-end pt-[30px] font-mono text-muted">
            <span className="text-[14px]">{formatPesos(b.precioTotal)}</span>
            {b.revisar && b.precioUnitario !== null && (
              <span className="text-[12px] whitespace-nowrap">
                {cantidadActual === null ? "?" : formatCantidad(cantidadActual)} × {formatPesos(b.precioUnitario)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={idCategoria} className={etiqueta}>
            Categoría
          </label>
          <Select
            id={idCategoria}
            className="text-[14px]"
            value={b.categoria}
            disabled={disabled}
            onChange={(e) => {
              const categoria = esCategoria(e.target.value) ? e.target.value : "";
              // Desde aquí la agrupación se deduce de la categoría; la tarjeta sigue abierta.
              onCambiar({ categoria, esAlimentoBackend: null, expandido: true });
            }}
          >
            <option value="">Sin categoría</option>
            {CATEGORIAS.map(({ valor, etiqueta: texto }) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={idFecha} className={etiqueta}>
            Vence
          </label>
          <input
            id={idFecha}
            type="date"
            className={`${campo} px-2 font-mono text-[14px] ${
              b.fecha ? "border-line-strong bg-surface" : "border-dashed border-dashed-line bg-paper text-muted"
            }`}
            value={b.fecha}
            disabled={disabled}
            onChange={(e) => onCambiar({ fecha: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor={idCantidad} className="sr-only">
          Cantidad
        </label>
        <Stepper
          id={idCantidad}
          size="sm"
          value={b.cantidad}
          onChange={(cantidad) => onCambiar({ cantidad })}
          step={pasoCantidad(b.unidad)}
          disabled={disabled}
        />
        <div className="w-[100px] shrink-0">
          <Select
            aria-label="Unidad"
            className="px-2 text-[14px]"
            value={b.unidad}
            disabled={disabled}
            onChange={(e) => onCambiar({ unidad: e.target.value })}
          >
            {unidades.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </div>
        <button
          type="button"
          aria-label={`Quitar ${b.nombre.trim() || "producto"}`}
          disabled={disabled}
          onClick={onQuitar}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted hover:bg-sunken hover:text-ink disabled:opacity-40"
        >
          <Trash2 size={19} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
