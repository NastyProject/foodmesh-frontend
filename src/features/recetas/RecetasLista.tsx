import { useState } from "react";
import { useFeedbackReceta, type Recomendacion } from "../../api/recetas";
import { RecetaCompacta } from "./RecetaCompacta";
import { RecetaTarjeta } from "./RecetaTarjeta";

interface RecetasListaProps {
  /** Montar con key={recomendacion_id}: recetas nuevas reinician la tarjeta abierta y los votos. */
  recomendacion: Recomendacion;
  /** Buscando otras o actualizando: se ven atenuadas y no se puede votar. */
  ocupado: boolean;
}

function sinClave<T>(registro: Record<number, T>, clave: number): Record<number, T> {
  const copia = { ...registro };
  delete copia[clave];
  return copia;
}

export function RecetasLista({ recomendacion, ocupado }: RecetasListaProps) {
  const [abierta, setAbierta] = useState(0);
  const [abiertaPorUsuario, setAbiertaPorUsuario] = useState(false);
  // TODO(back): la respuesta no trae el voto previo; al recargar, los botones salen sin marcar.
  const [votos, setVotos] = useState<Record<number, boolean>>({});
  const [errores, setErrores] = useState<Record<number, string>>({});
  const feedback = useFeedbackReceta(recomendacion.recomendacion_id);

  function abrir(indice: number) {
    setAbierta(indice);
    setAbiertaPorUsuario(true);
  }

  function votar(indice: number, util: boolean) {
    const anterior = votos[indice];
    if (anterior === util) return;
    // Optimista: se marca ya; si falla, se revierte solo si nadie cambió el voto mientras tanto.
    setVotos((v) => ({ ...v, [indice]: util }));
    setErrores((e) => sinClave(e, indice));
    feedback.mutate(
      { receta_indice: indice, util },
      {
        onError: (error) => {
          setVotos((v) => {
            if (v[indice] !== util) return v;
            return anterior === undefined ? sinClave(v, indice) : { ...v, [indice]: anterior };
          });
          setErrores((e) => ({ ...e, [indice]: error.message }));
        },
      },
    );
  }

  return (
    <div
      aria-busy={ocupado}
      className={`flex flex-col gap-3 transition-opacity ${ocupado ? "pointer-events-none opacity-50" : ""}`}
    >
      {recomendacion.recetas.map((receta, i) =>
        i === abierta ? (
          <RecetaTarjeta
            key={i}
            receta={receta}
            enfocar={abiertaPorUsuario}
            voto={votos[i]}
            onVotar={(util) => votar(i, util)}
            errorVoto={errores[i] ?? null}
            ocupado={ocupado}
          />
        ) : (
          <RecetaCompacta key={i} receta={receta} onAbrir={() => abrir(i)} ocupado={ocupado} />
        ),
      )}
    </div>
  );
}
