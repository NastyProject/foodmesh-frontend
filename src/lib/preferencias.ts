import type { Alergia, Dieta } from "../api/preferencias";

export const ETIQUETAS_DIETA: Record<Dieta, string> = {
  omnivora: "Omnívora",
  vegetariana: "Vegetariana",
  vegana: "Vegana",
  pescetariana: "Pescetariana",
};

export const DIETAS: Dieta[] = ["omnivora", "vegetariana", "vegana", "pescetariana"];

export const ETIQUETAS_ALERGIA: Record<Alergia, string> = {
  lacteos: "Lácteos",
  gluten: "Gluten",
  huevo: "Huevo",
  mani: "Maní",
  frutos_secos: "Frutos secos",
  mariscos: "Mariscos",
  pescado: "Pescado",
  soya: "Soya",
};

export const ALERGIAS: Alergia[] = ["lacteos", "gluten", "huevo", "mani", "frutos_secos", "mariscos", "pescado", "soya"];

/** Opciones del select de tiempo máximo. `null` = sin límite. */
export const OPCIONES_TIEMPO: number[] = [15, 30, 45, 60];

export const PORCIONES_MIN = 1;
export const PORCIONES_MAX = 12;
export const NO_LE_GUSTA_MAX = 20;
export const NO_LE_GUSTA_LARGO_MAX = 60;
