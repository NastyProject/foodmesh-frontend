import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { apiFetch } from "./client";
import type { components } from "./schema";

export type Recomendacion = components["schemas"]["RespuestaRecomendacion"];
export type Receta = components["schemas"]["RecetaOut"];
export type Ingrediente = components["schemas"]["IngredienteOut"];
export type ProximoAVencer = components["schemas"]["ItemProximoAVencer"];
type PedidoRecetas = components["schemas"]["PedidoRecetas"];
type FeedbackIn = components["schemas"]["FeedbackIn"];

export const recetasKey = ["recetas"] as const;

const RUTA_RECETAS = "/recomendaciones/recetas";

export function useRecetas() {
  const getToken = useApiToken();
  return useQuery({
    queryKey: recetasKey,
    // Es un POST, pero sin body el back responde de su caché si nada cambió: repetirlo es seguro.
    queryFn: ({ signal }) => apiFetch<Recomendacion>(RUTA_RECETAS, { getToken, method: "POST", signal }),
    // Solo se refresca cuando inventario, facturas o preferencias invalidan "recetas".
    staleTime: Infinity,
    // El back ya reintenta con la IA: reintentar aquí duplicaría la espera de un 503.
    retry: false,
  });
}

export function useOtrasRecetas() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      const body: PedidoRecetas = { nuevas: true };
      return apiFetch<Recomendacion>(RUTA_RECETAS, { getToken, method: "POST", body });
    },
    // Que un refetch en vuelo no pise las recetas nuevas al terminar después.
    onMutate: () => queryClient.cancelQueries({ queryKey: recetasKey }),
    onSuccess: (data) => queryClient.setQueryData(recetasKey, data),
  });
}

export function useFeedbackReceta(recomendacionId: number) {
  const getToken = useApiToken();
  return useMutation({
    // Mismo scope = se envían en orden: si cambia de opinión rápido, al back llega el último.
    scope: { id: `feedback-${recomendacionId}` },
    mutationFn: (feedback: FeedbackIn) =>
      apiFetch<void>(`/recomendaciones/${recomendacionId}/feedback`, { getToken, method: "POST", body: feedback }),
  });
}
