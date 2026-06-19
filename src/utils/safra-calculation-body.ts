import type { CalculationNewRequestBody } from "../types/safra";

export function toSafraDateOnly(
  value: string | undefined | null
): string | undefined {
  if (!value?.trim()) return undefined;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
}

export type BuildSafraCalculationInput = {
  idConvenio: number;
  cpf: number;
  matricula: string;
  comSeguro: boolean;
  isCotacao: boolean;
  idTabelaJuros: number;
  dtNascimento: string;
  idSexo: string;
  idSituacaoEmpregado: number;
  prazos: number[];
  valorParcela?: number;
  valorPrincipal?: number;
  valorRenda?: number;
  valorDescontos?: number;
  dataAdmissao?: string;
  idUF?: string;
  idCorban?: number;
  idCorbansubs?: number;
  idComercial?: number;
  idSeguro?: number;
  idServicos?: number[];
  taxaJuros?: number;
  tarifaCadastro?: number;
  comissao?: number;
};

function assignFinite(
  body: CalculationNewRequestBody,
  key:
    | "valorRenda"
    | "valorParcela"
    | "valorPrincipal"
    | "valorDescontos"
    | "idCorban"
    | "idCorbansubs"
    | "idComercial"
    | "idSeguro"
    | "taxaJuros"
    | "tarifaCadastro"
    | "comissao",
  value: number | undefined
): void {
  if (value != null && Number.isFinite(value)) {
    body[key] = value;
  }
}

/**
 * Monta o body de `POST /calculation/new` alinhado ao contrato Safra/Hub.
 * Datas (`dtNascimento`, `dataAdmissao`) em `YYYY-MM-DD`, sem hora.
 */
export function buildSafraCalculationNewBody(
  input: BuildSafraCalculationInput
): CalculationNewRequestBody {
  const prazos = input.prazos
    .filter((p) => Number.isFinite(p) && p > 0)
    .sort((a, b) => a - b);

  const body: CalculationNewRequestBody = {
    idConvenio: input.idConvenio,
    cpf: input.cpf,
    matricula: input.matricula,
    comSeguro: input.comSeguro,
    isCotacao: input.isCotacao,
    idTabelaJuros: input.idTabelaJuros,
    dtNascimento: input.dtNascimento,
    idSexo: input.idSexo,
    idSituacaoEmpregado: input.idSituacaoEmpregado,
    prazos,
  };

  assignFinite(body, "valorRenda", input.valorRenda);
  assignFinite(body, "valorParcela", input.valorParcela);
  assignFinite(body, "valorPrincipal", input.valorPrincipal);
  assignFinite(body, "valorDescontos", input.valorDescontos);
  assignFinite(body, "idCorban", input.idCorban);
  assignFinite(body, "idCorbansubs", input.idCorbansubs);
  assignFinite(body, "idComercial", input.idComercial);
  assignFinite(body, "idSeguro", input.idSeguro);
  assignFinite(body, "taxaJuros", input.taxaJuros);
  assignFinite(body, "tarifaCadastro", input.tarifaCadastro);
  assignFinite(body, "comissao", input.comissao);

  const admissao = toSafraDateOnly(input.dataAdmissao);
  if (admissao) body.dataAdmissao = admissao;

  const uf = input.idUF?.trim().toUpperCase().slice(0, 2);
  if (uf && /^[A-Z]{2}$/.test(uf)) body.idUF = uf;

  const servicos = (input.idServicos ?? [])
    .filter((id) => Number.isFinite(id) && id > 0)
    .sort((a, b) => a - b);
  if (servicos.length > 0) body.idServicos = servicos;

  return body;
}
