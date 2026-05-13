import type { MargemBpoRequestBody } from "../types/safra";

const STORAGE_LAST_MARGIN_REQ = "safra.margin.bpo.lastRequestJson";
const STORAGE_LAST_MARGIN_RES = "safra.margin.bpo.lastResponseJson";

/** Fingerprint usado pelo backend para resposta simulada em homologação/demo. */
export const SAFRA_DEMO_MARGIN_BPO: MargemBpoRequestBody = {
  convenio: 10237,
  cpf: 38585766034,
  idProduto: 1,
  matricula: "303048269980000",
};

export function getStoredSafraMarginBpoRequest(): MargemBpoRequestBody | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_LAST_MARGIN_REQ);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const r = o as Record<string, unknown>;
    if (
      typeof r.convenio !== "number" ||
      typeof r.cpf !== "number" ||
      typeof r.idProduto !== "number" ||
      typeof r.matricula !== "string"
    ) {
      return null;
    }
    return {
      convenio: r.convenio,
      cpf: r.cpf,
      idProduto: r.idProduto,
      matricula: r.matricula,
    };
  } catch {
    return null;
  }
}

export function setStoredSafraMarginBpoRequest(body: MargemBpoRequestBody): void {
  sessionStorage.setItem(STORAGE_LAST_MARGIN_REQ, JSON.stringify(body));
}

export function getStoredSafraMarginBpoResponse(): unknown | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_LAST_MARGIN_RES);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function setStoredSafraMarginBpoResponse(data: unknown): void {
  sessionStorage.setItem(STORAGE_LAST_MARGIN_RES, JSON.stringify(data));
}
