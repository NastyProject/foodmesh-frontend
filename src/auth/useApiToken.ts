import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import type { GetToken } from "../api/client";

export function useApiToken(): GetToken {
  const { getAccessTokenSilently } = useAuth0();
  return useCallback(async () => {
    const token = await getAccessTokenSilently();
    // apiFetch convierte este error en un 401 → login.
    if (!token) throw new Error("Auth0 no devolvió un access token");
    return token;
  }, [getAccessTokenSilently]);
}
