import { CookingPot, ReceiptText, Refrigerator, UserRound, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

interface Tab {
  to: string;
  label: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { to: "/despensa", label: "Despensa", icon: Refrigerator },
  { to: "/facturas", label: "Facturas", icon: ReceiptText },
  { to: "/recetas", label: "Recetas", icon: CookingPot },
  { to: "/hogar", label: "Hogar", icon: UserRound },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto grid max-w-[480px] grid-cols-4 gap-1 border-t border-line bg-surface px-3 pt-2 pb-[max(20px,env(safe-area-inset-bottom))]"
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex min-h-[52px] flex-col items-center justify-center gap-[3px] text-[12px] no-underline ${
              isActive ? "font-semibold text-brand hover:text-brand" : "font-medium text-muted hover:text-ink"
            }`
          }
        >
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
