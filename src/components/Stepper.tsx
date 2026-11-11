import { Minus, Plus } from "lucide-react";
import { cantidadAInput, parseCantidad, redondear } from "../lib/cantidad";
import { inputClasses } from "./fieldStyles";

interface StepperProps {
  id: string;
  /** Texto tal como lo escribe el usuario ("0,8"), para no pelear con el input. */
  value: string;
  onChange: (value: string) => void;
  step: number;
  disabled?: boolean;
  /** "sm": botones de 44 px y ancho flexible, para tarjetas angostas. */
  size?: "md" | "sm";
}

const botonBase =
  "flex h-12 shrink-0 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink " +
  "hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40";

export function Stepper({ id, value, onChange, step, disabled = false, size = "md" }: StepperProps) {
  const actual = parseCantidad(value);
  // El "−" no deja llegar a 0: el backend exige cantidad > 0.
  const puedeRestar = actual !== null && redondear(actual - step) > 0;
  const botonClasses = `${botonBase} ${size === "sm" ? "w-11" : "w-12"}`;

  return (
    <div className={`flex items-center gap-2 ${size === "sm" ? "min-w-0 flex-1" : ""}`}>
      <button
        type="button"
        aria-label="Restar"
        className={botonClasses}
        disabled={disabled || !puedeRestar}
        onClick={() => actual !== null && onChange(cantidadAInput(actual - step))}
      >
        <Minus size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className={`${inputClasses} min-w-0 text-center font-mono`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        aria-label="Sumar"
        className={botonClasses}
        disabled={disabled}
        onClick={() => onChange(cantidadAInput((actual ?? 0) + step))}
      >
        <Plus size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}
