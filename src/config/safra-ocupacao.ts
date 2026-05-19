/** Seleções da secção de catálogos (secção 7) reutilizadas na proposta Safra. */

export type SafraOcupacaoSelection = {
  convenioId?: number;
  idOrgaoEmpregador?: number;
  idRegimeJuridico?: number;
  idSituacaoEmpregado?: number;
};

const STORAGE_KEY = "safra.ocupacao.selection";

export function getStoredSafraOcupacaoSelection(): SafraOcupacaoSelection | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const r = o as Record<string, unknown>;
    const out: SafraOcupacaoSelection = {};
    for (const key of [
      "convenioId",
      "idOrgaoEmpregador",
      "idRegimeJuridico",
      "idSituacaoEmpregado",
    ] as const) {
      const v = r[key];
      if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export function setStoredSafraOcupacaoSelection(
  sel: SafraOcupacaoSelection
): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
}
