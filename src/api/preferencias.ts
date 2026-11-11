import { useQuery } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { apiFetch } from "./client";
import type { components } from "./schema";

export type Preferencias = components["schemas"]["Preferencias"];
export type Dieta = components["schemas"]["Dieta"];

export const preferenciasKey = ["preferencias"] as const;

export function usePreferencias() {
  const getToken = useApiToken();
  return useQuery({
    queryKey: preferenciasKey,
    queryFn: ({ signal }) => apiFetch<Preferencias>("/preferencias", { getToken, signal }),
  });
}
