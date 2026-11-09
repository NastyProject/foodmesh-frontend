interface PestanaBotonProps {
  activa: boolean;
  onClick: () => void;
  label: string;
  n: number;
}

export function PestanaBoton({ activa, onClick, label, n }: PestanaBotonProps) {
  return (
    // El botón mide 44px de alto para el dedo; la píldora visible, 36px como en el mockup.
    <button type="button" aria-pressed={activa} onClick={onClick} className="group flex h-11 items-center">
      <span
        className={`flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium ${
          activa ? "border-ink bg-ink text-paper" : "border-line-strong bg-transparent text-ink group-hover:bg-sunken"
        }`}
      >
        {label}
        <span className={`font-mono ${activa ? "opacity-75" : "text-muted"}`}>{n}</span>
      </span>
    </button>
  );
}
