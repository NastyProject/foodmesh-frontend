import { ThumbsDown, ThumbsUp } from "lucide-react";
import { BotonVoto } from "./BotonVoto";

interface FeedbackRecetaProps {
  voto: boolean | undefined;
  onVotar: (util: boolean) => void;
  error: string | null;
  disabled?: boolean;
}

export function FeedbackReceta({ voto, onVotar, error, disabled = false }: FeedbackRecetaProps) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-divider pt-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-ink-2">¿Te sirvió?</span>
        <div className="flex gap-2">
          <BotonVoto
            Icono={ThumbsUp}
            label="Sí me sirvió"
            activo={voto === true}
            disabled={disabled}
            onClick={() => onVotar(true)}
          />
          <BotonVoto
            Icono={ThumbsDown}
            label="No me sirvió"
            activo={voto === false}
            disabled={disabled}
            onClick={() => onVotar(false)}
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="m-0 text-[13px] text-urgent-text">
          {error}
        </p>
      )}
    </div>
  );
}
