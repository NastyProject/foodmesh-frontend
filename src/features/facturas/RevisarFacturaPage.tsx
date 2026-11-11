import { useParams } from "react-router";
import { ApiError } from "../../api/client";
import { useFactura } from "../../api/facturas";
import { ErrorState } from "../../components/ErrorState";
import { EncabezadoFactura } from "./EncabezadoFactura";
import { FacturaConfirmada } from "./FacturaConfirmada";
import { FacturaNoEncontrada } from "./FacturaNoEncontrada";
import { RevisionFactura } from "./RevisionFactura";
import { RevisionSkeleton } from "./RevisionSkeleton";

const SUBTITULO_REVISAR = "Nada entra a tu despensa hasta que confirmes";

export function RevisarFacturaPage() {
  const { id } = useParams();
  const facturaId = Number(id);
  const idValido = Number.isInteger(facturaId) && facturaId > 0;
  const factura = useFactura(facturaId, idValido);

  if (!idValido || (factura.error instanceof ApiError && factura.error.status === 404)) {
    return <FacturaNoEncontrada />;
  }

  if (factura.isPending) {
    return (
      <>
        <EncabezadoFactura titulo="Revisar factura" subtitulo={SUBTITULO_REVISAR} />
        <RevisionSkeleton />
      </>
    );
  }

  if (factura.isError) {
    return (
      <>
        <EncabezadoFactura titulo="Factura" />
        <div className="px-5">
          <ErrorState message={factura.error.message} onRetry={() => void factura.refetch()} retrying={factura.isFetching} />
        </div>
      </>
    );
  }

  if (factura.data.estado === "confirmada") {
    return (
      <>
        <EncabezadoFactura titulo="Factura" subtitulo="Ya está en tu despensa" />
        <FacturaConfirmada factura={factura.data} />
      </>
    );
  }

  return (
    <>
      <EncabezadoFactura titulo="Revisar factura" subtitulo={SUBTITULO_REVISAR} />
      {/* key: el borrador se arma una sola vez por factura; un refetch no lo pisa. */}
      <RevisionFactura key={factura.data.id} factura={factura.data} />
    </>
  );
}
