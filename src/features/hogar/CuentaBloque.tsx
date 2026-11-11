import type { User } from "@auth0/auth0-react";

function iniciales(texto: string): string {
  const partes = texto
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);
  const primera = partes[0] ?? "";
  const ultima = partes.at(-1) ?? "";
  const letras = partes.length > 1 ? primera.charAt(0) + ultima.charAt(0) : primera.slice(0, 2);
  return letras.toUpperCase() || "?";
}

export function CuentaBloque({ user }: { user: User | undefined }) {
  const nombre = user?.name ?? user?.nickname ?? user?.email ?? "Tu cuenta";
  const email = user?.email && user.email !== nombre ? user.email : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunken text-[15px] font-semibold text-ink-2"
        >
          {iniciales(nombre)}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] font-semibold text-ink">{nombre}</span>
          {email && <span className="truncate text-[13px] text-muted">{email}</span>}
        </div>
      </div>
      <p className="m-0 text-[13px] text-muted">Las preferencias son del hogar: las comparten todos sus miembros.</p>
    </div>
  );
}
