import { Info } from "lucide-react";

export function AvisoRecetas({ texto }: { texto: string }) {
  return (
    <p className="m-0 flex items-start gap-2.5 rounded-[10px] border border-line-strong px-3 py-2.5 text-[13px] leading-[1.45] text-ink-2">
      <Info size={16} strokeWidth={1.8} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{texto}</span>
    </p>
  );
}
