import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Texto en mono sobre el título. */
  eyebrow?: string;
  /** Botón a la derecha de la etiqueta (ej. "+" en Despensa). */
  action?: ReactNode;
  /** Línea de resumen bajo el título. */
  children?: ReactNode;
}

/** Encabezado de las pantallas principales: la fila de la etiqueta mide 44px siempre, para que el H1 no salte entre pestañas. */
export function PageHeader({ title, eyebrow = "FOODMESH · HOGAR", action, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-1 px-5 pt-7 pb-4">
      <div className="flex min-h-11 items-center justify-between">
        <span className="font-mono text-[12px] tracking-[0.08em] text-muted">{eyebrow}</span>
        {action}
      </div>
      <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">{title}</h1>
      {children}
    </header>
  );
}
