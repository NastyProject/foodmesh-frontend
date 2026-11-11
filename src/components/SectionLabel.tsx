import type { ReactNode } from "react";

interface SectionLabelProps {
  id?: string;
  /** "urgent": encabezado de "Úsalo primero". */
  tone?: "muted" | "urgent";
  children: ReactNode;
}

/** Etiqueta de sección: 13px, 600, mayúsculas. */
export function SectionLabel({ id, tone = "muted", children }: SectionLabelProps) {
  return (
    <h2
      id={id}
      className={`m-0 text-[13px] font-semibold tracking-[0.06em] uppercase ${
        tone === "urgent" ? "text-urgent-heading" : "text-muted"
      }`}
    >
      {children}
    </h2>
  );
}
