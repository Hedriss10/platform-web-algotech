import type { ReactNode } from "react";
import { HiHome, HiUserGroup } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { titlePlatform } from "../../utils/title-platform";
import { Button } from "../ui";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 shadow-sm ring-1 ring-blue-200/60"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");

function NavIcon({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "flex h-5 w-5 shrink-0 items-center justify-center",
        active ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500",
      ].join(" ")}
      aria-hidden
    >
      {children}
    </span>
  );
}

export function AppAside() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white/95 shadow-sm shadow-slate-200/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-6">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/25"
          aria-hidden
        >
          A
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-slate-900">
            {titlePlatform}
          </p>
          <p className="truncate text-xs text-slate-500">Plataforma</p>
        </div>
      </div>

      <nav
        className="flex flex-1 flex-col gap-1 px-3 py-4"
        aria-label="Principal"
      >
        <NavLink to="/" end className={navLinkClass}>
          {({ isActive }) => (
            <>
              <NavIcon active={isActive}>
                <HiHome className="h-5 w-5" />
              </NavIcon>
              Início
            </>
          )}
        </NavLink>
        <NavLink to="/employee" className={navLinkClass}>
          {({ isActive }) => (
            <>
              <NavIcon active={isActive}>
                <HiUserGroup className="h-5 w-5" />
              </NavIcon>
              Funcionários
            </>
          )}
        </NavLink>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 rounded-xl bg-slate-50/80 px-3 py-2">
          <p className="truncate text-xs font-medium text-slate-700">
            {user?.email ?? "—"}
          </p>
          <p className="truncate text-[11px] text-slate-500">
            {user?.role ?? "—"}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="!min-h-10 text-sm"
          onClick={logout}
        >
          Sair
        </Button>
      </div>
    </aside>
  );
}
