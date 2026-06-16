import type { SafraFinancialAgreement } from "../types/safra";

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

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const t = v.trim().replace(/\s/g, "");
    if (!t) return undefined;
    const n = Number.parseInt(t, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function asString(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return undefined;
}

function extractConvenioArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];
  const r = raw as Record<string, unknown>;
  for (const key of [
    "data",
    "items",
    "convenios",
    "financialAgreements",
    "financial_agreements",
    "result",
    "results",
    "lista",
    "Lista",
  ]) {
    const v = r[key];
    if (Array.isArray(v)) return v;
  }
  return [];
}

function normalizeConvenioItem(raw: unknown): SafraFinancialAgreement | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;

  const idConvenio = asNumber(
    pick(
      r,
      "idConvenio",
      "id_convenio",
      "convenioId",
      "convenio_id",
      "convenio",
      "id",
      "IdConvenio",
      "CodigoConvenio",
      "codigoConvenio"
    )
  );
  if (idConvenio == null || idConvenio <= 0) return null;

  const nome =
    asString(
      pick(r, "nome", "Nome", "name", "descricao", "Descricao", "description")
    ) ?? "";
  const nomeFantasia =
    asString(
      pick(
        r,
        "nomeFantasia",
        "nome_fantasia",
        "NomeFantasia",
        "fantasia",
        "Fantasia"
      )
    ) ?? nome;
  const uf = asString(pick(r, "uf", "UF", "siglaUf", "sigla_uf")) ?? "";
  const cnpj = asNumber(pick(r, "cnpj", "Cnpj", "CNPJ")) ?? 0;

  return { idConvenio, nome, nomeFantasia, uf, cnpj };
}

/**
 * Normaliza a resposta de `GET /financial-agreements` (array direto, wrapper ou aliases).
 */
export function normalizeSafraFinancialAgreements(
  raw: unknown
): SafraFinancialAgreement[] {
  const items = extractConvenioArray(raw);
  const seen = new Set<number>();
  const out: SafraFinancialAgreement[] = [];

  for (const item of items) {
    const norm = normalizeConvenioItem(item);
    if (!norm || seen.has(norm.idConvenio)) continue;
    seen.add(norm.idConvenio);
    out.push(norm);
  }

  return out.sort((a, b) => a.idConvenio - b.idConvenio);
}

export function filtrarConveniosSafra(
  rows: SafraFinancialAgreement[],
  busca: string
): SafraFinancialAgreement[] {
  const t = busca.trim().toLowerCase();
  if (!t) return rows;
  const digits = t.replace(/\D/g, "");
  return rows.filter((c) => {
    const label = `${c.idConvenio} ${c.nome} ${c.nomeFantasia} ${c.uf}`.toLowerCase();
    if (label.includes(t)) return true;
    if (digits && String(c.idConvenio).includes(digits)) return true;
    return false;
  });
}

/** Garante que convênios conhecidos (ex. homologação) aparecem mesmo se a API não os devolve. */
export function mesclarConveniosSafra(
  rows: SafraFinancialAgreement[],
  extras: SafraFinancialAgreement[]
): SafraFinancialAgreement[] {
  const map = new Map<number, SafraFinancialAgreement>();
  for (const r of rows) map.set(r.idConvenio, r);
  for (const e of extras) {
    if (!map.has(e.idConvenio)) map.set(e.idConvenio, e);
  }
  return [...map.values()].sort((a, b) => a.idConvenio - b.idConvenio);
}
