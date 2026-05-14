/** Contratos Hub Banking → proxy Safra (`/api/v2/safra`), camelCase. */

export type SafraBank = {
  codigoBanco: number;
  nomeBanco: string;
  cnpj: number;
  ispb: number;
};

/** Valores válidos de produto BPO (documentação Hub / Safra). */
export const SAFRA_ID_PRODUTO_OPCOES: ReadonlyArray<{
  value: 1 | 2 | 5 | 7;
  label: string;
}> = [
  { value: 1, label: "NOVO" },
  { value: 2, label: "REFIN" },
  { value: 5, label: "RETENÇÃO" },
  { value: 7, label: "PORTABILIDADE" },
];

export type MargemBpoRequestBody = {
  convenio: number;
  /** CPF só com dígitos (ou máscara normalizada pelo Hub); preferir string para zeros à esquerda. */
  cpf: string;
  idProduto: number;
  matricula: string;
};

/** Resposta 202 do upload CSV de batch. */
export type SafraBatchUploadAccepted = {
  job_id: string;
  status: string;
  total_rows: number;
};

/** Resposta do polling de status do job (Redis). */
export type SafraBatchJobStatus = {
  job_id: string;
  status: string;
  total_rows: number;
  processed_rows: number;
  failed_rows: number;
  detail: string | null;
};

/** Resposta de `GET …/batch/search/job-ids` (Postgres). */
export type SafraBatchJobIdsResponse = {
  batch_job_ids: string[];
};

/**
 * Resposta de consulta BPO — alinhado a `MargemBpoOutSchema` no OpenAPI do Hub
 * (`/openapi.json`). Campos opcionais na prática podem vir ausentes ou em alias
 * snake_case; o cliente normaliza em `normalizeMargemBpoResponse`.
 */
export type MargemBpoResponse = {
  cpf?: string;
  margem?: number;
  lotacao?: string;
  autorizada?: boolean;
  nome?: string;
  secretaria?: string;
  tipoServidor?: string;
  cargo?: string;
  regimeJuridico?: string;
  dataAdmissao?: string;
  uf?: string;
  renda?: number;
  mensagemErro?: string;
  dataHoraConsulta?: string;
};
