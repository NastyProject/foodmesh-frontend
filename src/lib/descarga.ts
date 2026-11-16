import { fechaISOLocal } from "./fechas";

/** "foodmesh-mis-datos-2026-11-16.json" */
export function nombreArchivoExportacion(hoy: Date = new Date()): string {
  return `foodmesh-mis-datos-${fechaISOLocal(hoy)}.json`;
}

/** Guarda `datos` como un archivo JSON legible, con un <a download> temporal. */
export function descargarJSON(datos: unknown, nombre: string): void {
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.append(a);
  a.click();
  a.remove();
  // Después del clic: algunos navegadores leen el blob de forma asíncrona.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
