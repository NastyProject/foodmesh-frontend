import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { apiFetch } from "./client";
import type { components } from "./schema";

export type Preferencias = components["schemas"]["Preferencias"];
export type Dieta = components["schemas"]["Dieta"];
// El OpenAPI no le da nombre al enum de alergias: se deriva del schema.
export type Alergia = Preferencias["alergias"][number];

export const preferenciasKey = ["preferencias"] as const;

export function usePreferencias() {
  const getToken = useApiToken();
  return useQuery({
    queryKey: preferenciasKey,
    queryFn: ({ signal }) => apiFetch<Preferencias>("/preferencias", { getToken, signal }),
  });
}

/** PUT reemplaza todo: siempre se manda el objeto completo. */
export function useGuardarPreferencias() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferencias: Preferencias) =>
      apiFetch<Preferencias>("/preferencias", { getToken, method: "PUT", body: preferencias }),
    onSuccess: (guardadas) => {
      queryClient.setQueryData(preferenciasKey, guardadas);
      return queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
  });
}
