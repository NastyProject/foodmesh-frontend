import { useAuth0 } from "@auth0/auth0-react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { RUTA_CONSENTIMIENTO, rutaConsentimiento } from "../features/consentimiento/ruta";
import { router } from "../router";
import { ApiError, esConsentimientoRequerido } from "./client";
import { shouldRetry } from "./reintentos";

function irAConsentimiento() {
  const { pathname, search } = router.state.location;
  // Varias queries pueden fallar a la vez: una sola navegación.
  if (pathname === RUTA_CONSENTIMIENTO) return;
  void router.navigate(rutaConsentimiento(pathname + search), { replace: true });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // loginWithRedirect es estable mientras viva el Auth0Provider.
  const { loginWithRedirect } = useAuth0();

  const [queryClient] = useState(() => {
    const onError = (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        void loginWithRedirect({ appState: { returnTo: window.location.pathname } });
      } else if (esConsentimientoRequerido(error)) {
        irAConsentimiento();
      }
    };
    return new QueryClient({
      queryCache: new QueryCache({ onError }),
      mutationCache: new MutationCache({ onError }),
      defaultOptions: {
        queries: { retry: shouldRetry, refetchOnWindowFocus: false },
        mutations: { retry: false },
      },
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
