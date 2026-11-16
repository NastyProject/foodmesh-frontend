import { useAuth0 } from "@auth0/auth0-react";
import { useId, useState } from "react";
import { useEliminarCuenta } from "../../api/cuenta";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { inputClasses } from "../../components/fieldStyles";
import { Sheet } from "../../components/Sheet";

const PALABRA = "ELIMINAR";

export function EliminarCuentaSheet({ onClose }: { onClose: () => void }) {
  const id = useId();
  const { logout } = useAuth0();
  const eliminar = useEliminarCuenta();
  const [texto, setTexto] = useState("");
  // Exactamente "ELIMINAR": es lo que se le manda al backend.
  const listo = texto === PALABRA;
  const ocupado = eliminar.isPending || eliminar.isSuccess;

  function confirmar() {
    if (!listo) return;
    eliminar.mutate(undefined, {
      onSuccess: () => void logout({ logoutParams: { returnTo: window.location.origin } }),
    });
  }

  return (
    <Sheet title="Eliminar tu cuenta" onClose={ocupado ? () => undefined : onClose}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          confirmar();
        }}
        className="flex flex-col gap-4 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]"
      >
        <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] text-ink-2">
          <li>
            Si eres el único miembro del hogar, se borra <strong className="text-ink">todo el hogar</strong>: despensa,
            facturas, preferencias y recetas.
          </li>
          <li>Si hay más miembros, solo se borra tu usuario y el hogar sigue para los demás.</li>
          <li>
            Tu inicio de sesión no se borra. Si vuelves a entrar con la misma cuenta, empiezas con un hogar nuevo y
            vacío.
          </li>
        </ul>
        <p className="m-0 text-[14px] font-semibold text-urgent-text">Esto no se puede deshacer.</p>

        <Field label={`Escribe ${PALABRA} para confirmar`} htmlFor={id}>
          <input
            id={id}
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className={`${inputClasses} font-mono`}
            value={texto}
            disabled={ocupado}
            onChange={(e) => setTexto(e.target.value)}
          />
        </Field>

        {eliminar.isError && (
          <p role="alert" className="m-0 text-[14px] text-urgent-text">
            {eliminar.error.message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button type="submit" variant="danger" className="w-full" disabled={!listo || ocupado}>
            {ocupado ? "Eliminando…" : "Eliminar mi cuenta"}
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose} disabled={ocupado}>
            Cancelar
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
