const PASOS = ["Escanea tu factura", "Mira qué vence primero", "Cocina con lo que tienes"];

export function PasosBienvenida() {
  return (
    <ol role="list" aria-label="Cómo funciona" className="m-0 flex list-none flex-col gap-2.5 p-0">
      {PASOS.map((paso, i) => (
        <li key={paso} className="flex items-baseline gap-3 text-[15px] font-medium">
          {/* El número lo lee el lector por ser lista ordenada; el visual es decorativo. */}
          <span aria-hidden="true" className="font-mono text-[14px] font-semibold text-brand">
            {String(i + 1).padStart(2, "0")}
          </span>
          {paso}
        </li>
      ))}
    </ol>
  );
}
