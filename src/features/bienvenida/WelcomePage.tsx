import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import { Button } from "../../components/Button";
import { FullScreenLoader } from "../../components/FullScreenLoader";
import { PasosBienvenida } from "./PasosBienvenida";
import { RecetaDemo } from "./RecetaDemo";
import { TiqueteDemo } from "./TiqueteDemo";

export function WelcomePage() {
  const { isLoading, isAuthenticated, loginWithRedirect, error } = useAuth0();

  if (isLoading) return <FullScreenLoader label="Cargando…" />;
  if (isAuthenticated) return <Navigate to="/despensa" replace />;

  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-6 px-5 pt-7 pb-[max(24px,env(safe-area-inset-bottom))]">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-[12px] tracking-[0.08em] text-muted">FOODMESH</span>
        <h1 className="m-0 text-[32px] leading-tight font-bold tracking-tight">Lo que compras, sin que se pierda.</h1>
      </header>

      {/* Ejemplo visual: el tiquete y la receta que sale de él. Decorativo. */}
      {/* La receta va en el flujo con margen negativo: monta ~20px sobre la esquina del tiquete
          sin importar cuántas líneas ocupe su título, y no tapa el último renglón. */}
      <div aria-hidden="true" className="flex flex-col">
        <div className="mr-7 -rotate-2 motion-safe:animate-imprimir">
          <TiqueteDemo />
        </div>
        <div className="relative -mt-5 ml-auto w-[66%] rotate-2 motion-safe:animate-aparecer">
          <RecetaDemo />
        </div>
      </div>

      <PasosBienvenida />

      <div className="mt-auto flex flex-col gap-3">
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
