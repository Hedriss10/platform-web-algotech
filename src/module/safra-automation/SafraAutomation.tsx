import { HiBuildingOffice2 } from "react-icons/hi2";

import SafraFluxoPanel from "./SafraFluxoPanel";

export default function SafraAutomation() {
  return (
    <div className="px-6 py-10 text-slate-900 sm:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/25">
            <HiBuildingOffice2 className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Automação interna
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Safra — Hub Banking
            </h1>
            <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600">
              Integração via proxy do Hub (<code className="text-xs">/api/v2/safra</code>
              ): lista de bancos e consulta de margem BPO.
            </p>
          </div>
        </div>
      </header>

      <SafraFluxoPanel />
    </div>
  );
}
