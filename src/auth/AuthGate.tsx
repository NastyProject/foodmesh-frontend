import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { FullScreenLoader } from "../components/FullScreenLoader";

export function AuthGate() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void loginWithRedirect({ appState: { returnTo: location.pathname + location.search } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location.pathname, location.search]);

  if (!isAuthenticated) return <FullScreenLoader label="Cargando tu sesión…" />;
  return <Outlet />;
}
