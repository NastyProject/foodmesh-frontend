export const RUTA_CONSENTIMIENTO = "/consentimiento";
const DESTINO_POR_DEFECTO = "/despensa";

/** URL de la pantalla de consentimiento que, al aceptar, vuelve a `actual`. */
export function rutaConsentimiento(actual: string): string {
  const volver = destinoSeguro(actual);
  return `${RUTA_CONSENTIMIENTO}?volver=${encodeURIComponent(volver)}`;
}

/**
 * Solo rutas internas: empieza por "/" pero no "//" (otro dominio) ni "/\" y no es la
 * propia pantalla de consentimiento. Cualquier otra cosa vuelve a la despensa.
 */
export function destinoSeguro(volver: string | null | undefined): string {
  if (!volver || !volver.startsWith("/") || volver.startsWith("//") || volver.startsWith("/\\")) {
    return DESTINO_POR_DEFECTO;
  }
  const ruta = volver.split(/[?#]/)[0] ?? "";
  if (ruta === "/" || ruta === RUTA_CONSENTIMIENTO) return DESTINO_POR_DEFECTO;
  return volver;
}
