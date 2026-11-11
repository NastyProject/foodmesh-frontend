import { TriangleAlert } from "lucide-react";
import { Button } from "../../components/Button";

interface SubidaFallidaProps {
  mensaje: string;
  onElegirOtra: () => void;
  onCancelar: () => void;
}

// No es un <dialog> modal a propósito: "Elegir otra foto" hace click() en el input de archivo,
// que quedaría inerte detrás de un modal.
export function SubidaFallida({ mensaje, onElegirOtra, onCancelar }: SubidaFallidaProps) {
  return (
    <div className="fixed inset-0 z-30 bg-paper">
      <div
        role="alert"
        className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-6 px-5 py-10"
      >
        <div className="flex flex-col gap-2">
          <TriangleAlert size={28} strokeWidth={1.8} aria-hidden="true" className="text-soon-text" />
          <h2 className="m-0 text-[22px] font-bold tracking-tight">No pudimos leer la foto</h2>
          <p className="m-0 text-[15px] text-ink-2">{mensaje}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Button className="w-full" onClick={onElegirOtra}>
            Elegir otra foto
          </Button>
          <Button variant="secondary" className="w-full" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
