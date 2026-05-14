import { useState } from "react";
import { HiBuildingOffice2, HiRectangleStack } from "react-icons/hi2";

import SafraBatchModal from "./SafraBatchModal";
import SafraFluxoPanel from "./SafraFluxoPanel";

export default function SafraAutomation() {
  const [batchOpen, setBatchOpen] = useState(false);

  return (
    <div className="px-6 py-10 text-slate-900 sm:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/25">
            <HiBuildingOffice2 className="h-7 w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Automação interna
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Safra — Hub Banking
            </h1>
            <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600">
              Consulte bancos e margem aqui. Para tratar muitas linhas de uma
              vez, use o botão à direita — abre um assistente simples, à parte
              deste ecrã.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setBatchOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3 text-left shadow-sm transition hover:border-emerald-300 hover:from-emerald-100/80 hover:to-teal-100/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/35 sm:mt-1"
          title="Tratar várias linhas de uma vez (lista)"
          aria-label="Abrir assistente de consultas em lista"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-700/20">
            <HiRectangleStack className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden text-sm font-semibold text-emerald-950 sm:block">
            Lista em lote
          </span>
        </button>
      </header>

      <SafraFluxoPanel />
      <SafraBatchModal open={batchOpen} onClose={() => setBatchOpen(false)} />
    </div>
  );
}
