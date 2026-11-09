import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function ErrorState({ message, onRetry, retrying = false }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col gap-4 rounded-xl border border-line bg-surface px-5 py-6">
      <p className="m-0 text-[15px] text-ink-2">{message}</p>
      <Button variant="secondary" onClick={onRetry} disabled={retrying}>
        {retrying ? "Reintentando…" : "Reintentar"}
      </Button>
    </div>
  );
}
