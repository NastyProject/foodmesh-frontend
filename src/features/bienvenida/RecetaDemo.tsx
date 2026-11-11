import { UsaPrimero } from "../recetas/UsaPrimero";

const USA_PRIMERO = [{ item_id: 1, nombre: "Espinaca", dias_para_vencer: 0 }];

/** Tarjeta de receta decorativa de la bienvenida: misma franja que en Recetas. */
export function RecetaDemo() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_2px_0_var(--color-line-strong)]">
      <UsaPrimero items={USA_PRIMERO} variante="franja" />
      <p className="m-0 px-4 pt-2.5 pb-3 text-[16px] leading-[1.3] font-bold">Tortilla de espinaca con yogur</p>
    </div>
  );
}
