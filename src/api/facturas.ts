import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { ApiError, apiFetch } from "./client";
import { inventarioKey, type Item } from "./inventario";
import type { components } from "./schema";

export type Factura = components["schemas"]["FacturaOut"];
export type EstadoFactura = components["schemas"]["EstadoFactura"];
export type ItemPropuesto = components["schemas"]["ItemPropuesto"];
export type ItemFactura = components["schemas"]["ItemFactura"];

export const facturasKey = ["facturas"] as const;
export const facturaKey = (id: number) => [...facturasKey, id] as const;

export function useFacturas() {
  const getToken = useApiToken();
  return useQuery({
    queryKey: facturasKey,
    queryFn: ({ signal }) => apiFetch<Factura[]>("/facturas", { getToken, signal }),
  });
}

export function useFactura(id: number, enabled = true) {
  const getToken = useApiToken();
  return useQuery({
    queryKey: facturaKey(id),
    enabled,
    queryFn: ({ signal }) => apiFetch<Factura>(`/facturas/${id}`, { getToken, signal }),
  });
}

export function useSubirFactura() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (archivo: File) => {
      const form = new FormData();
      form.append("archivo", archivo);
      // apiFetch no pone Content-Type con FormData: el navegador arma el boundary.
      return apiFetch<Factura>("/facturas", { getToken, method: "POST", body: form });
    },
    onSuccess: (factura) => {
      // La revisión abre con lo que ya llegó, sin pedirlo otra vez.
      queryClient.setQueryData(facturaKey(factura.id), factura);
      void queryClient.invalidateQueries({ queryKey: facturasKey, exact: true });
    },
  });
}

export function useConfirmarFactura(id: number) {
  const getToken = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: ItemFactura[]) =>
      apiFetch<Item[]>(`/facturas/${id}/confirmar`, { getToken, method: "POST", body: items }),
    // Sin await: quien llama navega a la despensa enseguida, y esta pantalla no debe
    // alcanzar a redibujarse como "confirmada" antes de irse.
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: facturasKey });
      void queryClient.invalidateQueries({ queryKey: inventarioKey });
      void queryClient.invalidateQueries({ queryKey: ["recetas"] });
    },
    onError: (error) => {
      // 409: ya estaba confirmada (quizá desde otro dispositivo). 404: ya no existe.
      if (error instanceof ApiError && (error.status === 409 || error.status === 404)) {
        void queryClient.invalidateQueries({ queryKey: facturasKey });
      }
    },
  });
}
