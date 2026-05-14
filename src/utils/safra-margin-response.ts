import type { MargemBpoResponse } from "../types/safra";

function pick(
  r: Record<string, unknown>,
  camel: string,
  ...aliases: string[]
): unknown {
  const keys = [camel, ...aliases];
  for (const k of keys) {
    if (
      Object.prototype.hasOwnProperty.call(r, k) &&
      r[k] !== undefined &&
      r[k] !== null
    ) {
      return r[k];
    }
  }
  return undefined;
}

function asString(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return undefined;
}

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const t = v.trim().replace(/\s/g, "").replace(",", ".");
    if (t === "") return undefined;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function asBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (v === 1 || v === "1") return true;
  if (v === 0 || v === "0") return false;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "s" || s === "sim" || s === "yes") return true;
    if (
      s === "false" ||
      s === "n" ||
      s === "nao" ||
      s === "não" ||
      s === "no"
    ) {
      return false;
    }
  }
  return undefined;
}

/**
 * Normaliza o JSON da margem BPO (camelCase oficial do Hub + aliases snake_case /
 * PascalCase e tipos soltos vindos do parceiro).
 */
export function normalizeMargemBpoResponse(raw: unknown): MargemBpoResponse {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const r = raw as Record<string, unknown>;

  return {
    cpf: asString(pick(r, "cpf", "Cpf", "CPF")),
    margem: asNumber(pick(r, "margem", "Margem")),
    lotacao: asString(pick(r, "lotacao", "Lotacao", "lotacao_servidor")),
    autorizada: asBool(pick(r, "autorizada", "Autorizada")),
    nome: asString(pick(r, "nome", "Nome")),
    secretaria: asString(pick(r, "secretaria", "Secretaria")),
    tipoServidor: asString(
      pick(r, "tipoServidor", "tipo_servidor", "TipoServidor")
    ),
    cargo: asString(pick(r, "cargo", "Cargo")),
    regimeJuridico: asString(
      pick(r, "regimeJuridico", "regime_juridico", "RegimeJuridico")
    ),
    dataAdmissao: asString(
      pick(r, "dataAdmissao", "data_admissao", "DataAdmissao")
    ),
    uf: asString(pick(r, "uf", "UF")),
    renda: asNumber(pick(r, "renda", "Renda")),
    mensagemErro: asString(
      pick(r, "mensagemErro", "mensagem_erro", "MensagemErro", "mensagem")
    ),
    dataHoraConsulta: asString(
      pick(r, "dataHoraConsulta", "data_hora_consulta", "DataHoraConsulta")
    ),
  };
}

export function isMargemBpoResponseEmpty(res: MargemBpoResponse): boolean {
  return !Object.values(res).some((v) => {
    if (v === undefined || v === null) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    return true;
  });
}
