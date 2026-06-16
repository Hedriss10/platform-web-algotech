import type { SafraSimulacaoItem } from "../types/safra";

export type SafraVendedorSnapshot = {
  convenioId?: number;
  cpf?: string;
  matricula?: string;
  idProduto?: number;
  idTabelaJuros?: number;
  simulacaoSelecionada?: SafraSimulacaoItem;
  idProposta?: number;
};

const STORAGE_KEY = "safra.vendedor.snapshot";

export function getStoredSafraVendedorSnapshot(): SafraVendedorSnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    return o as SafraVendedorSnapshot;
  } catch {
    return null;
  }
}

export function setStoredSafraVendedorSnapshot(
  snap: SafraVendedorSnapshot
): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
}

export function patchStoredSafraVendedorSnapshot(
  patch: Partial<SafraVendedorSnapshot>
): void {
  const prev = getStoredSafraVendedorSnapshot() ?? {};
  setStoredSafraVendedorSnapshot({ ...prev, ...patch });
}
