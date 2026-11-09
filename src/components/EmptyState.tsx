import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  text?: string;
  /** Botones de la acción siguiente. */
  children?: ReactNode;
}

export function EmptyState({ title, text, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface px-5 py-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-[18px] font-bold">{title}</h2>
        {text && <p className="m-0 text-[14px] text-muted">{text}</p>}
      </div>
      {children && <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
}
