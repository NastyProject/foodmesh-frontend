import { BordeDentado } from "../../components/BordeDentado";
import { ExpiryBadge } from "../../components/ExpiryBadge";
import type { EstadoVencimiento } from "../../lib/fechas";

// Ejemplo fijo: muestra los cuatro tipos de vencimiento con los mismos badges de la Despensa.
const RENGLONES: { nombre: string; estado: EstadoVencimiento }[] = [
  { nombre: "Espinaca", estado: { tipo: "hoy", dias: 0, etiqueta: "HOY" } },
  { nombre: "Yogur griego", estado: { tipo: "pronto", dias: 2, etiqueta: "2 DÍAS" } },
  { nombre: "Leche entera", estado: { tipo: "lejos", dias: 9, etiqueta: "9 días" } },
  { nombre: "Arroz", estado: { tipo: "lejos", dias: 240, etiqueta: "8 meses" } },
];

/** Tiquete decorativo de la bienvenida. Lo oculta a lectores de pantalla quien lo usa. */
export function TiqueteDemo() {
  return (
    <div className="relative flex flex-col gap-2.5 rounded-t-xl border border-line bg-surface px-4 pt-4 pb-3.5 font-mono">
      <span className="text-[13px] font-semibold tracking-[0.04em]">D1 · 01/11/2026</span>
      <div className="border-t border-dashed border-line-strong" />
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {RENGLONES.map(({ nombre, estado }) => (
          <li key={nombre} className="flex min-h-7 items-center justify-between gap-3 text-[14px]">
            <span className="truncate">{nombre}</span>
            <ExpiryBadge estado={estado} />
          </li>
        ))}
      </ul>
      <BordeDentado />
    </div>
  );
}
