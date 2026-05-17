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

/** Resposta `POST /token` (uso informativo / debug no Hub). */
export type SafraTokenResponse = {
  token: string;
};

/** Item de `GET /financial-agreements` (proxy Safra `Convenio`). */
export type SafraFinancialAgreement = {
  idConvenio: number;
  nome: string;
  cnpj: number;
  nomeFantasia: string;
  uf: string;
};

/** Item de `GET /tables/{convenio_id}` (`TabelaJuros`). */
export type SafraInterestTable = {
  id: number;
  descricao: string;
  dtInicioVigencia: string;
  dtFimVigencia: string;
};

/**
 * Farol de crédito — no Hub o `cpf` é **número** (contrato alinhado à Safra).
 * Na UI prefira derivar de 11 dígitos de texto para não perder zeros à esquerda antes da serialização.
 */
export type CreditLighthouseRequestBody = {
  idConvenio: number;
  idTipoProduto: number;
  cpf: number;
};

/** Elemento da lista devolvida por `POST /credit-lighthouse`. */
export type CreditLighthouseItem = {
  decisaoFarol: number;
  cpf: number;
  idTipoProduto: number | null;
  motivos: string[];
  timeOut: number;
};
