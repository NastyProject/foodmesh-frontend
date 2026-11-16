import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { useConsentimiento, useGuardarConsentimiento, type Consentimiento } from "../../api/consentimiento";
import { Button } from "../../components/Button";
import { ErrorState } from "../../components/ErrorState";
import { FullScreenLoader } from "../../components/FullScreenLoader";
import { PageHeader } from "../../components/PageHeader";
import { CasillaConsentimiento } from "./CasillaConsentimiento";
import { PoliticaResumen } from "./PoliticaResumen";
import { destinoSeguro } from "./ruta";

function vigente(c: Consentimiento): boolean {
  return c.acepta_tratamiento && c.version_politica === c.version_politica_vigente;
}

export function ConsentimientoPage() {
  const [params] = useSearchParams();
  const destino = destinoSeguro(params.get("volver"));
  const consentimiento = useConsentimiento();

  if (consentimiento.isPending) return <FullScreenLoader label="Cargando la política de datos…" />;

  if (consentimiento.isError) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-paper">
        <PageHeader eyebrow="FOODMESH · PRIVACIDAD" title="Tus datos" />
        <div className="px-5">
          <ErrorState
            message={consentimiento.error.message}
            onRetry={() => void consentimiento.refetch()}
            retrying={consentimiento.isFetching}
          />
        </div>
      </main>
    );
  }

  // Ya aceptó esta versión (ej. abrió la URL a mano): no hay nada que pedir.
  if (vigente(consentimiento.data)) return <Navigate to={destino} replace />;

  return <ConsentimientoForm actual={consentimiento.data} destino={destino} />;
}

function ConsentimientoForm({ actual, destino }: { actual: Consentimiento; destino: string }) {
  const navigate = useNavigate();
  const guardar = useGuardarConsentimiento();
  // El tratamiento siempre se marca de forma explícita; la analítica conserva lo que eligió antes (false si nunca respondió).
  const [tratamiento, setTratamiento] = useState(false);
  const [analitica, setAnalitica] = useState(actual.acepta_analitica_agregada);
  const version = actual.version_politica_vigente;
  const politicaCambio = actual.version_politica !== null && actual.version_politica !== version;

  function aceptar() {
    guardar.mutate(
      { acepta_tratamiento: true, acepta_analitica_agregada: analitica, version_politica: version },
      { onSuccess: () => void navigate(destino, { replace: true }) },
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-paper">
      <PageHeader eyebrow="FOODMESH · PRIVACIDAD" title="Antes de empezar">
        <p className="m-0 text-[15px] text-ink-2">
          {politicaCambio
            ? "Actualizamos la política de datos. Revísala y acéptala para seguir usando FoodMesh."
            : "Para usar FoodMesh necesitamos tu autorización para tratar los datos de tu hogar."}
        </p>
      </PageHeader>

      <div className="flex flex-1 flex-col gap-7 px-5 pb-6">
        <PoliticaResumen version={version} />

        <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
          <legend className="mb-3 p-0 text-[13px] font-semibold tracking-[0.06em] text-muted uppercase">
            Tu autorización
          </legend>
          <div className="flex flex-col rounded-xl border border-line bg-surface">
            <CasillaConsentimiento
              id="acepta-tratamiento"
              titulo="Acepto el tratamiento de mis datos"
              texto="Necesaria para usar la despensa, las facturas y las recetas."
              etiqueta="Obligatoria"
              checked={tratamiento}
              onChange={setTratamiento}
              disabled={guardar.isPending}
            />
            <CasillaConsentimiento
              id="acepta-analitica"
              titulo="Sumar mis compras a la demanda anónima"
              texto="Datos agregados por categoría y zona para supermercados. Puedes usar la app sin esto."
              etiqueta="Opcional"
              checked={analitica}
              onChange={setAnalitica}
              disabled={guardar.isPending}
            />
          </div>
        </fieldset>
      </div>

      <footer className="sticky bottom-0 flex flex-col gap-3 border-t border-line bg-paper px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {guardar.isError && (
          <p role="alert" className="m-0 text-[14px] text-urgent-text">
            {guardar.error.message}
          </p>
        )}
        <Button className="w-full" onClick={aceptar} disabled={!tratamiento || guardar.isPending}>
          {guardar.isPending ? "Guardando…" : "Aceptar y continuar"}
        </Button>
      </footer>
    </main>
  );
}
