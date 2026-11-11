import { Check } from "lucide-react";

interface OpcionChipProps {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Radio o checkbox real, oculto visualmente, dentro de un <label> con forma de chip. */
export function OpcionChip({ type, name, value, label, checked, onChange, disabled = false }: OpcionChipProps) {
  return (
    <label className="relative block cursor-pointer has-disabled:cursor-not-allowed">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={
          "flex min-h-11 items-center justify-center gap-1.5 rounded-[10px] border px-3.5 text-[15px] " +
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand " +
          "peer-disabled:opacity-60 " +
          (checked
            ? "border-brand bg-surface font-semibold text-brand"
            : "border-line-strong bg-surface font-medium text-ink hover:bg-sunken")
        }
      >
        {checked && <Check size={16} strokeWidth={1.8} aria-hidden="true" />}
        {label}
      </span>
    </label>
  );
}
