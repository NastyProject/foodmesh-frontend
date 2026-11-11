import { Link } from "react-router";
import { buttonClasses } from "../../components/buttonStyles";
import { EmptyState } from "../../components/EmptyState";
import { EncabezadoFactura } from "./EncabezadoFactura";

export function FacturaNoEncontrada() {
  return (
    <>
      <EncabezadoFactura titulo="Factura" />
      <div className="px-5">
        <EmptyState title="No encontramos esta factura" text="Puede que la hayan borrado o que el enlace esté mal.">
          <Link to="/facturas" className={buttonClasses("secondary", "w-full")}>
            Ver mis facturas
          </Link>
        </EmptyState>
      </div>
    </>
  );
}
