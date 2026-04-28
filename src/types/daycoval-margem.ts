/** Contratos conforme OpenAPI Daycoval Consignado (margem), chaves PascalCase. */

/** Simulação: `POST .../margem/simula-proposta-consignado/margem` */
export interface MargemSimulacaoFinanciamentoPayload {
  CodConvenio?: string;
  VlrFinanciado?: number;
  VlrParcela?: number;
  QtdParcela: number;
  /** Schema exige campo; quando não aparece nos `properties`, tratar conforme manual Daycoval. */
  TipoOperacao: string | number;
}

export interface MargemSimulacaoOrigemPayload {
  CodEmpregadorExterno: string;
  CodOrgaoExterno: string;
}

export interface MargemSimulacaoRequestBody {
  Cpf: string;
  Matricula: string;
  /** ISO 8601 (ex.: aniversário a meia-noite UTC ou conforme API). */
  DataNascimento: string;
  Financiamento: MargemSimulacaoFinanciamentoPayload;
  Origem: MargemSimulacaoOrigemPayload;
}

/** Inclusão de simulações: body = array com um ou mais itens. */
export type MargemIncluirSimulacoesBody = Record<string, unknown>[];

/** Inclusão de proposta: `POST .../margem/inclui-proposta` */
export interface MargemIncluirPropostaBody {
  CodProposta: number;
}
