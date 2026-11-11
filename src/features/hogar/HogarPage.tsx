import { useAuth0 } from "@auth0/auth0-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePreferencias } from "../../api/preferencias";
import { Button } from "../../components/Button";
import { ErrorState } from "../../components/ErrorState";
import { CuentaBloque } from "./CuentaBloque";
import { HogarSkeleton } from "./HogarSkeleton";
import { PreferenciasForm } from "./PreferenciasForm";

export function HogarPage() {
  const { user, logout } = useAuth0();
  const queryClient = useQueryClient();
  const preferencias = usePreferencias();

  function cerrarSesion() {
    // Que no queden datos de este usuario en caché para quien entre después.
    queryClient.clear();
    void logout({ logoutParams: { returnTo: window.location.origin } });
  }

  return (
    <>
      <header className="flex flex-col gap-1 px-5 pt-7 pb-4">
        <span className="font-mono text-[12px] tracking-[0.08em] text-muted">FOODMESH · HOGAR</span>
        <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">Hogar</h1>
      </header>

      <div className="flex flex-col gap-7 px-5 pb-6">
        <CuentaBloque user={user} />

        <section aria-labelledby="titulo-preferencias" className="flex flex-col gap-4">
          <h2 id="titulo-preferencias" className="m-0 text-[13px] font-semibold tracking-[0.06em] text-muted uppercase">
            Preferencias para recetas
          </h2>
          {preferencias.isPending ? (
            <HogarSkeleton />
          ) : preferencias.isError ? (
            <ErrorState
              message={preferencias.error.message}
              onRetry={() => void preferencias.refetch()}
              retrying={preferencias.isFetching}
            />
          ) : (
            // Key estable: un refetch en segundo plano no remonta el formulario ni pisa lo que editas.
            <PreferenciasForm key="preferencias" inicial={preferencias.data} />
          )}
        </section>

        <Button variant="secondary" className="w-full" onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      </div>
    </>
  );
}
