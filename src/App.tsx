import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import { RouterProvider } from "react-router";
import { QueryProvider } from "./api/QueryProvider";
import { router } from "./router";

function onRedirectCallback(appState?: AppState) {
  void router.navigate(appState?.returnTo ?? "/despensa", { replace: true });
}

export function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      // Refresh tokens en localStorage: la sesión sobrevive a recargar aunque el
      // navegador bloquee cookies de terceros (el silent auth por iframe fallaría).
      useRefreshTokens
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </Auth0Provider>
  );
}
