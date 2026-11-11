import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useBorrarItem, useCrearItem, useEditarItem, type Item, type ItemUpdate } from "../../api/inventario";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { inputClasses } from "../../components/fieldStyles";
import { Select } from "../../components/Select";
import { Sheet } from "../../components/Sheet";
import { Stepper } from "../../components/Stepper";
import { cantidadAInput, parseCantidad, pasoCantidad, UNIDADES } from "../../lib/cantidad";
import { CATEGORIAS, esCategoria, type Categoria } from "../../lib/categorias";

interface ItemSheetProps {
  /** Sin ítem: crear. Con ítem: editar. */
  item?: Item;
  /** Abrir con el foco en la fecha (desde el botón "+ Fecha"). */
  enfocarFecha?: boolean;
  onClose: () => void;
}

export function ItemSheet({ item, enfocarFecha = false, onClose }: ItemSheetProps) {
  const ids = useId();
  const fechaRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState(item?.nombre ?? "");
  const [categoria, setCategoria] = useState<Categoria | "">(item?.categoria ?? "");
  const [cantidad, setCantidad] = useState(cantidadAInput(item?.cantidad ?? 1));
  const [unidad, setUnidad] = useState(item?.unidad ?? "unidad");
  const [fecha, setFecha] = useState(item?.fecha_vencimiento ?? "");
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crear = useCrearItem();
  const editar = useEditarItem();
  const borrar = useBorrarItem();
  const ocupado = crear.isPending || editar.isPending || borrar.isPending;

  useEffect(() => {
    // El clic en "+ Fecha" todavía cuenta como gesto del usuario: abrimos el calendario directo.
    if (!enfocarFecha) return;
    try {
      fechaRef.current?.showPicker();
    } catch {
      // Navegador sin showPicker: basta con el foco que ya puso el Sheet.
    }
  }, [enfocarFecha]);

  // Unidades que vienen de facturas y no están en la lista: se conservan como opción.
  const unidades: readonly string[] = UNIDADES.includes(unidad as (typeof UNIDADES)[number])
    ? UNIDADES
    : [...UNIDADES, unidad];

  const onError = (e: Error) => setError(e.message);

  function guardar(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const nombreLimpio = nombre.trim();
    const cantidadNum = parseCantidad(cantidad);
    if (!nombreLimpio) return setError("Escribe el nombre del producto.");
    if (cantidadNum === null || cantidadNum <= 0) {
      return setError("Escribe una cantidad mayor que 0, por ejemplo 1 o 0,5.");
    }
    const categoriaFinal = categoria || null;
    const fechaFinal = fecha || null;

    if (!item) {
      crear.mutate(
        { nombre: nombreLimpio, categoria: categoriaFinal, cantidad: cantidadNum, unidad, fecha_vencimiento: fechaFinal },
        { onSuccess: onClose, onError },
      );
      return;
    }

    // PATCH solo con lo que cambió, y nunca null en nombre, cantidad ni unidad.
    const cambios: ItemUpdate = {};
    if (nombreLimpio !== item.nombre) cambios.nombre = nombreLimpio;
    if (categoriaFinal !== (item.categoria ?? null)) cambios.categoria = categoriaFinal;
    if (cantidadNum !== item.cantidad) cambios.cantidad = cantidadNum;
    if (unidad !== item.unidad) cambios.unidad = unidad;
    if (fechaFinal !== (item.fecha_vencimiento ?? null)) cambios.fecha_vencimiento = fechaFinal;

    if (Object.keys(cambios).length === 0) return onClose();
    editar.mutate({ id: item.id, cambios }, { onSuccess: onClose, onError });
  }

  function eliminar() {
    if (!item) return;
    setError(null);
    borrar.mutate(item.id, { onSuccess: onClose, onError });
  }

  return (
    <Sheet
      title={item ? "Editar producto" : "Agregar producto"}
      onClose={onClose}
      initialFocusRef={enfocarFecha ? fechaRef : undefined}
    >
      <form onSubmit={guardar} noValidate className="flex flex-col gap-4 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <Field label="Nombre" htmlFor={`${ids}-nombre`}>
          <input
            id={`${ids}-nombre`}
            type="text"
            autoComplete="off"
            maxLength={120}
            className={inputClasses}
            value={nombre}
            disabled={ocupado}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Field>

        <Field label="Categoría" htmlFor={`${ids}-categoria`}>
          <Select
            id={`${ids}-categoria`}
            value={categoria}
            disabled={ocupado}
            onChange={(e) => setCategoria(esCategoria(e.target.value) ? e.target.value : "")}
          >
            <option value="">Sin categoría</option>
            {CATEGORIAS.map(({ valor, etiqueta }) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Field label="Cantidad" htmlFor={`${ids}-cantidad`}>
            <Stepper
              id={`${ids}-cantidad`}
              value={cantidad}
              onChange={setCantidad}
              step={pasoCantidad(unidad)}
              disabled={ocupado}
            />
          </Field>
          <Field label="Unidad" htmlFor={`${ids}-unidad`}>
            <Select
              id={`${ids}-unidad`}
              className="w-[118px]"
              value={unidad}
              disabled={ocupado}
              onChange={(e) => setUnidad(e.target.value)}
            >
              {unidades.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field
          label="Vence"
          htmlFor={`${ids}-fecha`}
          action={
            fecha && (
              <button
                type="button"
                disabled={ocupado}
                onClick={() => setFecha("")}
                className="-my-2.5 h-11 px-1 text-[14px] font-semibold text-brand hover:text-brand-strong"
              >
                Quitar fecha
              </button>
            )
          }
        >
          <input
            ref={fechaRef}
            id={`${ids}-fecha`}
            type="date"
            className={`${inputClasses} font-mono`}
            value={fecha}
            disabled={ocupado}
            onChange={(e) => setFecha(e.target.value)}
          />
        </Field>

        {error && (
          <p role="alert" className="m-0 rounded-[10px] bg-soon-bg px-[14px] py-3 text-[14px] text-notice-text">
            {error}
          </p>
        )}

        {confirmandoBorrado && item ? (
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-sunken p-4">
            <p className="m-0 text-[15px]">
              ¿Eliminar <strong>{item.nombre}</strong> de tu despensa?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" disabled={ocupado} onClick={() => setConfirmandoBorrado(false)}>
                Cancelar
              </Button>
              <Button variant="danger" disabled={ocupado} onClick={eliminar}>
                {borrar.isPending ? "Eliminando…" : "Sí, eliminar"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-1">
            <Button type="submit" className="w-full" disabled={ocupado}>
              {crear.isPending || editar.isPending ? "Guardando…" : item ? "Guardar cambios" : "Agregar a la despensa"}
            </Button>
            {item && (
              <Button
                variant="danger-outline"
                className="w-full"
                disabled={ocupado}
                onClick={() => setConfirmandoBorrado(true)}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </form>
    </Sheet>
  );
}
