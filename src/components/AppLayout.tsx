import { useState } from "react";
import { Outlet } from "react-router";
import { OcultarBarraContext } from "./barraInferior";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  const [ocultarBarra, setOcultarBarra] = useState(false);

  return (
    <OcultarBarraContext.Provider value={setOcultarBarra}>
      <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-paper">
        {/* Espacio inferior = alto de la barra (52 + 8 + 20) para que nada quede debajo. */}
        <main className={`flex-1 ${ocultarBarra ? "" : "pb-[calc(80px+env(safe-area-inset-bottom))]"}`}>
          <Outlet />
        </main>
        {!ocultarBarra && <BottomNav />}
      </div>
    </OcultarBarraContext.Provider>
  );
}
