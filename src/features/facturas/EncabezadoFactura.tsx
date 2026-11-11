import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

interface EncabezadoFacturaProps {
  titulo: string;
  subtitulo?: string;
}

export function EncabezadoFactura({ titulo, subtitulo }: EncabezadoFacturaProps) {
  return (
    <header className="flex items-center gap-2 px-5 pt-5 pb-3">
      <Link
        to="/facturas"
        aria-label="Volver a facturas"
        className="-ml-2.5 flex h-11 w-11 shrink-0 items-center justify-center text-ink hover:text-ink"
      >
        <ChevronLeft size={22} strokeWidth={1.8} aria-hidden="true" />
      </Link>
      <div className="flex flex-col">
        <h1 className="m-0 text-[22px] leading-tight font-bold tracking-[-0.01em]">{titulo}</h1>
        {subtitulo && <span className="text-[13px] text-muted">{subtitulo}</span>}
      </div>
    </header>
  );
}
