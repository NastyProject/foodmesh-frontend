import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import { Button } from "../../components/Button";
import { FullScreenLoader } from "../../components/FullScreenLoader";

export function WelcomePage() {
  const { isLoading, isAuthenticated, loginWithRedirect, error } = useAuth0();

  if (isLoading) return <FullScreenLoader label="Cargando…" />;
  if (isAuthenticated) return <Navigate to="/despensa" replace />;

  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-5 pt-7 pb-[max(24px,env(safe-area-inset-bottom))]">
      <span className="font-mono text-[12px] tracking-[0.08em] text-muted">FOODMESH · HOGAR</span>

      <div className="flex flex-1 flex-col justify-center gap-3">
        <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">Lo que compras, sin que se pierda.</h1>
        <p className="m-0 text-[15px] text-ink-2">
          Escanea tu factura, mira qué vence primero y cocina con lo que ya tienes.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {error && (
          <p role="alert" className="m-0 rounded-[10px] bg-soon-bg px-[14px] py-3 text-[14px] text-notice-text">
            No pudimos iniciar tu sesión. Intenta de nuevo.
          </p>
        )}
        <Button className="w-full" onClick={() => void loginWithRedirect()}>
          Entrar
        </Button>
        <p className="m-0 text-center text-[13px] text-muted">Si es tu primera vez, ahí mismo creas tu cuenta.</p>
      </div>
    </div>
  );
}
