import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

export function PasosReceta({ pasos }: { pasos: string[] }) {
  const [abiertos, setAbiertos] = useState(false);
  const id = useId();
  if (pasos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={abiertos}
        aria-controls={id}
        onClick={() => setAbiertos((a) => !a)}
        className="flex h-11 items-center justify-center gap-1.5 rounded-[10px] border border-line-strong bg-transparent text-[14px] font-semibold text-ink hover:bg-sunken"
      >
        {abiertos ? (
          "Ocultar pasos"
        ) : (
          <span>
            Ver los <span className="font-mono">{pasos.length}</span> {pasos.length === 1 ? "paso" : "pasos"}
          </span>
        )}
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
          className={abiertos ? "rotate-180" : undefined}
        />
      </button>
      {abiertos && (
        <ol id={id} className="m-0 flex flex-col gap-2.5 p-0 text-[14px] leading-[1.45]">
          {pasos.map((paso, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 shrink-0 font-mono font-semibold text-muted">{i + 1}.</span>
              <span>{paso}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
