import { useAuth0 } from "@auth0/auth0-react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiError } from "./client";

const MAX_REINTENTOS = 1;

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Los 4xx no cambian al reintentar; solo reintentamos errores de red o del servidor.
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < MAX_REINTENTOS;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // loginWithRedirect es estable mientras viva el Auth0Provider.
  const { loginWithRedirect } = useAuth0();

  const [queryClient] = useState(() => {
    const onError = (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        void loginWithRedirect({ appState: { returnTo: window.location.pathname } });
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
