/** Contratos Hub Banking → proxy Safra (`/api/v2/safra`), camelCase. */

export type SafraBank = {
  codigoBanco: number;
  nomeBanco: string;
  cnpj: number;
  ispb: number;
};

export type MargemBpoRequestBody = {
  convenio: number;
  cpf: number;
  idProduto: number;
  matricula: string;
};

/** Resposta de consulta BPO (shape alinhado à API Safra). */
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
