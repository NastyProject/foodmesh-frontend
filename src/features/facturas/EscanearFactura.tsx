import { useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { ApiError } from "../../api/client";
import { useSubirFactura } from "../../api/facturas";
import { prepararImagen } from "../../lib/imagen";
import { LeyendoFactura } from "./LeyendoFactura";
import { SubidaFallida } from "./SubidaFallida";

interface EscanearFacturaProps {
  /** Pinta los botones que disparan la subida. `ocupado` = subiendo o comprimiendo. */
  children: (abrir: () => void, ocupado: boolean) => ReactNode;
}

function mensajeDeError(error: Error): string {
  if (error instanceof ApiError) {
    if (error.status === 413) return "La foto pesa más de 10 MB. Prueba con una más liviana.";
    if (error.status === 415) return "Ese archivo no es una foto JPG, PNG o WebP. Elige otra.";
  }
  return error.message;
}

/** Flujo único de "Escanear factura": elegir foto → comprimir si hace falta → subir → revisar. */
export function EscanearFactura({ children }: EscanearFacturaProps) {
  // En estado (no useRef): `abrir` se le pasa a los hijos durante el render.
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const subir = useSubirFactura();
  const [preparando, setPreparando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ocupado = preparando || subir.isPending;

  function abrir() {
    if (ocupado) return;
    setError(null);
    input?.click();
  }

  async function alElegir(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    // Limpiar para que elegir la misma foto otra vez vuelva a disparar onChange.
    e.target.value = "";
    if (!archivo) return;

    setError(null);
    setPreparando(true);
    let foto: File;
    try {
      foto = await prepararImagen(archivo);
    } catch {
      foto = archivo;
    } finally {
      setPreparando(false);
    }

    subir.mutate(foto, {
      onSuccess: (factura) => navigate(`/facturas/${factura.id}`),
      onError: (err) => setError(mensajeDeError(err)),
    });
  }

  return (
    <>
      <input
        ref={setInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        hidden
        onChange={(e) => void alElegir(e)}
      />
      {children(abrir, ocupado)}
      {ocupado && <LeyendoFactura />}
      {error && !ocupado && (
        <SubidaFallida mensaje={error} onElegirOtra={abrir} onCancelar={() => setError(null)} />
      )}
    </>
  );
}
