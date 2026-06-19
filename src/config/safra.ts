import type { MargemBpoRequestBody } from "../types/safra";

const STORAGE_LAST_MARGIN_REQ = "safra.margin.bpo.lastRequestJson";
const STORAGE_LAST_MARGIN_RES = "safra.margin.bpo.lastResponseJson";

/** Fingerprint usado pelo backend para resposta simulada em homologação/demo. */
export const SAFRA_DEMO_MARGIN_BPO: MargemBpoRequestBody = {
  convenio: 10237,
  cpf: "38585766034",
  idProduto: 1,
  matricula: "303048269980000",
};

/** Dados de cliente usados em demo (simulação exige para convênio 10237). */
export const SAFRA_DEMO_CLIENTE = {
  dataNascimento: "1980-05-20",
  dataAdmissao: "1979-09-17",
  idSexo: "M",
  idSituacaoEmpregado: 1,
};

/** Prazos padrão para simulação demo (convênio 10237). */
export const SAFRA_DEMO_PRAZOS: readonly number[] = [27, 76];

/** Campos extras de simulação para homologação (convênio 10237). */
export const SAFRA_DEMO_CALCULATION = {
  idCorban: 7629,
  idCorbansubs: 3,
  idComercial: 9598,
  idSeguro: 3683,
  idServicos: [5956, 5788] as const,
  isCotacao: true,
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
      typeof r.idProduto !== "number" ||
      typeof r.matricula !== "string"
    ) {
      return null;
    }
    let cpfStr: string;
    if (typeof r.cpf === "string") {
      cpfStr = r.cpf.replace(/\D/g, "");
    } else if (typeof r.cpf === "number" && Number.isFinite(r.cpf)) {
      cpfStr = String(Math.trunc(r.cpf)).padStart(11, "0");
    } else {
      return null;
    }
    if (cpfStr.length !== 11) return null;
    return {
      convenio: r.convenio,
      cpf: cpfStr,
      idProduto: r.idProduto,
      matricula: r.matricula,
    };
  } catch {
    return null;
  }
}

export function setStoredSafraMarginBpoRequest(
  body: MargemBpoRequestBody
): void {
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
