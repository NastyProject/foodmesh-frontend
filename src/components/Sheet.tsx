import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";

interface SheetProps {
  title: string;
  onClose: () => void;
  /** Elemento que recibe el foco al abrir (por defecto, el primero enfocable). */
  initialFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * Bottom sheet sobre <dialog> nativo: showModal() ya da foco atrapado, Esc y fondo inerte.
 * Se abre al montarse; para cerrarlo, el padre lo desmonta en onClose.
 */
export function Sheet({ title, onClose, initialFocusRef, children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    initialFocusRef?.current?.focus();
    return () => dialog.close();
  }, [initialFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clic en el fondo (fuera del contenido) cierra.
        if (e.target === dialogRef.current) onClose();
      }}
      className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[92dvh] w-full max-w-[480px] overflow-hidden rounded-t-[16px] border-0 bg-surface p-0 text-ink backdrop:bg-ink/45"
    >
      <div className="flex max-h-[92dvh] flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-divider py-2 pr-2 pl-5">
          <h2 id={titleId} className="m-0 text-[18px] font-bold">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink hover:bg-sunken"
          >
            <X size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </header>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
