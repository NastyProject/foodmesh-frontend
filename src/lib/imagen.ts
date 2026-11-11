// El backend rechaza fotos de más de 10 MB (413). Las más pesadas se recomprimen aquí.

export const TAMANO_MAXIMO = 10 * 1024 * 1024; // mismo límite que el backend

// Lado mayor en px y calidad JPEG; se prueba en orden hasta quedar por debajo del límite.
const PASOS: readonly [number, number][] = [
  [3000, 0.85],
  [2400, 0.8],
  [2000, 0.75],
  [1600, 0.7],
];

function aJpeg(canvas: HTMLCanvasElement, calidad: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", calidad));
}

function nombreJpg(nombre: string): string {
  return `${nombre.replace(/\.[^.]+$/, "") || "factura"}.jpg`;
}

/**
 * Devuelve la misma foto si cabe, o una versión JPEG más liviana.
 * Si el navegador no puede leerla, devuelve el original y el backend responde 413/415.
 */
export async function prepararImagen(archivo: File): Promise<File> {
  if (archivo.size <= TAMANO_MAXIMO) return archivo;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(archivo);
  } catch {
    return archivo;
  }

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return archivo;

    for (const [lado, calidad] of PASOS) {
      const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.round(bitmap.width * escala);
      canvas.height = Math.round(bitmap.height * escala);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await aJpeg(canvas, calidad);
      if (blob && blob.size <= TAMANO_MAXIMO) {
        return new File([blob], nombreJpg(archivo.name), { type: "image/jpeg" });
      }
    }
    return archivo;
  } finally {
    bitmap.close();
  }
}
