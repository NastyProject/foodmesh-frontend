// Pesos colombianos, sin decimales: 130690 → "$130.690".

const formato = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function formatPesos(valor: number): string {
  // es-CO pone un espacio (duro) entre "$" y el número; en la app va pegado.
  return formato.format(valor).replace(/\$\s+/, "$");
}
