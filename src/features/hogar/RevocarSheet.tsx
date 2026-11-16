import { useNavigate } from "react-router";
import { useRevocarConsentimiento } from "../../api/consentimiento";
import { Button } from "../../components/Button";
import { Sheet } from "../../components/Sheet";
import { rutaConsentimiento } from "../consentimiento/ruta";

interface RevocarSheetProps {
  versionVigente: string;
  onClose: () => void;
}

export function RevocarSheet({ versionVigente, onClose }: RevocarSheetProps) {
  const navigate = useNavigate();
  const revocar = useRevocarConsentimiento();

  function confirmar() {
    revocar.mutate(versionVigente, {
      // La app vuelve a pedir el consentimiento; al aceptarlo, regresa a Hogar.
      onSuccess: () => void navigate(rutaConsentimiento("/hogar"), { replace: true }),
    });
  }

  return (
    <Sheet title="¿Revocar tu autorización?" onClose={revocar.isPending ? () => undefined : onClose}>
      <div className="flex flex-col gap-4 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <p className="m-0 text-[15px] text-ink-2">
          Sin tu autorización no podemos tratar los datos de tu hogar: la despensa, las facturas y las recetas dejan de
          funcionar hasta que la aceptes de nuevo. Tus datos no se borran.
        </p>
        {revocar.isError && (
          <p role="alert" className="m-0 text-[14px] text-urgent-text">
            {revocar.error.message}
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Button variant="danger" className="w-full" onClick={confirmar} disabled={revocar.isPending}>
            {revocar.isPending ? "Revocando…" : "Revocar autorización"}
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose} disabled={revocar.isPending}>
            Cancelar
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
