import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { ApiError, apiFetch } from "./client";
import type { components } from "./schema";

export type Item = components["schemas"]["ItemOut"];
export type ItemCreate = components["schemas"]["ItemCreate"];
// TODO(back): ItemUpdate acepta null en nombre, cantidad y unidad, pero esas columnas son
// NOT NULL: un PATCH con null ahí probablemente da 500 en vez de 422. Aquí nunca lo mandamos.
export type ItemUpdate = components["schemas"]["ItemUpdate"];

export const inventarioKey = ["inventario"] as const;

function invalidarTrasMutar(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: inventarioKey }),
    queryClient.invalidateQueries({ queryKey: ["recetas"] }),
  ]);
}

function refrescarSi404(queryClient: QueryClient, error: unknown) {
  // El ítem ya no existe (lo borró otro miembro del hogar): la lista está desactualizada.
  if (error instanceof ApiError && error.status === 404) {
    void queryClient.invalidateQueries({ queryKey: inventarioKey });
  }
}

export function useInventario() {
  const getToken = useApiToken();
  return useQuery({
    queryKey: inventarioKey,
    queryFn: ({ signal }) => apiFetch<Item[]>("/inventario", { getToken, signal }),
  });
}

export function useCrearItem() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: ItemCreate) => apiFetch<Item>("/inventario", { getToken, method: "POST", body: datos }),
    onSuccess: () => invalidarTrasMutar(queryClient),
  });
}

export function useEditarItem() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cambios }: { id: number; cambios: ItemUpdate }) =>
      apiFetch<Item>(`/inventario/${id}`, { getToken, method: "PATCH", body: cambios }),
    onSuccess: () => invalidarTrasMutar(queryClient),
    onError: (error) => refrescarSi404(queryClient, error),
  });
}

export function useBorrarItem() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/inventario/${id}`, { getToken, method: "DELETE" }),
    onSuccess: () => invalidarTrasMutar(queryClient),
    onError: (error) => refrescarSi404(queryClient, error),
  });
}
