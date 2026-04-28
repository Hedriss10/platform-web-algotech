import { useCallback, useState } from "react";
import { HiBolt } from "react-icons/hi2";

import { resolveDefaultDaycovalLoginUsuario } from "../../config/daycoval";
import MargemFluxoPanel from "./MargemFluxoPanel";

export default function DaycovalAutomation() {
  const [loginUsuario, setLoginUsuario] = useState(() =>
    resolveDefaultDaycovalLoginUsuario()
  );

  const refreshLogin = useCallback(() => {
    setLoginUsuario(resolveDefaultDaycovalLoginUsuario());
  }, []);

  return (
    <div className="px-6 py-10 text-slate-900 sm:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <HiBolt className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Automação
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Daycoval — margem
            </h1>
            <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600">
              Fluxo consignado em margem: acesso institucional, tabelas de
              cadastro, simulação, inclusão na esteira e acompanhamento. Guarde
              a credencial antes de usar os outros passos; os dados ficam apenas
              na sessão deste navegador.
            </p>
          </div>
        </div>
      </header>

      <MargemFluxoPanel
        loginUsuario={loginUsuario}
        onSavedLogin={refreshLogin}
      />
    </div>
  );
}
