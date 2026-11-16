import { SectionLabel } from "../../components/SectionLabel";

// TODO(back): reemplazar por el texto oficial de la política de tratamiento de datos.
// Este resumen solo afirma lo que está documentado en docs/backend-avisos.md.
const PUNTOS: { titulo: string; texto: string }[] = [
  {
    titulo: "Qué guardamos",
    texto:
      "Lo que tienes en la despensa, las facturas que escaneas, las preferencias del hogar y las recetas que te sugerimos.",
  },
  {
    titulo: "Tus facturas",
    texto:
      "Para entender la factura, a la IA externa (Google Gemini) solo le enviamos el bloque de productos. " +
      "El resto del texto, con tus datos personales, no se guarda ni se envía. " +
      "La foto completa solo se envía si lo autorizas en esa factura. La imagen se borra al confirmar la factura.",
  },
  {
    titulo: "Recetas",
    texto: "Para sugerirte recetas, la IA recibe los alimentos de tu despensa y las preferencias del hogar.",
  },
  {
    titulo: "Supermercados",
    texto:
      "Solo si aceptas la casilla opcional, tus compras cuentan en datos anónimos y agregados de demanda " +
      "por categoría y zona.",
  },
  {
    titulo: "Tus derechos",
    texto:
      "Puedes descargar todos los datos de tu hogar, borrar tu cuenta y retirar esta autorización cuando quieras.",
  },
];

export function PoliticaResumen({ version }: { version: string }) {
  return (
    <section aria-labelledby="titulo-politica" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel id="titulo-politica">Tratamiento de datos</SectionLabel>
        <span className="font-mono text-[13px] text-muted">v{version}</span>
      </div>
      <dl className="m-0 flex flex-col rounded-xl border border-line bg-surface">
        {PUNTOS.map(({ titulo, texto }) => (
          <div key={titulo} className="flex flex-col gap-1 border-b border-divider px-4 py-3.5 last:border-b-0">
            <dt className="text-[15px] font-semibold text-ink">{titulo}</dt>
            <dd className="m-0 text-[14px] leading-relaxed text-ink-2">{texto}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 text-[13px] text-muted">
        Tratamos tus datos según la Ley 1581 de 2012 de protección de datos personales.
      </p>
    </section>
  );
}
