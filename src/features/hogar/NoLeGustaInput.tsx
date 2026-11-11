import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { inputClasses } from "../../components/fieldStyles";
import { NO_LE_GUSTA_LARGO_MAX, NO_LE_GUSTA_MAX } from "../../lib/preferencias";

interface NoLeGustaInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function NoLeGustaInput({ id, value, onChange, disabled = false }: NoLeGustaInputProps) {
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const avisoId = `${id}-aviso`;
  const lleno = value.length >= NO_LE_GUSTA_MAX;

  function agregar(entrada: string) {
    const nuevo = entrada.trim();
    if (!nuevo) return;
    if (lleno) return setAviso(`Máximo ${NO_LE_GUSTA_MAX} elementos.`);
    if (nuevo.length > NO_LE_GUSTA_LARGO_MAX) return setAviso(`Máximo ${NO_LE_GUSTA_LARGO_MAX} caracteres.`);
    if (value.some((v) => v.toLocaleLowerCase("es") === nuevo.toLocaleLowerCase("es"))) {
      return setAviso("Ya está en la lista.");
    }
    onChange([...value, nuevo]);
    setTexto("");
    setAviso(null);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      agregar(texto);
    }
  }

  function quitar(item: string) {
    onChange(value.filter((v) => v !== item));
    setAviso(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {value.map((item) => (
            <li
              key={item}
              className="flex min-h-11 items-center gap-1 rounded-[10px] border border-line-strong bg-surface pl-3 text-[15px] text-ink"
            >
              <span className="break-all">{item}</span>
              <button
                type="button"
                aria-label={`Quitar ${item}`}
                disabled={disabled}
                onClick={() => quitar(item)}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] text-muted hover:text-ink disabled:opacity-60"
              >
                <X size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        type="text"
        autoComplete="off"
        enterKeyHint="done"
        placeholder={lleno ? "Llegaste al máximo" : "Ej. cilantro, berenjena"}
        className={inputClasses}
        value={texto}
        disabled={disabled}
        aria-describedby={aviso ? avisoId : `${id}-ayuda`}
        aria-invalid={aviso ? true : undefined}
        onChange={(e) => {
          // Algunos teclados de Android no reportan la coma en keydown: se detecta aquí.
          const v = e.target.value;
          if (v.endsWith(",")) {
            const antes = v.slice(0, -1);
            setTexto(antes);
            agregar(antes);
            return;
          }
          setTexto(v);
          if (aviso) setAviso(null);
        }}
        onKeyDown={onKeyDown}
      />
      {aviso ? (
        <p id={avisoId} role="alert" className="m-0 text-[13px] text-urgent-text">
          {aviso}
        </p>
      ) : (
        <p id={`${id}-ayuda`} className="m-0 text-[13px] text-muted">
          Escribe y pulsa Enter o coma. <span className="font-mono">{value.length}</span>/
          <span className="font-mono">{NO_LE_GUSTA_MAX}</span>
        </p>
      )}
    </div>
  );
}
