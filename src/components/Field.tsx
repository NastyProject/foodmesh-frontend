import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  /** Acción pequeña a la derecha de la etiqueta (ej. "Quitar fecha"). */
  action?: ReactNode;
  children: ReactNode;
}

export function Field({ label, htmlFor, action, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex min-h-6 items-center justify-between">
        <label htmlFor={htmlFor} className="text-[14px] font-semibold text-ink-2">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}
