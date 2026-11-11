// Borde inferior dentado del tiquete (del mockup Validar).
const DIENTES =
  "M0 0 L348 0 L348 0 L340 8 L332 0 L324 8 L316 0 L308 8 L300 0 L292 8 L284 0 L276 8 L268 0 L260 8 L252 0 " +
  "L244 8 L236 0 L228 8 L220 0 L212 8 L204 0 L196 8 L188 0 L180 8 L172 0 L164 8 L156 0 L148 8 L140 0 L132 8 " +
  "L124 0 L116 8 L108 0 L100 8 L92 0 L84 8 L76 0 L68 8 L60 0 L52 8 L44 0 L36 8 L28 0 L20 8 L12 0 L4 8 L0 4 Z";

/** Va dentro de un contenedor `relative` con fondo surface; cuelga 8px por debajo. */
export function BordeDentado() {
  return (
    <svg
      width="100%"
      height="8"
      viewBox="0 0 348 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute -bottom-2 left-0 block"
    >
      <path d={DIENTES} className="fill-surface" />
    </svg>
  );
}
