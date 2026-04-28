import { Outlet } from "react-router-dom";
import { AppAside } from "./AppAside";

/**
 * Área autenticada: aside fixo + conteúdo principal com scroll.
 */
export function AuthenticatedLayout() {
  return (
    <div className="flex min-h-dvh w-full items-stretch bg-slate-50">
      <AppAside />
      <main className="min-h-dvh min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-blue-50/50">
        <Outlet />
      </main>
    </div>
  );
}
