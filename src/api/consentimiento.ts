import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { apiFetch } from "./client";
import type { components } from "./schema";

export type Consentimiento = components["schemas"]["ConsentimientoOut"];
export type ConsentimientoIn = components["schemas"]["ConsentimientoIn"];

export const consentimientoKey = ["consentimiento"] as const;

export function useConsentimiento() {
  const getToken = useApiToken();
  return useQuery({
    queryKey: consentimientoKey,
    queryFn: ({ signal }) => apiFetch<Consentimiento>("/consentimiento", { getToken, signal }),
  });
}

export function useGuardarConsentimiento() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consentimiento: ConsentimientoIn) =>
      apiFetch<Consentimiento>("/consentimiento", { getToken, method: "POST", body: consentimiento }),
    onSuccess: (guardado) => {
      queryClient.setQueryData(consentimientoKey, guardado);
      // Todo lo que falló con 403 se vuelve a pedir al montarse de nuevo (o ya, si está activo).
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== consentimientoKey[0] });
    },
  });
}

/**
 * Revoca el consentimiento: `acepta_tratamiento: false`. Desde ahí el backend responde 403 en
 * todo lo del hogar hasta que se acepte de nuevo. Se borran de la caché los datos del hogar.
 */
export function useRevocarConsentimiento() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (versionVigente: string) =>
      apiFetch<Consentimiento>("/consentimiento", {
        getToken,
        method: "POST",
        body: {
          acepta_tratamiento: false,
          acepta_analitica_agregada: false,
          version_politica: versionVigente,
        } satisfies ConsentimientoIn,
      }),
    onSuccess: (guardado) => {
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== consentimientoKey[0] });
      queryClient.setQueryData(consentimientoKey, guardado);
    },
  });
}
