import { ApiError } from "../../api/client";

// Foto que el backend no pudo leer: trae su propio mensaje y consejo, que se muestran tal cual.
const CODIGOS_FOTO_ILEGIBLE = new Set(["imagen_borrosa", "imagen_ilegible", "imagen_pequena"]);

export interface FalloSubida {
  titulo: string;
  mensaje: string;
  /** Texto del botón que vuelve a abrir la cámara o el selector. */
  accion: string;
}

export function falloDeError(error: Error): FalloSubida {
  const elegirOtra = { titulo: "No pudimos leer la foto", accion: "Elegir otra foto" };
  if (error instanceof ApiError) {
    if (error.status === 422 && error.codigo && CODIGOS_FOTO_ILEGIBLE.has(error.codigo)) {
      return { titulo: error.message, mensaje: error.consejo ?? "", accion: "Tomar otra foto" };
    }
    if (error.status === 413) return { ...elegirOtra, mensaje: "La foto pesa más de 10 MB. Prueba con una más liviana." };
    if (error.status === 415) return { ...elegirOtra, mensaje: "Ese archivo no es una foto JPG, PNG o WebP. Elige otra." };
  }
  return { ...elegirOtra, mensaje: error.message };
}
