// Regla de vencimiento de la app. Todas las fechas de vencimiento llegan del
// backend como "YYYY-MM-DD" y se interpretan como días calendario LOCALES.

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const DIAS_URGENTE = 3;

export type EstadoVencimiento =
  | { tipo: "vencido"; dias: number; etiqueta: "VENCIDO" }
  | { tipo: "hoy"; dias: 0; etiqueta: "HOY" }
  | { tipo: "pronto"; dias: number; etiqueta: string }
  | { tipo: "lejos"; dias: number; etiqueta: string }
  | { tipo: "sin_fecha" };

/**
 * Convierte "YYYY-MM-DD" en un Date a medianoche local.
 * No usar `new Date("YYYY-MM-DD")`: lo toma en UTC y en Bogotá cae el día anterior.
 */
export function parseFechaLocal(fecha: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!match) throw new Error(`Fecha inválida: "${fecha}" (se espera YYYY-MM-DD)`);
  const [, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function inicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

/** Días calendario entre hoy (local) y la fecha. Negativo si ya venció. */
export function diasParaVencer(fecha: string, hoy: Date = new Date()): number {
  const diff = parseFechaLocal(fecha).getTime() - inicioDelDia(hoy).getTime();
  // Math.round absorbe la hora de diferencia si algún día hay cambio de horario.
  return Math.round(diff / MS_POR_DIA);
}

function plural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

function textoLejano(dias: number): string {
  if (dias < 60) return plural(dias, "día", "días");
  if (dias < 365) return plural(Math.floor(dias / 30), "mes", "meses");
  return plural(Math.floor(dias / 365), "año", "años");
}

export function estadoVencimiento(fecha: string | null, hoy: Date = new Date()): EstadoVencimiento {
  if (fecha === null) return { tipo: "sin_fecha" };
  const dias = diasParaVencer(fecha, hoy);
  if (dias < 0) return { tipo: "vencido", dias, etiqueta: "VENCIDO" };
  if (dias === 0) return { tipo: "hoy", dias: 0, etiqueta: "HOY" };
  if (dias <= DIAS_URGENTE) return { tipo: "pronto", dias, etiqueta: dias === 1 ? "1 DÍA" : `${dias} DÍAS` };
  return { tipo: "lejos", dias, etiqueta: textoLejano(dias) };
}

/** "Úsalo primero": vence en 3 días o menos, incluidos los vencidos. Mismo umbral que el backend. */
export function esUsaloPrimero(fecha: string | null, hoy: Date = new Date()): boolean {
  return fecha !== null && diasParaVencer(fecha, hoy) <= DIAS_URGENTE;
}

/** "2026-11-01" → "01/11/2026". */
export function formatFechaCorta(fecha: string): string {
  const d = parseFechaLocal(fecha);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/** Días para vencer en texto corto de recetas: "hoy", "1 día", "3 días". */
export function textoDiasParaVencer(dias: number): string {
  if (dias < 0) return "vencido";
  if (dias === 0) return "hoy";
  return plural(dias, "día", "días");
}
