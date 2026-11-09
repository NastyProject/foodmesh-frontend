import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "dashed";

const base =
  "inline-flex h-[52px] items-center justify-center gap-2 rounded-xl px-5 text-[16px] font-semibold " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-surface hover:bg-brand-strong active:bg-brand-strong",
  secondary: "border border-ink bg-transparent text-ink hover:bg-sunken",
  dashed: "border border-dashed border-dashed-line bg-transparent text-ink hover:bg-sunken",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
