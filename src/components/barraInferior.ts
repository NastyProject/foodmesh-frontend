import { createContext, useContext, useEffect } from "react";

// Algunas pantallas (revisar factura) tienen su propio pie fijo y ocultan la barra de pestañas.
// Depende del estado de los datos, no solo de la ruta, así que lo pide la pantalla misma.
export const OcultarBarraContext = createContext<(ocultar: boolean) => void>(() => {});

/** Oculta la barra inferior mientras el componente que lo llama esté montado. */
export function useOcultarBarraInferior() {
  const setOcultar = useContext(OcultarBarraContext);
  useEffect(() => {
    setOcultar(true);
    return () => setOcultar(false);
  }, [setOcultar]);
}
