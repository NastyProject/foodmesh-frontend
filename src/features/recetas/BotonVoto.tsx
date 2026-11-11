import type { LucideIcon } from "lucide-react";

interface BotonVotoProps {
  Icono: LucideIcon;
  label: string;
  activo: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function BotonVoto({ Icono, label, activo, disabled, onClick }: BotonVotoProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={activo}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-[10px] border disabled:cursor-not-allowed ${
        activo ? "border-brand bg-brand text-surface" : "border-line-strong bg-transparent text-ink-2 hover:bg-sunken"
      }`}
    >
      <Icono size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
