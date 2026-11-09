// Clases del botón, separadas para poder usarlas también en <Link> (navegar ≠ acción).

export type ButtonVariant = "primary" | "secondary" | "dashed" | "danger" | "danger-outline";

const base =
  "inline-flex h-[52px] items-center justify-center gap-2 rounded-xl px-5 text-[16px] font-semibold no-underline " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-surface hover:bg-brand-strong hover:text-surface active:bg-brand-strong",
  secondary: "border border-ink bg-transparent text-ink hover:bg-sunken hover:text-ink",
  dashed: "border border-dashed border-dashed-line bg-transparent text-ink hover:bg-sunken hover:text-ink",
  // Solo para borrar: el rojo significa "esto no se deshace".
  danger: "bg-urgent text-surface hover:bg-urgent-text active:bg-urgent-text",
  "danger-outline": "border border-line-strong bg-transparent text-urgent hover:bg-sunken",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}
