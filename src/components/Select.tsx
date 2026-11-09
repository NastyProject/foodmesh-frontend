import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { inputClasses } from "./fieldStyles";

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={`${inputClasses} appearance-none pr-10 ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
