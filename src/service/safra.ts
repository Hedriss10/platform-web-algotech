import { isAxiosError } from "axios";

import type {
  CreditLighthouseItem,
  CreditLighthouseRequestBody,
  MargemBpoRequestBody,
  MargemBpoResponse,
  SafraBank,
  SafraBatchJobIdsResponse,
  SafraBatchJobStatus,
  SafraBatchUploadAccepted,
  SafraFinancialAgreement,
  SafraInterestTable,
  SafraTokenResponse,
} from "../types/safra";
import { getApiErrorMessage } from "../utils/api-error";
import { normalizeMargemBpoResponse } from "../utils/safra-margin-response";
import { apiClient } from "./api-base-client";

const PREFIX = "/api/v2/safra";

/** Token corporativo Safra exposto pelo Hub (debug). */
export async function safraObterTokenDebug(): Promise<SafraTokenResponse> {
  const { data } = await apiClient.post<SafraTokenResponse>(
    `${PREFIX}/token`
  );
  return data;
}

export async function safraListarBancos(): Promise<SafraBank[]> {
  const { data } = await apiClient.get<SafraBank[]>(`${PREFIX}/banks`);
  return data;
}

export async function safraConsultarMargemBpo(
  body: MargemBpoRequestBody
): Promise<MargemBpoResponse> {
  const { data } = await apiClient.post<unknown>(`${PREFIX}/margin/bpo`, body);
  return normalizeMargemBpoResponse(data);
}

/** Lista convênios (`GET …/Convenio` na origem). */
export async function safraListarConvenios(): Promise<
  SafraFinancialAgreement[]
> {
  const { data } = await apiClient.get<SafraFinancialAgreement[]>(
    `${PREFIX}/financial-agreements`
  );
  return Array.isArray(data) ? data : [];
}

/** Tabelas de juros do convênio (`idConvenio` da lista de convênios). */
export async function safraListarTabelasJuros(
  convenioId: number
): Promise<SafraInterestTable[]> {
  const { data } = await apiClient.get<SafraInterestTable[]>(
    `${PREFIX}/tables/${encodeURIComponent(String(convenioId))}`
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Farol de crédito — resposta sempre tratada como lista (Hub normaliza objeto único).
 */
export async function safraConsultarFarolCredito(
  body: CreditLighthouseRequestBody
): Promise<CreditLighthouseItem[]> {
  const { data } = await apiClient.post<
    CreditLighthouseItem[] | CreditLighthouseItem
  >(`${PREFIX}/credit-lighthouse`, body);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
}

/**
 * Upload CSV para batch de consultas de margem (202). Requer Redis no servidor.
 * Remove o `Content-Type` JSON predefinido para enviar multipart com boundary.
 */
export async function safraBatchUploadCsv(
  file: File
): Promise<SafraBatchUploadAccepted> {
  const form = new FormData();
  form.append("file", file, file.name);

  const { data } = await apiClient.post<SafraBatchUploadAccepted>(
    `${PREFIX}/batch/search/upload`,
    form,
    {
      transformRequest: [
        (body, headers) => {
          if (body instanceof FormData) {
            if (headers && typeof headers === "object") {
              const h = headers as Record<string, string | undefined>;
              delete h["Content-Type"];
            }
          }
          return body;
        },
      ],
    }
  );
  return data;
}

export async function safraBatchJobStatus(
  jobId: string
): Promise<SafraBatchJobStatus> {
  const { data } = await apiClient.get<SafraBatchJobStatus>(
    `${PREFIX}/batch/search/${encodeURIComponent(jobId)}/status`
  );
  return data;
}

/** Lista `batch_job_id` distintos com linhas gravadas em Postgres (sem Redis). */
export async function safraBatchSearchJobIds(): Promise<string[]> {
  const { data } = await apiClient.get<SafraBatchJobIdsResponse>(
    `${PREFIX}/batch/search/job-ids`
  );
  return Array.isArray(data?.batch_job_ids) ? data.batch_job_ids : [];
}

/** Exclusão física do lote em Postgres — `DELETE …/batch/search/{job_id}` (204, sem Redis). */
export const safraBatchSearchDelete = async (jobId: string): Promise<void> => {
  await apiClient.delete(`${PREFIX}/batch/search/${encodeURIComponent(jobId)}`);
};

/**
 * Descarrega o CSV exportado para o `job_id` (Postgres). Dispara download no browser.
 */
export async function safraBatchExportDownload(jobId: string): Promise<void> {
  try {
    const res = await apiClient.get<Blob>(
      `${PREFIX}/batch/search/${encodeURIComponent(jobId)}/export`,
      { responseType: "blob" }
    );
    const blob = res.data;
    let filename = `safra-batch-${jobId}.csv`;
    const cd = res.headers["content-disposition"];
    if (typeof cd === "string") {
      const utf = /filename\*=UTF-8''([^;\s]+)/i.exec(cd);
      const asc = /filename="([^"]+)"/i.exec(cd);
      if (utf?.[1]) {
        try {
          filename = decodeURIComponent(utf[1]);
        } catch {
          filename = utf[1];
        }
      } else if (asc?.[1]) {
        filename = asc[1];
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    if (isAxiosError(e) && e.response?.data instanceof Blob) {
      const text = await e.response.data.text();
      let msg = getApiErrorMessage(e);
      try {
        const j = JSON.parse(text) as { message?: string };
        if (typeof j.message === "string" && j.message.trim()) {
          msg = j.message.trim();
        }
      } catch {
        /* manter msg */
      }
      throw new Error(msg);
    }
    throw new Error(
      isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao exportar o CSV."
    );
  }
}
