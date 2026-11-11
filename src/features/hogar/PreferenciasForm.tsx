import { useEffect, useRef, useState, type FormEvent } from "react";
import { useGuardarPreferencias, type Alergia, type Dieta, type Preferencias } from "../../api/preferencias";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { Select } from "../../components/Select";
import { Stepper } from "../../components/Stepper";
import {
  ALERGIAS,
  DIETAS,
  ETIQUETAS_ALERGIA,
  ETIQUETAS_DIETA,
  OPCIONES_TIEMPO,
  PORCIONES_MAX,
  PORCIONES_MIN,
} from "../../lib/preferencias";
import { NoLeGustaInput } from "./NoLeGustaInput";
import { OpcionChip } from "./OpcionChip";

const MENSAJE_GUARDADO_MS = 4000;

function parsePorciones(texto: string): number | null {
  const limpio = texto.trim();
  if (!/^\d+$/.test(limpio)) return null;
  const n = Number(limpio);
  return n >= PORCIONES_MIN && n <= PORCIONES_MAX ? n : null;
}

function mismasPreferencias(a: Preferencias, b: Preferencias): boolean {
  const alergias = (p: Preferencias) => [...p.alergias].sort().join("|");
  return (
    a.dieta === b.dieta &&
    alergias(a) === alergias(b) &&
    a.no_le_gusta.join("|") === b.no_le_gusta.join("|") &&
    a.porciones === b.porciones &&
    (a.tiempo_max_minutos ?? null) === (b.tiempo_max_minutos ?? null)
  );
}

export function PreferenciasForm({ inicial }: { inicial: Preferencias }) {
  const guardar = useGuardarPreferencias();
  // Línea base para saber si hay cambios: lo último que confirmó el backend.
  const [guardado, setGuardado] = useState<Preferencias>(inicial);
  const [dieta, setDieta] = useState<Dieta>(inicial.dieta);
  const [alergias, setAlergias] = useState<Alergia[]>(inicial.alergias);
  const [noLeGusta, setNoLeGusta] = useState<string[]>(inicial.no_le_gusta);
  const [porciones, setPorciones] = useState(String(inicial.porciones));
  const [tiempo, setTiempo] = useState<number | null>(inicial.tiempo_max_minutos ?? null);
  const [mostrarGuardado, setMostrarGuardado] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const porcionesValidas = parsePorciones(porciones);
  const actual: Preferencias | null =
    porcionesValidas === null
      ? null
      : { dieta, alergias, no_le_gusta: noLeGusta, porciones: porcionesValidas, tiempo_max_minutos: tiempo };
  const hayCambios = actual !== null && !mismasPreferencias(actual, guardado);
  const puedeGuardar = hayCambios && !guardar.isPending;
  const deshabilitado = guardar.isPending;

  // Si lo guardado trae un tiempo que no está en la lista (el back acepta 5–600), se muestra igual.
  const opcionesTiempo =
    tiempo !== null && !OPCIONES_TIEMPO.includes(tiempo)
      ? [...OPCIONES_TIEMPO, tiempo].sort((a, b) => a - b)
      : OPCIONES_TIEMPO;

  function alternarAlergia(alergia: Alergia, marcada: boolean) {
    setAlergias((prev) => (marcada ? [...prev, alergia] : prev.filter((a) => a !== alergia)));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!actual || !puedeGuardar) return;
    window.clearTimeout(timer.current);
    setMostrarGuardado(false);
    guardar.mutate(actual, {
      onSuccess: (respuesta) => {
        setGuardado(respuesta);
        // El backend quita repetidos: el formulario queda igual a lo guardado.
        setNoLeGusta(respuesta.no_le_gusta);
        setMostrarGuardado(true);
        timer.current = window.setTimeout(() => setMostrarGuardado(false), MENSAJE_GUARDADO_MS);
      },
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
        <legend className="mb-1.5 p-0 text-[14px] font-semibold text-ink-2">Dieta</legend>
        <div className="grid grid-cols-2 gap-2">
          {DIETAS.map((d) => (
            <OpcionChip
              key={d}
              type="radio"
              name="dieta"
              value={d}
              label={ETIQUETAS_DIETA[d]}
              checked={dieta === d}
              onChange={(marcada) => marcada && setDieta(d)}
              disabled={deshabilitado}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
        <legend className="mb-1.5 p-0 text-[14px] font-semibold text-ink-2">Alergias</legend>
        <div className="flex flex-wrap gap-2">
          {ALERGIAS.map((a) => (
            <OpcionChip
              key={a}
              type="checkbox"
              name="alergias"
              value={a}
              label={ETIQUETAS_ALERGIA[a]}
              checked={alergias.includes(a)}
              onChange={(marcada) => alternarAlergia(a, marcada)}
              disabled={deshabilitado}
            />
          ))}
        </div>
      </fieldset>

      <Field label="No me gusta" htmlFor="no-le-gusta">
        <NoLeGustaInput id="no-le-gusta" value={noLeGusta} onChange={setNoLeGusta} disabled={deshabilitado} />
      </Field>

      <Field label="Porciones" htmlFor="porciones">
        <Stepper
          id="porciones"
          value={porciones}
          onChange={setPorciones}
          step={1}
          min={PORCIONES_MIN}
          max={PORCIONES_MAX}
          inputMode="numeric"
          disabled={deshabilitado}
        />
        {porcionesValidas === null && (
          <p role="alert" className="m-0 text-[13px] text-urgent-text">
            Escribe un número entero de <span className="font-mono">{PORCIONES_MIN}</span> a{" "}
            <span className="font-mono">{PORCIONES_MAX}</span>.
          </p>
        )}
      </Field>

      <Field label="Tiempo máximo" htmlFor="tiempo">
        <Select
          id="tiempo"
          value={tiempo === null ? "" : String(tiempo)}
          disabled={deshabilitado}
          onChange={(e) => setTiempo(e.target.value === "" ? null : Number(e.target.value))}
        >
          {opcionesTiempo.map((min) => (
            <option key={min} value={String(min)}>
              {min} min
            </option>
          ))}
          <option value="">Sin límite</option>
        </Select>
      </Field>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={!puedeGuardar}>
          {guardar.isPending ? "Guardando…" : "Guardar preferencias"}
        </Button>
        <p role="status" className="m-0 min-h-5 text-[14px] text-brand">
          {mostrarGuardado ? "Preferencias guardadas. Tus recetas se actualizarán." : ""}
        </p>
        {guardar.isError && (
          <p role="alert" className="m-0 text-[14px] text-urgent-text">
            {guardar.error.message}
          </p>
        )}
      </div>
    </form>
  );
}
