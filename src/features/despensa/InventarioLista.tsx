import type { Item } from "../../api/inventario";
import { InventarioFila } from "./InventarioFila";

interface InventarioListaProps {
  items: Item[];
  hoy: Date;
  onEditar: (item: Item, enfocarFecha: boolean) => void;
}

export function InventarioLista({ items, hoy, onEditar }: InventarioListaProps) {
  return (
    <ul className="m-0 list-none overflow-hidden rounded-xl border border-line bg-surface p-0">
      {items.map((item) => (
        <InventarioFila key={item.id} item={item} hoy={hoy} onEditar={onEditar} />
      ))}
    </ul>
  );
}
