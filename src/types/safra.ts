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

/**
 * Item comum de catálogos Safra por convênio (`OrgaoEmpregador`, `RegimeJuridico`,
 * `SituacaoEmpregado`). O `id` selecionado alimenta `dadosOcupacao` na proposta Safra.
 */
export type SafraCatalogItem = {
  id: number;
  descricao: string;
};

/** `contatos[]` em `POST /proposal`. */
export type SafraProposalContato = {
  ddd?: number | null;
  telefone?: string | null;
  email?: string | null;
  whatsapp?: boolean | null;
};

export type SafraProposalDadosBancarios = {
  tipoConta: string;
  agencia?: number | null;
  banco?: number | null;
  conta?: string | null;
};

export type SafraProposalDadosOcupacao = {
  idOrgaoEmpregador?: number | null;
  idRegimeJuridico?: number | null;
  idSituacaoEmpregado?: number | null;
  idProfissao?: number | null;
  idCargo?: number | null;
  idTipoVinculoEmpregaticio?: number | null;
  matricula?: string | null;
  valorRenda?: number | null;
  valorRendaLiquida?: number | null;
  dataAdmissao?: string | null;
  idTipoPagamentoBeneficio?: number | null;
  idUFBeneficio?: string | null;
};

export type SafraProposalDadosPessoais = {
  cpf?: number | null;
  nomeCompleto?: string | null;
  nomeMae?: string | null;
  dataNascimento?: string | null;
  sexo?: string | null;
  email?: string | null;
  alfabetizado?: string | null;
};

export type SafraProposalDadosProposta = {
  idConvenio: number;
  idTabelaJuros: number;
  isCotacao: boolean;
  valorParcela: number;
  prazo: number;
  valorPrincipal: number;
  cpfAgenteCertificado: number;
  dataPrimeiroVencimento: string;
  taxaJuros?: number | null;
  comSeguro?: boolean | null;
  aumentoMargem?: boolean;
};

export type SafraProposalEndereco = {
  logradouro: string;
  numero: string;
  cep: string;
  cidade: string;
  uf: string;
  bairro?: string | null;
  complemento?: string | null;
};

export type SafraProposalDadosBancariosAverbacao = {
  bancoAverbacao?: number | null;
  agenciaAverbacao?: number | null;
  contaAverbacao?: string | null;
};

/** Corpo `POST /api/v2/safra/proposal`. */
export type SafraProposalRequestBody = {
  contatos: SafraProposalContato[];
  dadosBancarios: SafraProposalDadosBancarios;
  dadosOcupacao: SafraProposalDadosOcupacao;
  dadosPessoais: SafraProposalDadosPessoais;
  dadosProposta: SafraProposalDadosProposta;
  endereco: SafraProposalEndereco;
  submeter: boolean;
  dadosBancariosAverbacao: SafraProposalDadosBancariosAverbacao;
};

export type SafraProposalErro = {
  codigo: number | null;
  descricao: string | null;
};

/** Resposta 200 de `POST /proposal`. */
export type SafraProposalResponse = {
  idProposta: number | null;
  erro: SafraProposalErro | null;
};

/** Item de simulação em `POST /calculation/new`. */
export type SafraSimulacaoItem = {
  prazo: number;
  valorParcela: number;
  valorPrincipal: number;
  taxaJuros: number;
};

/** Corpo `POST /api/v2/safra/calculation/new`. */
export type CalculationNewRequestBody = {
  idConvenio: number;
  cpf: number;
  comSeguro?: boolean;
  matricula?: string;
  prazos?: number[];
  idTabelaJuros?: number;
  valorParcela?: number;
  valorPrincipal?: number;
  prazo?: number;
  dtNascimento?: string;
  idSituacaoEmpregado?: number;
  /** API Hub/Safra exige string (ex.: `"1"`, `"2"` ou `"M"`, `"F"`). */
  idSexo?: string;
  idRegimeJuridico?: number;
  idOrgaoEmpregador?: number;
};

/** Valores de `idSexo` para simulação (`POST /calculation/new`). */
export const SAFRA_ID_SEXO_OPCOES: ReadonlyArray<{
  value: "1" | "2";
  label: string;
  sexoProposta: string;
}> = [
  { value: "1", label: "Masculino", sexoProposta: "M" },
  { value: "2", label: "Feminino", sexoProposta: "F" },
];

/** Resposta `POST /calculation/new`. */
export type CalculationNewResponse = {
  dataSimulacao?: string;
  simulacoes: SafraSimulacaoItem[];
  criticas: string[];
  avisos: string[];
};

/** Query `GET /proposal/formalization-link`. */
export type FormalizationLinkQuery = {
  id_proposta?: number;
  id_cliente?: number;
  dt_inicio?: string;
  dt_fim?: string;
  id_convenio?: number;
};

/** Resposta flexível — estrutura varia; normalizada no cliente. */
export type FormalizationLinkResponse = Record<string, unknown>;
