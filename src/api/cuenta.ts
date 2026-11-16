import { useMutation } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import { apiFetch } from "./client";
import type { components } from "./schema";

export type Exportacion = components["schemas"]["Exportacion"];
type ConfirmacionBorrado = components["schemas"]["ConfirmacionBorrado"];

/** GET /cuenta/exportar. Es una acción a pedido (botón), no un dato que se muestre: va como mutación. */
export function useExportarDatos() {
  const getToken = useApiToken();
  return useMutation({
    mutationFn: () => apiFetch<Exportacion>("/cuenta/exportar", { getToken }),
  });
}

/**
 * DELETE /cuenta con el body exacto que exige el backend. Después hay que cerrar sesión.
 * Sin limpiar la caché aquí: las queries montadas volverían a pedir datos, y cualquier
 * petición tras borrar le crea al usuario un hogar nuevo y vacío. El logout recarga la página.
 */
export function useEliminarCuenta() {
  const getToken = useApiToken();
  return useMutation({
    mutationFn: () =>
      apiFetch<void>("/cuenta", {
        getToken,
        method: "DELETE",
        body: { confirmar: "ELIMINAR" } satisfies ConfirmacionBorrado,
      }),
  });
}
