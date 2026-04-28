import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  HiArrowRightOnRectangle,
  HiBanknotes,
  HiChevronLeft,
  HiChevronRight,
  HiBolt,
  HiCurrencyDollar,
  HiHome,
  HiUserGroup,
} from "react-icons/hi2";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { titlePlatform } from "../../utils/title-platform";
import { Button } from "../ui";

const ASIDE_COLLAPSED_KEY = "platform-aside-collapsed";

const navLinkClass =
  (collapsed: boolean) =>
  ({ isActive }: { isActive: boolean }) =>
    [
      "group flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition",
      collapsed ? "justify-center px-2" : "px-3",
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

type NavSectionKey = "financeiro" | "gestao" | "automacao";

function NavSection({
  id,
  label,
  asideCollapsed,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  asideCollapsed: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = `${id}-panel`;

  if (asideCollapsed) {
    return (
      <div className="mt-5" role="group" aria-label={label}>
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="mb-1.5 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
      >
        <span>{label}</span>
        <HiChevronRight
          className={[
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            open ? "rotate-90" : "",
          ].join(" ")}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={id}
        className={open ? "flex flex-col gap-1" : "hidden"}
      >
        {children}
      </div>
    </div>
  );
}

function readCollapsedPreference(): boolean {
  try {
    return globalThis.localStorage?.getItem(ASIDE_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsedPreference(collapsed: boolean) {
  try {
    globalThis.localStorage?.setItem(
      ASIDE_COLLAPSED_KEY,
      collapsed ? "1" : "0"
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function AppAside() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsedPreference);
  const [openSections, setOpenSections] = useState<
    Record<NavSectionKey, boolean>
  >({
    financeiro: true,
    gestao: true,
    automacao: true,
  });

  useEffect(() => {
    const path = location.pathname;
    queueMicrotask(() => {
      setOpenSections((s) => ({
        ...s,
        ...(path.startsWith("/bankers") || path.startsWith("/loan-operations")
          ? { financeiro: true }
          : {}),
        ...(path.startsWith("/employee") ? { gestao: true } : {}),
        ...(path.startsWith("/automation") ? { automacao: true } : {}),
      }));
    });
  }, [location.pathname]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      writeCollapsedPreference(next);
      return next;
    });
  }, []);

  const toggleNavSection = useCallback((key: NavSectionKey) => {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  }, []);

  const linkCls = navLinkClass(collapsed);

  return (
    <aside
      className={[
        "sticky top-0 flex h-dvh max-h-dvh shrink-0 flex-col border-r border-slate-200/95 bg-gradient-to-b from-white via-white to-slate-50/98 shadow-sm shadow-slate-200/35 transition-[width] duration-200 ease-out",
        collapsed ? "w-[4.25rem]" : "w-64",
      ].join(" ")}
    >
      <div
        className={[
          "flex shrink-0 border-b border-slate-100",
          collapsed
            ? "flex-col items-center gap-3 px-2 py-4"
            : "items-center gap-3 px-4 py-5",
        ].join(" ")}
      >
        {collapsed ? (
          <>
            <button
              type="button"
              onClick={toggleCollapsed}
              className="w-full max-w-[2.5rem] rounded-xl border border-slate-200/90 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-expanded={false}
              title="Expandir menu lateral"
              aria-label="Expandir menu lateral"
            >
              <HiChevronRight className="mx-auto h-5 w-5" aria-hidden />
            </button>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/25"
              aria-hidden
            >
              A
            </div>
          </>
        ) : (
          <>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/25"
              aria-hidden
            >
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold tracking-tight text-slate-900">
                {titlePlatform}
              </p>
              <p className="truncate text-xs text-slate-500">Plataforma</p>
            </div>
            <button
              type="button"
              onClick={toggleCollapsed}
              className="shrink-0 rounded-xl border border-slate-200/90 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-expanded
              title="Recolher menu lateral"
              aria-label="Recolher menu lateral"
            >
              <HiChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      <nav
        className={[
          "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain py-4",
          collapsed ? "px-1.5" : "px-3",
        ].join(" ")}
        aria-label="Principal"
      >
        <div className="flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={linkCls}
            title={collapsed ? "Início" : undefined}
            aria-label={collapsed ? "Início" : undefined}
          >
            {({ isActive }) => (
              <>
                <NavIcon active={isActive}>
                  <HiHome className="h-5 w-5" />
                </NavIcon>
                <span className={collapsed ? "sr-only" : undefined}>
                  Início
                </span>
              </>
            )}
          </NavLink>
        </div>

        <NavSection
          id="nav-financeiro-heading"
          label="Financeiro"
          asideCollapsed={collapsed}
          open={openSections.financeiro}
          onToggle={() => toggleNavSection("financeiro")}
        >
          <NavLink
            to="/bankers"
            className={linkCls}
            title={collapsed ? "Bancos" : undefined}
            aria-label={collapsed ? "Bancos" : undefined}
          >
            {({ isActive }) => (
              <>
                <NavIcon active={isActive}>
                  <HiBanknotes className="h-5 w-5" />
                </NavIcon>
                <span className={collapsed ? "sr-only" : undefined}>
                  Bancos
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/loan-operations"
            className={linkCls}
            title={collapsed ? "Operação financeira" : undefined}
            aria-label={collapsed ? "Operação financeira" : undefined}
          >
            {({ isActive }) => (
              <>
                <NavIcon active={isActive}>
                  <HiCurrencyDollar className="h-5 w-5" />
                </NavIcon>
                <span className={collapsed ? "sr-only" : undefined}>
                  Operação financeira
                </span>
              </>
            )}
          </NavLink>
        </NavSection>

        <NavSection
          id="nav-automacao-heading"
          label="Automação"
          asideCollapsed={collapsed}
          open={openSections.automacao}
          onToggle={() => toggleNavSection("automacao")}
        >
          <NavLink
            to="/automation/daycoval"
            className={linkCls}
            title={collapsed ? "Automação / Daycoval" : undefined}
            aria-label={collapsed ? "Automação / Daycoval" : undefined}
          >
            {({ isActive }) => (
              <>
                <NavIcon active={isActive}>
                  <HiBolt className="h-5 w-5" />
                </NavIcon>
                <span className={collapsed ? "sr-only" : undefined}>
                  Daycoval
                </span>
              </>
            )}
          </NavLink>
        </NavSection>

        <NavSection
          id="nav-gestao-heading"
          label="Gestão"
          asideCollapsed={collapsed}
          open={openSections.gestao}
          onToggle={() => toggleNavSection("gestao")}
        >
          <NavLink
            to="/employee"
            className={linkCls}
            title={collapsed ? "Funcionários" : undefined}
            aria-label={collapsed ? "Funcionários" : undefined}
          >
            {({ isActive }) => (
              <>
                <NavIcon active={isActive}>
                  <HiUserGroup className="h-5 w-5" />
                </NavIcon>
                <span className={collapsed ? "sr-only" : undefined}>
                  Funcionários
                </span>
              </>
            )}
          </NavLink>
        </NavSection>
      </nav>

      <div
        className={[
          "shrink-0 border-t border-slate-100",
          collapsed ? "p-2" : "p-4",
        ].join(" ")}
      >
        {collapsed ? null : (
          <div className="mb-3 rounded-xl bg-slate-50/80 px-3 py-2">
            <p className="truncate text-xs font-medium text-slate-700">
              {user?.email ?? "—"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {user?.role ?? "—"}
            </p>
          </div>
        )}

        {collapsed ? (
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            title={`Sair${user?.email ? ` (${user.email})` : ""}`}
            aria-label="Sair da sessão"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" aria-hidden />
          </button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="!min-h-10 text-sm"
            onClick={logout}
          >
            Sair
          </Button>
        )}
      </div>
    </aside>
  );
}
