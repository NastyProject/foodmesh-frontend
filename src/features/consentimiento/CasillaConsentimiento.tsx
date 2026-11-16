import { Check } from "lucide-react";

interface CasillaConsentimientoProps {
  id: string;
  titulo: string;
  texto: string;
  etiqueta: "Obligatoria" | "Opcional";
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Checkbox real (oculto visualmente) con una caja propia; toda la fila es el <label>. */
export function CasillaConsentimiento({
  id,
  titulo,
  texto,
  etiqueta,
  checked,
  onChange,
  disabled = false,
}: CasillaConsentimientoProps) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-start gap-3 border-b border-divider px-4 py-3.5 last:border-b-0 has-disabled:cursor-not-allowed"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={`${id}-texto`}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border " +
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand " +
          (checked ? "border-brand bg-brand text-surface" : "border-line-strong bg-surface")
        }
      >
        {checked && <Check size={16} strokeWidth={2.4} />}
      </span>
      <span className="flex flex-col gap-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[15px] font-semibold text-ink">{titulo}</span>
          <span className="text-[12px] font-semibold tracking-[0.06em] text-muted uppercase">{etiqueta}</span>
        </span>
        <span id={`${id}-texto`} className="text-[14px] text-ink-2">
          {texto}
        </span>
      </span>
    </label>
  );
}
