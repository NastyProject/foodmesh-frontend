import { Button } from "../../components/Button";
import { Sheet } from "../../components/Sheet";

interface ReprocesarSheetProps {
  onAceptar: () => void;
  onClose: () => void;
}

/** Permiso explícito antes de enviar la foto completa a la IA externa (texto de los avisos, sección 5). */
export function ReprocesarSheet({ onAceptar, onClose }: ReprocesarSheetProps) {
  return (
    <Sheet title="¿Enviar la foto?" onClose={onClose}>
      <div className="flex flex-col gap-4 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <p className="m-0 text-[15px] text-ink-2">
          Vamos a enviar la foto completa de tu factura a Google (Gemini) para leerla de nuevo. La foto puede incluir tu
          nombre, documento y datos de pago. ¿Quieres continuar?
        </p>
        <p className="m-0 rounded-[10px] bg-soon-bg px-3.5 py-3 text-[14px] text-notice-text">
          Los productos de esta pantalla se reemplazan por los de la nueva lectura. Se pierden los cambios que hayas
          hecho.
        </p>
        <div className="flex flex-col gap-3">
          <Button className="w-full" onClick={onAceptar}>
            Enviar la foto
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
