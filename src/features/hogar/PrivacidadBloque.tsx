import { Download } from "lucide-react";
import { useState } from "react";
import { useConsentimiento } from "../../api/consentimiento";
import { useExportarDatos } from "../../api/cuenta";
import { Button } from "../../components/Button";
import { SectionLabel } from "../../components/SectionLabel";
import { descargarJSON, nombreArchivoExportacion } from "../../lib/descarga";
import { formatDiaMes } from "../../lib/fechas";
import { EliminarCuentaSheet } from "./EliminarCuentaSheet";
import { RevocarSheet } from "./RevocarSheet";

type Dialogo = "revocar" | "eliminar" | null;

/** Derechos de la Ley 1581 (avisos, sección 7): ver el consentimiento, descargar, revocar, eliminar. */
export function PrivacidadBloque() {
  const consentimiento = useConsentimiento();
  const exportar = useExportarDatos();
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const datos = consentimiento.data;

  function descargar() {
    exportar.mutate(undefined, { onSuccess: (exportacion) => descargarJSON(exportacion, nombreArchivoExportacion()) });
  }

  return (
    <section aria-labelledby="titulo-privacidad" className="flex flex-col gap-4">
      <SectionLabel id="titulo-privacidad">Privacidad</SectionLabel>

      <div className="flex min-h-11 items-center rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink-2">
        {consentimiento.isPending ? (
          <span aria-hidden="true" className="h-4 w-56 animate-pulse rounded bg-sunken" />
        ) : datos?.acepta_tratamiento && datos.version_politica && datos.otorgado_en ? (
          <span>
            Aceptaste la política <span className="font-mono">v{datos.version_politica}</span> el{" "}
            <span className="font-mono">{formatDiaMes(datos.otorgado_en)}</span>
          </span>
        ) : (
          <span>{consentimiento.isError ? consentimiento.error.message : "No has aceptado la política de datos."}</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="secondary" className="w-full" onClick={descargar} disabled={exportar.isPending}>
          <Download size={18} strokeWidth={1.8} aria-hidden="true" />
          {exportar.isPending ? "Preparando tus datos…" : "Descargar mis datos"}
        </Button>
        {exportar.isError && (
          <p role="alert" className="m-0 text-[14px] text-urgent-text">
            {exportar.error.message}
          </p>
        )}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setDialogo("revocar")}
          disabled={!datos?.acepta_tratamiento}
        >
          Revocar consentimiento
        </Button>
        <Button variant="danger-outline" className="w-full" onClick={() => setDialogo("eliminar")}>
          Eliminar mi cuenta
        </Button>
      </div>

      {dialogo === "revocar" && datos && (
        <RevocarSheet versionVigente={datos.version_politica_vigente} onClose={() => setDialogo(null)} />
      )}
      {dialogo === "eliminar" && <EliminarCuentaSheet onClose={() => setDialogo(null)} />}
    </section>
  );
}
