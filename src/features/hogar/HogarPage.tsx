import { useAuth0 } from "@auth0/auth0-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePreferencias } from "../../api/preferencias";
import { Button } from "../../components/Button";
import { ErrorState } from "../../components/ErrorState";
import { PageHeader } from "../../components/PageHeader";
import { SectionLabel } from "../../components/SectionLabel";
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
      <PageHeader title="Hogar" />

      <div className="flex flex-col gap-7 px-5 pb-6">
        <CuentaBloque user={user} />

        <section aria-labelledby="titulo-preferencias" className="flex flex-col gap-4">
          <SectionLabel id="titulo-preferencias">Preferencias para recetas</SectionLabel>
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
